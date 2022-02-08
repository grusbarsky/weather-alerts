const { emailArticle } = require("./emails");
const { emailAlerts } = require("./emails");
const sgMail = require("@sendgrid/mail");

jest.mock("@sendgrid/mail", () => {
  return {
    setApiKey: jest.fn(),
    send: jest.fn()
  };
});

describe("#sendingEmail", () => {
  afterEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });
  it("Should send mail about articles", done => {
    const logSpy = jest.spyOn(console, "log");
    const mResponse = "email successfully sent";

    const recipient = "testrecipient@test.com"
    const user = {firstName: "test", lastName: "test"}
    const message = "this is a test message."
    const articleUrl = "www.testarticle.com"

    sgMail.send.mockResolvedValueOnce(mResponse);
    emailArticle(recipient, user, message, articleUrl);
    setImmediate(() => {
      expect(sgMail.send).toBeCalledWith({
        to: "testrecipient@test.com",
        from: "test@test.com",
        subject: "test test sent you an article from WeatherAlerts",
        text: "this is a test message. www.testarticle.com",
        html: "this is a test message. <br> www.testarticle.com"
      });
      expect(logSpy).toBeCalledWith(mResponse);
      done();
    });
  });

  it("should send email with alerts", done => {
    const logSpy = jest.spyOn(console, "log");
    const mResponse = "email successfully sent";

    const user = {email: "testuser@test.com", firstName: "test", lastName: "test"}
    const alerts = ["This is a test alert."]

    sgMail.send.mockResolvedValueOnce(mResponse);
    emailAlerts(user, alerts);
    setImmediate(() => {
      expect(sgMail.send).toBeCalledWith({
        to: "testuser@test.com",
        from: "test@test.com",
        subject: "test test you have some weather alerts",
        text: "There are weather alerts in your locations of interest",
        html: "There are weather alerts in your locations of interest: <br> <br> This is a test alert."
        }
      );
      expect(logSpy).toBeCalledWith(mResponse);
      done();
    });
  });
});