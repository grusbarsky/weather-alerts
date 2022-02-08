import React from "react";
import UserContext from "./auth/UserContext";


const testUser = {
  username: "testuser",
  first_name: "testfirst",
  last_name: "testlast",
  email: "test@test.net",
  enableAlerts: false,
};

const UserProvider =
    ({ children, currentUser = testUser}) => (
    <UserContext.Provider value={{ currentUser }}>
      {children}
    </UserContext.Provider>
);

export { UserProvider };