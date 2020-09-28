var fs = require('fs');
var path = require('path');

function getFileArray(dir)
{
	var fileNames = [];
	fs.readdirSync(dir).forEach( file => { //for each entry in a directory listing
		if(fs.statSync(path.join(dir, file)).isDirectory())
		{
			//if its a directory, then call the function again on that directory.
			var subFiles = [];
			getFileArray(path.join(dir, file)).forEach( subFile => {
				//for each file returned, add the folder name before hand.
				subFiles.push(path.join(file, subFile));
			});

			//add the files returned by that call to our current list of files.
			fileNames = fileNames.concat(subFiles);
		}
		else
		{
			//if not a directory, then just add it to the list
			fileNames.push(file);
		}
	});
	//return a deep copy of the fileNames array;
	return [...fileNames];
}

module.exports = { getFileArray };