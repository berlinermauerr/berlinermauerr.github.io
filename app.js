const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const config = require('./config/database');

mongoose.connect(config.database, { useNewUrlParser: true });
let db = mongoose.connection;

//Check connection
db.once('open', function(){
  console.log('Connected to MongoDB');
});

//Check for DB errors
db.on('error', function(err){
  console.log(err);
});

//Init App
const app = express();

//Bring in Models
let job_listing = require('./models/job_listing');
let job_request = require('./models/job_request');

//Load View Engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

//Body Parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Set Public Folder
app.use(express.static(path.join(__dirname, 'public')));

//Express Session Middleware
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true
}));

//Express Messages Middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

//Express Validator Middleware
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

//Passport Config
require('./config/passport')(passport);
//Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

app.get('*', function(req, res, next){
  res.locals.user = req.user || null;
  next();
});

//Home Route
app.get('/', function(req, res){
  res.render('home', {
    title:'Home',
  });
});

//Listings Route
app.get('/listings', function(req, res){
  job_listing.find({}, function(err, job_listings){
    if(err){
      console.log(err);
    } else {
      res.render('job_listings', {
        title:'Job Listings',
        job_listings: job_listings
      });
    }
  });
});

//Requests Route
app.get('/requests', function(req, res){
  job_request.find({}, function(err, job_requests){
    if(err){
      console.log(err);
    } else {
      res.render('job_requests', {
        title:'Job Requests',
        job_requests: job_requests
      });
    }
  });
});

//Search Route
app.get('/search', function(req, res){
  job_listing.find({}, function(err, job_listings){
    if(err){
      console.log(err);
    } else {
      res.render('search', {
        title:'Search',
      });
    }
  });
});

//About Route
app.get('/about', function(req, res){
  res.render('about', {
    title:'About',
  });
});

//Route Files
let job_listings = require('./routes/listings');
let job_requests = require('./routes/requests');
let users = require('./routes/users');
app.use('/listings', job_listings);
app.use('/requests', job_requests);
app.use('/users', users);

//Catch 404
app.get('*', function(req, res){
  res.render('home', {
    title:'404 Page Not Found',
  });
});

//Start Server
app.listen(3000, function(){
  console.log('Server started on port 3000...');
});