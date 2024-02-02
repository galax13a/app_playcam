// app.js
//const { app, ipcMain, Notification} = require('electron');
const { app,ipcMain } = require('electron')
const express = require('express');
const path = require('path');
const routes = require('./routes');
const { createMainWindow, createWin } = require('./windows'); // Importa el nuevo módulo
const { Notification } = require('electron');
// This will print a number (corresponding with QUERY_USER_NOTIFICATION_STATE)


let Reload = true;
let expressApp;
let devtools = true; //open toolsDev
let MainWinApp;
let CopyTraductor = null; 

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

  expressApp.use(routes);

  const PORT = process.env.PORT || 3069;
  await new Promise(resolve => {
    expressApp.listen(PORT, () => {
      console.log(`Express server running on http://localhost:${PORT}`);
      resolve();
    });
  });

  return expressApp;
}

function showNotification() {
  const NOTIFICATION_TITLE = 'Basic Notification';
  const NOTIFICATION_BODY = 'Notification from the Main process';
  // Crear una nueva instancia de Notification
  const notification = new Notification({
    title: NOTIFICATION_TITLE,
    body: NOTIFICATION_BODY
  });
  notification.show();
}

app.whenReady().then(async () => {
  const expressApp = await startExpress();
  MainWinApp = createMainWindow({ width: 1200, height: 800, devtools: devtools }, expressApp);
  app.setAppUserModelId(process.execPath);

  showNotification();

  ipcMain.on('open-traductor-window', () => {
    const traductorWindow = createWin({
      url: 'https://translate.google.com/?hl=es&tab=TT&sl=en&tl=es&op=translate',
      icon: 'public/images/logo2.png',
      devtools: true,
      preloader: './views/traductor/preload-traductor.js'
    });
  });

  ipcMain.on('copied-text-traductor', (event, copiedText) => {
    console.log('Texto copiado desde el traductor:', copiedText);
    CopyTraductor = copiedText;  
  });

  ipcMain.on('open-moderatorcam-window', () => {
    const moderatorCamWindow = createWin({
      url: 'https://chaturbate.com/',
      icon: 'public/images/logo2.png',
      devtools: true,
      preloader: './views/moderator/preload-moderator.js'
    });
  });


});

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
