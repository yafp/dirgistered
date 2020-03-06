// 'use strict'

// ----------------------------------------------------------------------------
// IMPORT MODULES
// ----------------------------------------------------------------------------
require('v8-compile-cache')

// ----------------------------------------------------------------------------
// IMPORT DIRGISTERED MODULES
// ----------------------------------------------------------------------------
const utils = require('./js/modules/utils.js')

// ----------------------------------------------------------------------------
// VARIABLES
// ----------------------------------------------------------------------------
var currentOutputPath = ''

// ----------------------------------------------------------------------------
// FUNCTIONS
// ----------------------------------------------------------------------------

/**
* @function titlebarInit
* @summary Init the titlebar for the frameless mainWindow
* @description Creates a custom titlebar for the mainWindow using custom-electron-titlebar (https://github.com/AlexTorresSk/custom-electron-titlebar).
* @memberof renderer
*/
function titlebarInit () {
    const customTitlebar = require('custom-electron-titlebar')

    const myTitlebar = new customTitlebar.Titlebar({
        titleHorizontalAlignment: 'center', // position of window title
        icon: 'img/icon/icon.png',
        drag: true, // whether or not you can drag the window by holding the click on the title bar.
        backgroundColor: customTitlebar.Color.fromHex('#3d3b3b'), // #171717
        minimizable: true,
        maximizable: true,
        closeable: true,
        itemBackgroundColor: customTitlebar.Color.fromHex('#525252') // hover color
    })

    // Be aware: the font-size of .window-title (aka application name) is set by app/css/core.css
    utils.writeConsoleMsg('info', 'titlebarInit ::: Initialized custom titlebar')
}

/**
* @function uiSelectSource
* @summary selects a source folder
* @description selects a source folder
* @memberof renderer
*/
function uiSelectSource () {
    const options = { properties: ['openDirectory'] }
    const { dialog } = require('electron').remote

    utils.writeConsoleMsg('info', 'uiSelectSource ::: User wants to set a source directory. Now opening dialog to select a new source dir')
    dialog.showOpenDialog(options).then(res => {
        //utils.writeConsoleMsg('warn', '_' + res.filePaths + '_')

        if (res.filePaths.length === 0) {
            utils.writeConsoleMsg('warn', 'uiSelectSource ::: User aborted selecting a source dir')
            utils.showNoty('info', 'No changes applied.')
        } else {
            var newDownloadDirectory = res.filePaths.toString()
            updateUILog('Set source dir to: ' + newDownloadDirectory)
            $('#showSelectedSourceFolderPath').val(newDownloadDirectory) // show it in the UI
            utils.writeConsoleMsg('info', 'uiSelectSource ::: User selected the following source dir: _' + newDownloadDirectory + '_.')
            validateSourceAndTarget()
        }
    })
}

/**
* @function uiSelectTarget
* @summary selects a target folder
* @description selects a target folder
* @memberof renderer
*/
function uiSelectTarget () {
    const options = { properties: ['openDirectory'] }
    const { dialog } = require('electron').remote

    utils.writeConsoleMsg('info', 'uiSelectTarget ::: User wants to set a source directory. Now opening dialog to select a new target dir')
    dialog.showOpenDialog(options).then(res => {
        //utils.writeConsoleMsg('warn', '_' + res.filePaths + '_')

        if (res.filePaths.length === 0) {
            utils.writeConsoleMsg('warn', 'uiSelectTarget ::: User aborted selecting a target dir')
            utils.showNoty('info', 'No changes applied.')
        } else {
            var newDownloadDirectory = res.filePaths.toString()
            updateUILog('Set target dir to: ' + newDownloadDirectory)
            $('#showSelectedTargetFolderPath').val(newDownloadDirectory) // show it in the UI
            utils.writeConsoleMsg('info', 'uiSelectTarget ::: User selected the following target dir: _' + newDownloadDirectory + '_.')
            validateSourceAndTarget()
        }
    })
}

/**
* @function updateUILog
* @summary updates the UI log
* @description updates the UI log
* @memberof renderer
*/
function updateUILog (logText) {
    var timestamp = utils.generateTimestamp()
    $('#ta_log').val($('#ta_log').val() + timestamp + ' | ' + logText + '\n')
    logScrollToEnd()
}

/**
* @function resetMainUI
* @summary Resets the UI of the Main tab back to defaults
* @description Resets the UI of the Main tab back to defaults
* @memberof renderer
*/
function resetMainUI () {
    $('#showSelectedSourceFolderPath').val('') // source
    $('#showSelectedTargetFolderPath').val('') // target
    $('#ta_log').val('') // log

    $('#button_startIndexing').prop('disabled', true) // disable the start button
    $('#button_openIndex').prop('disabled', true) // disable the showIndex button

    utils.writeConsoleMsg('info', 'resetMainUI ::: Finished resetting the main UI.')
    utils.showNoty('success', 'Finished resetting the UI')
}

/**
* @function openIndex
* @summary Opens the target folder
* @description Opens the generated target folnder in the default file explorer
* @memberof renderer
*/
function openIndex () {
    const { shell } = require('electron') // deconstructing assignment
    utils.writeConsoleMsg('info', 'openIndex ::: Should open: _' + currentOutputPath + '_ in the default file explorer')
    shell.openItem(currentOutputPath)
}

/**
* @function createSingleHTMLIndex
* @summary Creates an html index for a given source dir in a given target dir
* @description Creates an html index for a given source dir in a given target dir. Launches itself for all sub-directories
* @param {string} - sourceFolderPath - The actual source directory path
* @param {string} - targetFolderPath - The actual target directory path
* @param {string} - targetFolderPath - The actual target directory path
* @memberof renderer
*/
function createSingleHTMLIndex (sourceFolderPath, targetFolderPath, initialRun = false) {
    var fs = require('fs')
    var path = require('path')
    var process = require('process')

    utils.writeConsoleMsg('info', 'createSingleHTMLIndex ::: Starting to create a single index')
    utils.writeConsoleMsg('info', 'createSingleHTMLIndex ::: Current source path: ' + sourceFolderPath)
    utils.writeConsoleMsg('info', 'createSingleHTMLIndex ::: Current target path: ' + targetFolderPath)

    // remember main target on initial run
    if (initialRun === true) {
        currentOutputPath = targetFolderPath
    }

    utils.createFolder(targetFolderPath) // create target folder if it doesnt exists yet

    var moveFrom = sourceFolderPath
    var moveTo = targetFolderPath

    // arrays for folder
    var dirNameArray = []
    var dirFullPathArray = []

    // arrays for files
    var fileNameArray = []
    var fileFullPathArray = []

    var i // used for loops

    // sync (async might be much better ... should check that)
    var filenames = fs.readdirSync(moveFrom)
    for (i = 0; i < filenames.length; i++) {
        var stats = fs.statSync(path.join(moveFrom, filenames[i]))
        var fromPath = path.join(moveFrom, filenames[i])

        // Store all directory informations in arrays
        //
        if (stats.isDirectory()) {
            dirFullPathArray.push(fromPath) // store entire path

            // store folder name itself
            var folderName = path.basename(fromPath)
            dirNameArray.push(folderName)

            utils.writeConsoleMsg('info', 'createSingleHTMLIndex ::: Found a subdir: ' + folderName)
        }

        // Store all file informations in arrays
        //
        if (stats.isFile()) {
            fileFullPathArray.push(fromPath) // store entire path

            // store file name itself
            var curFileName = path.basename(fromPath)
            fileNameArray.push(curFileName)
        }
    }

    // generate index.html in target dir
    var fileName = path.join(targetFolderPath, 'index.html')

    utils.writeConsoleMsg('info', 'createSingleHTMLIndex ::: Current output file is: _' + fileName + '_.')

    // html content
    var content = ''
    content += '<html>\n'
    content += '<head>\n'
    content += '<title>dirgistered</title>\n'
    content += '<script src="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.12.1/js/all.min.js" integrity="sha256-MAgcygDRahs+F/Nk5Vz387whB4kSK9NXlDN3w58LLq0=" crossorigin="anonymous"></script>\n'
    content += '<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css" integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" crossorigin="anonymous">\n'
    content += '</head>\n'
    content += '<body>\n'
    content += '<div class="container-fluid">\n'
    content += '<nav class="navbar navbar-light bg-light">\n'
    content += '<span class="navbar-brand mb-0 h1">Source: <span class="badge badge-secondary">' + sourceFolderPath + '</span> <small> generated using <a href="https://github.com/yafp/dirgistered">dirgistered</a></small></span>\n'
    content += '</nav>\n'

    // add a back button if needed
    if (initialRun === false) {
        content = content + '<a class="btn btn-sm btn-outline-secondary" href="../index.html"><i class="fas fa-backward" aria-hidden="true"></i> Back</a><br>'
        // content = content + '<button type="button" class="btn btn-sm btn-outline-secondary"><i class="fas fa-folder-open" aria-hidden="true"></i> BACK</button>'
    }

    fs.writeFile(fileName, content, function (err) {
        if (err) {
            utils.writeConsoleMsg('error', 'createSingleHTMLIndex ::: An error ocurred creating the file _' + err.message + '_')
        }

        utils.writeConsoleMsg('info', 'createSingleHTMLIndex ::: Created single index for: ' + sourceFolderPath + '.')
    })

    utils.writeConsoleMsg('info', 'createSingleHTMLIndex ::: Finished reading directory')

    // Section: Folders
    //
    if (dirNameArray.length > 0) {
        // build text
        var bodyFolderText = '<br><h5><i class="fas fa-folder"></i> Folders (' + dirNameArray.length + ')</h5><hr>'
        for (i = 0; i < dirNameArray.length; i++) {
            bodyFolderText += '<a href="' + dirNameArray[i] + '/index.html">' + dirNameArray[i] + '</a><br>'
        }

        // append text to index file
        fs.appendFile(fileName, bodyFolderText, function (err) {
            if (err) {
                utils.writeConsoleMsg('error', 'createSingleHTMLIndex ::: Failed to append the folder section to the .html file.')
            }
        })
    }

    // Section: Files
    //
    if (fileNameArray.length > 0) {
        // build text
        var bodyFilesText = '<br><h5><i class="fas fa-file"></i> Files (' + fileNameArray.length + ')</h5><hr>'
        for (i = 0; i < fileNameArray.length; i++) {
            var extension = fileNameArray[i].split('.').pop()
            var iconCode = utils.getFontAwesomeFileIcon(extension)
            bodyFilesText += iconCode + ' ' + fileNameArray[i] + '<br>'
        }

        // append text to index file
        fs.appendFile(fileName, bodyFilesText, function (err) {
            if (err) {
                utils.writeConsoleMsg('error', 'createSingleHTMLIndex ::: Failed to append the files section to the .html file.')
            }
        })
    }

    // Section Footer
    //
    var indexFooter = '<br><br>'
    // append text to index file
    fs.appendFile(fileName, indexFooter, function (err) {
        if (err) {
            utils.writeConsoleMsg('error', 'createSingleHTMLIndex ::: Failed to append the footer section to the .html file.')
        }
    })

    utils.writeConsoleMsg('info', 'createSingleHTMLIndex ::: Finished index creation for _' + sourceFolderPath + '_. checking sub-dirs now.')
    updateUILog('Finished indexing directory: "' + sourceFolderPath + '"') // update UI

    // start indexing for each subdir
    for (var j = 0; j < dirFullPathArray.length; j++) {
        createSingleHTMLIndex(dirFullPathArray[j], targetFolderPath + '/' + dirNameArray[j], false) // FIXME
    }
}

/**
* @function startIndexing
* @summary Starts the indexing process
* @description Starts the indexing process
* @memberof renderer
*/
function startIndexing () {
    var fs = require('fs')
    var path = require('path')

    utils.writeConsoleMsg('info', 'startIndexing ::: Starting')

    loadingAnimationShow() // start spinner

    $('#button_startIndexing').prop('disabled', true) // disable the start button

    // get source
    var sourceFolderPath = $('#showSelectedSourceFolderPath').val()
    utils.writeConsoleMsg('info', 'startIndexing ::: Source is set to: ' + sourceFolderPath)

    // get target
    var targetFolderPath = $('#showSelectedTargetFolderPath').val()
    utils.writeConsoleMsg('info', 'startIndexing ::: Target is set to:' + targetFolderPath)

    // make new date based folder in target
    var timestamp = utils.generateTimestamp('YYYYMMDD-HHmmss')
    targetFolderPath = path.join(targetFolderPath, timestamp + '---dirgistered-Index')

    if (utils.createFolder(targetFolderPath)) {
        updateUILog('Created date-based target folder: "' + targetFolderPath + '"')
        updateUILog('Starting indexing process ...')
        createSingleHTMLIndex(sourceFolderPath, targetFolderPath, true) // Start html generation madness
    }

    var finalMessage = 'Finished entire index process'

    utils.writeConsoleMsg('info', finalMessage)
    utils.showNoty('success', finalMessage)
    updateUILog(finalMessage) // update UI log
    loadingAnimationHide() // hide spinner

    $('#button_openIndex').prop('disabled', false) // enable the showIndex button
}

/**
* @function validateSourceAndTarget
* @summary Checks if both source and target folder are set and enables the startIndex button
* @description Is executed when either the source or target folder is configured
* @memberof renderer
*/
function validateSourceAndTarget () {
    utils.writeConsoleMsg('info', 'validateSourceAndTarget ::: Trying to validate the source and target situation')

    var misconfigurationDetected = false

    var sourceFolderPath = $('#showSelectedSourceFolderPath').val()
    utils.writeConsoleMsg('info', 'validateSourceAndTarget ::: Source is set to: ' + sourceFolderPath)

    var targetFolderPath = $('#showSelectedTargetFolderPath').val()
    utils.writeConsoleMsg('info', 'validateSourceAndTarget ::: Target is set to: ' + targetFolderPath)

    // condition 1: are same -> abort
    if (sourceFolderPath === targetFolderPath) {
        misconfigurationDetected = true
    }

    // condition 2: at least 1 is empty
    if ((sourceFolderPath === '') || (targetFolderPath === '')) {
        misconfigurationDetected = true
    }

    if (misconfigurationDetected === true) {
        $('#button_startIndexing').prop('disabled', true) // disable the start button
    } else {
        $('#button_startIndexing').prop('disabled', false) // enable the start button
    }
}

/**
* @function logScrollToEnd
* @summary Scrolls the UI log to the end
* @description Scrolls the UI log to the end / latest entry
*/
function logScrollToEnd () {
    $('#ta_log').scrollTop($('#ta_log')[0].scrollHeight) // scroll log textarea to the end
}

/**
* @function startIntro
* @summary start an intro / user tutorial
* @description Starts a short intro / tutorial which explains the user-interface. Using introJs
*/
function startIntro () {
    utils.writeConsoleMsg('info', 'startIntro ::: Starting the dirgistered intro')
    const introJs = require('intro.js')
    introJs().start()
}

/**
* @function searchUpdate
* @summary Checks if there is a new media-dupes release available
* @description Compares the local app version number with the tag of the latest github release. Displays a notification in the settings window if an update is available. Is executed on app launch NOT on reload.
* @memberof renderer
* @param {booean} [silent] - Boolean with default value. Shows a feedback in case of no available updates If 'silent' = false. Special handling for manually triggered update search
*/
function searchUpdate (silent = true) {
    loadingAnimationShow()

    // check if pre-releases should be included or not
    // var curEnablePrereleasesSetting = utils.globalObjectGet('enablePrereleases')
    var curEnablePrereleasesSetting = false

    // get url for github releases / api
    const { urlGithubApiReleases } = require('./js/modules/githubUrls.js') // get API url

    var remoteAppVersionLatest = '0.0.0'
    var remoteAppVersionLatestPrerelease = false
    var localAppVersion = '0.0.0'
    var versions

    // get local version
    //
    localAppVersion = require('electron').remote.app.getVersion()

    var updateStatus = $.get(urlGithubApiReleases, function (data, status) {
        // 3000 // in milliseconds

        utils.writeConsoleMsg('info', 'searchUpdate ::: Accessing _' + urlGithubApiReleases + '_ ended with: _' + status + '_')

        // success
        versions = data.sort(function (v1, v2) {
            // return semver.compare(v2.tag_name, v1.tag_name);
            // console.error(v1.tag_name)
            // console.error(v2.tag_name)
        })

        if (curEnablePrereleasesSetting === true) {
            // user wants the latest release - ignoring if it is a prerelease or an official one
            utils.writeConsoleMsg('info', 'searchUpdate ::: Including pre-releases in update search')
            remoteAppVersionLatest = versions[0].tag_name // Example: 0.4.2
            remoteAppVersionLatestPrerelease = versions[0].prerelease // boolean
        } else {
            // user wants official releases only
            utils.writeConsoleMsg('info', 'searchUpdate ::: Ignoring pre-releases in update search')
            // find the latest non pre-release build
            // loop over the versions array to find the latest non-pre-release
            var latestOfficialRelease
            for (var i = 0; i < versions.length; i++) {
                if (versions[i].prerelease === false) {
                    latestOfficialRelease = i
                    break
                }
            }

            remoteAppVersionLatest = versions[i].tag_name // Example: 0.4.2
            remoteAppVersionLatestPrerelease = versions[i].prerelease // boolean
        }

        // simulate different  update scenarios:
        //
        // localAppVersion = '0.0.1'; //  overwrite variable to simulate
        // remoteAppVersionLatest = 'v0.6.0' //  overwrite variable to simulate

        // strip the v away
        // - up to 0.5.0 the tag used on github did not start with v.
        // - comapring versions without leading chars is much easier.
        localAppVersion = localAppVersion.replace('v', '')
        remoteAppVersionLatest = remoteAppVersionLatest.replace('v', '')

        utils.writeConsoleMsg('info', 'searchUpdate ::: Local dirgistered version: ' + localAppVersion)
        utils.writeConsoleMsg('info', 'searchUpdate ::: Latest mdirgistered version: ' + remoteAppVersionLatest)

        // If a stable (not a prelease) update is available - see #73
        if (localAppVersion < remoteAppVersionLatest) {
            utils.writeConsoleMsg('info', 'searchUpdate ::: Found update, notify user')

            // prepare the message for the user - depending on the fact if it is a pre-release or not
            var updateText
            if (remoteAppVersionLatestPrerelease === false) {
                updateText = 'A dirgistered update from <b>' + localAppVersion + '</b> to version <b>' + remoteAppVersionLatest + '</b> is available. Do you want to visit the release page?'
            } else {
                updateText = 'A dirgistered <b>pre-release</b> update from <b>' + localAppVersion + '</b> to version <b>' + remoteAppVersionLatest + '</b> is available. Do you want to visit the release page?'
            }

            // ask user using a noty confirm dialog
            const Noty = require('noty')
            var n = new Noty(
                {
                    theme: 'bootstrap-v4',
                    layout: 'bottom',
                    type: 'info',
                    closeWith: [''], // to prevent closing the confirm-dialog by clicking something other then a confirm-dialog-button
                    text: updateText,
                    buttons: [
                        Noty.button('Yes', 'btn btn-success mediaDupes_btnDefaultWidth', function () {
                            n.close()
                            openReleasesOverview()
                        },
                        {
                            id: 'button1', 'data-status': 'ok'
                        }),

                        Noty.button('No', 'btn btn-secondary mediaDupes_btnDefaultWidth float-right', function () {
                            n.close()
                        })
                    ]
                })

            // show the noty dialog
            n.show()
        } else {
            utils.writeConsoleMsg('info', 'searchUpdate ::: No newer version of dirgistered found.')

            // when executed manually via menu -> user should see result of this search
            if (silent === false) {
                utils.showNoty('info', 'No updates for <b>dirgistered (' + localAppVersion + ')</b> available.')
            }
        }

        utils.writeConsoleMsg('info', 'searchUpdate ::: Successfully checked ' + urlGithubApiReleases + ' for available releases')
    })
        .done(function () {
        // utils.writeConsoleMsg('info', 'searchUpdate ::: Successfully checked ' + urlGithubApiReleases + ' for available releases');
        })

        .fail(function () {
            utils.writeConsoleMsg('info', 'searchUpdate ::: Checking ' + urlGithubApiReleases + ' for available releases failed.')
            utils.showNoty('error', 'Checking <b>' + urlGithubApiReleases + '</b> for available media-dupes releases failed. Please troubleshoot your network connection.', 0)
        })

        .always(function () {
            utils.writeConsoleMsg('info', 'searchUpdate ::: Finished checking ' + urlGithubApiReleases + ' for available releases')
            loadingAnimationHide()
        })
}

/**
* @function openReleasesOverview
* @summary Opens the media-dupes release page
* @description Opens the url https://github.com/yafp/media-dupes/releases in the default browser. Used in searchUpdate().
* @memberof renderer
*/
function openReleasesOverview () {
    const { urlGitHubReleases } = require('./js/modules/githubUrls.js')
    utils.writeConsoleMsg('info', 'openReleasesOverview ::: Opening _' + urlGitHubReleases + '_ to show available releases.')
    utils.openURL(urlGitHubReleases)
}

/**
* @function loadingAnimationShow
* @summary Shows the loading animation / download spinner
* @description Shows the loading animation / download spinner. applicationStateSet() is using this function
*/
function loadingAnimationShow () {
    // if ( $('#md_spinner').attr( "hidden" )) { // only if it isnt already displayed
    if ($('#div').data('hidden', true)) { // only if it isnt already displayed
        utils.writeConsoleMsg('info', 'loadingAnimationShow ::: Show spinner')
        $('#md_spinner').attr('hidden', false)
    }
}

/**
* @function loadingAnimationHide
* @summary Hides the loading animation / download spinner
* @description Hides the loading animation / download spinner. applicationStateSet() is using this function
*/
function loadingAnimationHide () {
    if ($('#div').data('hidden', false)) { // only if it isnt already hidden
        utils.writeConsoleMsg('info', 'loadingAnimationHide ::: Hide spinner')
        $('#md_spinner').attr('hidden', true)
    }
}

// ----------------------------------------------------------------------------
// IPC
// ----------------------------------------------------------------------------

// ----------------------------------------------------------------------------
// IPC - on ready-to-show
// ----------------------------------------------------------------------------

/**
* @name startSearchUpdatesSilent
* @summary Triggers the check for media-dupes updates in silent mode
* @description Called via ipc from main.js on-ready to start the search for media-dupes updates
* @memberof renderer
*/

require('electron').ipcRenderer.on('startSearchUpdatesSilent', function () {
    searchUpdate(true) // If silent = false -> Forces result feedback, even if no update is available
})

/**
* @name startSearchUpdatesVerbose
* @summary Start searching for updates in non-silent mode
* @description Called via ipc from main.js / menu to search for applicatipn updates
* @memberof renderer
*/
require('electron').ipcRenderer.on('startSearchUpdatesVerbose', function () {
    searchUpdate(false) // silent = false. Forces result feedback, even if no update is available
})
