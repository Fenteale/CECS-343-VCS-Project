var fs = require('fs');
var path = require('path');

function createArtID(file, reqPath) {
	var artID;
	var fileData = [];
	//var relativePath = path.dirname(file);
	var readable = fs.createReadStream(path.join(reqPath,file), {
		encoding: 'utf8',
		fd: null,
	});
	readable.on('readable', function() {
		var artChar;
		while(null !== (artChar = readable.read(1))) {
			fileData.push(artChar);
		}
	});

	var a = checkSum(fileData);
	var b = lastFour(file.size);
	var c = checkSum(relativePath);
	artID = 'P' + a + '-' + 'L' + b + '-' + 'C' + c + '.txt'; 
	return artID;
}

function checkSum(fileData) {
	var weight;
	for (var i = 0; i < fileData.length; i+=4) {
		//weight += charCodeAt[arguments[i]]*1 + charCodeAt[arguments[i + 1]]*3 + charCodeAt[arguments[i + 2]]*7 + charCodeAt[arguments[i + 3]]*11;
		weight += fileData[i].charCodeAt(0)*1 + fileData[i + 1].charCodeAt(0)*3 + fileData[i + 2].charCodeAt(0)*7 + fileData[i + 3].charCodeAt(0)*11;
	};
	lastFour(weight)
	return weight;
}

function lastFour(x) {
	if (x >= 1000) {
		x = x.toString().slice(-4);
	}
	return x;
}

module.exports = { createArtID };
