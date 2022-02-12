const sgMail = require('@sendgrid/mail');
require('dotenv').config();
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
const { getEmail } = require("../config")

sgMail.setApiKey(SENDGRID_API_KEY)

// helper function that handles sending articles
const emailArticle = async (recipient, user, message, articleUrl) => {
    const senderEmail = getEmail()

    const msg = {
        to: `${recipient}`,
        from: `${senderEmail}`,
        subject: `${user.firstName} ${user.lastName} sent you an article from WeatherAlerts`,
        text: `${message} ${articleUrl}`,
        html: `${message} <br> ${articleUrl}`
    }
    try{
        await sgMail.send(msg);
        console.log("email successfully sent");
    }catch (err) {
        console.error(err.toString());
      }
}


// helper function that handles sending emails for alerts
const emailAlerts = async (user, alerts) => {
    const senderEmail = getEmail()
    let message = alerts.join(' <br> <br> ');

    const msg = {
        to: `${user.email}`,
        from: `${senderEmail}`,
        subject: `${user.firstName} ${user.lastName} you have some weather alerts`,
        text: `There are weather alerts in your locations of interest`,
        html: `There are weather alerts in your locations of interest: <br> <br> ${message}`
    }

    try{
        await sgMail.send(msg);
        console.log("email successfully sent");
    }catch (err) {
        console.error(err.toString());
      }
}



module.exports = {
    emailArticle,
    emailAlerts
};