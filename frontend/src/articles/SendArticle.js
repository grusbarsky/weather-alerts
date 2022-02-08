import React, { useState } from 'react';
import Popup from 'reactjs-popup';
import WeatherAlertApi from '../api';
import Alert from "../alert";
import './articles.css';



function SendArticle(props) {

    const [formErrors, setFormErrors] = useState([]);
    const [saveConfirmed, setSaveConfirmed] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        message: '',
        article: props.url
    });

    async function handleSubmit(evt) {
        evt.preventDefault();

        let data = {
            email: formData.email,
            message: formData.message,
            article: formData.article
        };


        try {
            let sendEmail = await WeatherAlertApi.sendArticle(data);
        } catch (errors) {
            setFormErrors(errors);
            return;
        }

        setFormData(f => ({ ...f }));
        setFormErrors([]);
        setSaveConfirmed(true);
    }

    /** Handle form data changing */
    function handleChange(evt) {
        const { name, value } = evt.target;
        setFormData(f => ({ ...f, [name]: value }));
        setFormErrors([]);
    }

    return (
        <Popup
            trigger={<button className="btn btn-primary card-btn"> Send </button>}
            modal
            nested
        >
            {close => (
                <div className="modal">
                    <div className="modal-dialog align">
                        <div className='modal-content p-3'>
                            <div className='modal-header'>
                                <h3 className=""> Send Email</h3>
                                <button className="btn btn-primary p-1 close-popup" onClick={close}>
                                    &times;
                                </button>
                            </div>
                            <form>
                                <div className="form-group">
                                    <label className="fw-bold">url</label>
                                    <p className="form-control-plaintext">{formData.article}</p>
                                </div>
                                <div className="form-group">
                                    <label className="fw-bold">Recipient Email</label>
                                    <input
                                        name="email"
                                        className="form-control mb-3"
                                        value={formData.email}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="fw-bold">Message</label>
                                    <input
                                        name="message"
                                        className="form-control mb-3"
                                        value={formData.message}
                                        onChange={handleChange}
                                    />
                                </div>

                                {formErrors.length
                                    ? <Alert type="danger" messages={formErrors} />
                                    : null}

                                {saveConfirmed
                                    ?
                                    <Alert type="success" messages={["Email sent successfully"]} />
                                    : null}

                                <button
                                    className="btn btn-primary float-end"
                                    onClick={handleSubmit}
                                >
                                    Send Email
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </Popup>
    )
}

export default SendArticle;