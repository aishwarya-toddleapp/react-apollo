import React from "react";
import { LINKS_PER_PAGE, timeDifferenceForDate } from "../utils/util";
import { gql, useMutation } from "@apollo/client";
import { FEED_QUERY } from "./LinkList";
import { AUTH_TOKEN } from "../constants";

const VOTE_MUTATION = gql`
  mutation VoteMutation($linkId: ID!) {
    vote(linkId: $linkId) {
      id
      link {
        id
        votes {
          id
          user {
            id
          }
        }
      }
    }
  }
`;

const take = LINKS_PER_PAGE;
const skip = 0;
const orderBy = { createdAt: "desc" };

const Link = (props) => {
  const authToken = localStorage.getItem(AUTH_TOKEN);
  const { description, url, votes, postedBy, createdAt, id } = props.link;
  const [vote] = useMutation(VOTE_MUTATION, {
    variables: {
      linkId: id,
    },
    update: (cache, { data: { vote } }) => {
      const { feed } = cache.readQuery({
        query: FEED_QUERY,
        variables: {
          take,
          skip,
          orderBy,
        },
      });

      const updatedLinks = feed.links.map((feedLink) => {
        if (feedLink.id === id) {
          return {
            ...feedLink,
            votes: [...feedLink.votes, vote],
          };
        }
        return feedLink;
      });

      cache.writeQuery({
        query: FEED_QUERY,
        data: {
          feed: {
            links: updatedLinks,
          },
        },
        variables: {
          take,
          skip,
          orderBy,
        },
      });
    },
  });

  return (
    <div className="flex mt2 items-start">
      <div className="flex items-center">
        <span className="gray">{props.index + 1}.</span>
        {authToken && (
          <div
            className="ml1 gray f11"
            style={{ cursor: "pointer" }}
            onClick={vote}
          >
            ▲
          </div>
        )}
        <div className="ml1">
          <div>
            {description}({url})
          </div>

          {
            <div className="f6 lh-copy gray">
              {votes?.length} votes | by {postedBy ? postedBy.name : "Unknown"}{" "}
              {timeDifferenceForDate(createdAt)}
            </div>
          }
        </div>
      </div>
    </div>
  );
};

export default Link;
