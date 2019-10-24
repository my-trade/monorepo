const electron = require('electron')
const app = electron.app
const BrowserWindow = electron.BrowserWindow

const path = require('path')
const url = require('url')

let mainWindow

function createWindow() {
  const appWidth = 300;
  const display = electron.screen.getPrimaryDisplay();
  let displayWidth = display.bounds.width;

  mainWindow = new BrowserWindow({
    alwaysOnTop: true,
    height: 300,
    resizable: false,
    right: 0,
    titleBarStyle: 'hidden',
    top: 0,
    width: 300,
    x: displayWidth - appWidth,
    y: 0
  });

  mainWindow.loadURL(
    process.env.ELECTRON_START_URL ||
      url.format({
        pathname: path.join(__dirname, '/../public/index.html'),
        protocol: 'file:',
        slashes: true
      })
  )

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})