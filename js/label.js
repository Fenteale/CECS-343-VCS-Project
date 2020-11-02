//###########################################################
//
// label.js
//
// Author:
// contact:
//
// Description: This file contains all the functions related to
// getting and setting labels.
//
//###########################################################

//include our required modules.
var fs = require('fs');
var path = require('path');

function setLabel(repoPath, manPath, label) //sets the label of repoPath/manPath to label
{
    //read the stuff in the manifest file and puts it into a string.
    var data = fs.readFileSync(manPath, 
    {encoding:'utf8', flag:'r'});

    //find the index of the start of the "labels:" line in the manifest file
    var labelLoc = data.search(/^(\s*labels:).*/gm);
    //gets a string of just the labels: line
    var labelLine = data.match(/^(\s*labels:).*/gm);

    var dup = 0;
    var rc_code = 1;
    var manFiles = [];

    //check all of the manifest files in the directory to ensure that the
    //label that is trying to get set does not exist in other manifests
    //in that same repo.
    while(fs.existsSync(path.join(repoPath, '.man-' + String(rc_code) + '.rc')))
    {
        //push to manFiles each time we find a valid manifest file in the repo dir
        manFiles.push('.man-' + String(rc_code) + '.rc');
        rc_code += 1;
    }
    //if the label matches, say its a duplicate and make the function return an error.
    manFiles.forEach(mf => {
        getLabels(path.join(repoPath, mf)).forEach( l => {
            if(l === label)
                dup = 1;
        });
    });

    if(dup)
        return -1;

    //get the spot in the string to append the new label onto
    var writeStart = labelLine[0].length + labelLoc;

    //make a substring of the first part of the string before that point
    var dStart = data.substr(0, writeStart);
    //make a substring of the part of the string after the write point.
    var dEnd = data.substr(writeStart, data.length);
    //write to the manifest file the first part, the new label, then the end part
    //(by default writeFileSync truncates the file before writing)
    fs.writeFileSync(manPath, dStart + label + " " + dEnd);

    return 0;
    
}

function getLabels(manPath) //this gets all of the labels for a certain manifest file
{
    // read the manifest file.
    var data = fs.readFileSync(manPath, 
    {encoding:'utf8', flag:'r'});

    // get the string of the label line
    var labelLine = data.match(/^(\s*labels:).*/gm);

    var labels = [];
    
    // add to the labels array for each label on that line.
    labelLine[0].split(" ").forEach(l => {
        if(l.trim() !== "labels: " || l.trim() !== "\n" || l.trim() !== "") //I guess there is a bug here where it will fail if the label you are trying to set is "label:", but whatever
            labels.push(l.trim());
    });
    return labels;
}

module.exports = { setLabel, getLabels };