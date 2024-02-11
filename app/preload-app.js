//preload-app.js
const { ipcRenderer, remote } = require('electron');
console.log('Running App  preload v1')

window.IpcRenderJS = function (eventType) {
  const existingListener = window._ipcRenderJSListeners && window._ipcRenderJSListeners[eventType];
  if (existingListener) {
    window.removeEventListener(eventType, existingListener);
  }
  const listener = function (event) {
    console.log('Evento Win detectado:', event.detail);
    ipcRenderer.send(event.detail);
  };
  window.addEventListener(eventType, listener);
  
  if (!window._ipcRenderJSListeners) {
    window._ipcRenderJSListeners = {};
  }
  window._ipcRenderJSListeners[eventType] = listener;
  var eventoWin = new CustomEvent(eventType, {
    detail: eventType
  });
  window.dispatchEvent(eventoWin);
};

window.addEventListener('DOMContentLoaded', () => {
  
  const updateOnlineStatus = () => {
    document.getElementById('status').innerHTML = navigator.onLine ? 'online' : 'offline'
  }

  window.addEventListener('online', updateOnlineStatus)
  window.addEventListener('offline', updateOnlineStatus)

  updateOnlineStatus();

  const btn_close = document.getElementById('win-close');
  btn_close.addEventListener('click', () => {
    ipcRenderer.send('close-win-main');
  });

  const btn_mini = document.getElementById('win-mini');
  btn_mini.addEventListener('click', () => {
    //alert('mini clicked');
    ipcRenderer.send('minimize-win-main');

  });

  const btn_maximize = document.querySelector("#win-maximize")
  btn_maximize.addEventListener('click', () => {
    ipcRenderer.send('maximize-win-main');
  });
  
  /*
   document.getElementById('traductor-link').addEventListener('click', function (event) {
    ipcRenderer.send('open-traductor-window');
  });
  */

})
