//###########################################################
//
// app.js
//
// Author:
// contact:
//
// Description: Main entry point for our application.  It sets
// up the Express instance and handle requests for commands.
//
//###########################################################

// Import and initialize all variables that we need.
const path = require('path');	//Include path
var fs = require('fs');			//Include filesystem

//Include our functions in the js folder
var getFs = require('./getfiles.js');
var artID = require('./artID.js');
var manifest = require('./manifest.js');
var pn = require('./projName.js');
var checkin = require('./checkin.js');


function compareFile(fileToCheck, manifestArray) //checks to see if fileToCheck is in manifest array, if yes, returns code
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

	manifestArray.forEach(i => { //for each artid entry in the manifest
		if(returnCode==1) {
			var itemParts = i.split(" @ ");
			var itemPathToCheck = path.join(itemParts[1], itemParts[2]);
			if(filePathToCheck == itemPathToCheck){ //if the file with path matches the file with path of the one in the manifest
				var aisI = itemParts[0].split('-');
				if(aisT[0] == aisI[0]) //if checksum is the same
					returnCode = 3; //return with code 3
				else
					returnCode = 4; //if checksum not the same, merge conflict, return 4
			}
		}
	});

	return returnCode;
}

function getOrigArtId(fileToCheck, manifestArray) //return the original artid based on a filename and relative path
{
	var ai;

	var fileToCheckParts = fileToCheck.split(" @ ");
	var filePathToCheck = path.join(fileToCheckParts[1], fileToCheckParts[2]);

	manifestArray.forEach(i => { //for each entry in the manifest array
		if(ai==null) {
			var itemParts = i.split(" @ ");
			var itemPathToCheck = path.join(itemParts[1], itemParts[2]); //get the file and relative path
			if(filePathToCheck == itemPathToCheck){ 
				ai = itemParts[0]; //if they are the same, return the artid from the manifest array associated with it.
			}
		}
	});

	return ai;
}

function getGrandma(fileName, repo, target) { //returns the art id in the repo of the file that has a merge conflict
	var rc_code = 1;
	while(fs.existsSync(path.join(target, '.man-' + String(rc_code) + '.rc'))) //gets last checkout manifest
	{
		rc_code += 1; //changes int assigned to file name based off number of files created
	}
	rc_code --;

	var targetMan = fs.readFileSync(path.join(target, '.man-' + String(rc_code) + '.rc'), {encoding:'utf8', flag:'r'}); //opens latest checkout manifest
	var repoTargetName = targetMan.match(/^(checkout.*)\.man-\d\.rc/gm); //gets the line that has the previously used command
	var repoFN = repoTargetName[0].split(' ')[3];

	var RepoData = fs.readFileSync(path.join(repo, repoFN), {encoding:'utf8', flag:'r'}); //opens manifest that was used to checkout
	var RepoLines = RepoData.match(/.* @ .* @ .*/gm);

	console.log('getOrigArtId(' + fileName + ', ' + RepoLines);
	return getOrigArtId(fileName, RepoLines); //return the associated artid from the original manifest

}

function compareManifest(repo, target) //compares the files from the target folder to the latest repo manifest
{
	var pathOfManTarget = path.join(target, '.merge-1.rc');
	console.log(pathOfManTarget);
	var Targetdata = fs.readFileSync(pathOfManTarget, {encoding:'utf8', flag:'r'}); //first we read the manifest of the current files in target folder
	var TargetfileLines = Targetdata.match(/.* @ .* @ .*/gm); //get array of artid entries

	var rc_code = 1;
	while(fs.existsSync(path.join(repo, '.man-' + String(rc_code) + '.rc'))) //get latest manifest from repo
	{
		rc_code += 1; //changes int assigned to file name based off number of files created
	}
	rc_code --;

	var pathOfManRepo = path.join(repo, '.man-' + rc_code + '.rc');

	var Repodata = fs.readFileSync(pathOfManRepo, {encoding:'utf8', flag:'r'}); //load latest manifest from repo
	var RepofileLines = Repodata.match(/.* @ .* @ .*/gm);

	var index=0;
	var extraTargetFiles = [];
	TargetfileLines.forEach(f => { // For each file in the target manifest, check against repo manifest

		var retCode = compareFile(f, RepofileLines); //compare the file against the repo manifest
		switch(retCode) {
			case 1: //case 1: it exists in target but doesnt exist in repo
				extraTargetFiles.push(f);
				break; //case 2 is not checked here
			case 3: //case 3: file exists in repo already, but is identical
				console.log('File already exists in repo: ' + f);
				//File exists in repo and is identical
				//Do nothing
				break;
			case 4: //case 4: file exists in repo, but is different, and need to resolve merge conflict
				console.log('File exists in repo, but is different! ' + f);
				//File exists in the repo and is different!
				var fileParts = f.split(" @ ");
				//next two commands renames conflicting file in target folder to end with '_MT'
				fs.copyFileSync(path.join(target, fileParts[1], fileParts[2]),
					path.join(target, fileParts[1], path.basename(fileParts[2], path.extname(fileParts[2])) + '_MT' + path.extname(fileParts[2])));
				fs.unlinkSync(path.join(target, fileParts[1], fileParts[2]));


				var ArtifactPath = path.join(repo, getOrigArtId(f, RepofileLines)); //gets original artifact file name from repo of file in question
				console.log('Artpath: ' + ArtifactPath); 
				//copy file from repo, rename it to the original file name + '_MR'
				fs.copyFileSync(ArtifactPath, path.join(target, fileParts[1], path.basename(fileParts[2], path.extname(fileParts[2])) + '_MR' + path.extname(fileParts[2])));
				//call getGrandma and get artifact file name of the grandma file
				var GrandmaArtID = path.join(repo, getGrandma(f, repo, target));
				console.log('Grandma Artpath: ' + GrandmaArtID);
				//copy grandma file from repo, paste it into target with ending '_MG'
				fs.copyFileSync(GrandmaArtID, path.join(target, fileParts[1], path.basename(fileParts[2], path.extname(fileParts[2])) + '_MG' + path.extname(fileParts[2])));
				break;
		}
		index += 1;
	});

	//This next block checks for case 2, where if it only exists in the repo, then bring it ready to checkin to the target
	var extraRepoFiles = [];
	RepofileLines.forEach(f => { // For each file in the repo manifest, check against target
		if(compareFile(f, TargetfileLines) == 1)
			extraRepoFiles.push(f);
	});
	

	extraRepoFiles.forEach(l => {  //copied a lot from checkout, copies files found only in repo to target folder
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


function merge_out(repo, target, res) //merge out function
{
	checkin.checkin(repo, target, res, false); //run checkin function, but dont copy files, just make manifest
	console.log('Ran not full checkin.');

	compareManifest(repo, target); //compare the newly created manifest to the repo one

	fs.unlinkSync(path.join(target, '.merge-1.rc')); //delete the temporary merge manifest we created above, to get ready to merge in

}

module.exports = { merge_out } ;