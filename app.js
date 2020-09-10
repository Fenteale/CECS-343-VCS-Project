//File: app.js
var express = require('express'); // Load the Express builder fcn.
var app = express(); //Init an Express object.
app.get('/', function (req, res) { //Set page-gen fcn for URL roolt request.
	res.send('Hello World!'); //Send webpage containing "Hello Wolrd!".
});
app.listen(3000, function () { // Set callback action function on network port.
	console.log('app.js listening on port 3000!');
});