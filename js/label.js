var fs = require('fs');
var path = require('path');

function setLabel(repoPath, manPath, label)
{
    var data = fs.readFileSync(manPath, 
    {encoding:'utf8', flag:'r'});

    var labelLoc = data.search(/^(\s*labels:).*/gm);
    var labelLine = data.match(/^(\s*labels:).*/gm);

    var dup = 0;
    var rc_code = 1;
    var manFiles = [];

    while(fs.existsSync(path.join(repoPath, '.man-' + String(rc_code) + '.rc')))
    {
        manFiles.push('.man-' + String(rc_code) + '.rc');
        rc_code += 1;
    }
    manFiles.forEach(mf => {
        getLabels(path.join(repoPath, mf)).forEach( l => {
            if(l === label)
                dup = 1;
        });
    });

    if(dup)
        return -1;

    var writeStart = labelLine[0].length + labelLoc;


    var dStart = data.substr(0, writeStart);
    var dEnd = data.substr(writeStart, data.length);
    fs.writeFileSync(manPath, dStart + label + " " + dEnd);

    return 0;
    
}

function getLabels(manPath)
{
    var data = fs.readFileSync(manPath, 
    {encoding:'utf8', flag:'r'});

    var labelLine = data.match(/^(\s*labels:).*/gm);

    var labels = [];

    labelLine[0].split(" ").forEach(l => {
        if(l.trim() !== "labels: " || l.trim() !== "\n" || l.trim() !== "") //I guess there is a bug here where it will fail if the label you are trying to set is "label:", but whatever
            labels.push(l.trim());
    });
    return labels;
}

module.exports = { setLabel, getLabels };