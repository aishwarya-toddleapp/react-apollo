import { gql, useLazyQuery } from "@apollo/client";
import React, { useState } from "react";
import Link from "./Link";

const FEED_SEARCH_QUERY = gql`
  query FeedSearchQuery($filter: String!) {
    feed(filter: $filter) {
      id
      links {
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
  }
`;

const Search = () => {
  const [searchFilter, setSearchFilter] = useState("");
  const [executeSearch, { data }] = useLazyQuery(FEED_SEARCH_QUERY);
  console.log(data);
  return (
    <>
      <div>
        Search
        <input
          type="text"
          placeholder="Search"
          onChange={(e) => setSearchFilter(e.target.value)}
        />
        <button
          onClick={() => {
            executeSearch({
              variables: {
                filter: searchFilter,
              },
            });
          }}
        >
          Ok
        </button>
      </div>
      {data &&
        data?.feed?.links?.map((link, index) => (
          <Link index={index} link={link} key={link.id} />
        ))}
    </>
  );
};

export default Search;
