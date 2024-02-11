const { ipcRenderer, remote } = require('electron');
console.log('Running Moderator v1.1');
let domain = "https://chaturbate.com";
setTimeout(() => {
    hideOverlay();
    document.body.style.display = 'block'; // Mostrar el cuerpo después de ocultar el overlay
}, 100);

function hideOverlay() {
    // Crear el overlay
    const overlay = document.createElement('div');
    overlay.id = 'overlay';
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
    overlay.style.display = 'flex';
    overlay.style.alignItems = 'center';
    overlay.style.justifyContent = 'center';
    overlay.style.zIndex = '99999';

    const overlayContent = document.createElement('div');
    overlayContent.style.color = 'white';
    overlayContent.style.fontSize = '24px';
    overlayContent.textContent = 'Loanding...';
    overlay.appendChild(overlayContent);
    document.body.appendChild(overlay);
    setTimeout(() => {
        document.body.removeChild(overlay);
    }, 2000);
}

document.addEventListener('DOMContentLoaded', function () {


    const styles = `
  * {
    scrollbar-width: auto;
    scrollbar-color: #640080a6 #0a0a0b;
  }

  /* Chrome, Edge, y Safari */
  *::-webkit-scrollbar {
    width: 9px;    
  }

  *::-webkit-scrollbar-track {
    background: #0a0a0b;
  }

  *::-webkit-scrollbar-thumb {
    background-color: #640080a6;
    border-radius: 10px;
    border: 3px solid #0d1c19;
  }
`;
    let modeChatToggle;
    modeChatToggle = localStorage.getItem('modeChatToggle');

    const styleElement = document.createElement('style');
    styleElement.type = 'text/css';
    styleElement.appendChild(document.createTextNode(styles));

    document.head.appendChild(styleElement);

    document.body.style.padding = '9px';
    document.body.style.background = "#333";
    document.body.display = 'none';
    console.clear();

    function hideElement(selector) {
        try {
            const element = document.querySelector(selector);

            if (element) {
                element.style.display = "none";
            } else {
                throw new Error(`Elemento no encontrado con el selector: ${selector}`);
            }
        } catch (error) {
            console.error(`Error al intentar ocultar el elemento: ${error.message}`);
        }
    }

    function checkAndHideBio() {
        let bio = document.querySelector("#roomTabs > div.BioContents");

        if (bio) {
            bio.style.display = "none";
            clearInterval(checkBioInterval); // Detener el intervalo de verificación
        }
    }

    const checkBioInterval = setInterval(checkAndHideBio, 2000); // Verificar cada 3 segundos
    const headerSelector = "#header > div.section.clearfix";
    const broadcastYourselfSelector = "#nav > li.broadcast-yourself";
    const navLinkSelector = "#nav > a";
    const footerHolderSelector = "#footer-holder";
    const contenido = document.querySelector("#main");
    const topi = document.querySelector("#main > div.top-section");
    const banner = document.querySelector("#header > div.ad > a > img");

    hideElement(headerSelector);
    hideElement(footerHolderSelector);
    hideElement(navLinkSelector);
    hideElement(banner);

    if (document.querySelector(broadcastYourselfSelector)) {
        hideElement(broadcastYourselfSelector);
    }

    if (topi) { topi.style.background = "#333"; }

    if (contenido) {
        contenido.style.backgroundColor = "#333";
        contenido.style.color = "white";
    }

    const navbar = document.querySelector("#header > div.nav-bar");
    if (navbar) {
        navbar.style.backgroundColor = "#333";
        navbar.style.color = "white";
        navbar.style.borderBottom = '3px solid #d80b60cb';
        navbar.style.boxShadow = '0px 4px 8px rgba(255, 255, 0, 0.5)';
        //navbar.style.margin = '4px';
        navbar.style.padding = '2px';
        //navbar.style.borderRadius = '10px';
        navbar.style.paddingBottom = '4px';
    }

    // Seleccionar todos los elementos li bajo la estructura específica
    const liElements = document.querySelectorAll('#roomlist_root > div.roomlist_container.endless_page_styles > ul > li');

    liElements.forEach((li) => {
        li.style.backgroundColor = '#1b634567'; // Color de fondo
        li.style.color = '#ffffff'; // Color de texto
        li.style.fontFamily = 'monospace'; // Reemplaza "nombre-del-estilo-videojuego" con el nombre de la fuente de estilo de videojuego
        li.style.fontSize = '20px'; // Tamaño de letra
        li.style.fontWeight = 'bold'; // Negrita

        // Aplicar estilos al elemento a dentro de los li
        const aElement = li.querySelector('a');
        if (aElement) {
            aElement.style.fontWeight = 'bold'; // Negrita
            aElement.style.color = '#ffffff'; // Color de texto blanco
        }
        const spanElement = li.querySelector('span');
        if (spanElement) {
            spanElement.style.color = 'red'; // Color rojo
        }
    });

    document.body.display = 'block';

    // Crear el menú flotante
    const floatingMenu = document.createElement('div');
    floatingMenu.id = 'NavModerator';
    floatingMenu.classList.add('nav-bar');
    floatingMenu.style.position = 'fixed';
    floatingMenu.style.bottom = '0';
    floatingMenu.style.width = '100%';
    floatingMenu.style.minHeight = '36px';
    floatingMenu.style.backgroundColor = 'rgba(51, 51, 51, 0.9)';
    floatingMenu.style.color = 'white';
    floatingMenu.style.padding = '2px 2px 4px 15px';
    floatingMenu.style.borderBottom = '3px solid rgba(216, 11, 96, 0.796)';
    floatingMenu.style.boxShadow = 'rgba(255, 255, 0, 0.5) 0px 4px 8px';
    floatingMenu.style.marginTop = '3px';
    floatingMenu.style.marginLeft = '-26px';

    // Crear el contenedor <ul>
    const ulContainer = document.createElement('ul');
    ulContainer.style.listStyle = 'none';
    ulContainer.style.margin = '0';
    ulContainer.style.padding = '6px';
    ulContainer.style.display = 'flex'; // Hacer que los elementos flexibles se alineen en una fila

    // Función para aplicar estilos a los enlaces
    function applyLinkStyles(link) {
        link.style.display = 'inline-block';
        link.style.marginRight = '15px'; // Añadir espacio entre enlaces
        link.style.color = 'white';
        link.style.textDecoration = 'none';
        link.style.fontSize = '2.26rem'; // Tamaño de letra
        link.style.fontWeight = 'bold'; // Negrita
        link.style.padding = '3px';
        link.style.margin = '3px';


    }

    // Función para crear enlaces
    function createLink(id, text, linker = "#") {
        const liElement = document.createElement('li');
        const link = document.createElement('a');
        link.href = linker;
        link.id = id;

        link.textContent = text;
        applyLinkStyles(link);

        liElement.appendChild(link);
        return liElement;
    }

    // Crear enlaces
    const links = [
        createLink('link0', '😎 Playcam', 'https://en.chaturbate.com'),
        createLink('link1', '🔎 Search'),
        createLink('link6', '💭 Mode Chat'),
        createLink('link-send-tokens', '🔔Auto Tips'),
        createLink('link-chat-rec-room', '🔴 Rec Tokens'),
        createLink('link-follow', '💚 Follow'),
        createLink('link-camx', '🧿 Cams'),
        createLink('link-login', '🔒Login'),

    ];

    // Agregar enlaces al contenedor <ul>
    links.forEach(link => ulContainer.appendChild(link));

    // Agregar el contenedor <ul> al menú flotante
    floatingMenu.appendChild(ulContainer);

    // Agregar el menú flotante al body
    document.body.appendChild(floatingMenu);

    function showSearchPopup() {
        const popupContainer = document.createElement('div');
        const closeButton = document.createElement('button');
        const closeIcon = document.createTextNode('❌');
        const inputElement = document.createElement('input');
        const searchButton = document.createElement('button');
        const searchHistoryContainer = document.createElement('div'); // Contenedor para la lista con scroll
        const searchHistoryList = document.createElement('ul');

        popupContainer.style.position = 'fixed';
        popupContainer.style.top = '50%';
        popupContainer.style.left = '50%';
        popupContainer.style.transform = 'translate(-50%, -50%)';
        popupContainer.style.padding = '40px';
        popupContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        popupContainer.style.boxShadow = '0 0 20px rgba(0, 0, 0, 0.8)';
        popupContainer.style.borderRadius = '10px';
        popupContainer.style.zIndex = '9999';
        popupContainer.style.textAlign = 'center';

        closeButton.style.position = 'absolute';
        closeButton.style.top = '10px';
        closeButton.style.right = '10px';
        closeButton.style.background = 'none';
        closeButton.style.border = 'none';
        closeButton.style.cursor = 'pointer';
        closeButton.style.fontSize = '24px';
        closeButton.style.color = 'white';
        closeButton.appendChild(closeIcon);

        inputElement.type = 'text';
        inputElement.placeholder = 'Model Name';
        inputElement.style.margin = '10px 0';
        inputElement.style.padding = '15px';
        inputElement.style.width = '85%';
        inputElement.style.border = '1px solid #8e8e8e';
        inputElement.style.borderRadius = '5px';
        inputElement.required = true;
        inputElement.minLength = 3;
        inputElement.autocomplete = 'off';

        searchButton.textContent = 'Search';
        searchButton.style.marginTop = '10px';
        searchButton.style.padding = '15px';
        searchButton.style.width = '100%';
        searchButton.style.backgroundColor = 'black';
        searchButton.style.color = 'white';
        searchButton.style.border = 'none';
        searchButton.style.borderRadius = '5px';
        searchButton.style.cursor = 'pointer';
        searchButton.style.marginBottom = '12px';

        searchHistoryContainer.style.maxHeight = '260px'; // Altura máxima antes de activar el scroll
        searchHistoryContainer.style.overflowY = 'auto'; // Añadir scroll si es necesario

        searchHistoryList.style.listStyle = 'none';
        searchHistoryList.style.padding = '0';
        searchHistoryList.style.marginTop = '0'; // Reducir el margen superior para un mejor aspecto

        const searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];

        searchHistory.forEach(historyItem => {
            const historyItemElement = document.createElement('li');
            const deleteButton = document.createElement('button');
            const deleteIcon = document.createTextNode('✖️');

            historyItemElement.textContent = historyItem;
            historyItemElement.style.cursor = 'pointer';
            historyItemElement.style.padding = '2px';
            historyItemElement.style.margin = '2px';
            historyItemElement.style.fontWeight = 'bold';
            historyItemElement.style.color = 'white';

            deleteButton.style.background = 'none';
            deleteButton.style.border = 'none';
            deleteButton.style.cursor = 'pointer';
            deleteButton.style.fontSize = '16px';
            deleteButton.style.color = 'red';
            deleteButton.appendChild(deleteIcon);

            historyItemElement.appendChild(deleteButton);
            searchHistoryList.appendChild(historyItemElement);

            deleteButton.addEventListener('click', (event) => {
                event.stopPropagation();
                // Eliminar el registro del historial y actualizar el almacenamiento local
                searchHistory.splice(searchHistory.indexOf(historyItem), 1);
                localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
                // Eliminar el elemento del DOM
                searchHistoryList.removeChild(historyItemElement);
            });

            historyItemElement.addEventListener('click', () => {
                inputElement.value = historyItem;
                const currentDomain = window.location.origin;
                const urlToRedirect = new URL(historyItem, currentDomain).href;
                window.location.href = urlToRedirect;
                /*
                searchButton.click();
                console.log('historyItem');
                */
            });
        });

        popupContainer.appendChild(closeButton);
        popupContainer.appendChild(inputElement);
        popupContainer.appendChild(searchButton);
        searchHistoryContainer.appendChild(searchHistoryList); // Agregar lista al contenedor
        popupContainer.appendChild(searchHistoryContainer); // Agregar contenedor al popup

        document.body.appendChild(popupContainer);
        inputElement.focus();

        closeButton.addEventListener('click', () => {
            document.body.removeChild(popupContainer);
        });

        searchButton.addEventListener('click', performSearch);

        // Permitir la búsqueda al presionar Enter en el campo de entrada
        inputElement.addEventListener('keyup', (event) => {
            if (event.key === 'Enter') {
                performSearch();
            }
        });

        function performSearch() {
            const modelName = inputElement.value.trim();

            if (inputElement.checkValidity() && modelName.length >= 3) {
                const currentDomain = window.location.origin;
                const urlToRedirect = new URL(modelName, currentDomain).href;
                window.location.href = urlToRedirect;

                searchHistory.unshift(modelName);

                localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
                document.body.removeChild(popupContainer);
            } else {
                alert('Please enter a valid model name (at least 3 characters).');
            }
        }
    }

    const searchLink = document.getElementById('link1');
    if (searchLink) {
        searchLink.addEventListener('click', showSearchPopup);
    }

    // modochat
    // Función para ocultar elementos
    function hideElements() {
        const navbar = document.querySelector("#header > div.nav-bar");
        const genderTabs = document.querySelector("#main > div > div.genderTabs.bgColor.navigationAlt2BgImage.navigationAlt2BgColor.tabSectionBorder.top-section");
        const roomTabs = document.querySelector("#roomTabs");
        const chat = document.querySelector("#ChatTabContainer");

        if (navbar) {
            navbar.style.display = 'none';
        }
        if (genderTabs) {
            genderTabs.style.display = 'none';
        }
        if (roomTabs) {
            roomTabs.style.display = 'none';
        }
        if (chat) {
            chat.style.display = 'none';
        }
    }

    // Función para mostrar elementos
    function showElements() {
        const navbar = document.querySelector("#header > div.nav-bar");
        const genderTabs = document.querySelector("#main > div > div.genderTabs.bgColor.navigationAlt2BgImage.navigationAlt2BgColor.tabSectionBorder.top-section");
        const roomTabs = document.querySelector("#roomTabs");
        const chat = document.querySelector("#ChatTabContainer");

        if (navbar) {
            navbar.style.display = 'block';
        }
        if (genderTabs) {
            genderTabs.style.display = 'block';
        }
        if (roomTabs) {
            roomTabs.style.display = 'block';
        }
        if (chat) {
            chat.style.display = 'block';
        }
    }

    // Función para manejar el modo chat toggle
    function toggleModeChat() {
        let videomode = document.querySelector("#video-mode");
        if (videomode) { videomode.click(); }

        if (modeChatToggle === 'true') {
            hideElements();
        } else {
            showElements();
        }
    }

    toggleModeChat();

    const modeChatLink = document.getElementById('link6');

    if (modeChatLink) {

        modeChatLink.addEventListener('click', function (event) {
            const activeModelElement = document.querySelector("#main > div > div.genderTabs.bgColor.navigationAlt2BgImage.navigationAlt2BgColor.tabSectionBorder.top-section > div > div > a.gender-tab.tabElement.active.tabBorder.activeRoom.tabElementLink");
            const tabmenuchatcategory = document.querySelector("#main > div > div.genderTabs.bgColor.navigationAlt2BgImage.navigationAlt2BgColor.tabSectionBorder.top-section");
            if (activeModelElement) {
                if (modeChatToggle === 'true') {
                    localStorage.setItem('modeChatToggle', 'false');
                } else {
                    localStorage.setItem('modeChatToggle', 'true');
                }
                modeChatToggle = localStorage.getItem('modeChatToggle');
                if (modeChatToggle === 'true') {
                    createNotification('Mode Chat Active');                    
                    tabmenuchatcategory.style.display = 'none';

                } else {
                    createNotification('Mode Chat Disabled', 'red');
                    tabmenuchatcategory.style.display = 'block';
                }

            } else {
                createNotification('To be in chat mode, you must be seeing a model.');
                event.preventDefault();
            }

            toggleModeChat();
        });
    }

    function createNotification(message, fondo = null) {
        const notificationDiv = document.createElement('div');
        notificationDiv.style.position = 'fixed';
        notificationDiv.style.top = '50%';
        notificationDiv.style.left = '50%';
        notificationDiv.style.transform = 'translate(-50%, -50%)';
        notificationDiv.style.padding = '15px';
        notificationDiv.style.backgroundColor = '#333';
        notificationDiv.style.color = 'white';
        notificationDiv.style.borderRadius = '8px';
        notificationDiv.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.5)';
        notificationDiv.style.zIndex = '9999';
        notificationDiv.textContent = message;

        document.body.appendChild(notificationDiv);
        if (fondo) {
            notificationDiv.style.backgroundColor = fondo;
        } else {
            notificationDiv.style.backgroundColor = '#333'; // Fondo predeterminado
        }

        // Desvanecer después de 3 segundos
        setTimeout(() => {
            document.body.removeChild(notificationDiv);
        }, 3000);
    }


    // cams btn

    function showPopup_cams() {
        const popupContainer = document.createElement('div');
        const closeButton = document.createElement('button');
        const closeIcon = document.createTextNode('❌');
        const popupContent = document.createElement('div');

        popupContainer.style.position = 'fixed';
        popupContainer.style.top = '50%';
        popupContainer.style.left = '50%';
        popupContainer.style.transform = 'translate(-50%, -50%)';
        popupContainer.style.padding = '40px';
        popupContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        popupContainer.style.boxShadow = '0 0 20px rgba(0, 0, 0, 0.8)';
        popupContainer.style.borderRadius = '10px';
        popupContainer.style.zIndex = '9999';
        popupContainer.style.textAlign = 'center';

        closeButton.style.position = 'absolute';
        closeButton.style.top = '10px';
        closeButton.style.right = '10px';
        closeButton.style.background = 'none';
        closeButton.style.border = 'none';
        closeButton.style.cursor = 'pointer';
        closeButton.style.fontSize = '24px';
        closeButton.style.color = 'white';


        closeButton.appendChild(closeIcon);

        popupContent.style.maxHeight = '260px'; // Altura máxima antes de activar el scroll
        popupContent.style.minWidth = '460px';
        popupContent.style.overflowY = 'auto'; // Añadir scroll si es necesario

        // Recuperar el objeto de URLs agrupadas por fecha guardado en el almacenamiento local
        const storedURLsByDate = JSON.parse(localStorage.getItem('RomModelVisitURLsByDate')) || {};

        for (const date in storedURLsByDate) {
            if (storedURLsByDate.hasOwnProperty(date)) {
                const urlsForDate = storedURLsByDate[date];

                const detailsElement = document.createElement('details');
                const summaryElement = document.createElement('summary');
                const deleteButton = document.createElement('button');
                const deleteIcon = document.createTextNode('✖️ Delete Day');
                const urlList = document.createElement('ul');

                //detailsElement.style.margin = '10px 0';
                detailsElement.style.border = '1px solid #8e8e8e';
                detailsElement.style.borderRadius = '5px';
                detailsElement.style.cursor = 'pointer';
                detailsElement.style.padding = '12px';
                detailsElement.style.margin = '10px';
                detailsElement.style.fontSize = '26px';

                summaryElement.textContent = date;
                summaryElement.style.fontWeight = 'bold';

                deleteButton.style.background = 'none';
                deleteButton.style.border = 'none';
                deleteButton.style.cursor = 'pointer';
                deleteButton.style.fontSize = '16px';
                deleteButton.style.color = 'red';
                deleteButton.style.marginTop = '12px';
                deleteButton.style.padding = '4px';
                deleteButton.title = 'Delete';

                deleteButton.appendChild(deleteIcon);
                detailsElement.appendChild(summaryElement);

                detailsElement.appendChild(urlList);
                detailsElement.appendChild(deleteButton);

                if (date === getCurrentDate()) {
                    detailsElement.setAttribute('open', ''); // Agregar 'open' solo si es la fecha actual
                }

                urlsForDate.forEach(url => {
                    const listItem = document.createElement('li');
                    //listItem.textContent = url;
                    const trimmedUrl = url.replace(/\/$/, "");
                    listItem.textContent = trimmedUrl;

                    listItem.style.margin = '4px';
                    listItem.style.padding = '6px';
                    listItem.style.backgroundColor = "rgba(255, 255, 0, 0.5)";
                    listItem.style.borderRadius = "12px";
                    listItem.style.boxShadow = "0 0 10px rgba(0, 0, 0, 0.5)";

                    listItem.addEventListener('click', () => {
                        // Redirigir al hacer clic en un elemento de la lista
                        const currentDomain = window.location.origin;
                        const urlToRedirect = new URL(url, currentDomain).href;
                        window.location.href = urlToRedirect;
                    });

                    urlList.appendChild(listItem);
                });

                deleteButton.addEventListener('click', (event) => {
                    event.stopPropagation();
                    // Eliminar URLs para la fecha correspondiente y actualizar el almacenamiento local
                    delete storedURLsByDate[date];
                    localStorage.setItem('RomModelVisitURLsByDate', JSON.stringify(storedURLsByDate));
                    // Eliminar el elemento del DOM
                    popupContent.removeChild(detailsElement);
                });

                popupContent.appendChild(detailsElement);
            }
        }

        popupContainer.appendChild(closeButton);
        popupContainer.appendChild(popupContent);

        document.body.appendChild(popupContainer);

        closeButton.addEventListener('click', () => {
            document.body.removeChild(popupContainer);
        });

        function getCurrentDate() {
            const currentDate = new Date();
            const year = currentDate.getFullYear();
            const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
            const day = currentDate.getDate().toString().padStart(2, '0');
            return `${year}-${month}-${day}`;
        }
    }

    // Cambiar el selector a #link-cams
    const linkCams = document.querySelector("#link-camx");

    if (linkCams) {
        linkCams.addEventListener('click', showPopup_cams);
    } else {
        console.error("Elemento #link-cams no encontrado");
    }

    // activar modo CHAT

    function ShowNavChatRoom() {


        // disparar follow
        const linkCamsButton = document.querySelector("#link-camx");
        const followButton = document.querySelector("#roomTabs > div.tabBar > div:nth-child(1) > div.followButton");
        /*
        if (linkCamsButton && followButton) {       
            linkCamsButton.addEventListener('click', function () {
                followButton.click();
            });
        }
        */

        // Obtener el elemento del enlace de chat activo
        const chatRoomLink = document.querySelector("#TheaterModeRoomContents");
        const link6 = document.querySelector("#link6");
        const linkSendTokens = document.querySelector("#link-send-tokens");
        const linkChatRecRoom = document.querySelector("#link-chat-rec-room");
        const linkFollow = document.querySelector("#link-follow");
        // Verificar si el elemento del enlace de chat activo existe
        if (chatRoomLink) {
            link6.style.display = 'block';
            linkSendTokens.style.display = 'block';
            linkChatRecRoom.style.display = 'block';
            linkFollow.style.display = 'block';

        } else {
            link6.style.display = 'none';
            linkSendTokens.style.display = 'none';
            linkChatRecRoom.style.display = 'none';
            linkFollow.style.display = 'none';
        }
    }

    setTimeout(function () {
        ShowNavChatRoom();
    }, 333);

    // follows 
// Agregar nuevo follow al hacer clic en #link-follow
// Agregar nuevo follow al hacer clic en #link-follow
const linkFollow = document.querySelector("#link-follow");
if (linkFollow) {
    linkFollow.addEventListener('click', () => {
        const currentDomain = window.location.pathname.split('/')[1];
        const followsList = JSON.parse(localStorage.getItem('playcamFollows')) || [];

        if (!followsList.includes(currentDomain)) {
            followsList.push(currentDomain);
            localStorage.setItem('playcamFollows', JSON.stringify(followsList));
            console.log("Nuevo follow agregado:", currentDomain);
        } else {
            console.log("El follow ya existe en la lista:", currentDomain);
        }
        
        // Mostrar popup de follows en orden inverso
        showPopupFollows(followsList.reverse());
    });
} else {
    console.error("Elemento #link-follow no encontrado");
}

function showPopupFollows(followsList) {
    const popupContainer = document.createElement('div');
    const closeButton = document.createElement('button');
    const closeIcon = document.createTextNode('❌');
    const popupContent = document.createElement('div');

    popupContainer.style.position = 'fixed';
    popupContainer.style.top = '50%';
    popupContainer.style.left = '50%';
    popupContainer.style.transform = 'translate(-50%, -50%)';
    popupContainer.style.padding = '40px';
    popupContainer.style.backgroundColor = 'rgba(0, 255, 0, 0.5)'; // Cambiado a verde
    popupContainer.style.boxShadow = '0 0 20px rgba(0, 0, 0, 0.8)';
    popupContainer.style.borderRadius = '10px';
    popupContainer.style.zIndex = '9999';
    popupContainer.style.textAlign = 'center';

    closeButton.style.position = 'absolute';
    closeButton.style.top = '10px';
    closeButton.style.right = '10px';
    closeButton.style.background = 'none';
    closeButton.style.border = 'none';
    closeButton.style.cursor = 'pointer';
    closeButton.style.fontSize = '24px';
    closeButton.style.color = 'white';
    closeButton.appendChild(closeIcon);

    popupContent.style.maxHeight = '260px';
    popupContent.style.minWidth = '460px';
    popupContent.style.overflowY = 'auto';

    followsList.forEach(follow => {
        const listItem = document.createElement('div');
        listItem.textContent = follow;
        listItem.style.margin = '10px 0';
        listItem.style.fontSize = '18px';
        listItem.style.backgroundColor = "rgba(0, 255, 0, 0.5)"; // Cambiado a verde
        listItem.style.borderRadius = "12px";
        listItem.style.boxShadow = "0 0 10px rgba(0, 0, 0, 0.5)";
        listItem.style.color = 'white';
        listItem.style.padding = "4px";
        listItem.style.cursor = "pointer";

        const deleteButton = document.createElement('button');
        const deleteIcon = document.createTextNode('✖️');
        deleteButton.style.background = 'none';
        deleteButton.style.border = 'none';
        deleteButton.style.cursor = 'pointer';
        deleteButton.style.fontSize = '16px';
        deleteButton.style.color = 'red';
        deleteButton.style.marginLeft = '6px';

        deleteButton.appendChild(deleteIcon);
        listItem.appendChild(deleteButton);

        listItem.addEventListener('click', () => {
            const currentDomain = window.location.origin;
            const urlToRedirect = new URL(follow, currentDomain).href;
            window.location.href = urlToRedirect;
        });

        deleteButton.addEventListener('click', (event) => {
            event.stopPropagation();
            // Eliminar el follow del almacenamiento y actualizar el listado
            followsList.splice(followsList.indexOf(follow), 1);
            localStorage.setItem('playcamFollows', JSON.stringify(followsList));
            // Eliminar el elemento del DOM
            popupContent.removeChild(listItem);
        });

        popupContent.appendChild(listItem);
    });

    popupContainer.appendChild(closeButton);
    popupContainer.appendChild(popupContent);

    document.body.appendChild(popupContainer);

    closeButton.addEventListener('click', () => {
        document.body.removeChild(popupContainer);
    });
}



});


function GetRoomVisit() {
    document.addEventListener('DOMContentLoaded', function () {

        if (window.location.origin === domain) {

            const pathAfterDomain = window.location.pathname.substring(1).trim();
            const currentDate = new Date().toISOString().split('T')[0];
            let storedURLsByDate = JSON.parse(localStorage.getItem('RomModelVisitURLsByDate')) || {};
            let currentURLs = storedURLsByDate[currentDate] || [];
            if (pathAfterDomain !== '' && !currentURLs.includes(pathAfterDomain)) {
                currentURLs.unshift(pathAfterDomain);
                storedURLsByDate[currentDate] = currentURLs;
                localStorage.setItem('RomModelVisitURLsByDate', JSON.stringify(storedURLsByDate));
            }
        }
    });
}

// Llamar a la función
GetRoomVisit();
