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
let bounds = new maplibregl.LngLatBounds(); // defines the bounds
let route = [];
let BOUNDARY = 3; // Map boundary 

var sub = document.getElementById("submit1");

function getPayload(){
    var tos = document.getElementById("to");
    var froms = document.getElementById("from");
    var payload = {};
    if (tos.value != ""){
        payload.tos = tos.value;
    }else{ return null; }
    if (froms.value != ""){
        payload.froms = froms.value;
    }else{ return null; }
    return payload;
}

sub.addEventListener("click", function(event){
    let payload = getPayload();
    if (payload != null){
        var req = new XMLHttpRequest();
        req.open("POST","/getMaps",true);
        req.setRequestHeader("Content-Type","application/json")
        req.addEventListener("load", function(){
            if (req.status >= 200 && req.status < 400){
                buildCoord(JSON.parse(req.responseText));
                populatePark();
            }else{alert("Error: Invalid Submission")}
        })
        req.send(JSON.stringify(payload));
    }
    event.preventDefault();   
});

async function populatePark(){
    const response = await fetch('http://flip2.engr.oregonstate.edu:8050/all');
    const parkData = await response.json();
    // Filter the list 
    let container = document.getElementsByClassName('containers');
    container = container[3]; 
    checkBoundary("hello")
    for (const key in parkData){
        if (checkBoundary([parkData[key].Longitude, parkData[key].Latitude])){
            createCard(key, parkData, container)
        }
    }
}

function createCardElements(){
    let card = document.createElement("div");
    let cardBody = document.createElement('cardBody');
    let tabContent = document.createElement('tabContent');
    let header = document.createElement('h3');
    let content = document.createElement('p');
    let button = document.createElement('button');
    let obj = {card:card,cardBody:cardBody, tabContent:tabContent, header:header, content:content, button: button}
    return obj 
}

function fillOutCardElements(key, parkData, obj){
    obj.header.textContent = key;
    obj.button.setAttribute('class', 'btn btn-primary');
    obj.button.textContent = 'Place Marker';
    obj.button.addEventListener('click', function(event){
        addMarkerFromLonLatArr([[parkData[key].Longitude, parkData[key].Latitude]], [key])
        document.getElementById('my-map').scrollIntoView({behavior: "smooth", block: "center", inline: "center"});
    })
    obj.content.innerHTML = 
    `${key} is located at ${parkData[key].State} at longitude ${parkData[key].Longitude} and latitude ${parkData[key].Latitude}. <br>`+
    `This park was established in ${parkData[key].Date_Established} covering an area of ${parkData[key].Area} km^2, with a yearly visitors <br>`+
    `count of ${parkData[key].Visitors}. For more info, visit <a target="_blank" href ="${parkData[key].Website}">here</a>.`;
    obj.card.setAttribute('class', 'card');
    obj.cardBody.setAttribute('class', 'card-body');
    obj.tabContent.setAttribute('class','tabcontent');
    return obj
}

function createCard(key, parkData, container){
    let obj = createCardElements()
    let newObj = fillOutCardElements(key, parkData, obj)
    newObj.tabContent.appendChild(newObj.header);
    newObj.tabContent.appendChild(newObj.content);
    newObj.tabContent.appendChild(newObj.button);
    newObj.cardBody.appendChild(newObj.tabContent)
    newObj.card.appendChild(newObj.cardBody)
    container.appendChild(newObj.card)
    container.appendChild(document.createElement('br'));
}

function checkBoundary(data){
    for (let i = 0; i < route.length; i++){
        if (Math.abs(route[i][0] - data[0]) < BOUNDARY && Math.abs(route[i][1] - data[1] < BOUNDARY)){
            return true;
        }
    }
    return false;
}

function buildCoord(data){
    route = []
    var storage = data.features[0].geometry.coordinates;
    for (var i = 0; i < storage.length; i++){
        for (var j = 0; j < storage[i].length; j++){
            if (storage[i][j].length > 0){
                route.push(storage[i][j]);
            }
        }
    }   

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
function addMarkerFromLonLatArr(arr, arr2 = false){
    // I kept it in terms of i so if you have another array that 
    // has information about said marker you can still reference it
     
    for (let i = 0; i < arr.length; i++){
        let icon = document.createElement('div');
        icon.classList.add("icon");
        icon.setAttribute("id", "icon" + i);
        // This step above allows you to add event handlers for each icon
        let iconPopup = new maplibregl.Popup({
            anchor: 'bottom',
            offset: [0, -64] // height - shadow
          });
        if (arr2){
            iconPopup.setText(`${arr2[i]}`);   
        }

        let iconMarker = new maplibregl.Marker(icon, {
            anchor: 'bottom',
            offset: [0, 6]
        })
        .setLngLat(arr[i])
        .setPopup(iconPopup)
        .addTo(map);

        //map.setCenter(arr[i])
        //icon.onclick = (event) => {
        //    // you can add custom logic here. For example, modify popup.
        //    iconPopup.setHTML(`<p>${event.target.getAttribute('id')}</p>`);
        //    event.stopPropagation();
        //}

          icon.onmouseenter = () => iconMarker.togglePopup(); // show/hide popup on mouse hover
          icon.onmouseleave = () => iconMarker.togglePopup();

          
          bounds.extend(arr[i]);
    }
    map.fitBounds(bounds,{padding: {top:100, bottom:50, left:25, right:25}});
}

