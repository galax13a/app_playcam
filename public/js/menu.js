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


    Orders.forEach(order => {
        const tr = document.createElement('tr');
        const trContent = `
        <td>${order.productName}</td>
        <td>${order.productNumber}</td>
        <td>${order.paymentStatus}</td>
        <td class="${order.status === 'Declined' ? 'danger' : order.status === 'Pending' ? 'warning' : 'primary'}">${order.status}</td>
        <td class="primary">Details</td>
    `;
        tr.innerHTML = trContent;
        document.querySelector('table tbody').appendChild(tr);
    });
  

    var menuToglePlay = document.getElementById('menuToglePlay');
    var links = menuToglePlay.querySelectorAll('a');

    links.forEach(function (link) {
        link.addEventListener('click', function (event) {
            event.preventDefault(); // Evitar la navegación predeterminada

            // Eliminar la clase "active" de todos los enlaces
            links.forEach(function (otherLink) {
                otherLink.classList.remove('active');
            });

            // Agregar la clase "active" al enlace actual
            link.classList.add('active');
        });
    });
});