// windows.js

const { BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
const { app } = require('electron');

let mainWindow, Win_traductor, Win_moderator, Win_exhibitionist = false;
let Win_traductorVisible = false, Win_moderatorVisible = false;
const port = process.env.PORT || 3000;

function createMainWindow(config = {}) {
  const {
    devtools = false,
    preload = 'preload-app.js',
    icon = 'public/images/logo2.png',
    width = 800,
    height = 600,
  } = config;

  mainWindow = new BrowserWindow({
    width,
    height,
    frame: false,
    resizable: true,
    webPreferences: {
      nodeIntegrationInWorker: true,
      enableRemoteModule: true,
      contextIsolation: false,
      nodeIntegration: true,
      enableRemoteModule: true,
      preload: path.join(__dirname, preload),
      cache: {
        maxAge: 60 * 60 * 24 * 7,
      },
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

async function createWinTraductor(config) {
  const { url, icon, devtools, preloader } = config;

  if (!Win_traductorVisible) {
    Win_traductor = new BrowserWindow({
      width: 700,
      height: 500,
      title: 'Traductor',
      resizable: true,
      movable: false,
      minimizable: true,
      maximizable: true,
      fullscreenable: false,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        preload: path.join(__dirname, preloader),
      },
      icon: path.join(__dirname, icon),
      frame: true,
      autoHideMenuBar: true,
    });

    Win_traductor.on('closed', () => {
      Win_traductor = null;
      Win_traductorVisible = false;
    });

    Win_traductor.webContents.on('did-finish-load', () => {
      Win_traductor.setTitle('Traductor Playcam');
    });

    await Win_traductor.loadURL(url);

    if (devtools) {
      Win_traductor.webContents.openDevTools();
    }

    Win_traductor.hide();
    Win_traductor.maximize();
    Win_traductor.show();
    Win_traductorVisible = true;
  }

  return Win_traductorVisible;
}

async function createModeratorCamWindow(config) {
  const { url, icon, devtools, preloader } = config;

  if (!Win_moderatorVisible) {
    Win_moderator = new BrowserWindow({
      width: 660,
      height: 900,
      maximizable: false,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: true,
        preload: path.join(__dirname, preloader),
      },
      icon: path.join(__dirname, icon),
    });

    Win_moderator.maximize();

    if (devtools) {
      Win_moderator.webContents.openDevTools();
    }
    Win_moderator.webContents.on('did-finish-load', () => {
      console.log('finsh win moderator');
    });

    Win_moderator.setMenu(null);
    //await Win_moderator.hide();
    await Win_moderator.loadURL(url);
    //await Win_moderator.show();

    Win_moderator.on('closed', () => {
      Win_moderatorVisible = false;
      Win_moderator = null;
    });

    Win_moderatorVisible = true;
  } else return false;

  return Win_moderator;
}

async function createWinFile(config) { // load file
  const { url, icon, devtools, preloader, node = false } = config;
  let winLoad;
  winLoad = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      preload: path.join(__dirname, preloader),
    },
    icon: path.join(__dirname, icon),
  });

  if (devtools) {
    winLoad.webContents.openDevTools();
  }

  winLoad.setMenu(null);
  console.log(path.join(__dirname, url));
  await winLoad.loadFile(path.join(__dirname, url));
  await winLoad.maximize();

  winLoad.on('closed', () => {

    winLoad = null;
  });

  return winLoad;
}

async function createWinExhibitionist(config) { // load file createWinExhibitionist
  let winLoad;
  if (!Win_exhibitionist) {

          const { url, icon, devtools, preloader, node = false } = config;
       
          winLoad = new BrowserWindow({
            width: 1460,
            height: 1260,
            webPreferences: {
              nodeIntegration: node,
              contextIsolation: true,
              preload: path.join(__dirname, preloader),
            },
            icon: path.join(__dirname, icon),
          });

          if (devtools) {
            winLoad.webContents.openDevTools();
          }

          winLoad.setMenu(null);         
          await winLoad.loadURL(url);
          await winLoad.maximize();

          winLoad.on('closed', () => {
            winLoad = null;
            Win_exhibitionist = false;
          });
        
        Win_exhibitionist = true;
    }

  return winLoad;
}
module.exports = {
  createMainWindow,
  createWinTraductor,
  createModeratorCamWindow,
  createWinFile,
  createWinExhibitionist
};
