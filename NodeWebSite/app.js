//Comment
var express = require('express');
var app = express(); // Web framework to handle routing requests
var cons = require('consolidate'); // Templating library adapter for Express
var mongo = require('mongodb');
var MongoClient = mongo.MongoClient; // Driver for connecting to MongoDB
var routes = require('./routes'); // Routes for our application

MongoClient.connect('mongodb://localhost:27017/cars', function(err, db) {
    "use strict";
    if(err) throw err;

    // Register our templating engine
    app.engine('html', cons.swig);
    app.set('view engine', 'html');
    app.set('views', __dirname + '/views');

    // Express middleware to populate 'req.cookies' so we can access cookies
    app.use(express.cookieParser());

    // Express middleware to populate 'req.body' so we can access POST variables
    app.use(express.bodyParser());

    //Sets up the public directory
    app.use(express.static(__dirname + '/public'));

    // Application routes
    routes(app, db);

    app.listen(3000);
    console.log('Express server listening on port 3000');
});
