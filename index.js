
// WE REQUIRE EXPRESS FOR SETTING UP A SERVER
const express = require('express');
const app = express();

// WE REQUIRE NEDB FOR CREATING A DATABASE
const Datastore = require('nedb');

// WE REQUIRE NODE-FETCH SO THAT WE CAN USE FETCH IN THE SERVER.
const fetch = require('node-fetch');

// WE REQUIRE dotenv SO THAT WE CAN HIDE OUR API KEYS IN THE .env FILE
require('dotenv').config();

//console.log(process.env); // THIS LINE IS FOR TESTING PURPOSES.



// WE SET THE PORT FOR OUR SERVER.
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Starting server at ${port}`);
});

// WE TELL OUR SERVER TO SERVE WHAT IS IN THE public FOLDER. IF WE DON'T GIVE IT A FILE NAME,
// BY DEFAULT, IT WILL SERVE/OPEN THE index.html FILE IN THE PUBLIC FOLDER.
app.use(express.static('public'));
app.use(express.json({limit : '1mb'}));

// WE CREATE A DATABASE USING NEDB AND LOAD A FILE TO USE FOR OUR DATABASE
const database = new Datastore('database.db');
database.loadDatabase();

// WE HANDLE THE POST REQUESTS THAT OUR SERVER RECEIVES THROUGH THE /weather ENDPOINT.
// THE GET REQUEST IS MADE FROM THE SKETCH.JS FILE, AND SENDS THE CLIENT'S LOCATION'S 
// LATITUDE AND LONGITUDE TO THE SERVER. THE LATITUDE AND LONGIUDE ARE SENT AS 
// ROUTE PARAMETERS IN THE GET REQUEST TO OUR SERVER.
// OUR SERVER MAKES TWO API CALLS.
// THE FIRST API CALL IS MADE TO weather_url, AND THE RESPONSE INCLUDES THE WEATHER 
// SUMMARY AND TEMPERATURE.
// THE SECOND API CALL IS MADE TO aq_url, WHERE aq STANDS FOR AIR QUALITY. THE RESPONSE 
// INCLUDES THE CONCENTRATION OF PARTICULATE MATTER, AND WHEN IT WAS READ.
// THEN THE RESULT FROM THE TWO API CALLS IS PUT IN AN OBJECT NAMED json,
// AND IS SENT BACK AS THE RESPONSE FOR THIS GET REQUEST.
app.get('/weather/:latlon', async (request, response) =>
{
    const latlon = request.params.latlon.split(',');
    const lat = latlon[0];
    const lon = latlon[1];
    const api_key = process.env.API_KEY;
    // PLEASE IGNORE THE LINE BELOW. I HAVE KEPT IT FOR MY OWN FUTURE REFERENCE.
    //api_url = 'http://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&appid=${API_key}'
    
    // THE FIRST API CALL IS MADE TO weather_url, AND THE RESPONSE INCLUDES THE WEATHER 
    // SUMMARY AND TEMPERATURE.
    const weather_url = `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${api_key}`

    const weather_response = await fetch(weather_url);
    const weather_json = await weather_response.json();

   
   // THE SECOND API CALL IS MADE TO aq_url, WHERE aq STANDS FOR AIR QUALITY. THE RESPONSE 
   // INCLUDES THE CONCENTRATION OF PARTICULATE MATTER, AND WHEN IT WAS READ.
    const aq_url = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=pm10,pm2_5`;
    
    const aq_response = await fetch(aq_url);
    const aq_json = await aq_response.json();


    // THEN THE RESULT FROM THE TWO API CALLS IS PUT IN AN OBJECT NAMED json,
    // AND IS SENT BACK AS THE RESPONSE FOR THIS GET REQUEST.
    const json = 
      {
        weather: weather_json,
        aq: aq_json
      };


    response.json(json);

});


// WE HANDLE THE POST REQUESTS THAT OUR SERVER RECEIVES THROUGH THE /api ENDPOINT.
// THE POST REQUEST IS MADE FROM THE SKETCH.JS FILE, AND SENDS ALL THE CLIENT'S INFRMATION
// INCLUDING THE LOCATION AND WEATHER INFORMATION TO THE SERVER.
// WE TELL THE SERVER TO PUT ALL THE INFORMATION IN THE BODY OF THE POST REQUEST IN THE DATABASE.
app.post('/api', (request, response) => 
{
    console.log("I received a request");
    //console.log(request.body);
    data = request.body;
    const timestamp = Date.now();
    data.timestamp = timestamp;
    
    database.insert(data);
    // PLEASE IGNORE THE NEXT FEW LINES. THEY ARE FOR TESTING PURPOSES.
    //console.log(database);
    // response.json(
    //     {
    //         status: "Success",
    //         timestamp: timestamp,
    //         latitude: data.lat,
    //         longitude: data.lon,
    //         image64: data.image64,
    //         proxy_json: proxy_json
    //     }
    // );

    // FOR THE RESPONSE OF THE POST REQUEST, WE TELL THE SERVER TO SEND BACK ALL THE ENTRY INFORMATION
    // THAT IT PUT IN THE DATABASE TO THE CLIENT SO THAT THE CLIENT AS A CONFIRMATION.
    response.json(data);
    

});

// HERE, WE HANDLE THE GET REQUEST THAT OUR SERVER RECEIVES AT THE /api ENDPOINT.
// THIS GET REQUEST IS MADE IN THE logs.js FILE TO GET THE INFORMATION FOR ALL THE LOGIN ENTRIES
// IN THE DATABASE IN ORDER TO SHOW THEM ON THE MAP
// HERE, WE TELL THE SERVER THAT WEHN IT RECEIVES A GET REQUEST TO THE API PORT, IT SHOULD SEND 
// BACK ALL THE INFORMATION IN THE DATABASE AS THE RESPONSE. 
app.get('/api', (request, response) =>
{

    // WE USE database.find WITHOUT SENDING ANY PARAMETERS IN ORDER TO GET ALL THE INFORMATION
    // STORED IN THE DATABASE.
    database.find({}, (error, data) =>
    {
        if (error)
        {
            response.end();
            return;
        }
        response.json(data);

    });

});

