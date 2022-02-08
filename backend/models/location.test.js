"use strict";

const Location = require("./location.js");
const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  testLocationInfo
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);



describe("findAll", function () {
    test("works: findAll locations", async function () {
      let jobs = await Location.findAll();
      expect(jobs).toEqual([testLocationInfo[0].coordinates, testLocationInfo[1].coordinates]);
    });
});
  