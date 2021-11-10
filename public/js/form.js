import maplibregl from 'https://cdn.skypack.dev/maplibre-gl@2.0.0-pre.5';

window.addEventListener('load', function(event){
    let nav1 = document.getElementById("1");
    let nav2 = document.getElementById("2");
    let nav3 = document.getElementById("3");
    nav1.setAttribute("class", "nav-link")
    nav2.setAttribute("class", "nav-link active")
    nav3.setAttribute("class", "nav-link")
})


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

let tab4 = document.getElementById("4");
let tab5 = document.getElementById("5");
let tab6 = document.getElementById("6");
let tab7 = document.getElementById("7");
let tab8 = document.getElementById("8");
let containers = document.getElementsByClassName('containers')
tab4.addEventListener("click", function(event){
    tab4.setAttribute("class","nav-link active")
    tab5.setAttribute("class","nav-link")
    tab6.setAttribute("class","nav-link")
    let id = parseInt(event.target.getAttribute('id'));
    containers[0].style.display = 'none';
    containers[2].style.display = 'none';
    containers[3].style.display = 'none';
    containers[id-3].style.display = 'block';
})
tab5.addEventListener("click", function(event){
    tab4.setAttribute("class","nav-link")
    tab5.setAttribute("class","nav-link active")
    tab6.setAttribute("class","nav-link")
    let id = parseInt(event.target.getAttribute('id'));
    containers[0].style.display = 'none';
    containers[1].style.display = 'none';
    containers[2].style.display = 'none';
    containers[id-3].style.display = 'block';
})
tab6.addEventListener("click", function(event){
    tab4.setAttribute("class","nav-link")
    tab5.setAttribute("class","nav-link")
    tab6.setAttribute("class","nav-link active")
    let id = parseInt(event.target.getAttribute('id'));
    containers[0].style.display = 'none';
    containers[1].style.display = 'none';
    containers[2].style.display = 'none';
    containers[id-3].style.display = 'block';
})
tab7.addEventListener("click", function(event){
    tab7.setAttribute("class","nav-link active")
    tab8.setAttribute("class","nav-link")
    let id = parseInt(event.target.getAttribute('id'));
    containers[3].style.display = 'none';
    containers[4].style.display = 'none';
    containers[id-3-1].style.display = 'block';
})
tab8.addEventListener("click", function(event){
    tab7.setAttribute("class","nav-link")
    tab8.setAttribute("class","nav-link active")
    let id = parseInt(event.target.getAttribute('id'));
    containers[3].style.display = 'none';
    containers[4].style.display = 'none';
    console.log(`id - 3 = ${id - 3}` )
    containers[id-3-1].style.display = 'block';
})

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
            populatePark();
        }else{
            alert("Error: Invalid Submission")
        }
    })
    //console.log(payload);
    req.send(JSON.stringify(payload));
    event.preventDefault();
    
});

async function populatePark(){
    const response = await fetch('/all');
    const parkData = await response.json();
    // Filter the list 
    let container = document.getElementsByClassName('containers');
    container = container[3]; 
    for (const key in parkData){
        let card = document.createElement("div");
        let cardBody = document.createElement('cardBody');
        let tabContent = document.createElement('tabContent');
        let header = document.createElement('h3');
        header.textContent = key;
        let content = document.createElement('p');
        let button = document.createElement('button');
        button.setAttribute('class', 'btn btn-primary');
        button.textContent = 'Place Marker';
        button.addEventListener('click', function(event){
            addMarkerFromLonLatArr([[parkData[key].Longitude, parkData[key].Latitude]], [key])
            document.getElementById('my-map').scrollIntoView({behavior: "smooth", block: "center", inline: "center"});
        })
        content.innerHTML = 
        `${key} is located at ${parkData[key].State} at longitude ${parkData[key].Longitude} and latitude ${parkData[key].Latitude}. <br>`+
        `This park was established in ${parkData[key].Date_Established} covering an area of ${parkData[key].Area} km^2, with a yearly visitors <br>`+
        `count of ${parkData[key].Visitors}. For more info, visit <a target="_blank" href ="${parkData[key].Website}">here</a>.`;
        card.setAttribute('class', 'card');
        cardBody.setAttribute('class', 'card-body');
        tabContent.setAttribute('class','tabcontent');
        tabContent.appendChild(header);
        tabContent.appendChild(content);
        tabContent.appendChild(button);
        cardBody.appendChild(tabContent)
        card.appendChild(cardBody)
        container.appendChild(card)
        let breakLine = document.createElement('br');
        container.appendChild(breakLine);        
    }
}

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

