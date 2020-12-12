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

const path = require('path');	//Include path
var fs = require('fs');			//Include filesystem

function getWebpageData(extraData)
{
	return fs.readFileSync(path.join(__dirname, '..', 'index_top.html'), 
			  {encoding:'utf8', flag:'r'}) + extraData +
			  fs.readFileSync(path.join(__dirname, '..', 'index_bot.html'), 
              {encoding:'utf8', flag:'r'}); 
}

module.exports = {getWebpageData};