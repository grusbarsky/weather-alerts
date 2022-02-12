const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");

// helper that returns signed jwt from user data

function createToken(user) {
  let payload = {
    username: user.username,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email
  };

  return jwt.sign(payload, SECRET_KEY);
}

module.exports = { createToken };
