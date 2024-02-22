//preload-guests.js
const { ipcRenderer,contextBridge  } = require('electron');
console.log('preload guests');

contextBridge.exposeInMainWorld('PlaycamAPI', {
    OpenPlayerStripchat: (url, mobil) => {
        console.log(`OpenWin player stripchat` );
        ipcRenderer.send('open-player-stripchat', url, mobil);
    },
    openPlayerChaturbate: (nick) => {      
        
        ipcRenderer.send('open-player-chaturbate', nick);
    }
});