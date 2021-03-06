![logo](https://raw.githubusercontent.com/yafp/dirgistered/master/.github/images/logo/128x128.png)

# dirgistered
## changelog

This project is using [Semantic Versioning](https://semver.org/).

  `
  MAJOR.MINOR.PATCH
  `

* `MAJOR` version (incompatible API changes etc)
* `MINOR` version (adding functionality)
* `PATCH` version (bug fixes)


The following categories are used:

* `Added`: for new features
* `Changed`: for changes in existing functionality.
* `Deprecated`: for soon-to-be removed features.
* `Removed`: for now removed features.
* `Fixed`: for any bug fixes.
* `Security`: in case of vulnerabilities.



### dirgistered 0.5.2 (2021xxyy)
#### `Changed`
* Updated dependencies
  * Updated `custom-electron-titlebar` from `3.2.6` to `3.2.7`
  * Updated `electron-log` from `4.3.4` to `4.3.5`
  * Updated `electron-util` from `0.15.0` to `0.16.0`
  * Updated `eslint` from `7.24.0` to `7.27.0`
  * Updated `fortawesome/fontawesome-free` from `5.14.0` to `5.15.3`
  * Updated `jsdoc` from `3.6.6` to `3.6.7`
  * Updated `popperjs/core` from `2.4.4` to `2.9.2`
  * Updated `sentry/electron` from `2.4.0` to `2.4.1`

#### `Fixed`
* The Progress popup while indexing showed the wrong application name. Is now fixed.




### dirgistered 0.5.1 (20210424)
#### `Changed`
* Upgraded electrom from `9` to `11`
* Updated dependencies
  * Updated `about-window` from `1.13.2` to `1.14.0`
  * Updated `custom-electron-titlebar` from `3.2.2` to `3.2.6`
  * Updated `eslint` from `6.8.0` to `7.24.0`
  * Updated `electron` from `8.2.0` to `11.4.3`
  * Updated `electron-builder` from `22.4.1` to `22.10.5`
  * Updated `electron-packager` from `14.2.1` to `15.2.0`
  * Updated `electron-is-dev` from `1.1.0` to `1.2.0`
  * Updated `electron-log` from `4.1.0` to `4.3.4`
  * Updated `electron-util` from `0.14.0` to `0.15.0`
  * Updated `electron-json-storage` from `4.1.8` to `4.5.0`
  * Updated `fortawesome/fontawesome-free` from `5.13.0` to `5.14.0`
  * Updated `is-online` from `8.2.1` to `8.4.0`
  * Updated `graceful-fs` from `4.2.3` to `4.2.6`
  * Updated `jsdoc` from `3.6.3` to `3.6.6`
  * Updated `jquery` from `3.4.1` to `3.6.0`
  * Updated `popperjs/core` from `2.1.1` to `2.4.4`
  * Updated `sentry/electron` from `1.3.0` to `2.4.0`
  * Updated `standardx` from `5.0.0` to `7.0.0`
  * Updated `snazzy` from `8.0.0` to `9.0.0`
  * Updated `v8-compile-cache` from `2.1.0` to `2.3.0`

***

### dirgistered 0.5.0 (20200327)
#### `Added`
* Clicking a notification now gives focus to the main window. See [#12](https://github.com/yafp/dirgistered/issues/12)
* Update-Search: Added a setting to include pre-releases into the search. See [#13](https://github.com/yafp/dirgistered/issues/13)
* Settings UI: Cog icon now opens the user-settings folder.
* Added handling for symbolic links

#### `Changed`
* All `fs.`interactions are now using the `Sync` variant to avoid issues.
* Dependencies
  * Updated `electron` from `8.1.1` to `8.2.0`
  * Updated `fontawesome-free` from `5.12.1` to `5.13.0`

#### `Fixed`
* Fixed error when source folder is permission protected. Now throws an error. See [#10](https://github.com/yafp/dirgistered/issues/10)
* Sentry was not properly included in utils.js. See [#11](https://github.com/yafp/dirgistered/issues/11)

***

### dirgistered 0.4.0 (20200317)
#### `Added`
* Added general support for user-settings (using .json files)

#### `Changed`
* Error reporting is now optional (via settings). See [#7](https://github.com/yafp/dirgistered/issues/7)

#### `Fixed`
* Settings UI is now only offering function which are implemented. See [#6](https://github.com/yafp/dirgistered/issues/6)
* Fixed datatables button on generated index files.  See [#8](https://github.com/yafp/dirgistered/issues/8)

***

### dirgistered 0.3.0 (20200316)
#### `Added`
* Index
  * Added dirgister logo to head
  * DataTables (plus jQuery)
    * Added support for DataTables. See [#2](https://github.com/yafp/dirgistered/issues/2)
    * Added support for DataTables buttons.
  * Added a basic footer. See [#3](https://github.com/yafp/dirgistered/issues/3)
  * Added file / folder size. See [#5](https://github.com/yafp/dirgistered/issues/5)
* App
  * Added processing modal dialog which is displayed while app is generating indexes.
  * Added settings UI. See [#4](https://github.com/yafp/dirgistered/issues/4)
  * Opening settings UI blurs the mainWindow
  * Sentry
    * Sentry is now enabled by default

####  `Changed`
* Windows: NSIS Installer
  * Added install details
  * Added uninstall details
* Dependencies
  * Updated `electron` from `8.1.0` to `8.1.1`
  * Updated `electron-builder` from `22.4.0` to `22.4.1`
  * Updated `electron-log` from `4.0.7` to `4.1.0`
  * Updated `sentry` from `1.2.1` to `1.3.0`

***

### dirgistered 0.2.0 (20200309)
#### `Added`
* Project
  * Added a LICENSE to project
* App
  * Added a menu
  * Added an about-window
  * Added a button to open the generated index
  * Added a simple intro to explain the UI
  * Added update-search routine
  * Added window position and size restore function
* Index
  * Adding bootstrap & fontawesome to html index
  * Added a back link from html sub index files
  * Added file icons for several file extensions

####  `Changed`
* New app icon
* Developer Console can now be triggered via shortcut and/or menu
* Noty is now using animations (using animate.css)
* Bootstrap is now used via NPM
* FontAwesome is now used via NPM
* Dependencies
  * Updated `about-window` from `1.13.1` to `1.13.2`
  * Updated `electron` from `???` to `8.1.0`
  * Updated `electron-log` from `3.0.8` to `4.0.7`
  * Updated `electron-builder` from `22.1.0` to `22.4.0`
  * Updated `electron-packager` from `14.1.0` to `14.2.1`
  * Updated `is-online` from `8.2.0` to `8.2.1`
  * Updated `jquery` from `3.1.1` to `3.4.1`
  * Updated `eslint` from `6.6.0` to `6.8.0`
  * Updated `sentry` from `1.0.0` to `1.2.1`
  * Updated `custom-electron-titlebar` from `3.1.6` to `3.2.0`

#### `Removed`
* Removed header
* Removed footer


***

### dirgistered 0.1.0 (20170117)
#### `Added`
* First version of this project
* no executables so far
