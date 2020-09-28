function getProjectName(srcDir)
{
	var projName;
	var dirs = srcDir.split('/');
	if(dirs.length < 2)
	{
		dirs = srcDir.split('\\');
	}
	if(dirs[dirs.length - 1] == '')
	{
		projName = dirs[dirs.length - 2];
	}
	else
	{
		projName = dirs[dirs.length - 1];
	}
	console.log('Project name: ' + projName);

	return projName;
}

module.exports = { getProjectName };