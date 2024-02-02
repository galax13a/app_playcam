const { ipcRenderer, remote } = require('electron');
console.log('Running App  preload v1')
//alert('Starting')

window.addEventListener('DOMContentLoaded', () => {
  /*
  const openPuppeteerButton = document.getElementById('btn-open-puppeteer');
  openPuppeteerButton.addEventListener('click', () => {
    window.openPuppeteerWindow();
  });
  */
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

  // Maximizar la ventana principal
  const btn_maximize = document.querySelector("#win-maximize")
  btn_maximize.addEventListener('click', () => {
    ipcRenderer.send('maximize-win-main');

  });

  document.getElementById('traductor-link').addEventListener('click', function (event) {
    //event.preventDefault();      
    ipcRenderer.send('open-traductor-window');
  });

  document.getElementById('traductor-link').addEventListener('click', function (event) {
    ipcRenderer.send('open-traductor-window');
  });

  /*
  var elementoAocultar = document.querySelector("#gb");
  if (elementoAocultar) {
    elementoAocultar.style.display = 'none';
  }
  */

  // abrirventanas win children
  /*
  const btnOpenStreaming = document.getElementById('btn-open-streaming');
  btnOpenStreaming.addEventListener('click', () => {
      ipcRenderer.send('open-streaming');
    });
    // abrimos una nueva ventana en puppeteer-in-electron
  const btnOpenPuper= document.getElementById('btn-open-puper');
  btnOpenPuper.addEventListener('click', () => {
      ipcRenderer.send('open-pupper');
    });
    */

})
