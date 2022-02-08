"use strict";

const request = require("supertest");

const db = require("../db.js");
const app = require("../app");
const User = require("../models/user");
const axios = require('axios');

const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  testArticleInfo,
  testLocationInfo,
  test1Token,
  test2Token
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);



/************************************** GET /users/:username */

describe("GET /users/:username", function () {
  test("works for same user", async function () {

    const resp = await request(app)
        .get(`/users/test1`)
        .set("authorization", `Bearer ${test1Token}`);
    expect(resp.body).toEqual({
      user: {
        username: "test1",
        firstName: "first1",
        lastName: "last1",
        email: "test1@test.com",
        enableAlerts: false,
        locations: [testLocationInfo[0].coordinates],
        articles: [testArticleInfo[0]]
      },
    });
  });

  test("unauth for other users", async function () {
    const resp = await request(app)
        .get(`/users/test1`)
        .set("authorization", `Bearer ${test2Token}`);
    expect(resp.statusCode).toEqual(401);
  });

  test("unauth for anon", async function () {
    const resp = await request(app)
        .get(`/users/u1`);
    expect(resp.statusCode).toEqual(401);
  });
});

/************************************** PATCH /users/:username */

describe("PATCH /users/:username", () => {
  test("works for same user", async function () {
    const resp = await request(app)
        .patch(`/users/test1`)
        .send({
          firstName: "New",
        })
        .set("authorization", `Bearer ${test1Token}`);
    expect(resp.body).toEqual({
      user: {
        username: "test1",
        firstName: "New",
        lastName: "last1",
        email: "test1@test.com",
        enableAlerts: false,
      },
    });
  });

  test("unauth if not same user", async function () {
    const resp = await request(app)
        .patch(`/users/test1`)
        .send({
          firstName: "New",
        })
        .set("authorization", `Bearer ${test2Token}`);
    expect(resp.body).toEqual({
        "error": {
          "message": "Unauthorized",
          "status": 401
        }
      });
  });

  test("unauth for anon", async function () {
    const resp = await request(app)
        .patch(`/users/test1`)
        .send({
          firstName: "New",
        });
    expect(resp.statusCode).toEqual(401);
  });

  test("bad request if invalid data", async function () {
    const resp = await request(app)
        .patch(`/users/test1`)
        .send({
          firstName: 42,
        })
        .set("authorization", `Bearer ${test1Token}`);
    expect(resp.statusCode).toEqual(400);
  });
});

/************************************** DELETE /users/:username */

describe("DELETE /users/:username", function () {
  test("works for same user", async function () {
    const resp = await request(app)
        .delete(`/users/test1`)
        .set("authorization", `Bearer ${test1Token}`);
    expect(resp.body).toEqual({ deleted: "test1" });
  });

  test("unauth if not same user", async function () {
    const resp = await request(app)
        .delete(`/users/test1`)
        .set("authorization", `Bearer ${test2Token}`);
    expect(resp.statusCode).toEqual(401);
  });

  test("unauth for anon", async function () {
    const resp = await request(app)
        .delete(`/users/test1`);
    expect(resp.statusCode).toEqual(401);
  });
});

/************************************** LOCATIONS */

jest.mock('axios');

describe("#GET /users/locations/search", () => {
    it("Should return a response object of locations", async() => {
        axios.get.mockResolvedValue({
            data: {"results":[{
                "formatted_address": "Baltimore, MD, USA",
                "geometry": 
                    {"location": 
                        {"lat": "39.2903848", 
                        "lng": "-76.6121893"}}}
            ]}});
        const resp = await request(app)
            .get("/users/locations/search")
            .query({location: "Baltimore City"});
    expect(resp.body).toEqual({
        "formattedAddress": "Baltimore, MD, USA",
        "coordinates": "39.2903848,-76.6121893"
      });
  });
});

// save-location

describe("POST /users/:username/save-location", function () {
    test("works", async function () {
      const resp = await request(app)
          .post("/users/test1/save-location")
          .set("authorization", `Bearer ${test1Token}`)
          .send({"location":{
                    "formattedAddress": "address",
                    "coordinates": "lat,long"}});
      expect(resp.body).toEqual({ "saved": "address" });
    });
  
    test("unauth with non-existent user", async function () {
      const resp = await request(app)
          .post("/users/nope/save-location")
          .send({"location":{
            "formattedAddress": "address",
            "coordinates": "lat,long"}});
      expect(resp.statusCode).toEqual(401);
    });
    test("unauth with wrong user", async function () {
        const resp = await request(app)
            .post("/users/test1/save-location")
            .set("authorization", `Bearer ${test2Token}`)
            .send({"location":{
              "formattedAddress": "address",
              "coordinates": "lat,long"}});
        expect(resp.statusCode).toEqual(401);
      });
  });

// delete-location


describe(`POST /users/:username/delete-location/:id`, function () {
    test("works", async function () {
      const resp = await request(app)
          .delete(`/users/test1/delete-location/${testLocationInfo[0].id}`)
          .set("authorization", `Bearer ${test1Token}`)
      expect(resp.body).toEqual({ "deleted": testLocationInfo[0].id });
    });
  
    test("unauth with non-existent user", async function () {
      const resp = await request(app)
          .delete(`/users/nope/delete-location/${testLocationInfo[0].id}`)
      expect(resp.statusCode).toEqual(401);
    });
    test("unauth with wrong user", async function () {
        const resp = await request(app)
            .delete(`/users/test1/delete-location/${testLocationInfo[0].id}`)
            .set("authorization", `Bearer ${test2Token}`)
        expect(resp.statusCode).toEqual(401);
      });
  });