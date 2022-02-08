const bcrypt = require("bcrypt");

const db = require("../db.js");
const { BCRYPT_WORK_FACTOR } = require("../config");

const testArticleInfo = [];
const testLocationInfo = [];

async function commonBeforeAll() {
    // noinspection SqlWithoutWhere
    await db.query("DELETE FROM locations");
    // noinspection SqlWithoutWhere
    await db.query("DELETE FROM articles");
    // noinspection SqlWithoutWhere
    await db.query("DELETE FROM users");

    // add articles 
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
                                                            formattedAddress:l.formatted})));

    // add users
    await db.query(`
        INSERT INTO users(username,
                          password,
                          first_name,
                          last_name,
                          email)
        VALUES ('test1', $1, 'first1', 'last1', 'test1@test.com'),
               ('test2', $2, 'first2', 'last2', 'test2@test.com')
        RETURNING username`,
        [
            await bcrypt.hash("password1", BCRYPT_WORK_FACTOR),
            await bcrypt.hash("password2", BCRYPT_WORK_FACTOR),
        ]);
    
    // add to user_articles
    await db.query(`
        INSERT INTO user_articles(username, article_id)
        VALUES ('test1', $1)`,
        [testArticleInfo[0].id]);

    // add to user_locations
    await db.query(`
        INSERT INTO user_locations(username, location_id)
        VALUES ('test1', $1)`,
        [testLocationInfo[0].id]);
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


module.exports = {
    commonBeforeAll,
    commonBeforeEach,
    commonAfterEach,
    commonAfterAll,
    testLocationInfo,
    testArticleInfo
};