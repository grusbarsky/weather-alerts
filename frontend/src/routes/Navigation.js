import React, { useContext } from "react";
import { Link, NavLink } from "react-router-dom";
import UserContext from "../auth/UserContext";
import './navigation.css';

// Nav bar
// if not logged in, shows login and register
// if logged in, shows links to navigate site

function Navigation({ logout }) {
  const { currentUser } = useContext(UserContext);

  function loggedInNav() {
    return (
      <ul className="nav nav-pills nav-fill">
        <li className="nav-item">
          <NavLink className="nav-link" to="/dashboard">
            Dashboard
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink className="nav-link" to="/news">
            News
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink className="nav-link" to="/my-articles">
            My Articles
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink className="nav-link" to="/alerts">
            My Alerts
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink className="nav-link" to="/locations">
            My Locations
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink className="nav-link" to="/settings">
            Settings
          </NavLink>
        </li>
        <li className="nav-item" id="logout">
          <Link className="nav-link" to="/" onClick={logout}>
            Log out {currentUser.first_name || currentUser.username}
          </Link>
        </li>
      </ul>
    );
  }

  function loggedOutNav() {
    return (
      <ul className="nav nav-pills nav-fill">
        <li className="nav-item">
          <NavLink aria-current="page" className="nav-link" to="/login">
            Login
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink className="nav-link" to="/signup">
            Sign Up
          </NavLink>
        </li>
      </ul>
    );
  }

  return (
    <nav className="navbar navbar-expand-lg px-2 d-flex justify-content-center border-bottom shadow-sm sticky-top mb-4">
      <Link className="navbar-brand fw-bold" id="navbar-brand" to="/">
        Weather Alerts
      </Link>
      <div>
        {currentUser ? loggedInNav() : loggedOutNav()}
      </div>
    </nav>
  );
}

export default Navigation;