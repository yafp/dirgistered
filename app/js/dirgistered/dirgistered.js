/**
* @name showNoty
* @summary Shows a noty notification
* @description Creates a notification using the noty framework
* @param type - Options: alert, success, warning, error, info/information
* @param message - notification text
* @param timeout - Timevalue, defines how long the message should be displayed. Use 0 for no-timeout
*/
function showNoty(type, message, timeout = 3000)
{
    const Noty = require("noty");
    new Noty({
        type: type,
        timeout: timeout,
        theme: "bootstrap-v4",
        layout: "bottom",
        text: message,
    }).show();
}



// ################################################################
//
// ################################################################
function addZero(i)
{
    if (i < 10)
    {
        i = "0" + i;
    }
    return i;
}



// ################################################################
// Generate and return a timestamp (ymd-hms)
// ################################################################
function getActualFullDate()
{
    var d = new Date();
    var day = addZero(d.getDate());
    var month = addZero(d.getMonth()+1);
    var year = addZero(d.getFullYear());
    var h = addZero(d.getHours());
    var m = addZero(d.getMinutes());
    var s = addZero(d.getSeconds());
    //return day + ". " + month + ". " + year + " (" + h + ":" + m + ")";
    return year + month + day + "-" + h + m + s;
}



// ################################################################
// Add a new line to the log on the Main tab
// ################################################################
function updateUILog(logText)
{
    var timestamp = getActualFullDate();

    $('#ta_log').val($('#ta_log').val() + timestamp + ' '+logText+'\n');
}


// ################################################################
//
// ################################################################
function updateSourceUI()
{
    var sourceFolderPath = document.getElementById("sourceSelection").files[0].path;
    var sourceFolderName = document.getElementById("sourceSelection").files[0].name;

    // update UI
    $("#showSelectedSourceFolderPath").val(sourceFolderPath);

    // update UI log
    updateUILog('Source folder set to "'+sourceFolderPath+'"')

    // update console log
    console.log("Source: " +sourceFolderPath);
}

// ################################################################
//
// ################################################################
function updateTargetUI()
{
    var targetFolderPath = document.getElementById("targetSelection").files[0].path;
    var targetFolderName = document.getElementById("targetSelection").files[0].name;

    // update UI
    $("#showSelectedTargetFolderPath").val(targetFolderPath);

    // update UI log
    updateUILog('Target folder set to "'+targetFolderPath+'"')

    // update console log
    console.log("Target: " +targetFolderPath);
}


// ################################################################
// Resets the UI of the Main tab back to defaults
// ################################################################
function resetMainUI()
{
    // source & target
    $("#showSelectedSourceFolderPath").val("");
    $("#showSelectedTargetFolderPath").val("");

    // log
    $("#ta_log").val("");

    // update console log
    console.log("Finished Reset of Main UI");
}



// ################################################################
//
// ################################################################
function createSingleHTMLIndex(sourceFolderPath, timestampedTargetFolderPath)
{
    var fs = require('fs');

    console.log("-----------SingleIndex Start ---------");
    console.log("Current source path: "+sourceFolderPath);
    console.log("Current target path: "+timestampedTargetFolderPath);

    // update UI
    updateUILog('Indexing: "'+sourceFolderPath+'"');

    // create target folder if it doesnt exists yet
    if (!fs.existsSync(timestampedTargetFolderPath)) {
        console.log("Created target directory ________");
        fs.mkdirSync(timestampedTargetFolderPath);
    }

    // generate index.html in target dir
    var fileName = timestampedTargetFolderPath+"/index.htm";

    console.log("+++++"+fileName);

    var content = "<html> \
    <h1>DirGisterED Index</h1> \
    <h3>Folder: "+sourceFolderPath+"</h3> \
    <hr> \
    </html>";

    fs.writeFile(fileName, content, function (err) {
        if(err){
            alert("An error ocurred creating the file "+ err.message)
        }

        console.log('Single index for "'+sourceFolderPath+ '"created.');

        // update UI
        updateUILog('Indexed: "'+sourceFolderPath+'"');
    });


    var fs = require( 'fs' );
    var path = require( 'path' );
    var process = require( "process" );

    var moveFrom = sourceFolderPath;
    var moveTo = timestampedTargetFolderPath;

    // folder
    var dirNameArray = [];
    var dirFullPathArray = [];

    // file
    var fileNameArray = [];
    var fileFullPathArray = [];

    // sync (async might be much better ... should check that)
    filenames = fs.readdirSync(moveFrom);
    for (i = 0; i < filenames.length; i ++) {

        stats = fs.statSync(moveFrom + "/" + filenames[i]);
        var fromPath = path.join( moveFrom, filenames[i] );


        // Store all directory informations in arrays
        //
        if(stats.isDirectory()) {
            // store entire path
            dirFullPathArray.push(fromPath);

            // store folder name itself
            var folderName = fromPath.substr(fromPath.lastIndexOf('/') + 1);
            //dirNameArray.push(folderName);
            dirNameArray[dirNameArray.length] = folderName;

            //console.log(dirNameArray.length);
        }


        // Store all file informations in arrays
        //
        if(stats.isFile())
        {
            // store entire path
            fileFullPathArray.push(fromPath);

            // store folder name itself
            var curFileName = fromPath.substr(fromPath.lastIndexOf('/') + 1);
            fileNameArray.push(curFileName);
        }
    }

    console.log("Finished reading directory");


    // building body text for folders
    //
    var bodyFolderText = "<h3>Folders</h3>";

    for (var i=0; i < dirNameArray.length; i++)
    {
        //console.log(dirNameArray[i]);
        bodyFolderText += '<a href='+dirNameArray[i]+'/index.htm>'+dirNameArray[i]+'</a><br>'
    }

    // append to index file
    fs.appendFile(fileName, bodyFolderText, function (err)
    {

    });


    // building body text for files
    //
    var bodyFilesText = "<h3>Files</h3>";

    for (var i=0; i < fileNameArray.length; i++)
    {
        bodyFilesText += fileNameArray[i]+'<br>'
    }

    // append to index file
    fs.appendFile(fileName, bodyFilesText, function (err)
    {

    });

    console.log("Finished index creation for ..."+sourceFolderPath);
    console.log("Should now check subdirs of "+sourceFolderPath);

    checkSubDirs(sourceFolderPath, timestampedTargetFolderPath);
}



// ################################################################
//
// ################################################################
function checkSubDirs(sourceFolderPath, timestampedTargetFolderPath)
{
    console.log("started function checkSubDirs()");

    var fs = require('fs');
    var path = require( 'path' );
    var process = require( "process" );

    filenames = fs.readdirSync(sourceFolderPath);
    for (i = 0; i < filenames.length; i ++) {

        stats = fs.statSync(sourceFolderPath + "/" + filenames[i]);
        var fromPath = path.join( sourceFolderPath, filenames[i] );

        var newTargetPath = timestampedTargetFolderPath+"/"+filenames[i];

        // Store all directory informations in arrays
        //
        if(stats.isDirectory()) {
            createSingleHTMLIndex(fromPath, newTargetPath);
        }
    }
}



// ################################################################
// Start the Index generation process
// ################################################################
function startIndexing()
{

    console.log("Started function startIndexing()");

    var fs = require('fs');

    // source
    //
    try {
        var sourceFolderPath = document.getElementById("sourceSelection").files[0].path;
        //var sourceFolderName = document.getElementById("sourceSelection").files[0].name;
        //console.log(sourceFolderName);
        //console.log(sourceFolderPath);

        // Check if folder exists
        if (fs.existsSync(sourceFolderPath)) {
            console.log("Source folder exists");
        }
        else {
            alert("Source folder does not exist, aborting");
            return;
        }
    }
    catch(err) {
        console.log("Unable to validate source");
        return;
    }



    // target
    //
    try
    {
        var targetFolderPath = document.getElementById("targetSelection").files[0].path;
        //var targetFolderName = document.getElementById("targetSelection").files[0].name;
        //console.log(targetFolderName);
        //console.log(targetFolderPath);

        // Check if folder exists
        if (fs.existsSync(targetFolderPath)) {
            console.log("Target folder exists");
        }
        else {
            alert("Target folder does not exist, aborting");
            return;
        }
    }
    catch(err)
    {
        console.log("Unable to validate target");
        return;
    }

    if(sourceFolderPath != targetFolderPath)
    {
        console.log("Everything looks fine - lets start");

        // make new date based folder in target
        var timestamp = getActualFullDate();
        var timestampedTargetFolderPath = targetFolderPath+'/'+timestamp+'---DirGisterED-Index'
        var fs = require('fs');
        fs.mkdir(timestampedTargetFolderPath);

        updateUILog('Generated target folder "'+timestampedTargetFolderPath+'"')


        // Start html generation madness
        createSingleHTMLIndex(sourceFolderPath, timestampedTargetFolderPath)

    }
    else
    {
        console.log ("Source and target can't be the same directory, aborting.")
        return;
    }

    console.log("Finished index process");

    alert("Finished Indexing");
}
