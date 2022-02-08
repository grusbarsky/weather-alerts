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
        const user = await User.get(res.locals.user.username);
        user.locations.forEach(obj => {
            let val = obj.coordinates;
            locations.push(val);
          });
        let allAlerts = await getAlerts(locations)
        return res.json(allAlerts);
    } catch (err) {
        return next(err);
      }
})

module.exports = router;


