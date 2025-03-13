const express = require('express');
const app = express();

const Datastore = require('nedb');

const fetch = require('node-fetch');

require('dotenv').config();

//console.log(process.env);



const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Starting server at ${port}`);
});

app.use(express.static('public'));
app.use(express.json({limit : '1mb'}));

const database = new Datastore('database.db');
database.loadDatabase();
app.post('/api', (request, response) => 
{
    console.log("I received a request");
    //console.log(request.body);
    data = request.body;
    const timestamp = Date.now();
    data.timestamp = timestamp;
    
    database.insert(data);
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
    response.json(data);
    

});


app.get('/api', (request, response) =>
{

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


app.get('/weather/:latlon', async (request, response) =>
{
    const latlon = request.params.latlon.split(',');
    const lat = latlon[0];
    const lon = latlon[1];
    //const api_key = '522423cc67f1a0538d1f2f4dac5ccb40' ;
    const api_key = process.env.API_KEY;
    //api_url = 'http://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&appid=${API_key}'
    const weather_url = `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${api_key}`

    const weather_response = await fetch(weather_url);
    const weather_json = await weather_response.json();

    const aq_url = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=pm10,pm2_5`;
    
      const aq_response = await fetch(aq_url);
      const aq_json = await aq_response.json();


      const json = 
      {
        weather: weather_json,
        aq: aq_json
      };


    response.json(json);

     




});

