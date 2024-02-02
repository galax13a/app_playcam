document.addEventListener('DOMContentLoaded', function () {
    const sideMenu = document.querySelector('.sidebar');
    const menuBtn = document.getElementById('menu-btn');
    const closeBtn = document.getElementById('close-btn');
    const darkMode = document.querySelector('.dark-mode');

    // Función para guardar la última ruta en localStorage
    function guardarUltimaRuta(ruta) {
        localStorage.setItem('next_router', ruta);
    }

    // Función para cargar la última ruta desde localStorage
    function cargarUltimaRuta() {
        return localStorage.getItem('next_router') || '/app/dashboard';
    }

    const isDarkModeEnabled = localStorage.getItem('darkMode') === 'true';

    document.body.classList.toggle('dark-mode-variables', isDarkModeEnabled);
    const iconLightMode = darkMode.querySelector('span:nth-child(1)');
    const iconDarkMode = darkMode.querySelector('span:nth-child(2)');
    iconLightMode.classList.toggle('active', !isDarkModeEnabled);
    iconDarkMode.classList.toggle('active', isDarkModeEnabled);

    menuBtn.addEventListener('click', () => {
        sideMenu.style.display = 'block';
    });

    closeBtn.addEventListener('click', () => {
        sideMenu.style.display = 'none';
    });

    darkMode.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode-variables');
        const iconLightMode = darkMode.querySelector('span:nth-child(1)');
        const iconDarkMode = darkMode.querySelector('span:nth-child(2)');
        iconLightMode.classList.toggle('active', !document.body.classList.contains('dark-mode-variables'));
        iconDarkMode.classList.toggle('active', document.body.classList.contains('dark-mode-variables'));
        const isDarkModeEnabledNow = document.body.classList.contains('dark-mode-variables');
        localStorage.setItem('darkMode', isDarkModeEnabledNow.toString());
    });

    var menuToglePlay = document.getElementById('menuToglePlay');
    var links = menuToglePlay.querySelectorAll('a');

    // Obtener la última ruta almacenada
    var next_router = cargarUltimaRuta();

    links.forEach(function (link) {
        // Aplicar la clase active al enlace correspondiente
        if (link.getAttribute('hx-get') === next_router) {
            link.classList.add('active');
        }

        link.addEventListener('click', function (event) {
            
            event.preventDefault();
            links.forEach(function (otherLink) {
                otherLink.classList.remove('active');
            });

            link.classList.add('active');
            // Guardar la ruta activa
            guardarUltimaRuta(link.getAttribute('hx-get'));
            if (cargarUltimaRuta() === '/app/moderator') {
                //     console.log('moderator ruta');
                var script = document.createElement('script');
                script.src = '/js/renders/R-moderator.js';
                script.defer = true;
                script.addEventListener('load', function () {
                    setTimeout(function () {
                        GetButtonsEvents();
                    }, 600);
                });
                document.body.appendChild(script);
            } else {
                // console.log('No es la ruta del moderator, removiendo el script');
                var existingScript = document.querySelector('script[src="/js/render-moderator.js"]');

                if (existingScript) {
                    existingScript.parentNode.removeChild(existingScript);
                }
            }

        });
    });


    if (next_router === '/app/moderator') {
        // console.log('moderator ruta');
        var script = document.createElement('script');
        script.src = '/js/renders/R-moderator.js';
        script.defer = true;
        script.addEventListener('load', function () {
            setTimeout(function () {
                GetButtonsEvents();
            }, 1000);
        });
        document.body.appendChild(script);
    } else {
        //console.log('No es la ruta del moderator, removiendo el script');
        var existingScript = document.querySelector('script[src="/js/render-moderator.js"]');
        if (existingScript) {
            existingScript.parentNode.removeChild(existingScript);
        }
    }

    window.addEventListener('load', function () { // load dashboard
            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4 && xhr.status == 200) {
                    document.getElementById('app_content').innerHTML = xhr.responseText;
                }
            };
            xhr.open('GET', next_router, true);
            xhr.send();
    });


});
