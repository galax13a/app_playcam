const { ipcRenderer, remote } = require('electron');

console.log('Running traductor v1');


window.addEventListener('DOMContentLoaded', () => {


    const NOTIFICATION_TITLE = 'Title'
    const NOTIFICATION_BODY = 'Notification from the Renderer process. Click to log to console.'
    const CLICK_MESSAGE = 'Notification clicked!'

    new window.Notification(NOTIFICATION_TITLE, { body: NOTIFICATION_BODY })
        .onclick = () => { document.getElementById('output').innerText = CLICK_MESSAGE }

    const elementToHide = document.querySelector("#gb");
    if (elementToHide) {
        elementToHide.style.display = "none";
    }

    const textarea = document.querySelector('textarea[aria-label="Texto original"]');
    let topic = "Hello. How are you?";
    textarea.value = '';

    const elementToAdjust = document.querySelector("#yDmH0d > c-wiz"); //
    if (elementToAdjust) {
        elementToAdjust.style.marginTop = "-65px";
    }

    const elementToHideBtns = document.querySelector("#yDmH0d > c-wiz > div > div.ToWKne > c-wiz > nav");

    if (elementToHideBtns) {
        elementToHideBtns.style.display = "none";
    }


    function simulateHumanTyping(text) {
        let index = 0;
        textarea.value = '';

        function typeCharacter() {
            const char = text[index];
            textarea.value += char;
            textarea.dispatchEvent(new Event('input', { bubbles: true }));
            index++;
            if (index < text.length) {
                setTimeout(typeCharacter, getRandomTypingDelay());
            } else {
                // Simular un evento de cambio
                textarea.dispatchEvent(new Event('change', { bubbles: true }));
                // Desencadenar un clic después de escribir el texto idioma
                document.querySelector("#i13 > span.VfPpkd-YVzG2b").click();
            }
        }
        // Iniciar la simulación
        typeCharacter();
    }
    // Función para obtener un retraso aleatorio para simular la velocidad de escritura humana
    function getRandomTypingDelay() {
        return Math.floor(Math.random() * (10 - 50 + 1)) + 50;
    }
    // Iniciar la simulación después de un breve intervalo
    setTimeout(() => {
        // simulateHumanTyping(topic);   

    }, 3000);

    setTimeout(() => {

        const copyButton = document.createElement('div');
        copyButton.style.position = 'fixed';
        copyButton.style.bottom = '0';
        copyButton.style.width = '100%';
        copyButton.style.height = '36px';
        copyButton.style.backgroundColor = 'green';
        copyButton.style.color = 'white';
        copyButton.style.textAlign = 'center';
        copyButton.style.lineHeight = '36px';
        copyButton.style.cursor = 'pointer';

        copyButton.style.boxShadow = '0px -5px 5px rgba(0, 0, 0, 0.2)'; // Sombra
        copyButton.style.borderRadius = '3px';
        copyButton.textContent = 'Copy Text';

        document.body.appendChild(copyButton);

        // Agregar evento de clic al botón de copiar
        copyButton.addEventListener('click', () => {
            const contentSelector = "#yDmH0d > c-wiz > div > div.ToWKne > c-wiz > div.OlSOob > c-wiz > div.ccvoYb.EjH7wc > div.AxqVh > div.OPPzxe > c-wiz.sciAJc > div > div.usGWQd > div > div.lRu31";
            const contentElement = document.querySelector(contentSelector);
            const copiedText = contentElement.innerText;
            ipcRenderer.send('copied-text-traductor', copiedText);
            console.log('Texto copiado:', copiedText);
        });

    }, 1000);

});
