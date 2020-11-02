const fs = require('fs');
var path = require('path');
const { getLabels } = require('./label.js');

function listCommand(dir){
	var dirLabel = "";
	var rc_code = 1;
	var manFiles = [];

    while(fs.existsSync(path.join(dir, '.man-' + String(rc_code) + '.rc')))
    {
        manFiles.push('.man-' + String(rc_code) + '.rc');
        rc_code += 1;
    }

	for(var i = 0; i < manFiles.length; i++){
		dirLabel += "File: " + manFiles[i] + " Labels: ";
		var labels = getLabels(path.join(dir, manFiles[i]));
		labels = labels.slice(1, labels.length - 1);
		labels.forEach(l => {
			dirLabel += l + ", ";
		});
		dirLabel += "<br>";
	}

	return dirLabel;
}

module.exports = { listCommand }