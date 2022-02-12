"use strict";

// routes for users: user settings, edit user, delete user, add/delete locations

const jsonschema = require("jsonschema");
const express = require("express");
const router = express.Router();

const { BadRequestError } = require("../expressError");
const User = require("../models/user");
const userUpdateSchema = require("../schemas/userEdit.json");
const { ensureCorrectUser } = require("../middleware/auth");
const { locationSearch } = require("../helpers/locationSearch")



// get user settings
// only a logged in user can access their settings
// [username] => { user }
//  Returns { username, firstName, lastName, email, alertsEnabled }

router.get("/:username", ensureCorrectUser, async function (req, res, next) {
  try {
    const user = await User.get(req.params.username);
    return res.json({ user });
  } catch (err) {
    return next(err);
  }
});


// edit user

// Data can include: { firstName, lastName, password, email, alertsEnabled }
// Returns { username, firstName, lastName, email, alertsEnabled}
// only a logged in user can change their settings

router.patch("/:username", ensureCorrectUser, async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, userUpdateSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.schema.message);
      throw new BadRequestError(errs);
    }
    const authenticate = await User.authenticate(req.params.username, req.body.password);
    if(!authenticate) {
      throw new BadRequestError("Incorrect Password");
    }
    const user = await User.update(req.params.username, req.body);
    return res.json({ user });
  } catch (err) {
    return next(err);
  }
});


// delete user
// only a logged in user can delete their account

router.delete("/:username", ensureCorrectUser, async function (req, res, next) {
  try {
    await User.remove(req.params.username);
    return res.json({ deleted: req.params.username });
  } catch (err) {
    return next(err);
  }
});


// search location
// {"location":"Baltimore City"}
router.get("/locations/search/", async function(req, res, next){
  const query = req.query;
  // makes multi word search, url friendly
  let encoded = encodeURI(query.location);
  
  try{ 
    const resp = await locationSearch(encoded);
    return res.json(resp);
    
  }catch (err) {
    return next(err);
  }
});

// user saves location
// {"location":{
//      "formattedAddress": "address",
//      "coordinates": "lat,long"}}
router.post("/:username/save-location", ensureCorrectUser, async function (req, res, next){
  try { 
      let location = req.body.location;

      let saved = await User.saveLocation(req.params.username, location);
      return res.json(saved);
    } catch (err) {
      return next(err);
    }
});

// user deletes location
router.delete("/:username/delete-location/:id", ensureCorrectUser, async function (req, res, next){
  try {
      const locationId = +req.params.id;
      await User.removeLocation(req.params.username, locationId);
      return res.json({ deleted: locationId });
    } catch (err) {
      return next(err);
    }
});


module.exports = router;