//
// Entry point for the Electron app

const { app, BrowserWindow, ipcMain } = require('electron')

// Define windows
const WindowInfo = {

    // Welcome window
    welcome: {
        url: 'built/welcome/index.html',
        options: {
            width: 400, 
            height: 600,
            center: true,
            resizable: false,
            minimizable: false,
            maximizable: false,
            fullscreenable: false,
            title: "Welcome",
            autoHideMenuBar: true,
            backgroundColor: "#E1E3E5",
            webPreferences: { 
                nodeIntegration: true,
                webSecurity: false
            }
        }
    },

    // Main editor window
    editor: {
        url: 'built/editor/index.html',
        options: {
            width: 1280, 
            height: 900,
            center: true,
            title: "ChipCode",
            autoHideMenuBar: true,
            backgroundColor: "#242424",
            webPreferences: { 
                nodeIntegration: true,
                webSecurity: false
            }
        }
    }

}

// Create window
function createWindow(id) {

    // Create browser window
    let win = new BrowserWindow(WindowInfo[id].options)

    // Load window content
    win.loadFile(WindowInfo[id].url)

}

// Wait until the app is ready
app.whenReady().then(e => createWindow('welcome'))

// Quit when all windows are closed.
app.on('window-all-closed', () => {

    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }

})
  
app.on('activate', () => {

    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow('welcome')
    }

})

// When a renderer process wants to open a window
ipcMain.on('open-window', (event, arg) => {
    
    // Open the window
    createWindow(arg.id)
    
})