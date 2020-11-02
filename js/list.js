//###########################################################
//
// list.js
//
// Author:
// contact:
//
// Description: The listCommand lists all the manifest files
// and their labels in a repo folder.
//
//###########################################################

//include the needed modules
const fs = require('fs');
var path = require('path');
const { getLabels } = require('./label.js');

function listCommand(dir){
	var dirLabel = "";
	var rc_code = 1;
	var manFiles = [];

	//get a list of all the manifest files in the directory
    while(fs.existsSync(path.join(dir, '.man-' + String(rc_code) + '.rc')))
    {
        manFiles.push('.man-' + String(rc_code) + '.rc');
        rc_code += 1;
    }

	//for each manifest file, create a new line to return
	for(var i = 0; i < manFiles.length; i++){
		//print the file name and get ready to print labels.
		dirLabel += "File: " + manFiles[i] + " Labels: ";
		//run getLabels for that manifest file
		var labels = getLabels(path.join(dir, manFiles[i]));
		//throw out the first one because its always just the "labels: " string
		labels = labels.slice(1, labels.length - 1);
		//add each label to the string
		labels.forEach(l => {
			dirLabel += l + ", ";
		});
		//end with a break for a newline.
		dirLabel += "<br>";
	}

	return dirLabel;
}

module.exports = { listCommand }