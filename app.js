// app.js
const { app, ipcMain } = require('electron');
const express = require('express');
const path = require('path');
const routes = require('./routes');
const { createMainWindow } = require('./windows'); // Importa el nuevo módulo

const reload = require('electron-reload');
const projectDir = path.join(__dirname, '..'); // reload electron
reload(projectDir, {
  electron: path.join(projectDir, 'node_modules', '.bin', 'electron'),
  awaitWriteFinish: true,
});

let expressApp;
let devtools = true; //open toolsDev

async function startExpress() {
  expressApp = express();

  expressApp.use(express.json());
  expressApp.set('view engine', 'ejs');
  expressApp.set('views', path.join(__dirname, 'views'));
  expressApp.use(express.static(path.join(__dirname, 'public')));
  
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
  createMainWindow({ width: 1200, height: 800, devtools: true }, expressApp);
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', function () {
  if (mainWindow === null) {
    startExpress().then(() => createMainWindow());
  }
});