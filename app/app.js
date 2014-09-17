/* Module dependencies. */
var express = require('express'),
  routes = require('./routes'),
  http = require('http'),
  io = require('socket.io'),
  _ = require('underscore'),
  path = require('path'),
  request = require('request'),
  posts = require('./routes/posts.js'),
  coords = require('./routes/coords.js');

var app = express();
var server = http.createServer(app);

app.set('port', process.env.PORT || 80);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// routes
app.get('/', routes.index);
app.post('/coords', coords.addCoords);
app.put('/coords/:id', coords.updateCoords);

// mongo setup
var mongo = require('mongodb');
var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;

var mserver = new Server('localhost', 27017, {auto_reconnect: true});
db = new Db('spsugame', mserver);

db.open(function(err, db) {
  if(!err) {
    console.log("Connected to 'spsugame' database");
  }
});

//Start a Socket.IO listen
var io = io.listen(server);
io.set('log level', 1); // reduce socket io logging

server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
