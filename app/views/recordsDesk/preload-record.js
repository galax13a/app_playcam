console.log('👋 This message is being logged by "renderer.js", included via webpack');
document.addEventListener('DOMContentLoaded', () => {

  const { ipcRenderer } = require('electron');
  const { writeFile } = require('fs');

  let mediaRecorder;
  let recordedChunks = [];
  let loadPreview = false;

  const startBtn = document.getElementById('startBtn');
  startBtn.onclick = e => {
    startRecording();
    startBtn.innerHTML = `<i class='bx bx-video-recording fs-2'></i>`;
    startBtn.style.backgroundColor = 'red';
  };

  const stopBtn = document.getElementById('stopBtn');
//  stopBtn.style.display = 'none';

  stopBtn.onclick = e => {
    mediaRecorder.stop();
    startBtn.innerText = 'Start';
    startBtn.style.backgroundColor = 'white';
  };

  const videoSelectBtn = document.getElementById('videoSelectBtn');
  videoSelectBtn.onclick = getVideoSources;

  const selectMenu = document.getElementById('selectMenu')
  setInterval(getVideoSources, 2600);
  // Buttons

  const fileInput = document.getElementById('fileInput');
  const loadVideoBtn = document.getElementById('loadVideoBtn');
  const videoElement = document.getElementById('video-grabar'); // video source
  const previewVideo = document.getElementById('previewVideo');
  previewVideo.textContent = 'Video Loader ... ';

  previewVideo.style.display = 'none';
  videoElement.style.display = 'none';

  loadVideoBtn.addEventListener('click', () => {

    loadPreview = true;//await toggleFunction();

    console.log('Loading video ' + loadPreview);
    fileInput.click();

  });

   
  fileInput.addEventListener('change', async () => {

    const file = fileInput.files[0];
    if (file) {
      
      const videoURL = URL.createObjectURL(file);
      previewVideo.src = videoURL;
      previewVideo.controls = true;
      await previewVideo.play();
    }
  });


 async function toggleFunction() {
    let state = false;
    function toggle() {
        state = !state; 
        return state; 
    }
    return toggle;
}
  async function getVideoSources() {
    console.log("Loading video sources..." + loadPreview);
    if(loadPreview) {
      previewVideo.style.display = 'block';
      videoElement.style.display = 'none';
    }else{
      previewVideo.style.display = 'none';
      videoElement.style.display = 'block';
    }

    const currentValue = selectMenu.value;
    // Obtener las fuentes de video disponibles
    const inputSources = await ipcRenderer.invoke('getSources');
    // Crear un conjunto para mantener un registro de las fuentes de video ya agregadas
    const existingSources = new Set();
    // Limpiar el menú desplegable
    selectMenu.innerHTML = '';
    // Iterar sobre las fuentes de video disponibles
    inputSources.forEach(async source => {
      // Crear una nueva opción
      const element = document.createElement("option");
      element.value = source.id;
      element.innerHTML = source.name;
      selectMenu.appendChild(element);
      // Añadir la fuente de video al conjunto de fuentes existentes
      existingSources.add(source.id);
      // Si la fuente actual coincide con la seleccionada, mostrar una vista previa
      if (source.id === currentValue) {
        const screenStream = await navigator.mediaDevices.getUserMedia({
          video: {
            mandatory: {
              chromeMediaSource: 'desktop',
              chromeMediaSourceId: currentValue
            }
          }
        });

        // Mostrar la vista previa en un elemento de video
        videoElement.srcObject = screenStream;
        await videoElement.play();
      }
    });

    // Restaurar el valor seleccionado anteriormente si aún está disponible
    if (existingSources.has(currentValue)) {
      selectMenu.value = currentValue;
    }
  }

  selectMenu.addEventListener('change', () => {
    //localStorage.setItem('playcamSelectRecordWindowID', selectMenu.value);
    loadPreview = false;
    previewVideo.style.display = 'none';
      videoElement.style.display = 'block';
});


  async function startRecording() {
    const screenId = selectMenu.options[selectMenu.selectedIndex].value
//loadPreview = await toggleFunction();

  console.log("grabando....");
    // AUDIO WONT WORK ON MACOS
    const IS_MACOS = await ipcRenderer.invoke("getOperatingSystem") === 'darwin'
    console.log(await ipcRenderer.invoke('getOperatingSystem'))
    const audio = !IS_MACOS ? {
      mandatory: {
        chromeMediaSource: 'desktop'
      }
    } : false

    const constraints = {
      audio: {
        mandatory: {
          chromeMediaSource: 'desktop',
          chromeMediaSourceId: screenId,
          echoCancellation: false // Desactivar la cancelación de eco
        }
      },
      video: {
        mandatory: {
          chromeMediaSource: 'desktop',
          chromeMediaSourceId: screenId
        }
      }
    };


    // Create a Stream
    const stream = await navigator.mediaDevices
      .getUserMedia(constraints);

    // Preview the source in a video element
    videoElement.srcObject = stream;
    await videoElement.play();

    mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm; codecs=vp9' });
    mediaRecorder.ondataavailable = onDataAvailable;
    mediaRecorder.onstop = stopRecording;
    mediaRecorder.start();
  }

  function onDataAvailable(e) {
    recordedChunks.push(e.data);
  }


  async function stopRecording() {
    videoElement.srcObject = null

    const blob = new Blob(recordedChunks, {
      type: 'video/webm; codecs=vp9'
    });

    const buffer = Buffer.from(await blob.arrayBuffer());
    recordedChunks = []

    const { canceled, filePath } = await ipcRenderer.invoke('showSaveDialog')
    if (canceled) return

    if (filePath) {
      writeFile(filePath, buffer, () => console.log('video saved successfully!'));
    }
  }
});