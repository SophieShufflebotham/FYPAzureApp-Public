var sql = require('mysql');
var Connection = require('tedious').Connection;
var credentials = require('../classes/credentials.js');

var connConfig = {
    server: "ss-fypserver.database.windows.net",
    options: {
        database: "fyp_db",
        encrypt: true
    },
    authentication: {
      type: "default",
      options: {  
        userName: credentials.username,
        password: credentials.password,
        useColumnNames: true
      }
    }
  };

//Configure the Database connection
var connection = new Connection(connConfig);

//Throw an error if the database could not connect
connection.on('connect', function (err) {
    if (err) 
    {
        throw err;
    }
    console.log("\nDB Connection Success");
});

//Export as connection
module.exports = connection;