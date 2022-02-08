"use strict";

const db = require("../db.js");
const User = require("../models/User");
const { createToken } = require("../helpers/tokens");

const testArticleInfo = [];
const testLocationInfo = [];

async function commonBeforeAll() {
    // noinspection SqlWithoutWhere
    await db.query("DELETE FROM users");
    // noinspection SqlWithoutWhere
    await db.query("DELETE FROM articles");
    // noinspection SqlWithoutWhere
    await db.query("DELETE FROM locations");

    const articles = await db.query(`
    INSERT INTO articles(title, article_url, image_url, date_published)
    VALUES ('a1', 'www.a1.com', 'www.image1.com', '1-1-1'),
           ('a1', 'www.a2.com', 'www.image2.com', '2-2-2'),
           ('a1', 'www.a3.com', 'www.image3.com', '3-3-3')
    RETURNING id, title, article_url, image_url, date_published`);
    testArticleInfo.splice(0, 0, ...articles.rows.map(a => ({id:a.id, 
                                                            title:a.title, 
                                                            articleUrl:a.article_url, 
                                                            imageUrl:a.image_url, 
                                                            datePublished:a.date_published})));

    // add locations
    const locations = await db.query(`
    INSERT INTO locations (formatted_address, coordinates)
    VALUES ('location1', '1,1'),
           ('location2', '2,2')
    RETURNING id, coordinates, formatted_address`);
    testLocationInfo.splice(0, 0, ...locations.rows.map(l => ({id:l.id, 
                                                            coordinates:l.coordinates,
                                                            formattedAddress:l.formatted_address})));
    

    await User.register({
        username: "test1",
        firstName: "first1",
        lastName: "last1",
        email: "test1@test.com",
        password: "password1",
        enableAlerts: false,
    });
    await User.register({
        username: "test2",
        firstName: "first2",
        lastName: "last2",
        email: "test2@test.com",
        password: "password2",
        enableAlerts: false,
    });

    await User.saveArticle("test1", testArticleInfo[0]);
    await User.saveLocation("test1", testLocationInfo[0]);
}

async function commonBeforeEach() {
    await db.query("BEGIN");
}

async function commonAfterEach() {
    await db.query("ROLLBACK");
}

async function commonAfterAll() {
    await db.end();
}


const test1Token = createToken({ username: "test1", firstName: "first1", lastName:"last1", email:"test1@test.com"});
const test2Token = createToken({ username: "test2", firstName: "first2", lastName:"last2", email:"test2@test.com"});

module.exports = {
    commonBeforeAll,
    commonBeforeEach,
    commonAfterEach,
    commonAfterAll,
    testArticleInfo,
    testLocationInfo,
    test1Token,
    test2Token
};
