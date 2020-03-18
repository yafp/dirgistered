/**
 * @file Contains all helper and utility functions
 * @author yafp
 * @module utils
 */
'use strict'

// ----------------------------------------------------------------------------
// REQUIRE MODULES
// ----------------------------------------------------------------------------
const sentry = require('./sentry.js') // sentry for error reporting

// ----------------------------------------------------------------------------
// FUNCTIONS
// ----------------------------------------------------------------------------

/**
* @function writeConsoleMsg
* @summary Writes console output for the renderer process
* @description Writes console output for the renderer process
* @param {string} type - String which defines the log type
* @param {string} message - String which defines the log message
*/
function writeConsoleMsg (type, message) {
    const prefix = '[ Renderer ] '
    const log = require('electron-log')
    // electron-log can: error, warn, info, verbose, debug, silly
    switch (type) {
    case 'info':
        log.info(prefix + message)
        break

    case 'warn':
        log.warn(prefix + message)
        break

    case 'error':
        log.error(prefix + message)
        break

    default:
        log.silly(prefix + message)
    }
}

/**
* @function showNoty
* @summary Shows a noty notification
* @description Creates an in-app notification using the noty framework
* @param {string} type - Options: alert, success, warning, error, info/information
* @param {string} message - notification text
* @param {number} [timeout] - Timevalue, defines how long the message should be displayed. Use 0 for no-timeout
*/
function showNoty (type, message, timeout = 3000) {
    const Noty = require('noty')
    new Noty({
        type: type,
        timeout: timeout,
        theme: 'bootstrap-v4',
        layout: 'bottom',
        text: message,
        animation: {
            open: 'animated fadeIn', // Animate.css class names: default: bounceInRight
            close: 'animated fadeOut' // Animate.css class names: default:bounceOutRight
        }
    }).show()
}

/**
* @function showNotification
* @summary Shows a desktop notification
* @description Shows a desktop notification
* @param {string} message - The notification message text
* @param {string} [title] - The title of the desktop notification
*/
function showNotification (message, title = 'dirgistered') {
    const myNotification = new Notification(title, {
        body: message,
        icon: 'img/icon/icon.png'
    })

    myNotification.onclick = () => {
        writeConsoleMsg('info', 'showNotification ::: Notification clicked')
        const { ipcRenderer } = require('electron')
        ipcRenderer.send('showAndFocusMainUI') // tell main.js to show the main UI
    }
}

/**
* @function openURL
* @summary Opens an url in browser
* @description Opens a given url in default browser. This is pretty slow, but got no better solution so far.
* @param {string} url - URL string which contains the target url
*/
function openURL (url) {
    const { shell } = require('electron')
    writeConsoleMsg('info', 'openURL ::: Trying to open the url: _' + url + '_.')
    shell.openExternal(url)
}

/**
* @function generateTimestamp
* @summary Generates a timestamp
* @description Generates a timestamp using time-stamp
* @return {string} - timestamp - The generates timestamp
*/
function generateTimestamp (pattern = 'HH:mm:ss') {
    const timestamp = require('time-stamp')
    // var currentTimestamp = timestamp('HH:mm:ss') // hours : minutes : seconds
    var currentTimestamp = timestamp(pattern) // hours : minutes : seconds
    return currentTimestamp
}

/**
* @function createFolder
* @summary Creates a given folder
* @description Checks if the given path exists, otherwise it creates it
* @param {string} folderName- The given folder path which should be created
*/
function createFolder (folderPath) {
    var fs = require('fs')
    if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath)
        writeConsoleMsg('info', 'createFolder ::: Created target folder: ' + folderPath)
        return true
    } else {
        writeConsoleMsg('warn', 'createFolder ::: Folder: _' + folderPath + '_ already exists')
        return false
    }
}

/**
* @function getFontAwesomeFileIcon
* @summary Returns a FontAwesome iconCode
* @description Gets a given fileextension and returns the related iconCode. This iconCode is then used in the generated output .html
* @param {string} extension - The given extension
* @return {string} - iconCode - The matching iconcode for the given extension
*/
function getFontAwesomeFileIcon (extension) {
    var iconCode

    switch (extension) {
    // audio
    case 'aac':
    case 'aiff':
    case 'flac':
    case 'm4a':
    case 'm4b':
    case 'm4p':
    case 'mp3':
    case 'ogg':
    case 'opus':
    case 'wav':
    case 'wma':
        iconCode = '<i class="fas fa-file-audio"></i>'
        break

    // archive
    case 'zip':
    case '7z':
        iconCode = ' <i class="fas fa-file-archive"></i>'
        break

    // code
    case 'h': // c
    case 'js': // javascript
    case 'css': // css
    case 'php': // php
    case 'py': // phyton
    case 'cmd': // cmd (Windows)
    case 'bat': // batch (Windows)
    case 'xml': // xml
    case 'json': // json
        iconCode = '<i class="fas fa-file-code"></i>'
        break

    // csv
    case 'csv':
        iconCode = '<i class="fas fa-file-csv"></i>'
        break

    // excel
    case 'xls':
    case 'xlsx':
        iconCode = '<i class="fas fa-file-excel"></i>'
        break

    // images
    case 'bmp':
    case 'jpg':
    case 'jpeg':
    case 'tiff':
    case 'tif':
    case 'gif':
    case 'ico':
    case 'psd':
    case 'svg':
    case 'png':
        iconCode = '<i class="fas fa-file-image"></i>'
        break

    // pdf
    case 'pdf':
        iconCode = '<i class="fas fa-file-pdf"></i>'
        break

    // powerpoint
    case 'ppt':
    case 'pptx':
        iconCode = '<i class="fas fa-file-powerpoint"></i>'
        break

    // txt
    case 'txt':
    case 'md': // markdown
        iconCode = '<i class="fas fa-file-alt"></i>'
        break

    // video
    case 'avi':
    case 'mkv':
    case 'wmv':
    case 'mpg':
    case 'mpeg':
    case 'mp4':
    case 'm4v':
    case 'ogv':
        iconCode = '<i class="fas fa-file-video"></i>'
        break

    // word
    case 'doc':
    case 'docx':
        iconCode = '<i class="fas fa-file-word"></i>'
        break

    // default
    default:
        iconCode = '<i class="fas fa-file"></i>'
    }

    return iconCode
}

/**
* @function appendToFile
* @summary Appends text to a given filePath
* @description Appends text to a given filePath
* @param {string} filePath - The path to the file which the text should be appended to
* @param {string} textToAppend - The actual text which should be appended
*/
function appendToFile (filePath, textToAppend) {
    // var fs = require('fs')
    const fs = require('graceful-fs') // see #9

    fs.appendFile(filePath, textToAppend, function (error) {
        if (error) {
            writeConsoleMsg('error', 'appendToFile ::: Failed to append text to the .html file (' + filePath + ').')
            showNoty('error', 'Error occured while trying to append text to an index file. Error: ' + error)
        }
    })
}

/**
* @function bytesToSize
* @summary Calculates bytes to size
* @description Calculates bytes to size
* @param {string} bytes - The given amount of bytes
* @return The actual size
*/
function bytesToSize (bytes) {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
    if (bytes === 0) return 'n/a'
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)), 10)
    // if (i === 0) return `${bytes} ${sizes[i]})`
    if (i === 0) return `${bytes} ${sizes[i]}`
    return `${(bytes / (1024 ** i)).toFixed(1)} ${sizes[i]}`
}
// source: https://gist.github.com/lanqy/5193417 and variations

/**
* @function userSettingWrite
* @summary Write a user setting to file
* @description Writes a value for a given key to electron-json-storage
* @param {String} key - Name of storage key
* @param {String} value - New value
* @param {boolean} [silent] - If true - no notification is displayed on initial settingscreation
* @throws Exception when writing a file failed
*/
function userSettingWrite (key, value, silent = false) {
    const storage = require('electron-json-storage')
    const remote = require('electron').remote
    const app = remote.app
    const path = require('path')

    // set new path for userUsettings
    const userSettingsPath = path.join(app.getPath('userData'), 'UserSettings')
    storage.setDataPath(userSettingsPath)

    // write the user setting
    storage.set(key, { setting: value }, function (error) {
        if (error) {
            writeConsoleMsg('error', 'userSettingWrite ::: Unable to write setting _' + key + '_ = _' + value + '_. Error: ' + error)
            throw error
        }
        writeConsoleMsg('info', 'userSettingWrite ::: _' + key + '_ = _' + value + '_')
        globalObjectSet(key, value)

        if (silent === false) {
            showNoty('success', 'Set <b>' + key + '</b> to <b>' + value + '</b>.')
        }
    })
}

/**
* @function userSettingRead
* @summary Read a user setting from file
* @description Reads a value stored in local storage (for a given key)
* @param {String} key - Name of local storage key
* @param {Boolean} [optionalUpdateSettingUI] Boolean used for an ugly hack
*/
function userSettingRead (key, optionalUpdateSettingUI = false) {
    const storage = require('electron-json-storage')
    const remote = require('electron').remote
    const app = remote.app
    const path = require('path')

    // writeConsoleMsg('info', 'userSettingRead ::: Trying to read value of key: _' + key + '_.')

    // change path for userSettings
    const userSettingsPath = path.join(app.getPath('userData'), 'UserSettings')
    storage.setDataPath(userSettingsPath)

    // read the json file
    storage.get(key, function (error, data) {
        if (error) {
            writeConsoleMsg('error', 'userSettingRead ::: Unable to read user setting. Error: ' + error)
            throw error
        }
        var value = data.setting
        // writeConsoleMsg('info', 'userSettingRead :::  _' + key + '_ = _' + value + '_.')

        // Setting: enablePrereleases
        //
        if (key === 'enablePrereleases') {
            var settingPrereleases

            // if it is not yet configured
            if ((value === null) || (value === undefined)) {
                settingPrereleases = false // set the default
                writeConsoleMsg('warn', 'userSettingRead ::: No user setting found for: _' + key + '_. Initializing it now with the default value: _' + settingPrereleases + '_.')
                userSettingWrite('enablePrereleases', settingPrereleases, true) // write the setting
            } else {
                settingPrereleases = value // update global var
                writeConsoleMsg('info', 'userSettingRead ::: Found configured _' + key + '_ with value: _' + settingPrereleases + '_.')
            }
            globalObjectSet('enablePrereleases', settingPrereleases) // update the global object

            // Optional: update the settings UI
            if (optionalUpdateSettingUI === true) {
                if (settingPrereleases === true) {
                    $('#checkboxEnablePreReleases').prop('checked', true)
                } else {
                    $('#checkboxEnablePreReleases').prop('checked', false)
                }
            }
        }
        // end: enablePrereleases

        // Setting: enableErrorReporting
        //
        if (key === 'enableErrorReporting') {
            var settingEnableErrorReporting

            // not configured
            if ((value === null) || (value === undefined)) {
                settingEnableErrorReporting = true
                writeConsoleMsg('warn', 'userSettingRead ::: No user setting found for: _' + key + '_. Initializing it now with the default value: _' + settingEnableErrorReporting + '_.')
                userSettingWrite('enableErrorReporting', true, true) // write the setting
                sentry.enableSentry()
            } else {
                settingEnableErrorReporting = value
                writeConsoleMsg('info', 'userSettingRead ::: Found configured _' + key + '_ with value: _' + settingEnableErrorReporting + '_.')

                if (settingEnableErrorReporting === true) {
                    sentry.enableSentry()
                } else {
                    sentry.disableSentry()
                }
            }
            globalObjectSet('enableErrorReporting', settingEnableErrorReporting) // update the global object

            // Optional: update the settings UI
            if (optionalUpdateSettingUI === true) {
                if (settingEnableErrorReporting === true) {
                    $('#checkboxEnableErrorReporting').prop('checked', true)
                } else {
                    $('#checkboxEnableErrorReporting').prop('checked', false)
                }
            }
        }
        // end: enableErrorReporting
    })
}

/**
* @function globalObjectGet
* @summary Gets a value of a single property from the global object in main.js
* @description Gets a value of a single property from the global object in main.js
* @param {String} property - Name of the property
* @return {string} value - Value of the property
*/
function globalObjectGet (property) {
    const { remote } = require('electron')
    var value = remote.getGlobal('sharedObj')[property]
    // writeConsoleMsg('info', 'globalObjectGet ::: Property: _' + property + '_ has the value: _' + value + '_.')
    return value
}

/**
* @function globalObjectSet
* @summary Updates the value of a single property from the global object in main.js
* @description Updates the value of a single property from the global object in main.js
* @param {String} property - Name of the property
* @param {String} value - The new value of the property
*/
function globalObjectSet (property, value) {
    const { ipcRenderer } = require('electron')
    ipcRenderer.send('globalObjectSet', property, value)
}

// ----------------------------------------------------------------------------
// EXPORT THE MODULE FUNCTIONS
// ----------------------------------------------------------------------------
//
module.exports.writeConsoleMsg = writeConsoleMsg
module.exports.showNoty = showNoty
module.exports.showNotification = showNotification
module.exports.openURL = openURL
module.exports.generateTimestamp = generateTimestamp
module.exports.createFolder = createFolder
module.exports.getFontAwesomeFileIcon = getFontAwesomeFileIcon
module.exports.appendToFile = appendToFile
module.exports.bytesToSize = bytesToSize
module.exports.userSettingWrite = userSettingWrite
module.exports.userSettingRead = userSettingRead
module.exports.globalObjectGet = globalObjectGet
module.exports.globalObjectSet = globalObjectSet
