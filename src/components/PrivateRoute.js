// src/components/PrivateRoute.js
import React from "react";
import { Route, Redirect } from "react-router-dom";

const PrivateRoute = ({ children, ...rest }) => {
  const accessToken = localStorage.getItem("accessToken");
  console.log("AccessToken in PrivateRoute:", accessToken);

  return (
    <Route
      {...rest}
      render={(props) =>
        accessToken ? (
          children
        ) : (
          <Redirect to={{ pathname: "/", state: { from: props.location } }} />
        )
      }
    />
  );
};

export default PrivateRoute;
