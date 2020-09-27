var fs = require('fs');
var path = require('path');

function createManifest(srcPath, repoPath, artIDs, relPaths)
{
	var dest = path.join(repoPath, '.man-1.rc');
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