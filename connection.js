var express = require('express');
var app = express();
var bodyParser = require('body-parser')
var oracledb = require('oracledb');

var cors = require('cors')
var app = express()
app.use(cors())



// Use body parser to parse JSON body

app.use(bodyParser.json());



var connAttrs = {

    "user": "abarve",

    "password": "Fichdi456",

    "connectString": "oracle.cise.ufl.edu/orcl"

}



// Http Method: GET

// URI        : /user_profiles

// Read all the user profiles

app.get('/languages', function (req, res) {

    "use strict";



    oracledb.getConnection(connAttrs, function (err, connection) {

        if (err) {

            // Error connecting to DB

            res.set('Content-Type', 'application/json');

            res.status(500).send(JSON.stringify({

                status: 500,

                message: "Error connecting to DB",

                detailed_message: err.message

            }));

            return;

        }



        connection.execute("SELECT * FROM languages", {}, {

            outFormat: oracledb.OBJECT // Return the result as Object

        }, function (err, result) {

            if (err) {

                res.set('Content-Type', 'application/json');

                res.status(500).send(JSON.stringify({

                    status: 500,

                    message: "Error getting the user profile",

                    detailed_message: err.message

                }));

            } else {

                res.contentType('application/json').status(200);

                res.send(JSON.stringify(result.rows));

            }

            // Release the connection

            connection.release(

                function (err) {

                    if (err) {

                        console.error(err.message);

                    } else {

                        console.log("GET /user_profiles : Connection released");

                    }

                });

        });

    });

});

// Http Method: GET

// URI        : /user_profiles

// Read all the user profiles

app.get('/written_in/langcount', function (req, res) {

    "use strict";



    oracledb.getConnection(connAttrs, function (err, connection) {

        if (err) {

            // Error connecting to DB

            res.set('Content-Type', 'application/json');

            res.status(500).send(JSON.stringify({

                status: 500,

                message: "Error connecting to DB",

                detailed_message: err.message

            }));

            return;

        }



        connection.execute("select count(repo_name) as occurs, language_name from written_in group by language_name order by count(repo_name) desc", {}, {

            outFormat: oracledb.OBJECT // Return the result as Object

        }, function (err, result) {

            if (err) {

                res.set('Content-Type', 'application/json');

                res.status(500).send(JSON.stringify({

                    status: 500,

                    message: "Error getting the user profile",

                    detailed_message: err.message

                }));

            } else {

                res.contentType('application/json').status(200);

                res.send(JSON.stringify(result.rows));

            }

            // Release the connection

            connection.release(

                function (err) {

                    if (err) {

                        console.error(err.message);

                    } else {

                        console.log("GET /written_in/langcount : Connection released");

                    }

                });

        });

    });

});

var server = app.listen(3000, function () {

    "use strict";



    var host = server.address().address,

        port = server.address().port;



    console.log(' Server is listening at http://%s:%s', host, port);

});