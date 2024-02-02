// windows.js

const { BrowserWindow, ipcMain } = require('electron');
const path = require('path');

let mainWindow, Win_traductor;
let Win_traductorVisible = false;
const port = process.env.PORT || 3000;
let moderatorCamWindow;

function createMainWindow(config = {}, expressApp) {
  const {
    devtools = false,
    preload = 'preload-app.js',
    icon = 'public/images/logo2.png',//icon = '../src/icons/icon2.png',
    width = 800,
    height = 600,
  } = config;

  mainWindow = new BrowserWindow({
    width,
    height,
    frame: false,
    resizable: false,    
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
      frame: true, // Oculta la barra de título
      autoHideMenuBar: true, // Oculta la barra de menú
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

  }

  Win_traductorVisible = true;
  return Win_traductorVisible;

}

async function createModeratorCamWindow(config) {
  const { url, icon, devtools, preloader } = config;

  moderatorCamWindow = new BrowserWindow({
    width: 800, // Puedes ajustar el tamaño según tus necesidades
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, preloader),
    },
    icon: path.join(__dirname, icon),
  });

  if (devtools) {
    moderatorCamWindow.webContents.openDevTools();
  }

  await moderatorCamWindow.loadURL(url);

  moderatorCamWindow.on('closed', () => {
    // Puedes realizar tareas adicionales cuando se cierra la ventana
  });
}

module.exports = {
  createMainWindow,
  createWinTraductor,
  createModeratorCamWindow
};
