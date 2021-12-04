// This file is what is used to place marker on the map given addresses or coordinates
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

// address example that can be passed to fromAddressGetCoordData
var addresses = 
["42 Fairhaven Commons Way, Fairhaven MA 2719",
"374 William S Canning Blvd, Fall River MA 2721",
"121 Worcester Rd, Framingham MA 1701"];

// If you have address, call this function Otherwise skip 
// to addMarkerFromLonLatArr function 
function fromAddressGetCoordData(address){
    var req = new XMLHttpRequest();
    req.open("POST","https://elias-trip-planner.herokuapp.com/getCoord",true);
    req.setRequestHeader("Content-Type","application/json")
    req.addEventListener("load", function(){
        if (req.status >= 200 && req.status < 400){
            var response = JSON.parse(req.responseText);
            dataFromAddressToLonLat(response.data)
        }else{
            alert("Error: Invalid Submission")
        }
    })
    var payload = {}
    payload.list = address
    req.send(JSON.stringify(payload));
}

// Inner step to convert data recieved from fromAddressGetCoordData
// to a list of LonLat. Ignore this function entirely. 
function dataFromAddressToLonLat(data){
    var arr = [];
    data.forEach(datam => {
        var sub = [];
        sub.push(datam.lon)
        sub.push(datam.lat)
        arr.push(sub);
    });
    addMarkerFromLonLatArr(arr);
}

// arr = [[lon_1,lat_1],[lon_2,lat_2]...[lon_i,lat_i]]
function addMarkerFromLonLatArr(arr){
    let bounds = new maplibregl.LngLatBounds(); // defines the bounds 
    for (let i = 0; i < arr.length; i++){
        let icon = document.createElement('div');
        icon.classList.add("icon");
        icon.setAttribute("id", "icon" + i);
        // This step above allows you to add event handlers for each icon
        let iconPopup = new maplibregl.Popup({
            anchor: 'bottom',
            offset: [0, -64] // height - shadow
          })
          .setText('icon text');
      
        let iconMarker = new maplibregl.Marker(icon, {
            anchor: 'bottom',
            offset: [0, 6]
        })
        .setLngLat(arr[i])
        .setPopup(iconPopup)
        .addTo(map);

        icon.onclick = (event) => {
            // you can add custom logic here. For example, modify popup.
            iconPopup.setHTML(`<p>${event.target.getAttribute('id')}</p>`);
            event.stopPropagation();
          }

          icon.onmouseenter = () => iconMarker.togglePopup(); // show/hide popup on mouse hover
          icon.onmouseleave = () => iconMarker.togglePopup();

          
          bounds.extend(arr[i]);
    }
    map.fitBounds(bounds,{padding: {top: 100, bottom: 50, left: 25, right: 25}});
    
}






