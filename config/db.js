//  Import mysql
let mysql = require("mysql")

// Import credentials
let keys = require("./keys");

// Create the connection
let connection  = mysql.createConnection({
	host 	: keys.db.mysql.local.host,
	user 	: keys.db.mysql.local.user,
	password: keys.db.mysql.local.password,
	database: keys.db.mysql.local.database
});

// Connect using parameters
connection.connect((err)=> {
	if (err) {
	  	console.error('error connecting: ' + err.stack);
	   	return;
	}
	console.log('connected as id ' + connection.threadId);
});

//Export the connection 
module.exports = connection;
