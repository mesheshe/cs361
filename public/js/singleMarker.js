// Remember when making a call to the server use the following link  
// https://elias-trip-planner.herokuapp.com/
import maplibregl from 'https://cdn.skypack.dev/maplibre-gl@2.0.0-pre.5';

// Input lon and lat
const lon = -151.187402 
const lat = 63.097595


function drawMap(maplibregl){
    const mapTilerKey = "b1f46c812f0f4a7485e46c797622ab4a"    
    const map = new maplibregl.Map({
    container: "my-map",
    style: `https://maps.geoapify.com/v1/styles/osm-carto/style.json?apiKey=${mapTilerKey}`,
    center: [lon, lat],
    zoom: 4.7
    })
    

    map.addControl(
    new maplibregl.GeolocateControl({
    positionOptions: {enableHighAccuracy: true},
    }));
    return map;
}

var map = drawMap(maplibregl);
//var route = [];

addMarkerFromLonLatArr([[lon, lat]])

// addMarkerFromLonLatArr[[lon_1,lat_1],[lon_2,lat_2]...[lon_i,lat_i]]
function addMarkerFromLonLatArr(arr){
    // I kept it in terms of i so if you have another array that 
    // has information about said marker you can still reference it
    //let bounds = new maplibregl.LngLatBounds(); // defines the bounds 
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

          
          //bounds.extend(arr[i]);
    }
    //map.fitBounds(bounds,{padding: {top: 100, bottom: 50, left: 25, right: 25}});
    
}







