"use strict";

const db = require("../db");
const bcrypt = require("bcrypt");
const { partialUpdate } = require("../helpers/sql");
const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} = require("../expressError");

const { BCRYPT_WORK_FACTOR } = require("../config.js");

// functions for user

class User {
  // authenticate user with username, password.

  // Returns { username, first_name, last_name, email }

  // Throws UnauthorizedError is user not found or wrong password.

  static async authenticate(username, password) {
    // try to find the user first
    const result = await db.query(
          `SELECT username,
                  password,
                  first_name AS "firstName",
                  last_name AS "lastName",
                  email,
                  enable_alerts AS "enableAlerts"
           FROM users
           WHERE username = $1`,
        [username],
    );

    const user = result.rows[0];

    if (user) {
      // compare hashed password to a new hash from password
      const isValid = await bcrypt.compare(password, user.password);
      if (isValid === true) {
        delete user.password;
        return user;
      }
    }

    throw new UnauthorizedError("Invalid username or password");
  }

  // creates new user
  // Returns { username, firstName, lastName, email, enableAlerts }
  //  throws BadRequestError on duplicate username or email

  static async register(
      { username, password, firstName, lastName, email, enableAlerts }) {
    const duplicateCheck = await db.query(
          `SELECT username
           FROM users
           WHERE username = $1`,
        [username],
    );

    if (duplicateCheck.rows[0]) {
      throw new BadRequestError(`${username}: username already in use`);
    }

    const hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);

    const result = await db.query(
          `INSERT INTO users
           (username,
            password,
            first_name,
            last_name,
            email,
            enable_alerts)
           VALUES ($1, $2, $3, $4, $5, $6)
           RETURNING username, first_name AS "firstName", last_name AS "lastName", email, enable_alerts AS "enableAlerts"`,
        [
          username,
          hashedPassword,
          firstName,
          lastName,
          email,
          enableAlerts,
        ],
    );

    const user = result.rows[0];

    return user;
  }

  // Given a username, return data about user
  // Returns { username, first_name, last_name, alerts_enabled, locations, articles }
  // where locations is { id, location, alertsEnables }
  // where articles is {id, title, url, image_url, time_published}
  // Throws NotFoundError if user not found.


  static async get(username) {
    const userRes = await db.query(
          `SELECT username,
                  first_name AS "firstName",
                  last_name AS "lastName",
                  email,
                  enable_alerts AS "enableAlerts"
           FROM users
           WHERE username = $1`,
        [username],
    );

    const user = userRes.rows[0];

    if (!user) throw new NotFoundError(`${username} does not exist`);

    const userLocationsRes = await db.query(
          `SELECT l.coordinates, l.formatted_address, l.id
           FROM locations AS l
           INNER JOIN user_locations AS ul ON (l.id = ul.location_id)
           WHERE ul.username = $1`, [username]);

    const userArticlesRes = await db.query(
          `SELECT a.id, a.title, a.article_url, a.image_url, a.date_published, a.source_name, a.ar_description
          FROM articles AS a
          INNER JOIN user_articles AS ua ON (a.id = ua.article_id)
          WHERE ua.username = $1`, [username]);
  
    user.locations = userLocationsRes.rows.map(l => ({id: l.id,
                                                      coordinates: l.coordinates,
                                                      formattedAddress: l.formatted_address}));
    user.articles = userArticlesRes.rows.map(a => ({id: a.id, 
                                                    title: a.title, 
                                                    articleUrl: a.article_url, 
                                                    imageUrl: a.image_url, 
                                                    datePublished: a.date_published,
                                                    sourceName: a.source_name,
                                                    description: a.ar_description}));
  
    return user;
  }

  // Updates user
  // allows for a partial update

  //  Data can include:
  //  { firstName, lastName, password, email, alertsEnabled }

  // Returns { username, firstName, lastName, email, alertsEnabled }

  // Throws NotFoundError if not found.
  

  static async update(username, data) {
    if (data.password) {
      data.password = await bcrypt.hash(data.password, BCRYPT_WORK_FACTOR);
    }

    const { setCols, values } = partialUpdate(
        data,
        {
          firstName: "first_name",
          lastName: "last_name",
          enableAlerts: "enable_alerts",
        });
    const usernameVarIdx = "$" + (values.length + 1);

    const querySql = `UPDATE users 
                      SET ${setCols} 
                      WHERE username = ${usernameVarIdx} 
                      RETURNING username,
                                first_name AS "firstName",
                                last_name AS "lastName",
                                email,
                                enable_alerts AS "enableAlerts"`;
    const result = await db.query(querySql, [...values, username]);
    const user = result.rows[0];

    if (!user) throw new NotFoundError(`${username} does not exist`);

    delete user.password;
    return user;
  }

  // Delete user from database 
  // returns undefined

  static async remove(username) {
    let result = await db.query(
          `DELETE
           FROM users
           WHERE username = $1
           RETURNING username`,
        [username],
    );
    const user = result.rows[0];

    if (!user) throw new NotFoundError(`${username} does not exist`);
  }

  // save article
  // insert if not saved before


  static async saveArticle(username, articleInfo){
    let {title, articleUrl, imageUrl, datePublished, sourceName, description} = articleInfo;

    const check1  = await db.query(
      `SELECT id
       FROM articles
       WHERE article_url = $1`, [articleUrl]);
    let article = check1.rows[0];
 

    // if articleId evaluatees to null, insert into table and assign article
    if (!article){
      let articleInsert = await db.query(
        `INSERT INTO articles (title, article_url, image_url, date_published, source_name, ar_description)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING id`,
      [title, articleUrl, imageUrl, datePublished, sourceName, description]);

      article = articleInsert.rows[0];
    }

    // set articleId
    let articleId = article.id;

    const check2 = await db.query(
      `SELECT username
       FROM users
       WHERE username = $1`, [username]);
    const user = check2.rows[0];

    if (!user) throw new NotFoundError(`No user found`);

    const check3 = await db.query(
      `SELECT Username
      FROM user_articles
      WHERE username = $1 AND article_id = $2`, [username, articleId]
    );
    const userArticle = check3.rows[0];

    if (userArticle) throw new Error(`Article is already saved by user`)
      
    // insert into join table
    await db.query(
      `INSERT INTO user_articles (article_id, username)
       VALUES ($1, $2)`,
    [articleId, username]);

    return articleId;
  }

  // remove saved article
  // returns undefined

  // possible future optimization: check again if article exists in user_articles, if not --> delete from articles table

  static async removeArticle(username, articleId){
    const check1  = await db.query(
      `SELECT id
       FROM articles
       WHERE id = $1`, [articleId]);
    const article = check1.rows[0];

    if (!article) throw new NotFoundError(`Article not found: ${articleId}`);

    const check2 = await db.query(
      `SELECT username
       FROM users
       WHERE username = $1`, [username]);
    const user = check2.rows[0];

    if (!user) throw new NotFoundError(`No user found`);

    let result = await db.query(
      `DELETE
       FROM user_articles
       WHERE username = $1 AND article_id = $2`,
    [username, articleId],
    );
  }

  // check for all users with alerts enabled

  // return username, locatins, first_name, last_name

  static async allEnabled(){
    const result = await db.query(
              `SELECT username, locations, first_name, last_name, email
               FROM users
               WHERE enable_alerts = True`
    );

    let users = result.rows;

    if(users=== []) throw new NotFoundError(`No users found`);
    
    return users;
  }

  // save location

  static async saveLocation(username, locationInfo){
    let {formattedAddress, coordinates} = locationInfo;

    // check if location already exists in table
    // uses coordinates to reliably ensure location in case of different syntax
    const check = await db.query(
      `SELECT id, formatted_address AS "formattedAddress", coordinates
       FROM locations
       WHERE coordinates = $1`, [coordinates]);
    let location = check.rows[0];

    // if locationId is null, insert into table and set locationId
    if (!location){
      const locationInsert = await db.query(
        `INSERT INTO locations (formatted_address, coordinates)
         VALUES ($1, $2)
         RETURNING id, formatted_address AS "formattedAddress", coordinates`,
      [formattedAddress, coordinates]);

      location = locationInsert.rows[0];
    };

    let locationId = location.id;

    // check if user is found
    const check2 = await db.query(
      `SELECT username
       FROM users
       WHERE username = $1`, [username]);
    const user = check2.rows[0];

    if (!user) throw new NotFoundError(`No user found`);

    // check if user already has location saved

    const check3 = await db.query(
      `SELECT id
      FROM user_locations
      WHERE username = $1 AND location_id = $2`,
      [username, locationId]
    )
    const id = check3.rows[0];

    if(id) throw new BadRequestError('Location already saved');

    // insert into join table
    await db.query(
      `INSERT INTO user_locations (location_id, username)
       VALUES ($1, $2)`,
    [locationId, username]);

    return location;
  }

  
  // delete location
  // possible optimization: look after delete of location still exists in user_locations
      // if not delete from location table
  static async removeLocation(username, locationId){
    const check1  = await db.query(
      `SELECT id
       FROM locations
       WHERE id = $1`, [locationId]);
    const location = check1.rows[0];

    if (!location) throw new NotFoundError(`Location not found: ${locationId}`);

    const check2 = await db.query(
      `SELECT username
       FROM users
       WHERE username = $1`, [username]);
    const user = check2.rows[0];

    if (!user) throw new NotFoundError(`No user found`);

    let result = await db.query(
      `DELETE
       FROM user_locations
       WHERE username = $1 AND location_id = $2`,
    [username, locationId],
    );
  }
}



module.exports = User;
