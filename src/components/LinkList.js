import { gql, useQuery } from "@apollo/client";
import Link from "./Link";
import { useLocation, useNavigate } from "react-router-dom";
import { getQueryVariables, LINKS_PER_PAGE } from "../utils/util";

export const FEED_QUERY = gql`
  query FeedQuery($take: Int, $skip: Int, $orderBy: LinkOrderByInput) {
    feed(take: $take, skip: $skip, orderBy: $orderBy) {
      id
      links {
        id
        createdAt
        url
        postedBy {
          id
          name
        }
        description
        votes {
          id
          user {
            id
          }
        }
      }
      count
    }
  }
`;

const NEW_LINKS_SUBSCRIPTION = gql`
  subscription {
    newLink {
      id
      url
      description
      createdAt
      postedBy {
        id
        name
      }
      votes {
        id
        user {
          id
        }
      }
    }
  }
`;

const NEW_VOTE_SUBSCRIPTION = gql`
  subscription {
    newVote {
      id
      link {
        id
        url
        description
        createdAt
        postedBy {
          id
          name
        }
        votes {
          id
          user {
            id
          }
        }
      }
      user {
        id
      }
    }
  }
`;

const getListsToRender = (isNewPage, data) => {
  if (isNewPage) {
    return data?.feed?.links;
  }
  const rankedLists = data?.feed?.links?.slice();
  rankedLists?.sort((l1, l2) => l2?.votes?.length - l1?.votes?.length);
  return rankedLists;
};

const LinkList = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isNewPage = location.pathname.includes("/new");
  const pageIndexParam = location.pathname.split("/");
  const page = parseInt(pageIndexParam[pageIndexParam?.length - 1]);
  const pageIndex = page ? (page - 1) * LINKS_PER_PAGE : 0;

  const { data, subscribeToMore, loading, error } = useQuery(FEED_QUERY, {
    variables: getQueryVariables(isNewPage, page),
  });

  subscribeToMore({
    document: NEW_LINKS_SUBSCRIPTION,
    updateQuery: (prev, { subscriptionData }) => {
      if (!subscriptionData.data) return prev;
      const newLink = subscriptionData.data.newLink;
      const exists = prev.feed.links.find(({ id }) => id === newLink.id);
      if (exists) return prev;

      return Object.assign({}, prev, {
        feed: {
          links: [newLink, ...prev.feed.links],
          count: prev.feed.links.length + 1,
          __typename: prev.feed.__typename,
        },
      });
    },
  });

  subscribeToMore({
    document: NEW_VOTE_SUBSCRIPTION,
  });

  return (
    <>
      {loading && <p>loading...</p>}
      {error && <p>{JSON.stringify(error, null, 2)}</p>}
      {data && (
        <>
          {getListsToRender(isNewPage, data)?.map((link, index) => (
            <Link link={link} index={index + pageIndex} key={link?.id} />
          ))}
        </>
      )}
      {isNewPage && (
        <div className="flex ml4 mv3 gray">
          <div
            className="pointer mr2"
            onClick={() => {
              if (page > 1) {
                navigate(`/new/${page - 1}`);
              }
            }}
          >
            Previous
          </div>
          <div
            className="pointer"
            onClick={() => {
              if (page <= data?.feed?.count / LINKS_PER_PAGE) {
                navigate(`/new/${page + 1}`);
              }
            }}
          >
            Next
          </div>
        </div>
      )}
    </>
  );
};

export default LinkList;
