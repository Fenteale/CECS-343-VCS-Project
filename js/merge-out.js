// Import and initialize all variables that we need.
const path = require('path');	//Include path
var fs = require('fs');			//Include filesystem

//Include our functions in the js folder
var getFs = require('./getfiles.js');
var artID = require('./artID.js');
var manifest = require('./manifest.js');
var pn = require('./projName.js');
var checkin = require('./checkin.js');


function compareFile()
{
	var retCode;
	// 0 - Case 1: Source file exists but no target file
	// 1 - Case 2: Target file exists but no source file
	// 2 - Case 3: Both source and target files exist and are identical
	// 3 - Case 4: Both source and target files exist and are different

	return retCode;
}

function compareManifest(repo, target)
{
	var pathOfManTarget = path.join(target, '.merge-1.rc');

	var Targetdata = fs.readFileSync(pathOfManTarget, {encoding:'utf8', flag:'r'});
	var TargetfileLines = Targetdata.match(/.* @ .* @ .*/gm);

	var rc_code = 1;
	while(fs.existsSync(path.join(repo, '.man-' + String(rc_code) + '.rc')))
	{
		rc_code += 1; //changes int assigned to file name based off number of files created
	}
	rc_code --;

	var pathOfManRepo = path.join(repo, '.man-' + rc_code + '.rc');

	var Repodata = fs.readFileSync(pathOfManRepo, {encoding:'utf8', flag:'r'});
	var RepofileLines = Repodata.match(/.* @ .* @ .*/gm);

	var index=0;
	TargetfileLines.forEach(f => {
		console.log('Target:' + f + ' Repo:' + RepofileLines[index]);
		compareFile();
		index += 1;
	});
	//forEach file in manifest
	//call compareFile, depending on return code, do something different.
}


function merge_out(repo, target, res)
{
	checkin.checkin(repo, target, res, false);

	compareManifest(repo, target);

	//read from repo
	
	//compare all files in current manifests (target manifest, and repo manifest).
	
	//if they are the same, that means its a straight upgrade
	
	//copy files from target to repo.
	
	//If there are files that exist only on repo, download those.

	//If both files have updates since, then we need to do grandma thing
}

module.exports = { merge_out } ;