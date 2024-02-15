//preload-exhibitionist.js
const { ipcRenderer, remote,contextBridge  } = require('electron');

console.log("Starting prel;oad preload-exhibitionist.js");

contextBridge.exposeInMainWorld('PlaycamAPI', {
    OpenWinRoom: (nick = null, seg_close = null) => {
        console.log(`OpenWin ${nick} Close Win : ${seg_close}` );
    }
});
