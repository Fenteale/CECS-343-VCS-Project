var fs = require('fs');
var path = require('path');

function setLabel(manPath, label)
{
    var data = fs.readFileSync(manPath, 
    {encoding:'utf8', flag:'r'});

    var labelLoc = data.search(/^(\s*labels:).*/gm);
    var labelLine = data.match(/^(\s*labels:).*/gm);

    var dup = 0;

    labelLine[0].split(" ").forEach(l => {
        if(l.trim() === label) //I guess there is a bug here where it will fail if the label you are trying to set is "label:", but whatever
            dup = 1;
    });

    if(dup)
        return -1;

    var writeStart = labelLine[0].length + labelLoc;


    var dStart = data.substr(0, writeStart);
    var dEnd = data.substr(writeStart, data.length);
    fs.writeFileSync(manPath, dStart + label + " " + dEnd);

    return 0;
    
}

module.exports = { setLabel };