//In case teammates service goes down
const fs = require('fs');
const data = fs.readFileSync('parks.json');
const parks = JSON.parse(data);
//

var express = require('express');
var bodyParser = require('body-parser');
var app = express();
const fetch = require('node-fetch')

// Setting up cors for API use by client
const cors = require('cors');
const corsOptions = {
    origin: true,
    credentials: true,
    optionSuccessStatus: 200
}

app.set('port', process.env.PORT || 9794);

app.use(express.static('public'));
app.set('view engine','ejs'); 
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());


app.get('/', function(req,res){
  res.render('home');
});

app.get('/trip', function(req, res){
  res.render('trip');
});

// This gets routes between two locations 
app.post('/getMaps', function(req,res){
  var payload = {};
  let to = req.body.to;
  let from = req.body.from;
  fetch(`https://api.geoapify.com/v1/geocode/search?text=${to} US&limit=1&format=json&apiKey=b1f46c812f0f4a7485e46c797622ab4a`)
  .then(function(resp){
    if (resp.ok){return resp.json()}else{return Promise.reject(resp)} 
  }).then(function (results){
    payload.to = results;
    return fetch(`https://api.geoapify.com/v1/geocode/search?text=${from} US&limit=1&format=json&apiKey=b1f46c812f0f4a7485e46c797622ab4a`)
  }).then(function(resp){
    if (resp.ok){return resp.json()}else{return Promise.reject(resp)} 
  }).then(function (results){
    payload.from = results;
    return fetch(`https://api.geoapify.com/v1/routing?waypoints=${payload.to.results[0].lat},${payload.to.results[0].lon}|${payload.from.results[0].lat},${payload.from.results[0].lon}&mode=drive&apiKey=b1f46c812f0f4a7485e46c797622ab4a`);
  }).then(function (resp){
    if (resp.ok){return resp.json()}else{return Promise.reject(resp)} 
  }).then((calculatedRouteGeoJSON) => {
    res.send(JSON.stringify(calculatedRouteGeoJSON));
  }).catch(err => console.error(err));
});

// This accepts a list of address of places of interest, and returns a list of objects 
// with lat and long and name
app.post('/getCoord', function(req, res){
  var payload = {};
  payload.data = [];
  var firstURL = 'https://api.geoapify.com/v1/geocode/search?text=';
  var lastURL = '&limit=1&format=json&apiKey=b1f46c812f0f4a7485e46c797622ab4a';
  (() => {
    const urls = [];
    req.body.list.forEach(ele => urls.push(firstURL + ele + lastURL));
    const requests = urls.map((url) => fetch(url));
  
    Promise.all(requests)
      .then((responses) => {
        const errors = responses.filter((response) => !response.ok);
  
        if (errors.length > 0) {
          throw errors.map((response) => Error(response.statusText));
        }
  
        const json = responses.map((response) => response.json());
        return Promise.all(json);
      })
      .then((data) => {sendData(data)})
      .catch((errors) => {
        errors.forEach((error) => console.error(error));
      });
  })(); // running it right away
  function sendData(data){
    data.forEach(function(datum){
      var result = {};
      result.address = datum.query.text;
      result.lon = datum.results[0].lon;
      result.lat = datum.results[0].lat;
      payload.data.push(result)
    });
    res.send(JSON.stringify(payload));
  }
});

// Send all parks in case teammates service goes down
app.get('/all', sendAll);

function sendAll(request, response) {
    response.send(parks);
}

app.use(function(req,res){
    res.status(404);
    res.render('404');
});
  
app.use(function(error,req,res,next){
    console.error(error.stack);
    res.status(500);
    res.render('500');
});

app.use(cors());

app.listen(app.get('port'), function(){
  console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});