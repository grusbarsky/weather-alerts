
import React, { useState, useEffect, useContext } from "react";
import LocationCard from "./LocationCard";
import OptionCard from "./OptionCard";
import SearchForm from "../search/SearchForm";
import UserContext from "../auth/UserContext";
import WeatherAlertApi from "../api";


// Shows all article and a form
// on form submit, filter articles


function LocationList(props) {

  const { currentUser } = useContext(UserContext);
  const [locations, setLocations] = useState(null);
  const [saved, setSaved] = useState(true);
  const [options, setOptions] = useState(null);

  useEffect(function getLocationsOnMount() {
    usersLocations();
  }, []);

  async function search(query) {
    let options = await WeatherAlertApi.getLocations(query);
    setOptions(options);
  }

  async function usersLocations() {
    let locations = await currentUser.locations;
    setLocations(locations);
  }

  async function handleSave(info) {
    try {
      let saved = await WeatherAlertApi.saveLocation(currentUser.username,
        {
          "location": {
            "formattedAddress": info.place_name,
            "coordinates": `${info.geometry.coordinates[1]},${info.geometry.coordinates[0]}`
          }
        })
      setSaved(saved);
      setLocations(l => [...l, saved])
      setOptions(null);
    } catch (err) {
      console.log(err)
    }
  }

  async function deleteLocation(info) {
    try {
      let deleted = await WeatherAlertApi.deleteLocation(currentUser.username, info.id)
      setSaved(!saved);
      setLocations(locations.filter(l => l.id !== info.id));
    } catch (err) {
      console.log(err)
    }
  }

  if (!locations) return <h3 className="text-center mt-5">Loading...</h3>;

  return (
    <div className="LocationList">
      <SearchForm searchFor={search} />
      {options
        ? (
          <div className="OptionList-list list-group w-50 mx-auto">
            {options.map(info => (
                <OptionCard
                  info={{
                    formattedAddress: info.place_name,
                    coordinates: `${info.geometry.coordinates[0]},${info.geometry.coordinates[1]}`
                  }}
                  add={evt => handleSave(info)} />
            ))}
          </div>
        ) : (
          <br></br>
        )}

      {locations.length
        ? (
          <div className="LocationList-list">
            {locations.map(l => (
              <LocationCard
                data={{
                  id: l.id,
                  formattedAddress: l.formattedAddress,
                  coordinates: l.coordinates
                }}
                key={l.id}
                saved={saved ? true : false}
                delete={evt => deleteLocation(l)}
                width={props.width}
              />
            ))}
          </div>
        ) : (
          <h4 className="text-center mt-5">No locations to show!</h4>
        )}
    </div>
  );
}

export default LocationList;
