var fs = require('fs');

function getFileArray(dir)
{
	var fileNames = [];
	fs.readdir(dir, (err, files) => {
		if (err)
		{
			throw err;
		}
		fileNames = files;
	});
	return fileNames;
}