import maplibregl from 'https://cdn.skypack.dev/maplibre-gl@2.0.0-pre.5';

function drawMap(maplibregl){
    const mapTilerKey = "b1f46c812f0f4a7485e46c797622ab4a"    
    const map = new maplibregl.Map({
    container: "my-map",
    style: `https://maps.geoapify.com/v1/styles/osm-carto/style.json?apiKey=${mapTilerKey}`,
    center: [-96.359233, 38.91302],
    zoom: 2.4
    })

    map.addControl(new maplibregl.NavigationControl());
    return map;
}

let map = drawMap(maplibregl);
let bounds = new maplibregl.LngLatBounds(); // defines the bounds
let route = [];
let BOUNDARY = 3; // Map boundary 

var sub = document.getElementById("submit1");

function getPayload(){
    var to = document.getElementById("to");
    var from = document.getElementById("from");
    var payload = {};
    if (to.value == "" || from.value == ""){
        return null;
    }else{ 
        payload.from = from.value;
        payload.to = to.value;
        return payload;
    }
}

sub.addEventListener("click", function(event){
    let payload = getPayload();
    if (payload != null){
        clearEverythingAndBuildMap();
        var req = new XMLHttpRequest();
        req.open("POST","/getMaps",true);
        req.setRequestHeader("Content-Type","application/json")
        req.addEventListener("load", function(){
            if (req.status >= 200 && req.status < 400){
                buildCoord(JSON.parse(req.responseText));
                populatePark(); buildHotel();
            }else{alert("Error: Invalid Submission")}
        })
        req.send(JSON.stringify(payload));
    }
    event.preventDefault();   
});
// fix this 
async function populatePark(){
    const response = await fetch('/all');//fetch('http://flip2.engr.oregonstate.edu:8050/all');
    const parkData = await response.json();
    // Filter the list 
    let container = document.getElementsByClassName('containers')[3]; 
    checkBoundary("hello")
    for (const key in parkData){
        if (checkBoundary([parkData[key].Longitude, parkData[key].Latitude])){
            let content = `${key} is located at ${parkData[key].State} at longitude ${parkData[key].Longitude} and latitude ${parkData[key].Latitude}. <br>This park was established in ${parkData[key].Date_Established} covering an area of ${parkData[key].Area} km^2, with a yearly visitors <br>count of ${parkData[key].Visitors}. For more info, visit <a target="_blank" href ="${parkData[key].Website}">here</a>.`;
            createCard(key, parkData, container, content)
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

function fillOutCardElements(key, parkData, obj, content){
    obj.header.textContent = key;
    obj.button.setAttribute('class', 'btn btn-primary');
    obj.button.textContent = 'Place Marker';
    obj.button.addEventListener('click', function(event){
        addMarkerFromLonLatArr([[parkData[key].Longitude, parkData[key].Latitude]], [key])
        document.getElementById('my-map').scrollIntoView({behavior: "smooth", block: "center", inline: "center"});
    })
    obj.content.innerHTML = content;
    obj.card.setAttribute('class', 'card');
    obj.cardBody.setAttribute('class', 'card-body');
    obj.tabContent.setAttribute('class','tabcontent');
    return obj
}

function createCard(key, parkData, container, content){
    let obj = createCardElements()
    let newObj = fillOutCardElements(key, parkData, obj, content)
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
            if (storage[i][j].length > 0){route.push(storage[i][j]);}
        }
    }
    coordToRouteOnMap(route)
}

function coordToRouteOnMap(route){   
    route.forEach(element => bounds.extend(element))
    map.fitBounds(bounds,{padding: {top:100, bottom:50, left:25, right:25}});
    addMarkerFromLonLatArr([route[0], route[route.length - 1]])
    addMapLayer(route);
}

function addMapLayer(route){
    map.addLayer({
        "id": "route",
        "type": "line", 
        'layout': {'line-join': 'round', 'line-cap': 'round'},
        'paint': {'line-color': 'black', 'line-width': 8},
        "source": {"type": "geojson", "data": {"type": "Feature", "properties": {}, "geometry": {"type": "LineString","coordinates": route}}}
      });
}

// arr = [[lon_1,lat_1],[lon_2,lat_2]...[lon_i,lat_i]]
// arr2 = list of names for the coord in arr
function addMarkerFromLonLatArr(arr, arr2 = false){
    for (let i = 0; i < arr.length; i++){
        let icon = document.createElement('div');
        icon.classList.add("icon");
        icon.setAttribute("id", "icon" + i);
        // This step above allows you to add event handlers for each icon
        let iconPopup = new maplibregl.Popup({
            anchor: 'bottom',
            offset: [0, -64] // height - shadow
          });
        if (arr2){iconPopup.setText(`${arr2[i]}`);}
        let iconMarker = new maplibregl.Marker(icon, {
            anchor: 'bottom',
            offset: [0, 6]
        })
        .setLngLat(arr[i])
        .setPopup(iconPopup)
        .addTo(map);
        icon.onmouseenter = () => iconMarker.togglePopup(); // show/hide popup on mouse hover
        icon.onmouseleave = () => iconMarker.togglePopup();
        bounds.extend(arr[i]);
    }
    if (arr.length == 1){
        map.setCenter(arr[0]);
    }
    map.fitBounds(bounds,{padding: {top:100, bottom:50, left:25, right:25}});
    
}

document.getElementById('submit2').addEventListener("click",function(event){
    var res  = document.getElementById('PlaceOfInterest');
    if (res.value !== ""){
        clearEverythingAndBuildMap();
        var req = new XMLHttpRequest();
        req.open("POST","/getCoord",true);
        req.setRequestHeader("Content-Type","application/json")
        req.addEventListener("load", function(){
            if (req.status >= 200 && req.status < 400){
                var response = JSON.parse(req.responseText);
                dataFromAddressToLonLat(response.data);
                populatePark(); buildHotel();
            }else{
                alert("Error: Invalid Submission")
            }
        })
        var payload = {}
        payload.list = [res.value];
        req.send(JSON.stringify(payload));
    }
    event.preventDefault()
});

document.getElementById('submit3').addEventListener("click", function(event){
    var lon = document.getElementById('Longitude');
    var lat = document.getElementById('Latitude');
    if (lon.value !== "" && lat.value !== ""){
        clearEverythingAndBuildMap();
        route = [[parseFloat(lon.value), parseFloat(lat.value)]]
        addMarkerFromLonLatArr(route);
    }
    populatePark(); buildHotel();
    event.preventDefault();
});

function dataFromAddressToLonLat(data){
    var arr = [];
    data.forEach(datam => {
        var sub = [];
        sub.push(datam.lon)
        sub.push(datam.lat)
        arr.push(sub);
    });
    route = arr
    addMarkerFromLonLatArr(arr);
}

function clearEverythingAndBuildMap(){
    let newMap = document.createElement("div");
    let oldMap = document.getElementById('my-map')
    newMap.setAttribute('id', 'my-map');
    newMap.setAttribute('class', 'embed-responsive embed-responsive-16by9');
    oldMap.parentNode.replaceChild(newMap,oldMap)
    clearParksandHotels();
    map = drawMap(maplibregl); 
    bounds = new maplibregl.LngLatBounds();
}

function clearParksandHotels(){
    let container1 = document.getElementsByClassName('containers')[3];
    let container2 = document.getElementsByClassName('containers')[4];
    removeAllChildNodes(container1);
    removeAllChildNodes(container2);
}

function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

function buildHotel(){
    let start = route[0];
    let boundary = 5000;
    for (let i = 0; i < route.length; i = i + 1){
        if (i === 0 || measure(start[0], start[1], route[i][0],route[i][1]) > boundary){
            hotelHelper(route[i][0],route[i][1],boundary);
            start = route[i];
        }
    }
}

async function hotelHelper(lon, lat, radius){
    let container = document.getElementsByClassName('containers')[4];
    const response = await fetch('https://api.geoapify.com/v2/places?categories=accommodation.hotel&filter=circle:'+ lon +','+ lat +','+ radius + '&limit=2&apiKey=b1f46c812f0f4a7485e46c797622ab4a');
    const data1 = await response.json();
    let data = data1.features;
    for (let i = 0; i < data.length; i++){
        if (data[i].properties.name !== undefined){
            let key = data[i].properties.name;
            let obj  = {}; obj[key] = {Longitude:data[i].properties.lon,Latitude:data[i].properties.lat}
            let content =  `${key} is located at longitude ${obj[key].Longitude} and latitude ${obj[key].Latitude} ` +
                           `located at ${parseFloat((measure(lon, lat, obj[key].Longitude, obj[key].Latitude)*(1/1609.34))).toFixed(2)} miles from route.`;
            createCard(data[i].properties.name,obj,container,content)
        }
    }
}

function measure(lon1, lat1, lon2, lat2){  // generally used geo measurement function
    var R = 6378.137; // Radius of earth in KM
    var dLat = lat2 * Math.PI / 180 - lat1 * Math.PI / 180;
    var dLon = lon2 * Math.PI / 180 - lon1 * Math.PI / 180;
    var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    var d = R * c;
    return d * 1000; // meters
}