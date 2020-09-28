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

function createManifest(srcPath, repoPath, artIDs, relPaths)
{
	var rc_code = 1;
	while(fs.existsSync(path.join(repoPath, '.man-' + String(rc_code) + '.rc')))
	{
		rc_code += 1;
	}
	var dest = path.join(repoPath, '.man-' + String(rc_code) + '.rc');
	var writeStream = fs.createWriteStream(dest);
	writeStream.write('create ' + srcPath + ' ' + repoPath + '\n');
	var presentTime = new Date();
	var date = presentTime.getFullYear() + '-' + (presentTime.getMonth()+1) + '-' + presentTime.getDate();
	var time = presentTime.getHours() + ':' + presentTime.getMinutes() + ':' + presentTime.getSeconds();
	var current = date + ' ' + time;
	writeStream.write(current + '\n');
	var artRel = "";
	for(var i = 0; i < artIDs.length; i++) {
		artRel += artIDs[i] + ' @ ' + relPaths[i] + '\n';
	}
	writeStream.write(artRel);
	writeStream.end();
}

module.exports = { createManifest };