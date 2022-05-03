import React from "react";
import "./alert.css"
import { changeDateFormat } from "../helpers";

// alert card 
// creates a location card with alert card children
// if no alerts exist for a location, returns null

function AlertCard({location, alerts, width}) {

    return (

        <div >
            {alerts.length ?
                (
                    <div className={`AlertCard card mx-auto my-3 shadow-lg rounded border-light ${width}`}>
                        <div className="card-body">
                            <div>
                                <h4>{`Alerts for ${location}`}</h4>

                                <div className='list-group'>
                                    {alerts.map(a => (
                                        <div className='list-group-item m-3 shadow rounded border-light'>
                                            <h5 className="card-title">{a.headline}</h5>
                                            <p className='description'>{`${a.desc}`}</p>
                                            <div className='m-1'>{`Effective until: ${changeDateFormat(a.expires)}`}</div>
                                            <div className='m-1'>{`Severity: ${a.severity}`}</div>
                                            <div className='m-1'>{`Areas affected: ${a.areas}`}</div>
                                            <div className='m-1'>{`Type: ${a.event}`}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                        </div>
                    </div>
                ) : (
                    <div className={`AlertCard card mx-auto my-3 shadow-sm rounded border-light ${width}`}>
                        <div className="card-body">
                            <div>
                                <h5 className='text-center'>{`No Alerts for ${location}`}</h5>
                            </div>
                        </div>
                    </div>
                )}

        </div>

    );
}

export default AlertCard;