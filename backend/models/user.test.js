"use strict";

const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} = require("../expressError");
const db = require("../db.js");
const User = require("./user.js");
const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  testArticleInfo,
  testLocationInfo
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** authenticate */

describe("authenticate", function () {
  test("works", async function () {
    const user = await User.authenticate("test1", "password1");
    expect(user).toEqual({
      username: "test1",
      firstName: "first1",
      lastName: "last1",
      email: "test1@test.com",
      enableAlerts: false,
    });
  });

  test("unauth if no such user", async function () {
    try {
      await User.authenticate("nope", "password");
      fail();
    } catch (err) {
      expect(err instanceof UnauthorizedError).toBeTruthy();
    }
  });

  test("unauth if wrong password", async function () {
    try {
      await User.authenticate("test1", "wrong");
      fail();
    } catch (err) {
      expect(err instanceof UnauthorizedError).toBeTruthy();
    }
  });
});

/************************************** register */

describe("register", function () {
  const newUser = {
    username: "new",
    firstName: "Test",
    lastName: "Tester",
    email: "new@test.com",
    enableAlerts: false,
  };

  test("works", async function () {
    let user = await User.register({
      ...newUser,
      password: "password",
    });
    expect(user).toEqual(newUser);
    const found = await db.query("SELECT * FROM users WHERE username = 'new'");
    expect(found.rows.length).toEqual(1);
    expect(found.rows[0].enable_alerts).toEqual(false);
    expect(found.rows[0].password.startsWith("$2b$")).toEqual(true);
  });

  test("bad request with dup data", async function () {
    try {
      await User.register({
        ...newUser,
        password: "password",
      });
      await User.register({
        ...newUser,
        password: "password",
      });
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });
});

/************************************** get */

describe("get", function () {
  test("works", async function () {
    let user = await User.get("test1");
    
    expect(user).toEqual({
      username: "test1",
      firstName: "first1",
      lastName: "last1",
      email: "test1@test.com",
      enableAlerts: false,
      locations: [testLocationInfo[0].coordinates],
      articles: [testArticleInfo[0]]
    });
  });

  test("not found if no such user", async function () {
    try {
      await User.get("nope");
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});

/************************************** update */

describe("update", function () {
  const updateData = {
    firstName: "NewF",
    lastName: "NewF",
    email: "new@test.com",
    enableAlerts: true,
  };

  test("works", async function () {
    let job = await User.update("test1", updateData);
    expect(job).toEqual({
      username: "test1",
      ...updateData,
    });
  });

  test("not found if no such user", async function () {
    try {
      await User.update("nope", {
        firstName: "test",
      });
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});

/************************************** remove */

describe("remove", function () {
  test("works", async function () {
    await User.remove("test1");
    const res = await db.query(
        "SELECT * FROM users WHERE username='u1'");
    expect(res.rows.length).toEqual(0);
  });

  test("not found if no such user", async function () {
    try {
      await User.remove("nope");
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});

/************************************** save / delete article */

describe("saveArticle", function () {
  test("works", async function () {
    await User.saveArticle("test1", testArticleInfo[1]);

    const res = await db.query(
        "SELECT * FROM user_articles WHERE article_id=$1 AND username=$2", [testArticleInfo[1].id, "test1"]);
    expect(res.rows.length).toEqual(1);
  });
});

describe("deleteArticle", function () {
    test("works", async function () {
        await User.removeArticle("test1", testArticleInfo[0].id );
        const res = await db.query(
          "SELECT * FROM user_articles WHERE article_id=$1 AND username=$2", [testArticleInfo[0].id, "test1"]);
        expect(res.rows.length).toEqual(0);
      });
});

/************************************** save / delete location*/

describe("saveLocation", function () {
    test("works", async function () {
      await User.saveLocation("test1", testLocationInfo[1]);
  
      const res = await db.query(
          "SELECT * FROM user_locations WHERE location_id=$1 AND username=$2", [testLocationInfo[1].id, "test1"]);
          expect(res.rows.length).toEqual(1);
    });
});

  describe("deleteLocation", function () {
    test("works", async function () {
        await User.removeLocation("test1", testLocationInfo[0].id );
        const res = await db.query(
          "SELECT * FROM user_locations WHERE location_id=$1 AND username=$2", [testLocationInfo[0].id, "test1"]);
        expect(res.rows.length).toEqual(0);
      });
});