const cron = require('node-cron');
const Location = require("./models/location");
const User = require("../models/user");
const {getAlerts} = require("../helpers/alerts")
const {emailAlerts} = require("../helpers/emails");
const res = require('express/lib/response');



// using cron to schedule an alert check and sending alert emails
// alert emails only sent to those who have alerts enabled

// this will be run every 6 hours
    // 0*/6*** --> at minute 0 every 6th hour

cron.schedule('0 */6 * * *', () => {
    // database pull for every location in location table
    let allLocations = Location.findAll();

    // for every location retrieve all alerts --> object: {location: [alerts]}
    let allAlerts = await getAlerts(allLocations);
    
    // db pull with all users with alertsEnabled:true --> [users]
    let enabledUsersData = User.allEnabled();

    // loop through enabled users and retrieve their locations
    for(let i=0; i < enabledUsersData.length; i++){
        let user = enabledUsersData[i];
        let locations = user.locations;
        let alerts = {};
        // loop through users locations
        for(let j = 0; j < locations.length; j++){
            let entries = Object.entries(allAlerts)
            // for each entry of allAlerts
                // check if each key matches the location
                // if it does, push it to alerts
            entries.forEach(([key,val]) => {
                if(locations[j] === key){
                    alerts[`${prop}`] = val;
                }
            })
        }
        emailAlerts(user, alerts)
    }
    res.json("Alerts emailed to enabled users")
});