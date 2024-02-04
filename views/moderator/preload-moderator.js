const { ipcRenderer, remote } = require('electron');

console.log('Running Moderator v1.1');

document.addEventListener('DOMContentLoaded', function () {

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
floatingMenu.style.minHeight = '60px';
floatingMenu.style.backgroundColor = 'rgba(51, 51, 51, 0.9)';
floatingMenu.style.color = 'white';
floatingMenu.style.padding = '2px 2px 4px 15px';
floatingMenu.style.borderBottom = '3px solid rgba(216, 11, 96, 0.796)';
floatingMenu.style.boxShadow = 'rgba(255, 255, 0, 0.5) 0px 4px 8px';
floatingMenu.style.marginTop = '3px';

// Crear el contenedor <ul>
const ulContainer = document.createElement('ul');
ulContainer.style.listStyle = 'none';
ulContainer.style.margin = '0';
ulContainer.style.padding = '0';
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
function createLink(id, text) {
    const liElement = document.createElement('li');
    const link = document.createElement('a');
    link.href = '#';
    link.id = id;
    link.textContent = text;
    applyLinkStyles(link);

    liElement.appendChild(link);
    return liElement;
}

// Crear enlaces
const links = [
    createLink('link1', 'Search'),
    createLink('link2', 'Send Scheduled Tokens'),
    createLink('link3', 'Login'),
    createLink('link4', 'Join the Community'),
    createLink('link5', 'Follow'),
    createLink('link6', 'Mode Chat'), // Nuevo enlace
];

// Agregar enlaces al contenedor <ul>
links.forEach(link => ulContainer.appendChild(link));

// Agregar el contenedor <ul> al menú flotante
floatingMenu.appendChild(ulContainer);

// Agregar el menú flotante al body
document.body.appendChild(floatingMenu);

});