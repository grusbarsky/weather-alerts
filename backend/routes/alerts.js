// routes for alerts


const express = require("express");
const { json } = require("express/lib/response");
const router = new express.Router();
const {getAlerts} = require("../helpers/alerts"); 
const User = require("../models/user");



// get alerts for this user when user accesses alerts page
router.get("/", async function(req,res,next){
    try{
        const locations = []
        // gets all locations for user, creates array of coordinates
        const user = await User.get(res.locals.user.username);
        user.locations.forEach(obj => {
            let val = obj.coordinates;
            locations.push(val);
          });
        // array of coordinates sent to getAlerts helper function and returns an array of objects
        // returns [{location: "location1", alerts: [alert1, alert2]},
        //            {location: "location2", alerts: [alert1, alert2}]
        let allAlerts = await getAlerts(locations)
        return res.json(allAlerts);
    } catch (err) {
        return next(err);
      }
})

module.exports = router;


