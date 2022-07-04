# Weather Alerts

My completed Capstone Project

### Live on Surge
### https://weather-alerts.surge.sh/

## Description
Existing weather apps give you the weather for a location but don’t aggregate multiple locations’ information for you on one page. 
I built weather alerts to bridge that gap – to create an application where a user can access important  weather alerts for their family and friends, 
in one location, quickly and efficiently. Features include: viewing weather alerts, viewing weather-related articles, emailing articles to friends or family,
and real-time search bars.

##Technologies
 * JavaScript
 * Node.js
 * Express
 * React
 * Bootstrap
 * PostgreSQL
 * CSS
 * Jest

### Dashboard

<img width="1438" alt="Screen Shot 2022-05-03 at 4 46 16 PM" src="https://user-images.githubusercontent.com/62483491/166572369-8b8fc987-1311-43cd-ad46-2beb6e230410.png">

### Alerts

<img width="1434" alt="Screen Shot 2022-05-03 at 4 52 47 PM" src="https://user-images.githubusercontent.com/62483491/166572507-d1e6ec59-9b7c-4d8c-8d14-1a43b4561f61.png">

### Articles

<img width="1434" alt="Screen Shot 2022-05-03 at 4 47 23 PM" src="https://user-images.githubusercontent.com/62483491/166572399-afc6ce30-1191-4c13-adf7-efc7d686b95c.png">

## How to download and use locally

### Install Dependencies
In backend folder run: <br />
$npm install <br />
<br />
In frontend folder run: <br />
$npm install

### Create free accounts for the following API's
  * https://www.weatherapi.com/
  * https://newsapi.org/
  * https://sendgrid.com/
  * https://www.mapbox.com/

### Create .env file in backend folder and include API keys in the following format
NEWS_API_KEY='' <br />
SENDGRID_API_KEY='' <br />
WEATHER_API_KEY='' <br />
MAPBOX_API_KEY='' <br />
senderEmail='' (The email you used to send emails via Sendgrid) <br />
SECRET_KEY = '' (Your own personal key) <br />

### Create a database using postgreSQL
$ createdb weather_alerts

### To start servers
#### Backend
Run command in backend folder: <br />
$ nodemon server
#### Frontend
Run command in frontend folder: <br />
$ npm start

## APIs used
  * https://www.weatherapi.com/
  * https://newsapi.org/
  * https://sendgrid.com/
  * https://www.mapbox.com/
