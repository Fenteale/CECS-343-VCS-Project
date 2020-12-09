// Import and initialize all variables that we need.
const path = require('path');	//Include path
var fs = require('fs');			//Include filesystem

//Include our functions in the js folder
var getFs = require('./getfiles.js');
var artID = require('./artID.js');
var manifest = require('./manifest.js');
var pn = require('./projName.js');


function merge_out(repo, target, res)
{
	//read from repo
	
	//compare all files in current manifests (target manifest, and repo manifest).
	
	//if they are the same, that means its a straight upgrade
	
	//copy files from target to repo.
	
	//If there are files that exist only on repo, download those.

	//If both files have updates since, then we need to do grandma thing
}

module.exports = { merge_out } ;