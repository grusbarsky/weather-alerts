import React from "react";
import "./alert.css"

// article snapshot

function AlertCard(props) {

    return (
        <div className={`AlertCard card mx-auto my-3 shadow ${props.width}`}>
            <div className="card-body">
            {props.alerts.length ?
            (<div>
                <h4>{`Alerts for ${props.location}`}</h4>
                
                <div className='list-group'>
                     {props.alerts.map(a => (
                         <div className='list-group-item m-3 shadow-sm rounded border-light'>
                            <h5 className="card-title">{a.headline}</h5>
                            <p className='description'>{`${a.desc}`}</p>
                            <div className='m-1'>{`effective until ${a.expires}`}</div>
                            <div className='m-1'>{`Severity: ${a.severity}`}</div>
                            <div className='m-1'>{`Areas affected: ${a.areas}`}</div>
                            <div className='m-1'>{`Type: ${a.event}`}</div>
                         </div>
                    ))}
                </div>
            </div>) : (null)}
                
            </div>
        </div>
    );
}

export default AlertCard;