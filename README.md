# cs361

What do you need to have a map that has the ability to add markers to it, if you give it 
addresses or an array of coordinates (lon,lat)

Step 1: Under your main layout html page post the following line of code where you keep your 
other style sheets: <link rel = "stylesheet" type="text/css" href="https://cdn.skypack.dev/maplibre-gl/dist/maplibre-gl.css">

Step 2: In the html page that you are going to put the map in, create a div with an id = "my-map"

Step 3: In that same HTML page, scroll to the bottom of the page and either change the style existing js script 
to module, or create a new file with your other js files and import as a module. Example posted below:
<script type="module" src = "js/example.js"> </script>

For the next following steps, you can follow along by downloading recom.js file in the js file tree.

Step 4: Post the following lines of code to draw a map that you can view and use. 

import maplibregl from 'https://cdn.skypack.dev/maplibre-gl@2.0.0-pre.5';

function drawMap(maplibregl){
    const mapTilerKey = "b1f46c812f0f4a7485e46c797622ab4a"    
    const map = new maplibregl.Map({
    container: "my-map",
    style: `https://maps.geoapify.com/v1/styles/osm-carto/style.json?apiKey=${mapTilerKey}`,
    center: [-122.483696, 37.833818],
    zoom: 5
    })
    

    map.addControl(
    new maplibregl.GeolocateControl({
    positionOptions: {enableHighAccuracy: true},
    }));
    return map;
}

var map = drawMap(maplibregl);

Step 5: To add markkers there are two steps, either you add markers from a list of addresses or you
add based on a list of coordinates (lon, lat).

5a) If you are adding from a list of coordinates, make sure it has the following format 
[[lon_1,lat_1],[lon_2,lat_2]...[lon_i,lat_i]]
Once you see that it has the same format, then call the function addMarkerFromLonLatArr(arr)
and pass in the coordinates array. You will see the resutls then.

5b) Remove the sub.addEventListener and replace it with a function called addressToCoord, it will make
your life easier. Anyway once you call that, then you are done as everything is done automatically.

Step 6: For the icon, check out the style sheet in proj.css under the name .icon

