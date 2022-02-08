const { getAlerts } = require("./alerts");
const axios = require('axios');

jest.mock('axios');

describe("#getAlerts", () => {
    it("Should return a response object of alerts", async() => {
        let locations = ["40.7128,74.0060"]
        axios.get.mockResolvedValue({
            data: {
                "location": {
                    "name": "New York",
                    "region": "New York",
                    "country": "United States of America",
                },
                "alerts": {
                    "alert": [
                        {"headline": "alert #1"},
                        {"headline": "alert #2"}
                    ]
                }
            }
        });
    const alerts = await getAlerts(locations);

    expect(alerts).toEqual({"New York, New York": [
        {"headline": "alert #1"},
        {"headline": "alert #2"}
    ]});

  });
});