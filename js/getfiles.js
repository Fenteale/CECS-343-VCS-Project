var fs = require('fs');
var path = require('path');

function getFileArray(dir)
{
	var fileNames = [];
	fs.readdirSync(dir).forEach( file => {
		if(fs.statSync(path.join(dir, file)).isDirectory())
		{
			var subFiles = [];
			getFileArray(path.join(dir, file)).forEach( subFile => {
				subFiles.push(path.join(file, subFile));
			});
			fileNames = fileNames.concat(subFiles);
		}
		else
		{
			fileNames.push(file);
		}
	});
	return [...fileNames];
}

module.exports = { getFileArray };