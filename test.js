const { app, BrowserWindow, Notification, ipcMain  } = require('electron/main');
const path = require('path');
const { NotificationState } = require('electron-notification-state');

const notificationState = new NotificationState();
console

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'test-preload.js'),
    },
  });

  win.loadURL('https://chaturbate.com');

  win.webContents.once('dom-ready', () => {
    win.webContents.openDevTools();
    win.maximize();
  });

  win.webContents.once('did-finish-load', () => {
    requestNotificationPermission(win.webContents);
  });

}

function requestNotificationPermission(webContents) {
  Notification.requestPermission().then((permission) => {
    // Enviar el resultado al proceso de renderizado
    webContents.send('notification-permission', permission);
  });
}

function showNotification() {
  console.log('Notification log v2');
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
 
  }
});

ipcMain.on('trigger-notification', (event) => {
  showNotification();

});