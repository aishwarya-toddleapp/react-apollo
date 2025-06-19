import React from "react";

const Link = (props) => {
  const { description, url } = props.link;
  return (
    <div>
      <div>
        {description}
        {url}
      </div>
    </div>
  );
};

export default Link;
