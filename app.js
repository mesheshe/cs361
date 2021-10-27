var express = require('express');
var app = express();

app.set('port', process.env.PORT || 9794);

app.use(express.static('public'));
app.set('view engine','ejs'); 


app.get('/', function(req,res){
  res.render('home');
});

app.get('/form', function(req, res){
  res.render('form');
});

app.get('/recom',function(req, res){
  res.render('recom');
});

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