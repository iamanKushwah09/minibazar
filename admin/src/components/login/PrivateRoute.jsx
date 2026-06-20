import React, { useContext } from "react";
import { Redirect, Route } from "react-router-dom";
import { AdminContext } from "@/context/AdminContext";

const PrivateRoute = ({ children, ...rest }) => {
  const { state } = useContext(AdminContext);
  const { adminInfo } = state;

  // Debug logging
  console.log('PrivateRoute - adminInfo:', adminInfo);
  console.log('PrivateRoute - adminInfo?.email:', adminInfo?.email);

  return (
    <Route
      {...rest}
      render={({ location }) => {
        if (adminInfo?.email && adminInfo?.token) {
          return children;
        } else {
          console.log('Redirecting to login - no valid adminInfo');
          return (
            <Redirect
              to={{
                pathname: "/login",
                state: { from: location },
              }}
            />
          );
        }
      }}
    />
  );
};

export default PrivateRoute;
