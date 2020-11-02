//######################################################################################################
//
// artID.js
//
// Author:
// Contact:
//
// Description: This file creates the Artifact ID that has 3 parts: "Pa-Lb-Cc" and the original filename extension 
// for the files we pass through. The "a" is the checksum of all the Characters in the file, "b" is the checksum 
// of the file length, and "c" is the checksum of the file's relative path.
//
//######################################################################################################

var fs = require('fs');
var path = require('path');

function createArtID(file, reqPath, projName) {
	var relativePath = path.dirname(path.join(projName, file)) + path.sep; //Gets the relative path 

	//Reads the file and puts to the content into the string
	var data = fs.readFileSync(path.join(reqPath, file), 
              {encoding:'utf8', flag:'r'}); 

	var a = checkSum(data); //Checksum of all the Characters
	var b = lastFour(data.length); //Checksum of the file length
	var c = checkSum(relativePath); //Checksum of the file's relative path
	var artID = 'P' + a + '-' + 'L' + b + '-' + 'C' + c + path.extname(file);
	return artID;
}

//This function performs the calculations to actually get the checksum for Path, Length and Characters
function checkSum(fileData) {
	var weight = 0; //Initialize the weighted checksum
	var removed = ''; //Initialize the characters to remove if file length is not divisible by four
	var removedWeight = 0; //Initialize the weighted checksum for the characters removed
	if (fileData.length < 4) { //Perform checksum calculation if the string length is less than four
		if (fileData.length == 1) {
			weight = fileData.charCodeAt(0)*1; 
		} else if (fileData.length == 2) {
			weight = fileData.charCodeAt(0)*1 + fileData.charCodeAt(1)*3;
		} else {
			weight = fileData.charCodeAt(0)*1 + fileData.charCodeAt(1)*3 + fileData.charCodeAt(2)*7;
		};
	} else { //Perform checksum calculation if the string length is greater or equal to four
		while (fileData.length %4 != 0) { //Removes the last character of the string until the string length is disible by four
			removed += fileData.slice(fileData.length - 1);
			fileData = fileData.slice(0, -1);
		};
		removedWeight = reverseCheckSum(removed); //Gets the the checksum of the removed characters
		for (var i = 0; i < fileData.length; i += 4) { //Loop that checks most of the calculations of the string
			weight += fileData.charCodeAt(i)*1 + fileData.charCodeAt(i + 1)*3 + fileData.charCodeAt(i + 2)*7 + fileData.charCodeAt(i + 3)*11;
		};
	};
	if (removed == '') { //Avoids the error of adding a null checksum
		weight = lastFour(weight);
	} else {
		weight = lastFour(weight + removedWeight);
	};
	return weight;
}

//This function captures the low-order four digits of the checksum
function lastFour(x) {
	if (x >= 10000) {
		x = x.toString().slice(-4);
	}
	return x;
}

//This function gets the checksum of the characters we removed from the string
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
