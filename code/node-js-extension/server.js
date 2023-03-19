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

var EXAMLE_JSON_RETURN = {
    "matching_results": 2,
    "retrievalDetails": {
      "document_retrieval_strategy": "llm"
    },
    "results": [
      {
        "document_id": "472ec509-9861-45aa-8bce-983289032484",
        "title": "Answer",
        "text": [
          "IBM has acquired Red Hat for $34 billion in October 2018."
        ],
        "link": null,
        "document_passages": null
      },
      {
        "document_id": "086988c4-ab65-44f6-a2b5-5bfdd8afdb44",
        "title": "IBM acquires Red Hat",
        "text": [
          "It's official - IBM has acquired Red Hat! The deal was announced in October 2018. IBM Closes Landmark Acquisition of Red Hat."
        ],
        "link": "https://www.ibm.com/support/pages/ibm-acquires-red-hat",
        "document_passages": [
          {
            "passage_text": "<em>IBM</em> <em>acquires</em> <em>Red</em> <em>Hat</em>",
            "passageAnswers": [
              {
                "answer_text": "IBM acquires Red Hat",
                "confidence": 0.07588528
              }
            ]
          }
        ]
      },
      {
        "document_id": "fdc7a154-497b-4115-bb71-b3d20fe0c822",
        "title": "IBM Closes Landmark Acquisition of Red Hat; Defines Open, Hybrid Cloud Future",
        "text": [
          "IBM (NYSE:IBM) and Red Hat announced today that they have closed the transaction under which IBM acquired all of the issued and outstanding common shares of Red Hat for $190.00 per share in cash, representing a total equity value of approximately $34 billion. The acquisition redefines the cloud market for business. Red Hat’s open hybrid cloud technologies are now paired with the unmatched scale and depth of IBM’s innovation and industry expertise, and sales leadership in more than 175 countries. Together, IBM and Red Hat will accelerate innovation by offering a next-generation hybrid multicloud platform. Based on open source technologies, such as Linux and Kubernetes, the platform will allow businesses to securely deploy, run and manage data and applications on-premises and on private and multiple public clouds."
        ],
        "link": "https://www.redhat.com/en/about/press-releases/ibm-closes-landmark-acquisition-red-hat-34-billion-defines-open-hybrid-cloud-future",
        "document_passages": [
          {
            "passage_text": "<em>IBM</em> (NYSE<em>:</em><em>IBM</em>) and <em>Red</em> <em>Hat</em> announced today that they have closed the transaction under which <em>IBM</em> <em>acquired</em> all of the issued and outstanding common shares of <em>Red</em> <em>Hat</em> for $190.00 per share in cash, representing a total equity value of approximately $34 billion.",
            "passageAnswers": [
              {
                "answer_text": "$190.00 per share in cash",
                "confidence": 0.6790031
              }
            ]
          }
        ]
      }
    ]
  }
  

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

app.post('/v1/query', function(req, res) {
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
        // 1. request contains content
        if (req != undefined) {
            // console.log("** Request  \n ", req.toString());
            // console.log("** Headers  \n ", JSON.stringify(req.headers));
            const contentType = req.headers["content-type"];
            
            // 2. right format
            if (contentType && contentType.indexOf("application/json") !== -1) {
                // console.log("** Content Type OK");       
                // 3. Body exists
                if (req.body != undefined) {
                    // console.log("** Body is defined \n ", JSON.stringify(req.body));          
                    var input = req.body;
                    console.log("** Input \n ", JSON.stringify(input));
                    res.statusCode = "200";
                    returnvalue = EXAMLE_JSON_RETURN;
                    console.log("** 200", returnvalue);
                    res.json(returnvalue);
                } else {
                    res.statusCode = 406;
                    returnvalue = { "info":"Not acceptable wrong format (no body)" };
                    console.log("** 406", returnvalue);
                    res.json(returnvalue);
                }
            } else {
                res.statusCode = 406;
                returnvalue = { "info":"Not acceptable wrong format" };
                console.log("** 406", returnvalue);
                res.json(returnvalue);
            }
        } else {
            res.statusCode = 406;
            returnvalue = { "info":"Not acceptable wrong format" };
            console.log("** 406", returnvalue);
            res.json(returnvalue);
        }
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