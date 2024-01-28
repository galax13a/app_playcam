const { ipcRenderer, remote } = require('electron');
console.log('Running  preload')
//alert('Starting')

window.addEventListener('DOMContentLoaded', () => {
/*
    const openPuppeteerButton = document.getElementById('btn-open-puppeteer');
    openPuppeteerButton.addEventListener('click', () => {
      window.openPuppeteerWindow();
    });
    */

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
