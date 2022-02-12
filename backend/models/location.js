const db = require("../db");
const { NotFoundError} = require("../expressError");

// class for locations

class Location{
  // allows you to find all locations that have been saved by users
    static async findAll() {
        const result = await db.query(
              `SELECT coordinates
               FROM locations`
        );

        let locations = result.rows.map(l => l.coordinates);
        if(locations=== []) throw new NotFoundError(`No locations found`);
    
        return locations;
      }
}


module.exports = Location;
