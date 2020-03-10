/**
* @file Contains the main.js code of dirgistered
* @author yafp
* @namespace main
*/

// ----------------------------------------------------------------------------
// REQUIRE: DIRGISTERED MODULES
// ----------------------------------------------------------------------------
const crash = require('./app/js/modules/crashReporter.js') // crashReporter
const sentry = require('./app/js/modules/sentry.js') // sentry
const unhandled = require('./app/js/modules/unhandled.js') // electron-unhandled
const utils = require('./app/js/modules/utils.js')

// -----------------------------------------------------------------------------
// REQUIRE: 3rd PARTY
// -----------------------------------------------------------------------------
const { app, BrowserWindow, electron, ipcMain, Menu } = require('electron')
const shell = require('electron').shell
const path = require('path')
const fs = require('fs')
const openAboutWindow = require('about-window').default // for: about-window

// npm-check:
// use:
//   npm-check -s
// to ignore all non-referenced node_modules

// ----------------------------------------------------------------------------
// ERROR-HANDLING:
// ----------------------------------------------------------------------------
crash.initCrashReporter()
unhandled.initUnhandled()
// sentry.enableSentry() // sentry is enabled by default
sentry.disableSentry() // sentry is enabled by default

// ----------------------------------------------------------------------------
// VARIABLES & CONSTANTS
// ----------------------------------------------------------------------------
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow
let settingsWindow

const gotTheLock = app.requestSingleInstanceLock() // for: single-instance handling
const defaultUserDataPath = app.getPath('userData') // for: storing window position and size

const { urlGitHubGeneral, urlGitHubIssues, urlGitHubChangelog, urlGitHubReleases } = require('./app/js/modules/githubUrls.js') // project-urls

// Caution: Warning since electron 8
// app.allowRendererProcessReuse = false // see: https://github.com/electron/electron/issues/18397

// mainWindow: minimal window size
const mainWindowMinimalWindowHeight = 650
const mainWindowMinimalWindowWidth = 700

// settingsWundow: minimal window size
const settingsWindowMinimalWindowHeight = 400
const settingsWindowMinimalWindowWidth = 800

// ----------------------------------------------------------------------------
// FUNCTIONS
// ----------------------------------------------------------------------------

/**
* @function doLog
* @summary Writes console output for the main process
* @description Writes console output for the main process
* @memberof main
* @param {string} type - The log type
* @param {string} message - The log message
*/
function doLog (type, message) {
    const prefix = '[   Main   ] '
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
            // code block
    }
}

/**
* @function createWindowSettings
* @summary Manages the BrowserWindow for the Settings UI
* @description Manages the BrowserWindow for the Settings UI
* @memberof main
*/
function createWindowSettings () {
    doLog('info', 'createWindowSettings ::: Creating the settings window')

    // Create the browser window.
    settingsWindow = new BrowserWindow({
        // parent: mainWindow,
        modal: true,
        frame: true, // false results in a borderless window. Needed for custom titlebar
        titleBarStyle: 'default', // needed for custom-electron-titlebar. See: https://electronjs.org/docs/api/frameless-window
        backgroundColor: '#ffffff', // since 0.3.0
        show: true, // hide until: ready-to-show
        center: true, // Show window in the center of the screen. (since 0.3.0)
        width: settingsWindowMinimalWindowWidth,
        minWidth: settingsWindowMinimalWindowWidth,
        // resizable: false, // this conflickts with opening dev tools
        minimizable: false, // not implemented on linux
        maximizable: false, // not implemented on linux
        height: settingsWindowMinimalWindowHeight,
        minHeight: settingsWindowMinimalWindowHeight,
        icon: path.join(__dirname, 'app/img/icon/icon.png'),
        webPreferences: {
            nodeIntegration: true,
            webSecurity: true // introduced in 0.3.0
        }
    })

    // and load the setting.html of the app.
    settingsWindow.loadFile('app/settings.html')

    // window needs no menu
    settingsWindow.removeMenu()

    // Call from renderer: Settings UI - toggle dev tools
    ipcMain.on('settingsToggleDevTools', function () {
        settingsWindow.webContents.toggleDevTools()
    })

    // Emitted before the window is closed.
    settingsWindow.on('close', function () {
        doLog('info', 'createWindowSettings ::: settingsWindow will close (event: close)')
    })

    // Emitted when the window is closed.
    settingsWindow.on('closed', function (event) {
        doLog('info', 'createWindowSettings ::: settingsWindow is closed (event: closed)')
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        settingsWindow = null

        // unblur main UI
        mainWindow.webContents.send('unblurMainUI')
    })
}

/**
* @function createWindowMain
* @summary Creates the mainWindow
* @description Creates the mainWindow (restores window position and size of possible)
* @memberof main
*/
function createWindowMain () {
    doLog('info', 'createWindowMain ::: Starting to create the application windows')

    // Check last window position and size from user data
    var windowWidth
    var windowHeight
    var windowPositionX
    var windowPositionY

    // Read a local config file
    var customUserDataPath = path.join(defaultUserDataPath, 'DirgisteredWindowPosSize.json')
    var data
    try {
        data = JSON.parse(fs.readFileSync(customUserDataPath, 'utf8'))

        // size
        windowWidth = data.bounds.width
        windowHeight = data.bounds.height

        // position
        windowPositionX = data.bounds.x
        windowPositionY = data.bounds.y

        doLog('info', 'createWindowMain ::: Got last window position and size information from _' + customUserDataPath + '_.')
    } catch (e) {
        doLog('warn', 'createWindowMain ::: No last window position and size information found in _' + customUserDataPath + '_. Using fallback values')

        // set some default values for window size
        windowWidth = mainWindowMinimalWindowWidth
        windowHeight = mainWindowMinimalWindowHeight
    }

    // Create the browser window.
    mainWindow = new BrowserWindow({
        frame: false, // false results in a borderless window. Needed for custom titlebar
        titleBarStyle: 'hidden', // needed for custom-electron-titlebar. See: https://electronjs.org/docs/api/frameless-window
        backgroundColor: '#ffffff', // since 0.3.0
        show: false, // hide until: ready-to-show
        center: true, // Show window in the center of the screen. (since 0.3.0)
        width: windowWidth,
        minWidth: mainWindowMinimalWindowWidth,
        height: windowHeight,
        minHeight: mainWindowMinimalWindowHeight,
        icon: path.join(__dirname, 'app/img/icon/icon.png'),
        webPreferences: {
            nodeIntegration: true,
            webSecurity: true // introduced in 0.3.0
            // preload: path.join(__dirname, 'preload.js')
        }
    })

    // Call from renderer: Option: load settings UI
    ipcMain.on('settingsUiLoad', function () {
        createWindowSettings()
    })

    // Restore window position if possible
    //
    // requirements: found values in DirgisteredWindowPosSize.json from the previous session
    if ((typeof windowPositionX !== 'undefined') && (typeof windowPositionY !== 'undefined')) {
        mainWindow.setPosition(windowPositionX, windowPositionY)
    }

    // Call from renderer: show mainUI
    ipcMain.on('showAndFocusMainUI', function () {
        mainWindow.show()
        mainWindow.focus()
    })

    // and load the index.html of the app.
    mainWindow.loadFile('app/index.html')

    // Open the DevTools.
    // mainWindow.webContents.openDevTools()

    // Emitted when the web page becomes unresponsive.
    mainWindow.on('unresponsive', function () {
        doLog('warn', 'createWindowMain ::: mainWindow is now unresponsive (event: unresponsive)')
    })

    // Emitted when the unresponsive web page becomes responsive again.
    mainWindow.on('responsive', function () {
        doLog('info', 'createWindowMain ::: mainWindow is now responsive again (event: responsive)')
    })

    // Emitted when the web page has been rendered (while not being shown) and window can be displayed without a visual flash.
    mainWindow.on('ready-to-show', function () {
        doLog('info', 'createWindowMain ::: mainWindow is now ready, so show it and then focus it (event: ready-to-show)')
        mainWindow.show()
        mainWindow.focus()
        mainWindow.webContents.send('startSearchUpdatesSilent') // search silently for dirgistered updates
    })

    // Emitted before the window is closed.
    mainWindow.on('close', function (event) {
        doLog('info', 'createWindowMain ::: mainWindow will close (event: close)')

        // get window position and size
        var data = {
            bounds: mainWindow.getBounds()
        }

        // define target path (in user data)
        var customUserDataPath = path.join(defaultUserDataPath, 'DirgisteredWindowPosSize.json')

        // try to write
        fs.writeFile(customUserDataPath, JSON.stringify(data), function (error) {
            if (error) {
                doLog('error', 'createWindowMain ::: storing window-position and -size of mainWindow in  _' + customUserDataPath + '_ failed with error: _' + error + '_ (event: close)')
                throw error
            }

            doLog('info', 'createWindowMain ::: mainWindow stored window-position and -size in _' + customUserDataPath + '_ (event: close)')
        })
    })

    // Emitted when the window is closed.
    mainWindow.on('closed', function (event) {
        doLog('info', 'createWindowMain ::: mainWindow is closed (event: closed)')
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null
    })
}

/**
* @function createMenuMain
* @summary Creates the application menu
* @description Creates the application menu
* @memberof main
*/
function createMenuMain () {
    // doLog('createMenu', __dirname)

    // Create a custom menu
    var menu = Menu.buildFromTemplate([

        // Menu: File
        {
            label: 'File',
            submenu: [
                // Settings
                {
                    label: 'Settings',
                    enabled: false,
                    // icon: __dirname + '/app/img/icon/icon.png',
                    click () {
                        mainWindow.webContents.send('openSettings')
                    },
                    accelerator: 'CmdOrCtrl+,'
                },
                {
                    type: 'separator'
                },
                // Exit
                {
                    role: 'quit',
                    label: 'Exit',
                    click () {
                        app.quit()
                    },
                    accelerator: 'CmdOrCtrl+Q'
                }
            ]
        },

        // Menu: Edit
        {
            label: 'Edit',
            submenu: [
                {
                    label: 'Undo',
                    accelerator: 'CmdOrCtrl+Z',
                    selector: 'undo:'
                },
                {
                    label: 'Redo',
                    accelerator: 'Shift+CmdOrCtrl+Z',
                    selector: 'redo:'
                },
                {
                    type: 'separator'
                },
                {
                    label: 'Cut',
                    accelerator: 'CmdOrCtrl+X',
                    selector: 'cut:'
                },
                {
                    label: 'Copy',
                    accelerator: 'CmdOrCtrl+C',
                    selector: 'copy:'
                },
                {
                    label: 'Paste',
                    accelerator: 'CmdOrCtrl+V',
                    selector: 'paste:'
                },
                {
                    label: 'Select All',
                    accelerator: 'CmdOrCtrl+A',
                    selector: 'selectAll:'
                }
            ]
        },

        // Menu: View
        {
            label: 'View',
            submenu: [
                {
                    role: 'reload',
                    label: 'Reload',
                    click (item, mainWindow) {
                        mainWindow.reload()
                    },
                    accelerator: 'CmdOrCtrl+R'
                }
            ]
        },

        // Menu: Window
        {
            label: 'Window',
            submenu: [
                {
                    role: 'togglefullscreen',
                    label: 'Toggle Fullscreen',
                    click (item, mainWindow) {
                        if (mainWindow.isFullScreen()) {
                            mainWindow.setFullScreen(false)
                        } else {
                            mainWindow.setFullScreen(true)
                        }
                    },
                    accelerator: 'F11' // is most likely predefined on osx - results in: doesnt work on osx
                },
                {
                    role: 'minimize',
                    label: 'Minimize',
                    click (item, mainWindow) {
                        if (mainWindow.isMinimized()) {
                            // mainWindow.restore();
                        } else {
                            mainWindow.minimize()
                        }
                    },
                    accelerator: 'CmdOrCtrl+M'
                },
                {
                    label: 'Maximize',
                    click (item, mainWindow) {
                        if (mainWindow.isMaximized()) {
                            mainWindow.unmaximize()
                        } else {
                            mainWindow.maximize()
                        }
                    },
                    accelerator: 'CmdOrCtrl+K'
                }
            ]
        },

        // Menu: Help
        {
            role: 'help',
            label: 'Help',
            submenu: [
                // About
                {
                    role: 'about',
                    label: 'About',
                    click () {
                        openAboutWindow({
                            icon_path: path.join(__dirname, 'app/img/about/icon_about.png'),
                            open_devtools: false,
                            use_version_info: true,
                            win_options: // https://github.com/electron/electron/blob/master/docs/api/browser-window.md#new-browserwindowoptions
                    {
                        autoHideMenuBar: true,
                        titleBarStyle: 'hidden',
                        minimizable: false, // not implemented on linux
                        maximizable: false, // not implemented on linux
                        movable: false, // not implemented on linux
                        resizable: false,
                        alwaysOnTop: true,
                        fullscreenable: false,
                        skipTaskbar: false
                    }
                        })
                    }
                },
                // open homepage
                {
                    label: 'Homepage',
                    click () {
                        shell.openExternal(urlGitHubGeneral)
                    },
                    accelerator: 'F1'
                },
                // report issue
                {
                    label: 'Report issue',
                    click () {
                        shell.openExternal(urlGitHubIssues)
                    },
                    accelerator: 'F2'
                },
                // open changelog
                {
                    label: 'Changelog',
                    click () {
                        shell.openExternal(urlGitHubChangelog)
                    },
                    accelerator: 'F3'
                },
                // open Releases
                {
                    label: 'Releases',
                    click () {
                        shell.openExternal(urlGitHubReleases)
                    },
                    accelerator: 'F4'
                },
                {
                    type: 'separator'
                },
                // Update
                {
                    label: 'Search dirgistered updates',
                    click (item, mainWindow) {
                        mainWindow.webContents.send('startSearchUpdatesVerbose')
                    },
                    enabled: true,
                    accelerator: 'F9'
                },
                {
                    type: 'separator'
                },

                // Console
                {
                    id: 'HelpConsole',
                    label: 'Console',
                    click (item, mainWindow) {
                        mainWindow.webContents.toggleDevTools()
                    },
                    enabled: true,
                    accelerator: 'F12'
                }
            ]
        }
    ])

    // use the menu
    Menu.setApplicationMenu(menu)
}

/**
* @function forceSingleAppInstance
* @summary Takes care that there is only 1 instance of this app running
* @description Takes care that there is only 1 instance of this app running
* @memberof main
*/
function forceSingleAppInstance () {
    if (!gotTheLock) {
        doLog('warn', 'forceSingleAppInstance ::: There is already another instance of dirgistered')
        app.quit() // quit the second instance
    } else {
        app.on('second-instance', (event, commandLine, workingDirectory) => {
            // Someone tried to run a second instance, we should focus our first instance window.
            if (mainWindow) {
                // #134
                if (mainWindow === null) {
                    // do nothing - there is no mainwindow - most likely we are on macOS
                } else {
                    // mainWindow exists
                    if (mainWindow.isMinimized()) {
                        mainWindow.restore()
                    }
                    mainWindow.focus()
                }
            }
        })
    }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
//
// app.on('ready', createWindow)
app.on('ready', function () {
    forceSingleAppInstance() // check for single instance
    createWindowMain() // create the application UI
    createMenuMain() // create the application menu
})

// Quit when all windows are closed.
app.on('window-all-closed', function () {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) createWindowMain()
})
