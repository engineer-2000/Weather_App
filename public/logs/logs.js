// THIS IS THE JS FILE FOR THE LOGS/INDEX.HTML FILE WHICH SHOWS ALL THE LOGINS IN THE 
// DATABASE ON A MAP CREATED USING LEAFLET



async function getData()
        {
            //FIRST, WE SEND A FETCH REQUEST TO THE SERVER, AND RECEIVE ALL THE DATA IN THE DATABASE.
            const response = await fetch('/api');
            const json = await response.json();
            console.log(json);

            
            // WE CREATE A MAP USING LEAFLET.JS
            var map = L.map('map').setView([0, 0],1);
            

            // WE SET THE TILES FOR THE MAP. WE GET THE MAP TILES FROM openstreetmap.org
            L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            }).addTo(map);

            

            // AFTER WE GET ALL THE DATA FROM THE DATABASE, WE DISPLAY EACH ENTRY
            // ON OUT MAP WITH A MARKER.
            for (item of json)
            {
                //console.log(item.proxy_json); // THIS LINE IS FOR TESTING
                // WE CREATE A MARKER ON THE MAP FOR EACH LOGIN ENTRY AND CREATE A POPUP FOR IT.
                var marker = L.marker([item.lat, item.lon]).addTo(map);
                let popup_text =``;

                try
                {

                // IF THE READING FOR THE PARTICULATE MATTER CONCENTRATION IS AVAILABLE,
                // WE SHOW ALL THE WEATHER INFORMATION IN THE POPUP TEXT FOR THE MARKER.    
                
                popup_text = `The weather here at latitude = ${item.lat}, longitude = ${item.lon} 
                is mainly ${item.proxy_json.weather.weather[0].main} with a temperature 
                of ${item.proxy_json.weather.main.temp} degrees K.
                The concentration of particulate matter (PM25) 
                is ${item.proxy_json.aq.current.pm2_5}${item.proxy_json.aq.current_units.pm2_5} 
                last read on ${item.proxy_json.aq.current.time} ${item.proxy_json.aq.timezone}.`;

                }

                // IF THE READING FOR THE PARTICULATE MATTER CONCENTRATION IS NOT AVAILABLE,
                // WE REPLACE THAT PART IN THE popup_text WITH "NO READING AVAILABLE"
                catch(error)
                {
                    console.log("Something went wrong!");
                    popup_text = `The weather here at latitude = ${item.lat}, longitude = ${item.lon} 
                    is mainly ${item.proxy_json.weather.weather[0].main} with a temperature 
                    of ${item.proxy_json.weather.main.temp} degrees K.
                    The concentration of particulate matter (PM25) is NO READING AVAILABLE`;

                }

                // WE BIND THE popup_text TO THE MARKER.
                marker.bindPopup(popup_text);
                


                // const root = document.createElement('div');
                // const geo = document.createElement('div');
                // const date = document.createElement('div');
                // //const image = document.createElement('img');
                

                // geo.textContent = `${item.lat}°, ${item.lon}°`;
                // const dateString = new Date(item.timestamp).toLocaleString();
                // date.textContent = dateString;
                // //image.src = item.image64;

                // //root.append(geo, date, image);
                // root.append(geo, date);
                // document.body.append(root);


            }

        }

        getData();