//temp
const fs = require('fs');
const data = fs.readFileSync('parks.json');
const parks = JSON.parse(data);
//temp

var express = require('express');
var bodyParser = require('body-parser');
var app = express();
const fetch = require('node-fetch')

app.set('port', process.env.PORT || 9794);

app.use(express.static('public'));
app.set('view engine','ejs'); 
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());


app.get('/', function(req,res){
  res.render('home');
});

app.get('/form', function(req, res){
  res.render('form');
});

app.get('/recom',function(req, res){
  res.render('recom');
});

app.post('/getRoutes', function(req,res){
  console.log("hello")
  fetch('https://api.geoapify.com/v1/routing?waypoints=47.6038321,-122.3300624|47.3826903,-122.2270272&mode=drive&apiKey=b1f46c812f0f4a7485e46c797622ab4a')
    .then(resp => resp.json())
    .then((calculatedRouteGeoJSON) => {
      res.send(JSON.stringify(calculatedRouteGeoJSON));
    });
})

app.post('/getMaps', function(req,res){
  var payload = {};
  fetch(`https://api.geoapify.com/v1/geocode/search?text=${req.body.to.city} ${req.body.to.state} US&limit=1&format=json&apiKey=b1f46c812f0f4a7485e46c797622ab4a`)
  .then(function(resp){
    if (resp.ok){return resp.json()}else{return Promise.reject(resp)} 
  }).then(function (results){
    payload.to = results;
    return fetch(`https://api.geoapify.com/v1/geocode/search?text=${req.body.from.city} ${req.body.from.state} US&limit=1&format=json&apiKey=b1f46c812f0f4a7485e46c797622ab4a`)
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

app.post('/getCoord', function(req, res){
  var payload = {};
  var data = [];
  payload.data = data;
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

//temp
// Send all parks
app.get('/all/', sendAll);

function sendAll(request, response) {
    response.send(parks);
}
//temp


app.use(function(req,res){
    res.status(404);
    res.render('404');
});
  
app.use(function(error,req,res,next){
    console.error(error.stack);
    res.status(500);
    res.render('500');
});
  
  app.listen(app.get('port'), function(){
    console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
  });