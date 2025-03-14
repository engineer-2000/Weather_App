
function setup()
      {
        console.log("here0");
        noCanvas();
      // const video = createCapture(VIDEO);
      // video.size(320, 240);

      // video.loadPixels();
      // const image64 = video.canvas.toDataURL();

      if("geolocation" in navigator)
      {
        console.log("Geolocation available");
      }
      else
      {
        console.log("geolocation NOT available");
      }

      navigator.geolocation.getCurrentPosition(async (position) => {
      try
      {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      document.getElementById('latitude').textContent = lat;
      document.getElementById('longitude').textContent = lon;

      const proxy_api_url = `/weather/${lat},${lon}`;
      const proxy_response = await fetch(proxy_api_url);
      const proxy_json = await proxy_response.json();
      console.log(proxy_json);
      document.getElementById('summary').textContent = proxy_json.weather.weather[0].main;
      document.getElementById('temperature').textContent = proxy_json.weather.main.temp;

      document.getElementById('aq_value').textContent = proxy_json.aq.current.pm2_5;
      document.getElementById('aq_unit').textContent = proxy_json.aq.current_units.pm2_5;
      document.getElementById('aq_time').textContent = proxy_json.aq.current.time;
      document.getElementById('aq_timezone').textContent = proxy_json.aq.timezone;
      



      const data = {lat, lon, proxy_json};
      //console.log(data);

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
    catch(error)
    {
      console.log('Something went wrong!');
      document.getElementById('aq_value').textContent = 'NO READING';

    }

      });

      


      }