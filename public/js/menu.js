document.addEventListener('DOMContentLoaded', function () {
    const sideMenu = document.querySelector('aside');
    const menuBtn = document.getElementById('menu-btn');
    const closeBtn = document.getElementById('close-btn');
    const darkMode = document.querySelector('.dark-mode');

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

    links.forEach(function (link) {
        link.addEventListener('click', function (event) {
            event.preventDefault(); 
            links.forEach(function (otherLink) {
                otherLink.classList.remove('active');
            });
            link.classList.add('active');
        });
    });


    window.addEventListener('load', function () { // load dasboard
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && xhr.status == 200) {
                document.getElementById('app_container').innerHTML = xhr.responseText;
            }
        };
        xhr.open('GET', '/app/dashboard', true);
        xhr.send();
    });

});