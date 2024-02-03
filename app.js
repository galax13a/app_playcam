// app.js
//const { app, ipcMain, Notification} = require('electron');
const { app,ipcMain, BrowserWindow  } = require('electron')
const express = require('express');
const path = require('path');
const routes = require('./routes');
const { createMainWindow, createWinTraductor, createModeratorCamWindow } = require('./windows'); // Importa el nuevo módulo
const { Notification } = require('electron');
const cors = require('cors');

let Reload = false;
let expressApp;
let devtools = true; //open toolsDev
let MainWinApp;
let CopyTraductor = null; 
const PORT = process.env.PORT || 3069;

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
      url: 'https://chaturbate.com/',
      icon: 'public/images/logo2.png',
      devtools: true,
      preloader: './views/moderator/preload-moderator.js'
    });
  });

  ipcMain.on('open-youtube-window', () => { //win Moderator..
   
    console.log('Moderator youtube');
    const win = new BrowserWindow({ width: 800, height: 600 });
    win.loadURL(`http://localhost:${PORT}/app/youtube`);
    win.setMenu(null);

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


app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', function () {
  if (mainWindow === null) {
    startExpress().then(() => createMainWindow());
  }
});

app.on("ready", function () {
  new Notification({ title: 'Test Notification', body: 'This is a test notification' }).show();
});
