const express = require('express');
var session = require('express-session');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const config= require('./config');
const passport = require('passport');
var app=express();

//db connection
    mongoose.connect(config.url);
    mongoose.connect(config.url, {useNewUrlParser: true})
        .then(_ => console.log('Connected Successfully to MongoDB'))
        .catch(err => console.error(err));

//set up express application
    app.use(session({secret:config.secret}));
    app.use(morgan('dev')); //log every request to console
    app.use(cookieParser()); //read cookies needed for auth
    // parse application/x-www-form-urlencoded
    app.use(bodyParser.urlencoded());
    // parse application/json
    app.use(bodyParser.json());

//passport
    require('./passportCall')(passport); // pass passport for configuration
    app.use(passport.initialize());
    app.use(passport.session()); // persistent login sessions

//routes
    require('./route')(app,passport);


//launch
    app.listen(2500,function(){
        console.log('Server running on port 2500');
    })
