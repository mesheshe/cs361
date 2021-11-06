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
var route = [];

var sub = document.getElementById("submit2");

var addresses = 
["42 Fairhaven Commons Way, Fairhaven MA 2719",
"374 William S Canning Blvd, Fall River MA 2721",
"121 Worcester Rd, Framingham MA 1701"];


// I put it as submit for my project, but 
// you can even change it to a function if you 
// are going to hardcode it
sub.addEventListener("click", function(event){
    var req = new XMLHttpRequest();
    req.open("POST","/getCoord",true);
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
    payload.list = addresses
    console.log("hello")
    req.send(JSON.stringify(payload));
    event.preventDefault()
});
//Covert from data 
//data: Array()
//   address: "42 Fairhaven Commons Way, Fairhaven MA 2719"
//   lat: 41.644822149999996
//   lon: -70.88809189255878
// to an array of lat and lon
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
// [[lon_1,lat_1],[lon_2,lat_2]...[lon_i,lat_i]]
function addMarkerFromLonLatArr(arr){
    // I kept it in terms of i so if you have another array that 
    // has information about said marker you can still reference it
    var bounds = new maplibregl.LngLatBounds(); // defines the bounds 
    for (let i = 0; i < arr.length; i++){
        var icon = document.createElement('div');
        icon.classList.add("icon");
        icon.setAttribute("id", "icon" + i);
        // This step above allows you to add event handlers for each icon
        var iconPopup = new maplibregl.Popup({
            anchor: 'bottom',
            offset: [0, -64] // height - shadow
          })
          .setText('icon text');
      
        var iconMarker = new maplibregl.Marker(icon, {
            anchor: 'bottom',
            offset: [0, 6]
        })
        .setLngLat(arr[i])
        .setPopup(iconPopup)
        .addTo(map);

        //map.setCenter(arr[i])
        icon.onclick = (event) => {
            // you can add custom logic here. For example, modify popup.
            iconPopup.setHTML(`<p>${event.target.getAttribute('id')}</p>`);
            event.stopPropagation();
          }

          icon.onmouseenter = () => iconMarker.togglePopup(); // show/hide popup on mouse hover
          icon.onmouseleave = () => iconMarker.togglePopup();

          
          bounds.extend(arr[i]);
    }
    map.fitBounds(bounds,{padding: {top:100, bottom:50, left:25, right:25}});
}


/*
sub.addEventListener("click", function(event){
    var req = new XMLHttpRequest();
    req.open("POST","/getRoutes",true);
    req.setRequestHeader("Content-Type","application/json")
    req.addEventListener("load", function(){
        if (req.status >= 200 && req.status < 400){
            var response = JSON.parse(req.responseText);
            buildCoord(response);
        }else{
            alert("Error: Invalid Submission")
        }
    })
    
    var payload = {}
    console.log("hello")
    //req.send(JSON.stringify(payload));
    event.preventDefault()
});

function buildCoord(data){
    route = []
    console.log("done")
    var storage = data.features[0].geometry.coordinates;
    for (var i = 0; i < storage.length; i++){
        for (var j = 0; j < storage[i].length; j++){
            if (storage[i][j].length > 0){
                route.push(storage[i][j]);
            }
        }
    }

    
    var airportIcon = document.createElement('div');
    var airport2Icon = document.createElement('div');
    airportIcon.classList.add("airport");
    airport2Icon.classList.add("airport");

    var airportPopup = new maplibregl.Popup({
        anchor: 'bottom',
        offset: [0, -64] // height - shadow
      })
      .setText('Zürich Airport');
    
    var airport = new maplibregl.Marker(airportIcon, {
        anchor: 'bottom',
        offset: [0, 6]
    })
    .setLngLat(route[0])
    .setPopup(airportPopup)
    .addTo(map);

    var airport2 = new maplibregl.Marker(airport2Icon, {
        anchor: 'bottom',
        offset: [0, 6]
    })
    .setLngLat(route[route.length - 1])
    .setPopup(airportPopup)
    .addTo(map);
    
    
    map.setCenter(route[0])
    airportIcon.onclick = (event) => {
        // you can add custom logic here. For example, modify popup.
        airportPopup.setHTML("<h3>I'm clicked!</h3>");
      }
      
      airportIcon.onmouseenter = () => airport.togglePopup(); // show/hide popup on mouse hover
      airportIcon.onmouseleave = () => airport.togglePopup();

      var bounds = new maplibregl.LngLatBounds();
      route.forEach(element => bounds.extend(element))
      map.fitBounds(bounds,{padding: {top:100, bottom:50, left:25, right:25}});
      
      if (map.getLayer('route') != undefined){
        map.removeLayer('route');
        map.removeSource('route');
      }
    

      map.addLayer({
        "id": "route",
        "type": "line", 
        'layout': {
            'line-join': 'round',
            'line-cap': 'round'
        },
        'paint': {
            'line-color': 'black',
            'line-width': 8
        },
        "source": {
            "type": "geojson",
            "data": {
                "type": "Feature",
                "properties": {},
                "geometry": {
                    "type": "LineString",
                    "coordinates": route
                }
            }
        }
    });

}
*/




