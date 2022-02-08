const res = require("express/lib/response");
const axios = require("axios");
require('dotenv').config();

const WEATHER_API_KEY = process.env.WEATHER_API_KEY

async function getAlerts(locations){
    let locationAlertsPromise = [];

    let allAlerts = [];

    // loop through locations
    for(let i=0; i<locations.length; i++){
        locationAlertsPromise.push(
            axios.get(`http://api.weatherapi.com/v1/forecast.json?key=${WEATHER_API_KEY}&q=${locations[i]}&days=1&aqi=no&alerts=yes`)
        );
    }

    // resolve of promises
    await Promise.all(locationAlertsPromise).then((locationData) => {
        for (location of locationData){
            let alerts = location.data.alerts.alert;
            let names = location.data.location;
            // for each location, add alerts to allAlerts object with location as key
            let alert = {location: `${names.name}, ${names.region}`, alerts: alerts}
            allAlerts.push(alert);
        }
    }).catch(err => res.json(err));

    return allAlerts;
}

module.exports = {getAlerts}