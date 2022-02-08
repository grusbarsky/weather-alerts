import React, { useState, useContext } from "react";
import Alert from "../alert";
import WeatherAlertApi from "../api";
import UserContext from "../auth/UserContext";

// allows user to edit profile
// these changes will immediatly be seen around the sute

function ProfileForm() {
  const { currentUser, setCurrentUser } = useContext(UserContext);
  const [formData, setFormData] = useState({
    firstName: currentUser.firstName,
    lastName: currentUser.lastName,
    email: currentUser.email,
    username: currentUser.username,
    enableAlerts: currentUser.enableAlerts,
    password: "",
  });
  const [formErrors, setFormErrors] = useState([]);


  const [saveConfirmed, setSaveConfirmed] = useState(false);


  async function handleSubmit(evt) {
    evt.preventDefault();

    let profileData = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      enableAlerts: formData.enableAlerts,
      password: formData.password
    };

    let username = formData.username;
    let updatedUser;

    try {
      updatedUser = await WeatherAlertApi.saveSettings(username, profileData);
    } catch (errors) {
      setFormErrors(errors);
      return;
    }

    setFormData(f => ({ ...f, password: "" }));
    setFormErrors([]);
    setSaveConfirmed(true);

    // reloads information on entire site
    setCurrentUser(updatedUser);
  }

  /** Handle form data changing */
  function handleChange(evt) {
    const target = evt.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    setFormData(f => ({
      ...f,
      [name]: value,
    }));
    setFormErrors([]);
  }

  return (
    <div className='profile-form mt-5'>
      <div className="col-md-6 col-lg-4 offset-lg-4 p-0">
        <h3>Profile</h3>
        <div className="card text-left">
          <div className='card-body w-100'>
          <form>
              <div className="form-group">
                <label className="fw-bold">Username</label>
                <p className="form-control-plaintext">{formData.username}</p>
              </div>
              <div className="form-group">
                <label className="fw-bold">First Name</label>
                <input
                    name="firstName"
                    className="form-control mb-3"
                    value={formData.firstName}
                    onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label className="fw-bold">Last Name</label>
                <input
                    name="lastName"
                    className="form-control mb-3"
                    value={formData.lastName}
                    onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label className="fw-bold">Email</label>
                <input
                    name="email"
                    className="form-control mb-3"
                    value={formData.email}
                    onChange={handleChange}
                />
              </div>
              <div className="form-check formgroup">
                  <label className='form-check-label fw-bold'>Enable Email Alerts</label>
                  <input
                      type="checkbox"
                      name="enableAlerts"
                      className="form-check-input form-control mb-3"
                      checked={formData.enableAlerts}
                      onChange={handleChange}
                  />
                </div>
              <div className="form-group">
                <label className="fw-bold">Confirm password to make changes:</label>
                <input
                    type="password"
                    name="password"
                    className="form-control mb-3"
                    value={formData.password}
                    onChange={handleChange}
                />
              </div>

              {formErrors.length
                  ? <Alert type="danger" messages={formErrors} />
                  : null}

              {saveConfirmed
                  ?
                  <Alert type="success" messages={["Updated successfully"]} />
                  : null}

              <button
                  className="btn btn-primary w-100"
                  onClick={handleSubmit}
              >
                Save Changes
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileForm;
