const jwt = require("jsonwebtoken");
const { createToken } = require("./tokens");
const { SECRET_KEY } = require("../config");

describe("createToken", function () {
  test("works", function () {
    const user = {username: "test",
                    firstName: "test",
                    lastName: "test",
                    email: "test@test.com"}
    const token = createToken(user);
    const payload = jwt.verify(token, SECRET_KEY);
    expect(payload).toEqual({
        iat: expect.any(Number),
        username: "test",
        firstName: "test",
        lastName: "test",
        email: "test@test.com"
    });
  });
});