import { gql, useQuery } from "@apollo/client";
import Link from "./Link";

const FEED_QUERY = gql`
  {
    feed {
      id
      links {
        id
        createdAt
        url
        description
      }
    }
  }
`;

const LinkList = () => {
  const { data } = useQuery(FEED_QUERY);
  return (
    <div>
      {data &&
        data?.feed?.links?.map((link) => (
          <div key={link.id}>
            <Link link={link} />
          </div>
        ))}
    </div>
  );
};

export default LinkList;
