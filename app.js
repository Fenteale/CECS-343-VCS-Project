//###########################################################
//
// app.js
//
// Author:
// contact:
//
// Description: Main entry point for our application.  It sets
// up the Express instance and handle requests for commands.
//
//###########################################################


// Import and initialize all variables that we need.
var express = require('express'); // Load the Express builder fcn.
var app = express(); //Init an Express object.
const path = require('path');	//Include path
var fs = require('fs');			//Include filesystem

//Include our functions in the js folder
var getFs = require('./js/getfiles.js');
var artID = require('./js/artID.js');
var manifest = require('./js/manifest.js');
var pn = require('./js/projName.js');
var label = require('./js/label.js');
var checkout = require('./js/checkout.js');
var listCmd = require('./js/list.js');
var getWebpageData = require('./js/getWebPageData.js');
var checkin = require('./js/checkin.js');
var merge_out = require('./js/merge-out.js');


app.get('/', function (req, res) { //Set page-gen fcn for URL root request.

	res.send(getWebpageData.getWebpageData(''));
});


app.get('/create', function (req, res) {
	//if user sends a request to /create, then we need to make a snapshot
	if(!fs.existsSync(req.query.repoPath))
	{
		//if repo directory doesnt exist already, we need to make it
		fs.mkdirSync(req.query.repoPath);
	}

	var projName = pn.getProjectName(req.query.srcPath); //get project name


	var files = getFs.getFileArray(req.query.srcPath); //get array of files
	console.log(files); //print them to console for debugging.

	var artIDs = [];

	var fileDirs = [];
	files.forEach(file => {
		//for each file in the files array
		var aID = artID.createArtID(file, req.query.srcPath, projName); //createArtID for each file
		console.log(aID); //print it to console
		artIDs.push(aID); //add it to the array of artIDs
		fileDirs.push(path.dirname(file)); //add relative path of file to the fileDirs array

		//copy each file in the files array to the repo directory and name it based off the artID.
		fs.copyFileSync(path.join(req.query.srcPath, file), path.join(req.query.repoPath, aID));
	});

	//create manifest file.
	manifest.createManifest(req.query.srcPath, req.query.repoPath, files, artIDs, fileDirs);

	//then display the webpage again.
	res.send(getWebpageData.getWebpageData("<p>Created repo.</p>"));
});

app.get('/list', function (req, res) {
	//Run command to list and return it to the argument of getWebpageData
	res.send(getWebpageData.getWebpageData(listCmd.listCommand(req.query.repoPath)));
});

app.get('/label', function (req, res) {
	// The command to set labels is run here.
	//get the path to the manifest file.
	var pathOfMan = path.join(req.query.repoPath, req.query.manName);
	//check the return value of the setLabel command
	switch(label.setLabel(req.query.repoPath, pathOfMan, req.query.labelName))
	{
		case 0: //if its 0 that means it was successful
			res.send(getWebpageData.getWebpageData("<p>Successfully set label.</p>"));
			break;
		case -1: //if its -1 that means the label already exists in some form
			res.send(getWebpageData.getWebpageData("<p>Failed to set label, that label already exists for that manifest.</p>"));
			break;
		default: //some other unhandled error
			res.send(getWebpageData.getWebpageData("<p>Failed to set label.</p>"));
			break;
	}
		
});

app.get('/checkout', function (req, res) {
	//run the checkout function.
	checkout.checkout(req)

	//display that it finished to the webpage
	res.send(getWebpageData.getWebpageData("<p>Successfully ran checkout.</p>"));
});

app.get('/checkin', function (req, res) {  //lotsa this copied from create
	checkin.checkin(req.query.repoPath, req.query.srcPath, res);
	
	res.send(getWebpageData.getWebpageData("<p>Successfully ran checkin.</p>"));
});

app.get('/merge-in', function(req, res) {
	//run merge-in command here
	checkin.checkin(req.query.repoPath, req.query.srcPath, res);
	//then display the webpage again.
	res.send(getWebpageData.getWebpageData("<p>Successfully ran merge-in.</p>"));
});

app.get('/merge-out', function(req, res) {
	//run merge-in command here
	merge_out.merge_out(req.query.repoPath, req.query.srcPath, res);
	//then display the webpage again.
	res.send(getWebpageData.getWebpageData("<p>Successfully ran merge-out.</p>"));
});

app.listen(3000, function () { // Set callback action function on network port.
	console.log('app.js listening on port 3000!');
});