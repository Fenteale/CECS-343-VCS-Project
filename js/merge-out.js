// Import and initialize all variables that we need.
const path = require('path');	//Include path
var fs = require('fs');			//Include filesystem

//Include our functions in the js folder
var getFs = require('./getfiles.js');
var artID = require('./artID.js');
var manifest = require('./manifest.js');
var pn = require('./projName.js');
var checkin = require('./checkin.js');


function compareFile(fileToCheck, manifestArray)
{
	var returnCode;
	// Case 1: Source file exists but no target file
	// Case 2: Target file exists but no source file
	// Case 3: Both source and target files exist and are identical
	// Case 4: Both source and target files exist and are different

	var fileToCheckParts = fileToCheck.split(" @ ");
	var filePathToCheck = path.join(fileToCheckParts[1], fileToCheckParts[2]);

	returnCode = 1;

	var aisT = fileToCheckParts[0].split('-');

	manifestArray.forEach(i => {
		if(returnCode==1) {
			var itemParts = i.split(" @ ");
			var itemPathToCheck = path.join(itemParts[1], itemParts[2]);
			if(filePathToCheck == itemPathToCheck){
				var aisI = itemParts[0].split('-');
				if(aisT[0] == aisI[0]) {
					//console.log('###### ' + aisT[0] + ' ' + aisI[0]);
					returnCode = 3;
				}
				else {
					returnCode = 4;
				}
			}
			//else
				//console.log(filePathToCheck + ' did not equal ' + itemPathToCheck);
		}
	});

	return returnCode;
}

function getOrigArtId(fileToCheck, manifestArray)
{
	var ai;

	var fileToCheckParts = fileToCheck.split(" @ ");
	var filePathToCheck = path.join(fileToCheckParts[1], fileToCheckParts[2]);

	var aisT = fileToCheckParts[0].split('-');

	manifestArray.forEach(i => {
		if(ai==null) {
			var itemParts = i.split(" @ ");
			var itemPathToCheck = path.join(itemParts[1], itemParts[2]);
			if(filePathToCheck == itemPathToCheck){
				ai = itemParts[0];
			}
		}
	});

	return ai;
}

function getGrandma(fileName, repo, target) {
	var rc_code = 1;
	while(fs.existsSync(path.join(target, '.man-' + String(rc_code) + '.rc')))
	{
		rc_code += 1; //changes int assigned to file name based off number of files created
	}
	rc_code --;

	var targetMan = fs.readFileSync(path.join(target, '.man-' + String(rc_code) + '.rc'), {encoding:'utf8', flag:'r'});
	var repoTargetName = targetMan.match(/^(checkout.*)\.man-\d\.rc/gm);
	var repoFN = repoTargetName[0].split(' ')[3];

	var RepoData = fs.readFileSync(path.join(repo, repoFN), {encoding:'utf8', flag:'r'});
	var RepoLines = RepoData.match(/.* @ .* @ .*/gm);

	console.log('getOrigArtId(' + fileName + ', ' + RepoLines);
	return getOrigArtId(fileName, RepoLines);

}

function compareManifest(repo, target)
{
	var pathOfManTarget = path.join(target, '.merge-1.rc');
	console.log(pathOfManTarget);
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
	var extraTargetFiles = [];
	TargetfileLines.forEach(f => { // For each file in the target manifest, check against repo manifest
		//console.log('Target:' + f + ' Repo:' + RepofileLines[index]);
		var retCode = compareFile(f, RepofileLines);
		console.log('Return code: ' + retCode);
		switch(retCode) {
			case 1:
				extraTargetFiles.push(f);
				break;
			case 3:
				console.log('File already exists in repo: ' + f);
				//File exists in repo and is identical
				//Do nothing
				break;
			case 4:
				console.log('File exists in repo, but is different! ' + f);
				//File exists in the repo and is different!
				var fileParts = f.split(" @ ");
				fs.copyFileSync(path.join(target, fileParts[1], fileParts[2]),
					path.join(target, fileParts[1], path.basename(fileParts[2], path.extname(fileParts[2])) + '_MT' + path.extname(fileParts[2])));
				fs.unlinkSync(path.join(target, fileParts[1], fileParts[2]));

				var ArtifactPath = path.join(repo, getOrigArtId(f, RepofileLines));
				console.log('Artpath: ' + ArtifactPath);
				fs.copyFileSync(ArtifactPath, path.join(target, fileParts[1], path.basename(fileParts[2], path.extname(fileParts[2])) + '_MR' + path.extname(fileParts[2])));
				var GrandmaArtID = path.join(repo, getGrandma(f, repo, target));
				console.log('Grandma Artpath: ' + GrandmaArtID);
				fs.copyFileSync(GrandmaArtID, path.join(target, fileParts[1], path.basename(fileParts[2], path.extname(fileParts[2])) + '_MG' + path.extname(fileParts[2])));
				break;
		}
		index += 1;
	});

	var extraRepoFiles = [];
	RepofileLines.forEach(f => { // For each file in the repo manifest, check against target
		if(compareFile(f, TargetfileLines) == 1)
			extraRepoFiles.push(f);
	});
	

	extraRepoFiles.forEach(l => {
		var items = l.split(" @ ");

		if(items[1] != ".")
		{
			var subDirs = items[1].split(path.sep);
			var i = 0;
			var dirToCheck = "";
			for(i = 0; i < subDirs.length; i++)
			{
				dirToCheck = path.join(dirToCheck, subDirs[i]);
				if(!fs.existsSync(path.join(target, dirToCheck)))
					fs.mkdirSync(path.join(target, dirToCheck));
			}
		}

		var fileToCopy = path.join(repo, items[0]); //files to copy from repo folder
		var fileToPaste = path.join(target, items[1], items[2]); //files to clone onto target folder
		fs.copyFileSync(fileToCopy, fileToPaste);
	});
}


function merge_out(repo, target, res)
{
	checkin.checkin(repo, target, res, false);
	console.log('Ran not full checkin.');

	compareManifest(repo, target);

	//read from repo
	
	//compare all files in current manifests (target manifest, and repo manifest).
	
	//if they are the same, that means its a straight upgrade
	
	//copy files from target to repo.
	
	//If there are files that exist only on repo, download those.

	//If both files have updates since, then we need to do grandma thing

	fs.unlinkSync(path.join(target, '.merge-1.rc'));

}

module.exports = { merge_out } ;