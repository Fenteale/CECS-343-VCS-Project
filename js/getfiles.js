var fs = require('fs');

function getFileArray(dir)
{
	console.log(dir);
	//var fileNames = [];
	//fileNames = [...fs.readdirSync(dir)];
	/*
	fileNames.forEach(fileI => {
		console.log(fileI);
	});
	*/
	//return [...fileNames];
	return [...fs.readdirSync(dir)];
}

module.exports = { getFileArray };