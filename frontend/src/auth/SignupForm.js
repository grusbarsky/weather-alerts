import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import Alert from "../alert";
import './form.css';


function SignupForm({ signup }) {
  const history = useHistory();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    firstName: "",
    lastName: "",
    email: "",
    enableAlerts: false
  });
  const [formErrors, setFormErrors] = useState([]);

  async function handleSubmit(evt) {
    evt.preventDefault();
    let result = await signup(formData);
    if (result.success) {
      history.push("/");
    } else {
      setFormErrors(result.errors);
    }
  }

  function handleChange(evt) {
    const target = evt.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    setFormData(data => ({ ...data, [name]: value }));
  }

  return (
      <div className="form mt-4">
        <div className="col-md-6 col-lg-4 offset-lg-4 p-0">
          <h2>Sign Up</h2>
          <div className="card shadow-lg p-5">
            <div className="card-body w-100">
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className='fw-bold'>Username</label>
                  <input
                      name="username"
                      className="form-control mb-3"
                      value={formData.username}
                      onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label className='fw-bold'>Password</label>
                  <input
                      type="password"
                      name="password"
                      className="form-control mb-3"
                      value={formData.password}
                      onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label className='fw-bold'>First name</label>
                  <input
                      name="firstName"
                      className="form-control mb-3"
                      value={formData.firstName}
                      onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label className='fw-bold'>Last name</label>
                  <input
                      name="lastName"
                      className="form-control mb-3"
                      value={formData.lastName}
                      onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label className='fw-bold'>Email</label>
                  <input
                      type="email"
                      name="email"
                      className="form-control mb-3"
                      value={formData.email}
                      onChange={handleChange}
                  />
                </div>
                <div className="form-check form-group">
                  <label className='form-check-label fw-bold'>Enable Email Alerts</label>
                  <input
                      type="checkbox"
                      name="enableAlerts"
                      className="form-check-input form-control mb-3"
                      checked={formData.enableAlerts}
                      onChange={handleChange}
                  />
                </div>

                {formErrors.length
                    ? <Alert type="danger" messages={formErrors} />
                    : null
                }

                <button
                    type="submit"
                    className="btn btn-primary w-100"
                    onSubmit={handleSubmit}
                >
                  Submit
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
  );
}

export default SignupForm;