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
var route = [];

function openTab(event, opt){
    var i, tabcontent, tabs, starts, ends;
    tabcontent = document.getElementsByClassName('tabcontent');
    tabs = document.getElementsByClassName("nav-link");
    if (event.currentTarget.className == "nav-link active"){return;}
    if (parseInt(opt) <= 3){
        starts = 0;
        ends = 3;
    }else{
        starts = 3;
        ends = tabcontent.length;
    }
    console.log(starts, ends);
    for (i = starts; i < ends; i++){
        tabcontent[i].style.display = "none";
    }
    tabcontent[parseInt(opt)-1].style.display = "block";  
    // We are adding plus 3 because the header also has elements with 
    // attribute nav-link, therefore need to offset to fix the issue.
    for (i = starts + 3; i< ends + 3; i++){
        if (tabs[i].getAttribute("class") == "nav-link active")
            tabs[i].setAttribute("class", "nav-link");
    }
    event.currentTarget.className += " active";
}

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