//###########################################################
//
// projName.js
//
// Author:
// contact:
//
// Description: getProjectName takes in the source directory
// as a parameter and returns just the last folder's name as
// the project name.
//
//###########################################################

function getProjectName(srcDir)
{
	var projName;
	var dirs = srcDir.split('/'); //split the string based on the / character
	if(dirs.length < 2)
	{
		// if there are less than 2 parts to the array, then assume it failed
		// split the string with the backslash instead
		dirs = srcDir.split('\\');
	}
	if(dirs[dirs.length - 1] == '')
	{
		// if the string ends with a trailing slash, return the directory before
		// the slash
		projName = dirs[dirs.length - 2];
	}
	else
	{
		// return the last entry in the split array
		projName = dirs[dirs.length - 1];
	}
	console.log('Project name: ' + projName);

	return projName;
}

module.exports = { getProjectName };