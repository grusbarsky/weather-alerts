import React, { useState, useEffect } from "react";
import WeatherAlertApi from "../api";
import AlertCard from "./AlertCard";


// Shows all article and a form
// on form submit, filter articles

function ArticleList(props) {

  const [alerts, setAlerts] = useState(null);

  useEffect(function getAlertsOnMount() {
    getAlerts();
  }, []);

  async function getAlerts() {
    let alerts = await WeatherAlertApi.getAlerts();
    setAlerts(alerts);
  }

  if (!alerts) return <h3 className="text-center mt-5">Loading...</h3>;

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

export default ArticleList;
