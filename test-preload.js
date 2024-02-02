const { ipcRenderer } = require('electron');

document.addEventListener('DOMContentLoaded', () => {
  const notifyButton = document.createElement('button');
  notifyButton.textContent = 'Notificar';
  notifyButton.style.position = 'fixed';
  notifyButton.style.bottom = '0';
  notifyButton.style.width = '100%';
  notifyButton.style.height = '36px';
  notifyButton.style.backgroundColor = 'green';
  notifyButton.style.color = 'white';
  notifyButton.style.textAlign = 'center';
  notifyButton.style.lineHeight = '36px';
  notifyButton.style.cursor = 'pointer';
  notifyButton.style.boxShadow = '0px -5px 5px rgba(0, 0, 0, 0.2)'; // Sombra
  notifyButton.style.borderRadius = '3px';

  // Agregar el botón al cuerpo del documento
  document.body.appendChild(notifyButton);

  // Agregar un manejador de eventos al botón
  notifyButton.addEventListener('click', async () => {
    // Solicitar permiso para mostrar notificaciones
    const permission = await Notification.requestPermission();
alert(permission);
    if (permission === 'granted') {
      // Enviar el evento de notificación al proceso principal
      NOTIFY('Notification -> Saved Successfully');
      ipcRenderer.send('trigger-notification');
    } else {
      console.warn('El usuario denegó el permiso para mostrar notificaciones.');
    }
  });

  function NOTIFY(msg) {
    const NOTIFICATION_TITLE = 'BotCam-Trafic';
    const NOTIFICATION_BODY = `Notification / ${msg} `;
    new Notification(NOTIFICATION_TITLE, { body: NOTIFICATION_BODY });
  }
});
