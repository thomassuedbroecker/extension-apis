var express = require('express');
var app = express();

var bodyParser = require('body-parser');
app.use(bodyParser.json() );  
app.use(bodyParser.urlencoded({extended: true}));

// use environment variables file
const dotenv = require('dotenv');
dotenv.config();

var auth = require('basic-auth'); 

// set environment variables
var port = process.env.PORT || 3000;
var extension_usage = process.env.EXTENSION_USAGE;
var env_username=process.env.USERNAME;
var env_password=process.env.PASSWORD;

/*****************************/
/* API                       */
/*****************************/

app.get('/v1/getmessage', function(req, res) {
    var returnvalue = {};
    var credentials = auth(req);

    console.log("** Request  \n ", req.toString());
    console.log("** Headers  \n ", JSON.stringify(req.headers));

    if (!credentials) {
        console.log("** user: " + undefined);
        console.log("** password: " + undefined);
    } else {
        console.log("** user: " + credentials.name);
        console.log("** password: " + credentials.pass);
    }

    if (!credentials || !check(credentials.name, credentials.pass)) {      
        returnvalue = { "message": "Access denied" };
        res.statusCode = "401";
        res.setHeader('WWW-Authenticate', 'Basic realm="example"');
        console.log("** 401", returnvalue);
        res.json(returnvalue);
    } else {
        res.body=returnvalue;
        res.statusCode = "200";
        returnvalue = { "message": extension_usage };
        console.log("** 200", returnvalue);
        res.json(returnvalue);
    }  
});

/*****************************/
/* Basic endpoints           */
/*****************************/

// Health check
app.get('/health', function(req, res) {
    var returnvalue = {};
    var credentials = auth(req);

    console.log("** Request  \n ", req.toString());
    console.log("** Headers  \n ", JSON.stringify(req.headers));

    if (!credentials) {
        console.log("** user: " + undefined);
        console.log("** password: " + undefined);
    } else {
        console.log("** user: " + credentials.name);
        console.log("** password: " + credentials.pass);
    }
    
    res.body=returnvalue;
    res.statusCode = "200";
    returnvalue = { "info": "health: node-extension is running" };
    console.log("** 200", returnvalue);
    res.json(returnvalue);
});

app.get('/', function(req, res) {
    var returnvalue = {};
    var credentials = auth(req);

    console.log("** Request  \n ", req.toString());
    console.log("** Headers  \n ", JSON.stringify(req.headers));

    if (!credentials) {
        console.log("** user: " + undefined);
        console.log("** password: " + undefined);
    } else {
        console.log("** user: " + credentials.name);
        console.log("** password: " + credentials.pass);
    }

    res.statusCode = "200";
    returnvalue = { "info": "node-extension is running" };
    console.log("** 200", returnvalue);
    res.json(returnvalue);
});

// ***************
// Functions
// ***************

function check (name, pass) {
    var valid = true
   
    var username=env_username;
    var password=env_password;
    
    if ((name.localeCompare(username) === 0) || (pass.localeCompare(password) === 0)) {
      valid = true;
    } else {
      valid = false;
    }
  
    return valid;
  }


/*****************************/
/* Run server                */
/*****************************/

const server = app.listen(port, function () {
    console.log('extension backend is running');  
});

module.exports = server;