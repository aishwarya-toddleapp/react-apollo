import { gql, useMutation } from "@apollo/client";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const CREATE_LINK_MUTATION = gql`
  mutation PostMutation($description: String!, $url: String!) {
    post(description: $description, url: $url) {
      id
      description
      url
      createdAt
    }
  }
`;

const CreateLink = () => {
  const navigate = useNavigate();
  const [formValues, setFormValues] = useState({
    url: "",
    description: "",
  });
  const [createLink] = useMutation(CREATE_LINK_MUTATION, {
    variables: {
      description: formValues.description,
      url: formValues.url,
    },
    onCompleted: () => {
      navigate("/");
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        createLink();
      }}
    >
      <input
        type="text"
        className="mb2"
        value={formValues.url}
        placeholder="Enter the URL"
        onChange={(e) => {
          setFormValues((prev) => ({
            ...prev,
            url: e.target.value,
          }));
        }}
      />
      <input
        type="text"
        className="mb2"
        value={formValues.description}
        placeholder="Enter the description"
        onChange={(e) => {
          setFormValues((prev) => ({
            ...prev,
            description: e.target.value,
          }));
        }}
      />
      <button type="submit">Submit</button>
    </form>
  );
};

export default CreateLink;
