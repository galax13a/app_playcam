// app.js
const { app, ipcMain, Notification } = require('electron');
const express = require('express');
const path = require('path');
const routes = require('./routes');
const { createMainWindow, createWin } = require('./windows'); // Importa el nuevo módulo

let Reload = true;
let expressApp;
let devtools = true; //open toolsDev
let MainWinApp;

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

app.whenReady().then(async () => {
  const expressApp = await startExpress();
  MainWinApp = createMainWindow({ width: 1200, height: 800, devtools: devtools }, expressApp);

  ipcMain.on('open-traductor-window', () => {

    const traductorWindow = createWin({ // Traductor .. create
      url: 'https://translate.google.com/?hl=es&tab=TT&sl=en&tl=es&op=translate',
      icon: 'public/images/logo2.png',
      devtools: true, 
      preloader:'./views/traductor/preload-traductor.js'
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

