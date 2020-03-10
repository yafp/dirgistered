/**
 * @file Contains all constants used for the index creation
 * @author yafp
 * @module githubUrls
 */
'use strict'

// ----------------------------------------------------------------------------
// DEFINE GITHUB URL CONSTANTS
// ----------------------------------------------------------------------------
//

/**
* @constant
* @name indexDataTablesHead
* @type {string}
* @default
*/
const indexDataTablesHead = '<table id="example" class="display" style="width:100%">\n<thead><tr><th>Icon</th><th>Name</th><th>Type</th><th>Size</th></tr></thead>\n<tbody>\n'

/**
* @constant
* @name indexDataTablesFoot
* @type {string}
* @default
*/
const indexDataTablesFoot = '</tbody>\n<tfoot><tr><th>Icon</th><th>Name</th><th>Type</th><th>Size</th></tr></tfoot>\n</table>\n'

// ----------------------------------------------------------------------------
// EXPORT THE MODULE FUNCTIONS
// ----------------------------------------------------------------------------
//
module.exports.indexDataTablesHead = indexDataTablesHead
module.exports.indexDataTablesFoot = indexDataTablesFoot
