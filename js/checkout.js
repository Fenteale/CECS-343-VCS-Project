//######################################################################################################
//
// checkout.js
//
// Author:
// Contact:
//
// Description: Recreates the snapshot of the project tree into an empty folder from selecting
// a particular manigest file in the repository.
//
//######################################################################################################

//included functions to run the file
var fs = require('fs');
var path = require('path');
const { getLabels } = require('./label.js');

function checkout(req){
	var pathOfMan = path.join(req.query.repoPath, req.query.manName); //gets the manifest file

	//checks if the manifest has labels
	if(!fs.existsSync(pathOfMan))
	{
		var realManFile; //original manifest name
		var rc_code = 1;
		var manFiles = [];

		while(fs.existsSync(path.join(req.query.repoPath, '.man-' + String(rc_code) + '.rc')))
		{
			manFiles.push('.man-' + String(rc_code) + '.rc');
			rc_code += 1;
		}
		manFiles.forEach(mf => {
			getLabels(path.join(req.query.repoPath, mf)).forEach( l => {
				if(l === req.query.manName)
					realManFile = mf;
			});
		});
		var pathOfMan = path.join(req.query.repoPath, realManFile);
	}

	if(!fs.existsSync(req.query.targetPath))
	{
		//if repo directory doesnt exist already, we need to make it
		fs.mkdirSync(req.query.targetPath);
	}

	var data = fs.readFileSync(pathOfMan, {encoding:'utf8', flag:'r'});
	var fileLines = data.match(/.* @ .* @ .*/gm);

	var files = [];

	//recreates all the files from the manifest with their respective relative folder
	fileLines.forEach(l => {
		var items = l.split(" @ ");

		if(items[1] != ".")
		{
			var subDirs = items[1].split(path.sep);
			var i = 0;
			var dirToCheck = "";
			for(i = 0; i < subDirs.length; i++)
			{
				dirToCheck = path.join(dirToCheck, subDirs[i]);
				if(!fs.existsSync(path.join(req.query.targetPath, dirToCheck)))
					fs.mkdirSync(path.join(req.query.targetPath, dirToCheck));
			}
		}

		var fileToCopy = path.join(req.query.repoPath, items[0]); //files to copy from repo folder
		var fileToPaste = path.join(req.query.targetPath, items[1], items[2]); //files to clone onto target folder
		files.push(fileToPaste);
		fs.copyFileSync(fileToCopy, fileToPaste);
	});

	//creates the checkout manifest
	createCheckoutManifest(req.query.repoPath, req.query.targetPath, req.query.manName, files);
}

//modified version of create manifest for the checkout function that includes the arguments
function createCheckoutManifest(repoPath, targetPath, manName, files)
{
	var rc_code = 1;
	while(fs.existsSync(path.join(targetPath, '.man-' + String(rc_code) + '.rc')))
	{
		rc_code += 1; //changes int assigned to file name based off number of files created
	}
	var dest = path.join(targetPath, '.man-' + String(rc_code) + '.rc'); //writes out path to file
	var writeStream = fs.createWriteStream(dest); //creates a writeStream to write into file
	writeStream.write('checkout ' + repoPath + ' ' + targetPath + ' ' + manName + '\n'); //writes the source path and repo path to file
	var presentTime = new Date(); //creates a Date object
	var date = presentTime.getFullYear() + '-' + (presentTime.getMonth()+1) + '-' + presentTime.getDate(); //creates date in correct format
	var time = presentTime.getHours() + ':' + presentTime.getMinutes() + ':' + presentTime.getSeconds(); //creates time in correct format
	var current = date + ' ' + time; //puts together full date and time in correct format
	writeStream.write(current + '\n'); //writes the date and time to file
	var artRel = "";
	for(var i = 0; i < files.length; i++) { //creates a String with artID's and relative paths
		artRel += files[i] + '\n'; 
	}
	writeStream.write(artRel); // writes the artID and relative paths to file
	writeStream.end(); //closes writeStream
}

module.exports = { checkout }