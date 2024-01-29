// windows.js

const { BrowserWindow, ipcMain } = require('electron');
const path = require('path');

let mainWindow;
const port = process.env.PORT || 3000;

function createMainWindow(config = {}, expressApp) {
    const {
      devtools = false,
      preload = 'preload-app.js',
      icon = '../src/icons/icon2.png',
      width = 800,
      height = 600,
    } = config;
  
    mainWindow = new BrowserWindow({
      width,
      height,
      frame: false,
      webPreferences: {
        nodeIntegrationInWorker: true,
        enableRemoteModule: true,
        contextIsolation: false,
        nodeIntegration: true,
        enableRemoteModule: true,
        preload: path.join(__dirname, preload),
        cache: {
          maxAge: 60 * 60 * 24 * 7 // 90 días 7 días
        }
      },
      icon: path.join(__dirname, icon),
    });
  
  
  if (devtools) mainWindow.webContents.openDevTools();

  mainWindow.loadURL(`http://localhost:${port}/`);

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  mainWindow.on('maximize', () => {
    mainWindow.webContents.send('maximized');
  });

  mainWindow.on('unmaximize', () => {
    mainWindow.webContents.send('unmaximized');
  });

  ipcMain.on('minimize-win-main', () => {
    mainWindow.minimize();
  });

  ipcMain.on('maximize-win-main', () => {
    if (mainWindow.isMaximized()) {
      mainWindow.unmaximize();
    } else {
      mainWindow.maximize();
    }
  });

  ipcMain.on('close-win-main', () => {
    console.log('cerrando close');
    mainWindow.close();
  });

  mainWindow.hide();
  mainWindow.maximize();
  mainWindow.show();
}

module.exports = {
  createMainWindow,
};
