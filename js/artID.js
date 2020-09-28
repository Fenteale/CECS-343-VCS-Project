var fs = require('fs');
var path = require('path');

function createArtID(file, reqPath, projName) {
	var relativePath = path.dirname(path.join(projName, file)) + path.sep;
	console.log(relativePath);

	var data = fs.readFileSync(path.join(reqPath, file), 
              {encoding:'utf8', flag:'r'}); 

	var a = checkSum(data);
	var b = lastFour(data.length);
	var c = checkSum(relativePath);
	var artID = 'P' + a + '-' + 'L' + b + '-' + 'C' + c + path.extname(file); 
	return artID;
}

function checkSum(fileData) {
	var weight = 0;
	var removed = '';
	var removedWeight = 0;
	if (fileData.length < 4) {
		if (fileData.length == 1) {
			weight = fileData.charCodeAt(0)*1;
		} else if (fileData.length == 2) {
			weight = fileData.charCodeAt(0)*1 + fileData.charCodeAt(1)*3;
		} else {
			weight = fileData.charCodeAt(0)*1 + fileData.charCodeAt(1)*3 + fileData.charCodeAt(2)*7;
		};
	} else {
		while (fileData.length %4 != 0) {
			removed += fileData.slice(fileData.length - 1);
			fileData = fileData.slice(0, -1);
		};
		removedWeight = reverseCheckSum(removed);
		for (var i = 0; i < fileData.length; i += 4) {
			weight += fileData.charCodeAt(i)*1 + fileData.charCodeAt(i + 1)*3 + fileData.charCodeAt(i + 2)*7 + fileData.charCodeAt(i + 3)*11;
		};
	};
	if (removed == '') {
		weight = lastFour(weight);
	} else {
		weight = lastFour(weight + removedWeight);
	};
	return weight;
}

function lastFour(x) {
	if (x >= 10000) {
		x = x.toString().slice(-4);
	}
	return x;
}

function reverseCheckSum(removed) {
	var weight = 0;
	if (removed.length == 1) {
		weight = removed.charCodeAt(0)*1;
	} else if (removed.length == 2) {
		weight = removed.charCodeAt(0)*3 + removed.charCodeAt(1)*1;
	} else {
		weight = removed.charCodeAt(0)*7 + removed.charCodeAt(1)*3 + removed.charCodeAt(2)*1;
	};
	return weight;
}

module.exports = { createArtID };
