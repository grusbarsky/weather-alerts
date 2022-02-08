import React, { useState, useContext } from "react";
import UserContext from "../auth/UserContext";
import { useHistory, Redirect } from "react-router-dom";
import Alert from "../alert";
import './form.css';


function LoginForm({ login }) {
  const { currentUser } = useContext(UserContext);
  const history = useHistory();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [formErrors, setFormErrors] = useState([]);
 

  async function handleSubmit(evt) {
    evt.preventDefault();
    let result = await login(formData);
    if (result.success) {
      history.push("/"); 
    } else {
      setFormErrors(result.errors);
    }
  }

  function handleChange(evt) {
    const { name, value } = evt.target;
    setFormData(l => ({ ...l, [name]: value }));
  }

  if(currentUser){
    return <Redirect to={"/"} />
  }

  return (
    <div className='form'>
      <div className="col-md-6 col-lg-4 offset-lg-4 p-0">
          <h3>Log In</h3>
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
                    autoComplete="username"
                    required
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
                    autoComplete="current-password"
                    required
                  />
                </div>

                {formErrors.length
                ? <Alert type="danger" messages={formErrors} />
                : null}

                <button className="btn btn-primary w-100" onSubmit={handleSubmit}>Submit</button>
              </form>
              </div>
            </div>
          </div>
          </div>
  ); 
}

export default LoginForm;
