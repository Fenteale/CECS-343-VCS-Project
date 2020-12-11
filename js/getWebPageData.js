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