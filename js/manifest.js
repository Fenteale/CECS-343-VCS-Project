//###########################################################
//
// manifest.js
//
// Author:
// contact:
//
// Description: createManifest creates a manifest file in the
// repo directory based on the artifact IDs, list of files,
// and command issues.
//
//###########################################################

var fs = require('fs');
var path = require('path');

function createManifest(srcPath, repoPath, files, artIDs, relPaths)
{
	var rc_code = 1;
	while(fs.existsSync(path.join(repoPath, '.man-' + String(rc_code) + '.rc')))
	{
		rc_code += 1; //changes int assigned to file name based off number of files created
	}
	var dest = path.join(repoPath, '.man-' + String(rc_code) + '.rc'); //writes out path to file
	var writeStream = fs.createWriteStream(dest); //creates a writeStream to write into file
	writeStream.write('create ' + srcPath + ' ' + repoPath + '\n'); //writes the source path and repo path to file
	var presentTime = new Date(); //creates a Date object
	var date = presentTime.getFullYear() + '-' + (presentTime.getMonth()+1) + '-' + presentTime.getDate(); //creates date in correct format
	var time = presentTime.getHours() + ':' + presentTime.getMinutes() + ':' + presentTime.getSeconds(); //creates time in correct format
	var current = date + ' ' + time; //puts together full date and time in correct format
	writeStream.write(current + '\n'); //writes the date and time to file
	writeStream.write("labels: \n");
	var artRel = "";
	for(var i = 0; i < artIDs.length; i++) { //creates a String with artID's and relative paths
		artRel += artIDs[i] + ' @ ' + relPaths[i] + ' @ ' + path.basename(files[i]) + '\n'; 
	}
	writeStream.write(artRel); // writes the artID and relative paths to file
	writeStream.end(); //closes writeStream
}

module.exports = { createManifest };
