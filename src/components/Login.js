import React, { useState } from "react";

const Login = () => {
  const [formValues, setFormValues] = useState({
    login: true,
    name: "",
    email: "",
    password: "",
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
          <button className="mr2 button">
            {formValues.login ? "Login" : "Create Account"}
          </button>
          <button className="button">
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
