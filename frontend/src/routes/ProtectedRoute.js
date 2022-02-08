import React, { useContext } from "react";
import { Route, Redirect } from "react-router-dom";
import UserContext from "../auth/UserContext";

// To ensure a user is logged in to access protected routes
// protected routes: articles page, profile page, alerts page

function ProtectedRoute({ exact, path, children }) {
  const { currentUser } = useContext(UserContext);


  if (!currentUser) {
    return <Redirect to="/login" />;
  }

  return (
      <Route exact={exact} path={path}>
        {children}
      </Route>
  );
}

export default ProtectedRoute;
