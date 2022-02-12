const res = require("express/lib/response");
require('dotenv').config();
const MAPBOX_API_KEY = process.env.MAPBOX_API_KEY;
const axios = require("axios");

// helper function that handles searching for valid locations and returns data including the coordinates

async function locationSearch(query) {
    try {
        const locations = await axios.get(
            `https://api.mapbox.com/geocoding/v5/mapbox.places/${query}.json?types=place%2Cpostcode%2Caddress&autocomplete=false&fuzzyMatch=true&access_token=${MAPBOX_API_KEY}`
        );

        return(locations.data.features);
        
    } catch (err) {
        console.log("\ncatching error")
        res.json(err)
    }
}

module.exports = { locationSearch }
