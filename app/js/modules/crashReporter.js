/**
* @file crashReporter.js
* @fileOverview This module contains all crashReporter functions, See: https://electronjs.org/docs/api/crash-reporter
* @author yafp
* @module crashReporter
*/

'use strict'

const utils = require('./utils.js')

/**
* @function initCrashReporter
* @summary Initialized the crashReporter
* @description Initialized the electron crashReporter. See: https://electronjs.org/docs/api/crash-reporter
*/
function initCrashReporter () {
    const { crashReporter } = require('electron')
    crashReporter.start({
        productName: 'media-dupes',
        companyName: 'yafp',
        submitURL: 'https://sentry.io/api/1757940/minidump/?sentry_key=bbaa8fa09ca84a8da6a545c04d086859',
        uploadToServer: false
    })
    utils.writeConsoleMsg('info', 'initCrashReporter ::: crashReporter is now initialized')

    // To simulate a crash - execute: process.crash();
}

// ----------------------------------------------------------------------------
// EXPORT THE MODULE FUNCTIONS
// ----------------------------------------------------------------------------
//
module.exports.initCrashReporter = initCrashReporter
