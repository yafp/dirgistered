/**
 * @file Contains all sentry functions
 * @author yafp
 * @module sentry
 */
'use strict'

const utils = require('./utils.js')

// ----------------------------------------------------------------------------
// Error Handling using: sentry
// ----------------------------------------------------------------------------
//
// https://sentry.io/organizations/yafp/
// https://docs.sentry.io/platforms/javascript/electron/
// https://docs.sentry.io/error-reporting/configuration/?platform=electron
//
const Sentry = require('@sentry/electron')
Sentry.init({
    dsn: 'https://b81f7bc0f9dc4c2693bca00f7b77c34d@sentry.io/3742693',
    debug: true
})
//
// simple way to force a crash:
// myUndefinedFunctionInSentryModul();

/**
* @function enableSentry
* @summary Enables sentry
* @description Enabled sentry to log errors
*/
function enableSentry () {
    Sentry.getCurrentHub().getClient().getOptions().enabled = true
    utils.writeConsoleMsg('info', 'enableSentry ::: Enabled sentry')
}

/**
* @function disableSentry
* @summary Disables sentry
* @description Disables sentry to log errors
*/
function disableSentry () {
    Sentry.getCurrentHub().getClient().getOptions().enabled = false
    utils.writeConsoleMsg('warn', 'disableSentry ::: Disabled sentry')
}

// ----------------------------------------------------------------------------
// EXPORT THE MODULE FUNCTIONS
// ----------------------------------------------------------------------------
//
module.exports.enableSentry = enableSentry
module.exports.disableSentry = disableSentry
