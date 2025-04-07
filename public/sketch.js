//--------------------------------- PLEASE START HERE ---------------------------------
//THIS IS THE START
//THIS IS THE JS FILE FOR THE MAIN PAGE OF THE APP WHICH IS INDEX.HTML

//WE USE FUNCTION SETUP BECAUSE PART OF THE PROGRAM THAT HAS BEEN COMMENTED USED THE P5 LIBRARY
function setup()
      {
        noCanvas();
        //THIS PART THAT HAS BEEN COMMENTED IS CAPTURING THE USER'S PICTURE, BUT 
        // I HAVE REMOVED THIS FEATURE
      // const video = createCapture(VIDEO);
      // video.size(320, 240);

      // video.loadPixels();
      // const image64 = video.canvas.toDataURL();

      // STEP 2. FIRST WE CHECK TO SEE IF THE CLINET'S BROWSER HAS THE NAVIGATOR INTERFACE
      if("geolocation" in navigator)
      {
        console.log("Geolocation available");
      }
      else
      {
        console.log("geolocation NOT available");
      }

      // STEP 3. WE GET THE USER'S LOCATION USING THE NAVIGATOR INTERFACE
      navigator.geolocation.getCurrentPosition(async (position) => {
      try
      {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;

      //WE DISPLAY THE USER'S LOCATION'S LATITUDE AND LONGITUDE ON THE PAGE
      document.getElementById('latitude').textContent = lat;
      document.getElementById('longitude').textContent = lon;

      
      // WE WANT TO MAKE TWO API CALLS, AND BECAUSE WE HAVE AN API KEY, WE MAKE THE REQUESTS FROM OUR SERVER.
      // WE MAKE A ROXY API PORT NAMED WEATHER, AND SEND THE USER'S LOCATION'S LATITUDE AND LONGITUDE
      // AS ROUTE PARAMETERS
      // OUR SERVER MAKES TWO API CALLS, AND RETURNS THE RESULT TO US
      // FROM THE FIRST API CALL, WE GET THE WEATHER SUMMARY AND TEMPERATURE
      // FROM THE SECOND API CALL, WE GET THE AIR QUALITY (aq). IT GIVES US THE CONCENTRATION OF
      // THE PARTICULATE MATTER, AND WHEN THIS VALUE WAS READ.
      const proxy_api_url = `/weather/${lat},${lon}`;
      const proxy_response = await fetch(proxy_api_url);
      const proxy_json = await proxy_response.json();
      console.log(proxy_json);

      // WE DISPLAY THE WEATHER SUMMARY AND TEMPERATURE ON THE PAGE
      document.getElementById('summary').textContent = proxy_json.weather.weather[0].main;
      document.getElementById('temperature').textContent = proxy_json.weather.main.temp;

      // WE DISPLAY THE CONCENTRATION OF THE PARTICULATE MATTER AND WHEN IT WAS READ ON THE PAGE
      document.getElementById('aq_value').textContent = proxy_json.aq.current.pm2_5;
      document.getElementById('aq_unit').textContent = proxy_json.aq.current_units.pm2_5;
      document.getElementById('aq_time').textContent = proxy_json.aq.current.time;
      document.getElementById('aq_timezone').textContent = proxy_json.aq.timezone;
      



      // NOW THAT WE HAVE ALL THE DATA, WE CREATE AN OBJECT THAT CONTAINES THE USER'S 
      // LOCATION'S LATITUDE, LONGITUDE, AND WEATHER INFORMATION.
      // proxy_json IS AN OBJECT THAT INCLUDES ALL THE INFORMATION ABOUT THE WEATHER'S 
      // SUMMARY, TEMPERATURE, THE CONCENTRATION OF PARTICULATE MATTER, AND WHEN IT WAS
      
      const data = {lat, lon, proxy_json};
      //console.log(data);

      // WE SEND ALL THE DATA TO THE SERVER TO BE PUT IN THE DATABASE
      const options = {
        method: 'POST',
        headers: 
        {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)

      };

      const response = await fetch('/api', options);
      const json = await response.json();
      console.log(json);

    }

    // WE CATCH ANY ERROR AND IF THERE IS NO VALUE FOR THE CONCENTRATION OF PARTICULATE MATTER, 
    // WE DISPLAY A 'NO READING' VALUE.
    catch(error)
    {
      console.log('Something went wrong!');
      document.getElementById('aq_value').textContent = 'NO READING';

    }

      });

      


      }