// app.js
//const { app, ipcMain, Notification} = require('electron');
const { app, ipcMain, BrowserWindow, desktopCapturer, dialog } = require('electron')
const express = require('express');
const path = require('path');
const routes = require('./routes');
const { createMainWindow, createWinTraductor, createModeratorCamWindow, createWinFile, createWinExhibitionist } = require('./windows'); // Importa el nuevo módulo
const cors = require('cors');

let Reload = true;
let devtools = true; //open toolsDev
let expressApp;
let MainWinApp, WinPLayRecord;
let CopyTraductor = null;
const PORT = process.env.PORT || 3069;
let Win_Youtube;

if (Reload) {
  const reload = require('electron-reload');
  const projectDir = path.join(__dirname, '..'); // reload electron
  reload(projectDir, {
    electron: path.join(projectDir, 'node_modules', '.bin', 'electron'),
    awaitWriteFinish: true,
  });
}

async function startExpress() {
  expressApp = express();

  expressApp.use(express.json());
  expressApp.set('view engine', 'ejs');
  //expressApp.use(htmx);
  expressApp.set('views', path.join(__dirname, 'views'));
  expressApp.use(express.static(path.join(__dirname, 'public')));
  expressApp.use('/modules', express.static(path.join(__dirname, '../node_modules')));
  expressApp.use(express.urlencoded({ extended: true }));
  expressApp.use(cors());  // Permitir solicitudes CORS
  expressApp.use(routes);


  await new Promise(resolve => {
    expressApp.listen(PORT, () => {
      console.log(`Express server running on http://localhost:${PORT}`);
      resolve();
    });
  });

  return expressApp;
}

app.whenReady().then(async () => {

  const expressApp = await startExpress();
  MainWinApp = createMainWindow({ width: 1200, height: 800, devtools: devtools }, expressApp);

  app.setAppUserModelId(process.execPath);

  ipcMain.on('open-traductor-window', () => {  // Win Traductor
    createTraductorWindow();
  });

  ipcMain.on('copied-text-traductor', (event, copiedText) => { //Copied-text-traductor
    console.log('Texto copiado desde el traductor:', copiedText);
    CopyTraductor = copiedText;
  });

  ipcMain.on('open-moderator-window', () => { //win Moderator..
    console.log('Moderator IPMAIN');
    const moderatorCamWindow = createModeratorCamWindow({
      url: 'https://en.chaturbate.com/',
      icon: 'public/images/moderator.png',
      devtools: devtools,
      preloader: './views/moderator/preload-moderator.js'
    });
  });

  ipcMain.on('open-record', () => { //win record..
    console.log('Moderator IPMAIN');
    const moderatorCamWindow = createWinFile({
      url: './views/recordsDesk/record.html',
      icon: 'public/images/rec.png',
      devtools: devtools,
      node: true,
      preloader: './views/recordsDesk/preload-record.js'
    });
  });

  ipcMain.on('open-voice-rec-window', () => { //win Moderator..
    console.log('voice-rec ');
    WinPLayRecord = new BrowserWindow({
      width: 960,
      height: 700,
      icon: path.join(__dirname, 'public', 'images', 'youtube.png'), // Ruta al archivo de icono
    });

    WinPLayRecord.loadURL(`http://localhost:${PORT}/app/traductor/audio`);
    WinPLayRecord.setMenu(null);
    if (devtools) {
      WinPLayRecord.webContents.openDevTools();
    }

    WinPLayRecord.on('closed', () => {
      WinPLayRecord = null;
    });

  });

  ipcMain.on('open-youtube-window', () => { //win Moderator..

    console.log('Canal youtube');
    Win_Youtube = new BrowserWindow({
      width: 960,
      height: 700,
      icon: path.join(__dirname, 'public', 'images', 'youtube.png'), // Ruta al archivo de icono
    });

    Win_Youtube.loadURL(`http://localhost:${PORT}/app/youtube`);
    Win_Youtube.setMenu(null);
    if (devtools) {
      Win_Youtube.webContents.openDevTools();
    }

    Win_Youtube.on('closed', () => {
      Win_Youtube = null;
    });

  });

});

async function createTraductorWindow() { // createTraductorWindow
  const traductorWindow = await createWinTraductor({
    url: 'https://translate.google.com/?hl=es&tab=TT&sl=en&tl=es&op=translate',
    icon: 'public/images/traducir.png',
    devtools: true,
    preloader: './views/traductor/preload-traductor.js'
  });

  console.log('IPC traductor');
}

app.on('window-all-closed', function () { //clsoe app
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', function () {
  if (mainWindow === null) {
    startExpress().then(() => createMainWindow());
  }
});

app.on("ready", function () {

});

ipcMain.handle('getSources', async () => { // getSources Grabar video 
  return await desktopCapturer.getSources({ types: ['window', 'screen'] })

})

ipcMain.handle('showSaveDialog', async () => { // save video
  return await dialog.showSaveDialog({
    buttonLabel: 'Save video',
    defaultPath: `vid-${Date.now()}.webm`
  });
})

ipcMain.handle('getOperatingSystem', () => {
  return process.platform
})


ipcMain.on('open-exhibitionist-window', () => { //win exhibitionist..

  const App_createWinExhibitionist = createWinExhibitionist({
    url: `http://localhost:${PORT}/app/chaturbate/get-exhibitionist`,
    icon: 'public/images/pervertido.png',
    devtools: devtools,
    preloader: './views/exhibitionist/preload-exhibitionist.js',
    node: false,
  });

});

ipcMain.on('openWindow', (event, { url, closeAfter,nick  }) => { /// open exhibitionist
  try {
    const win = new BrowserWindow({
      width: 800,
      height: 600,
      maximizable: false,
      icon: path.join(__dirname, 'public', 'images', 'pervertido.png'),
    });
    win.loadURL(url);
    win.setMenu(null);
    win.webContents.on('dom-ready', () => {
      win.setTitle(`Playcam - ${nick}`);
  });

    if (closeAfter) {
      setTimeout(() => {
        win.close();
        win.destroy();
      }, closeAfter * 1000);
    }
  } catch (error) {
    console.error('Error win  open exhibitionist ', error.message);
  }
});