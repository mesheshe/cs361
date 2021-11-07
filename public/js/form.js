import maplibregl from 'https://cdn.skypack.dev/maplibre-gl@2.0.0-pre.5';

function drawMap(maplibregl){
    const mapTilerKey = "b1f46c812f0f4a7485e46c797622ab4a"    
    const map = new maplibregl.Map({
    container: "my-map",
    style: `https://maps.geoapify.com/v1/styles/osm-carto/style.json?apiKey=${mapTilerKey}`,
    center: [-96.359233, 38.91302],
    zoom: 2.4
    })

    map.addControl(
    new maplibregl.GeolocateControl({
    positionOptions: {enableHighAccuracy: true},
    }));
    return map;
}

var map = drawMap(maplibregl);

var sub = document.getElementById("submit1");

sub.addEventListener("click", function(event){
    var tos = document.getElementById("to");
    var froms = document.getElementById("from");
    var to  = {};
    var from = {};
    var req = new XMLHttpRequest();
    var payload = {to:null, from:null};
    if (tos.value != ""){
        payload.to = tos.value;
    }else{
        to.city = "Seattle";
        to.state = "WA";
        payload.to = to;    
    }
    if (froms.value != ""){
        payload.from = froms.value;
    }else{
        from.city = "Los Angles";
        from.state = "CA";
        payload.from = from;
    }
    req.open("POST","/getMaps",true);
    req.setRequestHeader("Content-Type","application/json")
    req.addEventListener("load", function(){
        if (req.status >= 200 && req.status < 400){
            var response = JSON.parse(req.responseText);
            console.log(response);
            buildCoord(response);
        }else{
            alert("Error: Invalid Submission")
        }
    })
    //console.log(payload);
    req.send(JSON.stringify(payload));
    event.preventDefault();
    
});

function buildCoord(data){
    var route = []
    var storage = data.features[0].geometry.coordinates;
    for (var i = 0; i < storage.length; i++){
        for (var j = 0; j < storage[i].length; j++){
            if (storage[i][j].length > 0){
                route.push(storage[i][j]);
            }
        }
    }   

    var bounds = new maplibregl.LngLatBounds();

    route.forEach(element => bounds.extend(element))
    map.fitBounds(bounds,{padding: {top:100, bottom:50, left:25, right:25}});
    
    if (map.getLayer('route') != undefined){
      map.removeLayer('route');
      map.removeSource('route');
    }
    
    addMarkerFromLonLatArr([route[0], route[route.length - 1]])

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

// [[lon_1,lat_1],[lon_2,lat_2]...[lon_i,lat_i]]
function addMarkerFromLonLatArr(arr){
    // I kept it in terms of i so if you have another array that 
    // has information about said marker you can still reference it
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