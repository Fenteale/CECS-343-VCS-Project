const fs = require('fs');
var path = require('path');

function listCommand(dir, labels){
	var dirLabel = "";
	var files = [];
	fs.readdirSync(dir).forEach(file => {
  		files.push(file + "\n");
	});

	for(var i = 0; i < labels.length; i++){
		dirLabel += "File: " + files[i] + " Label: " + labels[i] + "\n";
	}

	return dirLabel;
}

module.exports = { listCommand }