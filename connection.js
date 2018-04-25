/*jslint node:true*/



var express = require('express');

var app = express();

var bodyParser = require('body-parser');

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

//number of repos per language(top lanuages)
// Http method: GET
/*select count(repo_name), language_name
  from written_in
  group by language_name
  order by count(repo_name) desc;*/
// URI        : /userprofiles/:USER_NAME
// Read the profile of user given in :USER_NAME
app.get('/languages/top/:akash', function (req, res) {
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

        connection.execute("select * from (select count(repo_name) as OCCURS, language_name from written_in group by language_name order by count(repo_name) desc) where rownum <= :akash", [req.params.akash], {
            outFormat: oracledb.OBJECT // Return the result as Object
        }, function (err, result) {
            if (err || result.rows.length < 1) {
                res.set('Content-Type', 'application/json');
                var status = err ? 500 : 404;
                res.status(status).send(JSON.stringify({
                    status: status,
                    message: err ? "Error getting the user profile" : "User doesn't exist",
                    detailed_message: err ? err.message : ""
                }));
            } else {
                res.contentType('application/json').status(200).send(JSON.stringify(result.rows));
            }
            // Release the connection
            connection.release(
                function (err) {
                    if (err) {
                        console.error(err.message);
                    } else {
                        console.log("GET /languages/top/" + req.params.akash + " : Connection released");
                    }
                });
        });
    });
});


//number of languages a user knows and total bytes of code he hs written(users)
// Http method: GET
/*select repo_name, count(language_name) as no_lang_inrepo, sum(bytes) as total_bytes
from written_in
where repo_name like '%adam%'
group by repo_name
order by count(language_name) desc;*/
// URI        : /userprofiles/:USER_NAME
// Read the profile of user given in :USER_NAME
app.get('/users/knows/:namelike', function (req, res) {
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

        connection.execute("select repo_name, count(language_name) as no_lang_inrepo, sum(bytes) as total_bytes from written_in where REPO_NAME LIKE :namelike group by repo_name order by count(language_name) desc", [req.params.namelike], {
            outFormat: oracledb.OBJECT // Return the result as Object
        }, function (err, result) {
            if (err || result.rows.length < 1) {
                res.set('Content-Type', 'application/json');
                var status = err ? 500 : 404;
                res.status(status).send(JSON.stringify({
                    status: status,
                    message: err ? "Error getting the user profile" : "User doesn't exist",
                    detailed_message: err ? err.message : ""
                }));
            } else {
                res.contentType('application/json').status(200).send(JSON.stringify(result.rows));
            }
            // Release the connection
            connection.release(
                function (err) {
                    if (err) {
                        console.error(err.message);
                    } else {
                        console.log("GET /users/knows/" + req.params.namelike + " : Connection released");
                    }
                });
        });
    });
});

//number of languages in a license(repsitory)
// Http method: GET
/* select license, count(DISTINCT language_name) as lang_per_license
  from written_in a, repository b
  where a.repo_name = b.repo_name
  group by license;*/
// URI        : /userprofiles/:USER_NAME
// Read the profile of user given in :USER_NAME
app.get('/repository/licenselang', function (req, res) {

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



        connection.execute("select license, count(DISTINCT language_name) as lang_per_license from written_in a, repository b where a.repo_name = b.repo_name group by license", {}, {

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

                        console.log("GET /repository/licenselang : Connection released");

                    }

                });

        });

    });

});

//number of ppl watching a lang(language)
// Http method: GET
/* select license, count(DISTINCT language_name) as lang_per_license
  from written_in a, repository b
  where a.repo_name = b.repo_name
  group by license;*/
// URI        : /userprofiles/:USER_NAME
// Read the profile of user given in :USER_NAME
app.get('/lang/peoplewatching', function (req, res) {

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



        connection.execute("select language_name, sum(watch_count) as totalwatchinglang from repository a, written_in where a.repo_name = b.repo_name group by language_name order by sum(watch_count) desc", {}, {

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

                        console.log("GET /lang/peoplewatching : Connection released");

                    }

                });

        });

    });

});

//top x repositories with watch count(repository)
// Http method: GET
/*select repo_name, watch_count
from repository
where rownum <= 20
order by watch_count desc;*/
// URI        : /userprofiles/:USER_NAME
// Read the profile of user given in :USER_NAME
app.get('/repository/topxwatch/:akash1', function (req, res) {
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

        connection.execute("select repo_name, watch_count from repository where rownum <= :akash1 order by watch_count desc", [req.params.akash1], {
            outFormat: oracledb.OBJECT // Return the result as Object
        }, function (err, result) {
            if (err || result.rows.length < 1) {
                res.set('Content-Type', 'application/json');
                var status = err ? 500 : 404;
                res.status(status).send(JSON.stringify({
                    status: status,
                    message: err ? "Error getting the user profile" : "User doesn't exist",
                    detailed_message: err ? err.message : ""
                }));
            } else {
                res.contentType('application/json').status(200).send(JSON.stringify(result.rows));
            }
            // Release the connection
            connection.release(
                function (err) {
                    if (err) {
                        console.error(err.message);
                    } else {
                        console.log("GET /repository/topxwatch/" + req.params.akash1 + " : Connection released");
                    }
                });
        });
    });
});

//topX languages with bytes of code(languages)
// Http method: GET
/*select language_name, sum(bytes) as total_bytes_per_lang
from written_in
group by language_name
order by total_bytes_per_lang desc;*/
// URI        : /userprofiles/:USER_NAME
// Read the profile of user given in :USER_NAME
app.get('/lang/totalbytes/:akash2', function (req, res) {
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

        connection.execute("select * from (select language_name, sum(bytes) as total_bytes_per_lang from written_in group by language_name order by total_bytes_per_lang desc) where rownum <= :akash2", [req.params.akash2], {
            outFormat: oracledb.OBJECT // Return the result as Object
        }, function (err, result) {
            if (err || result.rows.length < 1) {
                res.set('Content-Type', 'application/json');
                var status = err ? 500 : 404;
                res.status(status).send(JSON.stringify({
                    status: status,
                    message: err ? "Error getting the user profile" : "User doesn't exist",
                    detailed_message: err ? err.message : ""
                }));
            } else {
                res.contentType('application/json').status(200).send(JSON.stringify(result.rows));
            }
            // Release the connection
            connection.release(
                function (err) {
                    if (err) {
                        console.error(err.message);
                    } else {
                        console.log("GET /lang/totalbytes/" + req.params.akash2 + " : Connection released");
                    }
                });
        });
    });
});

//topX languages related o a particular domain(languages)
// Http method: GET
/*select language_name, sum(bytes) as lang_fr_repotype
from written_in
where repo_name like '%linux%' 
group by language_name
order by sum(bytes) desc;*/
// URI        : /userprofiles/:USER_NAME
// Read the profile of user given in :USER_NAME
app.get('/lang/totalfordomain/:akash3', function (req, res) {
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

        connection.execute("select language_name, sum(bytes) as lang_fr_repotype from written_in where repo_name like :akash3 group by language_name order by sum(bytes) desc", [req.params.akash3], {
            outFormat: oracledb.OBJECT // Return the result as Object
        }, function (err, result) {
            if (err || result.rows.length < 1) {
                res.set('Content-Type', 'application/json');
                var status = err ? 500 : 404;
                res.status(status).send(JSON.stringify({
                    status: status,
                    message: err ? "Error getting the user profile" : "User doesn't exist",
                    detailed_message: err ? err.message : ""
                }));
            } else {
                res.contentType('application/json').status(200).send(JSON.stringify(result.rows));
            }
            // Release the connection
            connection.release(
                function (err) {
                    if (err) {
                        console.error(err.message);
                    } else {
                        console.log("GET /lang/totalfordomain/" + req.params.akash3 + " : Connection released");
                    }
                });
        });
    });
});


//topX repo names company wise(repository)
// Http method: GET
/*select repo_name, count (a.author_id) as no_of_commits
from commits a, author b
where a.author_id = b.author_id and b.author_email like '%.edu%'
group by repo_name;*/
// URI        : /userprofiles/:USER_NAME
// Read the profile of user given in :USER_NAME
app.get('/repository/topcompanies/:akash4', function (req, res) {
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

        connection.execute("select repo_name, count (a.author_id) as no_of_commits from commits a, author b where a.author_id = b.author_id and b.author_email like :akash4 group by repo_name", [req.params.akash4], {
            outFormat: oracledb.OBJECT // Return the result as Object
        }, function (err, result) {
            if (err || result.rows.length < 1) {
                res.set('Content-Type', 'application/json');
                var status = err ? 500 : 404;
                res.status(status).send(JSON.stringify({
                    status: status,
                    message: err ? "Error getting the user profile" : "User doesn't exist",
                    detailed_message: err ? err.message : ""
                }));
            } else {
                res.contentType('application/json').status(200).send(JSON.stringify(result.rows));
            }
            // Release the connection
            connection.release(
                function (err) {
                    if (err) {
                        console.error(err.message);
                    } else {
                        console.log("GET /repositories/topcompany/" + req.params.akash4 + " : Connection released");
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