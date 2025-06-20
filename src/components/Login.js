import { gql, useMutation } from "@apollo/client";
import React, { useState } from "react";
import { AUTH_TOKEN } from "../constants";
import { useNavigate } from "react-router-dom";

const SIGNUP_MUTATION = gql`
  mutation SignupMutation($email: String!, $password: String!, $name: String!) {
    signup(email: $email, password: $password, name: $name) {
      token
    }
  }
`;

const LOGIN_MUTATION = gql`
  mutation LoginMutation($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
    }
  }
`;

const Login = () => {
  const navigate = useNavigate();
  const [formValues, setFormValues] = useState({
    login: true,
    name: "",
    email: "",
    password: "",
  });
  const [login] = useMutation(LOGIN_MUTATION, {
    variables: {
      email: formValues.email,
      password: formValues.password,
    },
    onCompleted: ({ login }) => {
      localStorage.setItem(AUTH_TOKEN, login.token);
      navigate("/");
    },
  });

  const [signup] = useMutation(SIGNUP_MUTATION, {
    variables: {
      name: formValues.name,
      email: formValues.email,
      password: formValues.password,
    },
    onCompleted: ({ signup }) => {
      localStorage.setItem(AUTH_TOKEN, signup.token);
      navigate("/");
    },
  });
  return (
    <div>
      <h4>{formValues?.login ? "Login" : "Sign Up"}</h4>
      <div className="flex flex-column">
        {!formValues.login && (
          <input
            type="text"
            value={formValues.name}
            placeholder="Enter Name"
            onChange={(e) => {
              setFormValues((prev) => ({
                ...prev,
                name: e.target.value,
              }));
            }}
          />
        )}
        <input
          type="email"
          value={formValues.email}
          placeholder="Enter Email"
          onChange={(e) => {
            setFormValues((prev) => ({
              ...prev,
              email: e.target.value,
            }));
          }}
        />
        <input
          type="password"
          value={formValues.password}
          placeholder="Enter Password"
          onChange={(e) => {
            setFormValues((prev) => ({
              ...prev,
              password: e.target.value,
            }));
          }}
        />
        <div className="flex mt-3">
          <button
            className="mr2 button"
            onClick={formValues.login ? login : signup}
          >
            {formValues.login ? "Login" : "Create Account"}
          </button>
          <button
            className="button"
            onClick={(e) =>
              setFormValues({
                ...formValues,
                login: !formValues.login,
              })
            }
          >
            {formValues.login
              ? "need to create an account?"
              : "already have an account"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
