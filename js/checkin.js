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
const path = require('path');	//Include path
var fs = require('fs');			//Include filesystem

//Include our functions in the js folder
var getFs = require('./getfiles.js');
var artID = require('./artID.js');
var manifest = require('./manifest.js');
var pn = require('./projName.js');
var getWebpageData = require('./getWebPageData');

function checkin(repo, target, res, full = true)
{ // if full = true, do checkin like normal, if not, just create manifest
	//if user sends a request to /checkin, then we need to make a snapshot
	if(!fs.existsSync(repo) && full)
	{
		res.send(getWebpageData.getWebpageData("<p>Directory is not a repository.</p>"));
	}
	else
	{

		var projName = pn.getProjectName(target); //get project name


		var files = getFs.getFileArray(target); //get array of files
		console.log(files); //print them to console for debugging.

		var artIDs = [];

		var fileDirs = [];
		files.forEach(file => {
			//for each file in the files array
			var aID = artID.createArtID(file, target, projName); //createArtID for each file
			console.log(aID); //print it to console
			artIDs.push(aID); //add it to the array of artIDs
			fileDirs.push(path.dirname(file)); //add relative path of file to the fileDirs array

			//copy each file in the files array to the repo directory and name it based off the artID.
			if(full)
				fs.copyFileSync(path.join(target, file), path.join(repo, aID));
		});

		//create manifest file.
		if(full)
			manifest.createManifest(target, repo, files, artIDs, fileDirs);
		else
			manifest.createManifest(target, target, files, artIDs, fileDirs, 'merge');
	}
}

module.exports = {checkin}