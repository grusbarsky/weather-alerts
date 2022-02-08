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

jest.mock('axios');

/************************************** GET /news/search */
describe("GET /news/search", function () {
    test("works for same user", async function () {
        axios.get.mockResolvedValue({
            data: {"articles":[{
                    "title": "test title",
                    "url": "test url",
                    "urlToImage": "test image",
                    "publishedAt": "test date"
            }]}});
      const resp = await request(app)
          .get(`/news/search`)
          .query({keyword: "test"});
      expect(resp.body).toEqual({
            "articles":[{
                "title": "test title",
                "url": "test url",
                "urlToImage": "test image",
                "publishedAt": "test date"
        }]},
      );
    });
  
    test("GET /news/search", async function () {
      const resp = await request(app)
          .get(`/news/search`);
      expect(resp.statusCode).toEqual(400);
    });
  });


/************************************** POST /news/:username/save-article */

describe("POST /news/:username/save-article", function () {
    test("works", async function () {
      const resp = await request(app)
          .post("/news/test1/save-article")
          .set("authorization", `Bearer ${test1Token}`)
          .send({"article":{
                    "title": "title",
                    "articleUrl": "article url",
                    "imageUrl": "image url",
                    "datePublished": "date"}});
      expect(resp.body).toEqual({ "saved": "title" });
    });
  
    test("unauth with non-existent user", async function () {
      const resp = await request(app)
          .post("/news/nope/save-article")
          .send({"article":{
                    "title": "title",
                    "articleUrl": "article url",
                    "imageUrl": "image url",
                    "datePublished": "date"}});
      expect(resp.statusCode).toEqual(401);
    });
    test("unauth with wrong user", async function () {
        const resp = await request(app)
            .post("/news/test1/save-article")
            .set("authorization", `Bearer ${test2Token}`)
            .send({"article":{
                        "title": "title",
                        "articleUrl": "article url",
                        "imageUrl": "image url",
                        "datePublished": "date"}});
        expect(resp.statusCode).toEqual(401);
      });
  });

/************************************** DELETE /news/:username/delete-article/:id */

describe(`POST /news/:username/delete-article/:id`, function () {
    test("works", async function () {
      const resp = await request(app)
          .delete(`/news/test1/delete-article/${testArticleInfo[0].id}`)
          .set("authorization", `Bearer ${test1Token}`)
      expect(resp.body).toEqual({ "deleted": testArticleInfo[0].id });
    });
  
    test("unauth with non-existent user", async function () {
      const resp = await request(app)
          .delete(`/news/nope/delete-article/${testArticleInfo[0].id}`)
      expect(resp.statusCode).toEqual(401);
    });
    test("unauth with wrong user", async function () {
        const resp = await request(app)
            .delete(`/news/test1/delete-article/${testArticleInfo[0].id}`)
            .set("authorization", `Bearer ${test2Token}`)
        expect(resp.statusCode).toEqual(401);
      });
  });

