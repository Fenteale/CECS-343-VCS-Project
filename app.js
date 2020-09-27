//File: app.js
var express = require('express'); // Load the Express builder fcn.
var app = express(); //Init an Express object.
const path = require('path');
//app.use('/js', express.static(__dirname + '/js'));
var getFs = require('./js/getfiles.js');
var artID = require('./js/artID.js');
var manifest = require('./js/manifest.js');

const { createArtID } = require('./js/artID.js');

app.get('/', function (req, res) { //Set page-gen fcn for URL roolt request.
	res.sendFile(path.join(__dirname, 'index.html'));
});


app.get('/create', function (req, res) {
	var dirs = req.query.path.split('/');
	if(dirs.length < 2)
	{
		dirs = req.query.path.split('\\');
	}
	var projName;
	if(dirs[dirs.length - 1] == '')
	{
		projName = dirs[dirs.length - 2];
	}
	else
	{
		projName = dirs[dirs.length - 1];
	}
	console.log('Project name: ' + projName);
	var files = getFs.getFileArray(req.query.path);
	console.log(files);
	files.forEach(file => {
		console.log(artID.createArtID(file, req.query.path, projName));
	});
	res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(3000, function () { // Set callback action function on network port.
	console.log('app.js listening on port 3000!');
});