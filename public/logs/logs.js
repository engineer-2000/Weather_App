async function getData()
        {
            const response = await fetch('/api');
            const json = await response.json();
            console.log(json);

            
            var map = L.map('map').setView([0, 0],1);
            

            L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            }).addTo(map);

            

            for (item of json)
            {
                //console.log(item.proxy_json);
                var marker = L.marker([item.lat, item.lon]).addTo(map);
                let popup_text =``;

                try
                {
                
                popup_text = `The weather here at latitude = ${item.lat}, longitude = ${item.lon} 
                is mainly ${item.proxy_json.weather.weather[0].main} with a temperature 
                of ${item.proxy_json.weather.main.temp} degrees K.
                The concentration of particulate matter (PM25) 
                is ${item.proxy_json.aq.current.pm2_5}${item.proxy_json.aq.current_units.pm2_5} 
                last read on ${item.proxy_json.aq.current.time} ${item.proxy_json.aq.timezone}.`;

                }
                catch(error)
                {
                    console.log("Something went wrong!");
                    popup_text = `The weather here at latitude = ${item.lat}, longitude = ${item.lon} 
                    is mainly ${item.proxy_json.weather.weather[0].main} with a temperature 
                    of ${item.proxy_json.weather.main.temp} degrees K.
                    The concentration of particulate matter (PM25) is NO READING AVAILABLE`;

                }

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