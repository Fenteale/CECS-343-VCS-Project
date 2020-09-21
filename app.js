//File: app.js
var express = require('express'); // Load the Express builder fcn.
var app = express(); //Init an Express object.
const path = require('path');
//app.use('/js', express.static(__dirname + '/js'));
var getFs = require('./js/getfiles.js');

app.get('/', function (req, res) { //Set page-gen fcn for URL roolt request.
	//res.send('Hello World!'); //Send webpage containing "Hello Wolrd!".
	res.sendFile(path.join(__dirname+'/index.html'));
});


app.get('/create', function (req, res) {
	var files = getFs.getFileArray(req.query.path);
	console.log(files.toString());
	res.sendFile(path.join(__dirname+'/index.html'));
});

app.listen(3000, function () { // Set callback action function on network port.
	console.log('app.js listening on port 3000!');
});