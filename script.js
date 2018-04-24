var oracledb = require('oracledb');

//var dbConfig = require('./dbconfig.js');



oracledb.getConnection(

  {

    user          : "abarve",

    password      : "Fichdi456",

    connectString : "oracle.cise.ufl.edu/orcl"

  },

  function(err, connection) {

    if (err) {

      console.error(err.message);

      return;

    }

    console.log('Connection was successful!');



    connection.close(

      function(err) {

        if (err) {

          console.error(err.message);

          return;

        }

      });

  });