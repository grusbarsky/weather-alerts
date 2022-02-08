"use strict";
require('dotenv').config();

const SECRET_KEY = process.env.SECRET_KEY || "secret-dev";

const PORT = +process.env.PORT || 3001;


// Use dev database, testing database, or via env var, production database
function getDatabaseUri() {
  return (process.env.NODE_ENV === "test")
      ? "weather_alerts_test"
      : process.env.DATABASE_URL || "weather_alerts";
}

function getEmail() {
  return (process.env.NODE_ENV === "test")
      ? "test@test.com"
      : process.env.EMAIL || process.env.senderEmail;
}


const BCRYPT_WORK_FACTOR = process.env.NODE_ENV === "test" ? 1 : 12;

console.log("weather-alerts Config:");
console.log("SECRET_KEY:", SECRET_KEY);
console.log("PORT:", PORT.toString());
console.log("BCRYPT_WORK_FACTOR:", BCRYPT_WORK_FACTOR);
console.log("Database:", getDatabaseUri());
console.log("Email:", getEmail());
console.log("---");

module.exports = {
  SECRET_KEY,
  PORT,
  BCRYPT_WORK_FACTOR,
  getDatabaseUri,
  getEmail
};
