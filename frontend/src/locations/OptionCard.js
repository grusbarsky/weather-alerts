import React from 'react';


function OptionCard(props) {


  return (
    <div onClick={props.add} className='OptionCard list-group-item list-group-item-action py-0'>
      <div className="body">
        <p>{props.info.formattedAddress}</p>
      </div>
    </div>
  )
}

export default OptionCard;