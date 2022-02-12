import React from "react";

// article snapshot

function LocationCard(props) {

  let formattedAddress = props.data.formattedAddress;


  async function handleDeleteLocation() {
    props.delete(props, props.saved);
  }


  return (
    <div className={`LocationCard card ${props.width} mx-auto mb-4 p-0 shadow-sm rounded border-light`}>
      <div className="card-body">
        <h5 className="card-title">{formattedAddress}</h5>
        <button
          className="btn btn-primary float-end"
          onClick={handleDeleteLocation}>Delete</button>
      </div>
    </div>
  );
}

export default LocationCard;