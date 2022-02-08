import React from "react";

// show alerts

function Alert({ type = "danger", messages = [] }) {

  return (
      <div className={`alert-${type}`} role="alert">
        {messages.map(error => (
            <p className="alert-text text-center" key={error}>
              {error}
            </p>
        ))}
      </div>
  );
}

export default Alert;