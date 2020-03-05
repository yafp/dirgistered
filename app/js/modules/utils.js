/**
 * @file Contains all helper and utility functions
 * @author yafp
 * @module utils
 */
'use strict'

// ----------------------------------------------------------------------------
// REQUIRE MODULES
// ----------------------------------------------------------------------------

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