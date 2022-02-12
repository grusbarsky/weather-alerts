import React, { useState, useEffect } from "react";
import WeatherAlertApi from "../api";
import AlertCard from "./AlertCard";
import LoadingOverlay from 'react-loading-overlay';


// Shows all alerts per location

function AlertList(props) {

  const [alerts, setAlerts] = useState(null);

  useEffect(function getAlertsOnMount() {
    getAlerts();
  }, []);

  async function getAlerts() {
    let alerts = await WeatherAlertApi.getAlerts();
    setAlerts(alerts);
  }

  // shows Loading spinner until alerts are loaded
  if (!alerts) return (
    <div className='p-5'>
      <div className='m-5 p-5'>
        <LoadingOverlay
          active
          spinner={true}
          text='Loading...'
          styles={{
            spinner: (base) => ({
              ...base,
              width: '7rem',
              '& svg circle': {
                stroke: 'black'
              }
            })
          }}
        >
        </LoadingOverlay>
      </div>
    </div>
  )

  return (
      <div className="AlertList">
        {alerts.length
            ? (
                <div className="AlertList-list">
                  {alerts.map(a => (
                      <AlertCard
                        location={a.location}
                        alerts={a.alerts}
                        width={props.width}
                      />
                  ))}
                </div>
            ) : (
                <h4 className="text-center mt-5">No alerts for your locations!</h4>
            )}
      </div>
  );
}

export default AlertList;
