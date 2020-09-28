//File: app.js
var express = require('express'); // Load the Express builder fcn.
var app = express(); //Init an Express object.
const path = require('path');
//app.use('/js', express.static(__dirname + '/js'));
var getFs = require('./js/getfiles.js');
var artID = require('./js/artID.js');
var manifest = require('./js/manifest.js');
var pn = require('./js/projName.js');

const { createArtID } = require('./js/artID.js');
var fs = require('fs');

app.get('/', function (req, res) { //Set page-gen fcn for URL roolt request.
	res.sendFile(path.join(__dirname, 'index.html'));
});


app.get('/create', function (req, res) {
	if(!fs.existsSync(req.query.repoPath))
	{
		fs.mkdirSync(req.query.repoPath);
	}

	var projName = pn.getProjectName(req.query.srcPath);


	var files = getFs.getFileArray(req.query.srcPath);
	console.log(files);

	var artIDs = [];

	var fileDirs = [];
	files.forEach(file => {
		var aID = artID.createArtID(file, req.query.srcPath, projName)
		console.log(aID);
		artIDs.push(aID);
		fileDirs.push(path.dirname(file));

		fs.copyFileSync(path.join(req.query.srcPath, file), path.join(req.query.repoPath, aID));
	});
	manifest.createManifest(req.query.srcPath, req.query.repoPath, artIDs, fileDirs);

	res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(3000, function () { // Set callback action function on network port.
	console.log('app.js listening on port 3000!');
});