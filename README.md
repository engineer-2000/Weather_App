The Server Side File:  
    &emsp;&emsp; index.js

The Client Side Files:  
    &emsp;&emsp; 'Check in' page (main page):  
    &emsp;&emsp; /public/index.html  
    &emsp;&emsp; /public/sketch.js    
    &emsp;&emsp; 'View Check-ins' page:  
    &emsp;&emsp; /public/logs/index.html  
    &emsp;&emsp; /public/logs/logs.js

The Weather App has two pages. On the check in page, the navigator interface finds the user's location's latitude and longitude, and displays
them. Then the server sends a GET request to Open Weather Map API, sends the location, and gets the weather summary and temperature. 
Then the server sends a GET request to the Air Quality API of the Open-Meteo website, sends the latitude and longitude, and gets the air quality 
indices for this location, and displays the concentration of particulate matter.

The client side sends all the information to the server with a POST request, and all information for each check-in is saved to a database created 
using NeDB.

On the View Check-ins page, the user can see the locations of all the check-ins, displayed on the map with markers. The map has been created 
using Leaflet. If the user clicks on the marker for each check-in's location, a pop-up shows all the weather information for that location.


