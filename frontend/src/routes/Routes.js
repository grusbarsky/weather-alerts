import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import LocationList from "../locations/LocationList";
import ArticleList from "../articles/ArticleList";
import UserArticleList from "../articles/UserArticleList";
import AlertList from "../alerts/AlertList";
import LoginForm from "../auth/LoginForm";
import EditForm from "../settings/EditForm";
import SignupForm from "../auth/SignupForm";
import ProtectedRoute from "./ProtectedRoute";
import Dashboard from "../dashboard/Dashboard";


function WeatherAlertRoutes({ login, signup }) {

  return (
    <div className="page">
      <Switch>

        <Route exact path="/">
          <Redirect to="/dashboard" />
        </Route>

        <Route exact path="/dashboard">
          <Dashboard />
        </Route>

        <Route exact path="/login">
          <LoginForm login={login} />
        </Route>

        <Route exact path="/signup">
          <SignupForm signup={signup} />
        </Route>

        <ProtectedRoute exact path="/news">
          <ArticleList width={"w-50"} />
        </ProtectedRoute>

        <ProtectedRoute exact path="/alerts">
          <AlertList width={"w-50"} />
        </ProtectedRoute>


        <ProtectedRoute exact path="/my-articles">
          <UserArticleList width={"w-50"} />
        </ProtectedRoute>

        <ProtectedRoute exact path="/locations">
          <LocationList width={"w-50"} />
        </ProtectedRoute>

        <ProtectedRoute exact path="/settings">
          <EditForm />
        </ProtectedRoute>

        <Redirect to="/" />
      </Switch>
    </div>
  );
}

export default WeatherAlertRoutes;