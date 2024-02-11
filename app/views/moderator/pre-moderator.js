const { ipcRenderer, remote } = require('electron');
const { setupOverlay } = require('./module-body');
const Notiflix = require('notiflix');


let domain = "https://chaturbate.com";
// Initialization
document.addEventListener('DOMContentLoaded', () => {
    console.clear();
    console.log('Running PRE Moderator v1.1');
    setupOverlay();

    Notiflix.Notify.init({
        width: '280px',
        position: 'center-center'
    });

    Notiflix.Loading['standard']('Loading...');
    Notiflix.Loading.remove(2000);

    Notiflix.Notify['success'](message = "Successfully"), {
        timeout: 3300,
        showOnlyTheLastOne: true,
        position: 'center-center'
    }

    // setupStyles();
    // setupBody();
    //  hideUnwantedElements();
    // setupFloatingMenu();
    //  CLickSearchLink();
    //    setupModeChat();
    //setupCamsLink();
    //setupFollowLink();

});