import React, { useState, useEffect, useContext } from "react";
import { BrowserRouter } from "react-router-dom";
import useLocalStorage from "./hooks/UseLocalStorage";
import Navigation from "./routes/Navigation";
import Routes from "./routes/Routes";
import WeatherAlertApi from "./api";
import UserContext from "./auth/UserContext";
import jwt from "jsonwebtoken";


// rememeber token for future login attempts
export const TOKEN_STORAGE_ID = "weatheralert-token";



function App() {
  const [infoLoaded, setInfoLoaded] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useLocalStorage(TOKEN_STORAGE_ID);


  useEffect(function loadUserInfo() {

    async function getCurrentUser() {
      if (token) {
        try {
          let { username } = jwt.decode(token);
          WeatherAlertApi.token = token;
          let currentUser = await WeatherAlertApi.getCurrentUser(username);
          setCurrentUser(currentUser);
        } catch (err) {
          console.error("App loadUserInfo: problem loading", err);
          setCurrentUser(null);
        }
      }
      setInfoLoaded(true);
    }

    setInfoLoaded(false);
    getCurrentUser();
  }, [token]);

  // handles logout
  // clears current user and token
  function logout() {
    setCurrentUser(null);
    setToken(null);
  }

  // user is signed in after they signup
  async function signup(signupData) {
    try {
      let token = await WeatherAlertApi.signup(signupData);
      setToken(token);
      return { success: true };
    } catch (errors) {
      console.error("signup failed", errors);
      return { success: false, errors };
    }
  }

  // login and set token
  async function login(loginData) {
    try {
      let token = await WeatherAlertApi.login(loginData);
      setToken(token);
      return { success: true };
    } catch (errors) {
      console.error("login failed", errors);
      return { success: false, errors };
    }
  }


  return (
      <BrowserRouter>
        <UserContext.Provider
            value={{ currentUser, setCurrentUser }}>
          <div className="App">
            <Navigation logout={logout} />
            <div className='routes'>
              <Routes login={login} signup={signup} />
            </div>
          </div>
        </UserContext.Provider>
      </BrowserRouter>
  );
}

export default App;