// Set up basic variables for app
const record = document.querySelector("#btn-record");
const stop = document.querySelector("#btn-stop")
const soundClips = document.querySelector(".sound-clips");
const canvas = document.querySelector(".visualizer");
const mainSection = document.querySelector(".main-controls");

// Disable stop button while not recording
stop.disabled = true;

// Visualiser setup - create web audio api context and canvas
let audioCtx;
const canvasCtx = canvas.getContext("2d");

// Main block for doing the audio recording
if (navigator.mediaDevices.getUserMedia) {
  console.log("The mediaDevices.getUserMedia() method is supported.");

  const constraints = { audio: true };
  let chunks = [];

  let onSuccess = function (stream) {
    const mediaRecorder = new MediaRecorder(stream);

    visualize(stream);

    record.onclick = function () {
      mediaRecorder.start();
      console.log(mediaRecorder.state);
      console.log("Recorder started.");
      record.style.background = "red";

      stop.disabled = false;
      record.disabled = true;
    };

    stop.onclick = function () {
      mediaRecorder.stop();
      console.log(mediaRecorder.state);
      console.log("Recorder stopped.");
      record.style.background = "";
      record.style.color = "";

      stop.disabled = true;
      record.disabled = false;
    };


    // ...

mediaRecorder.onstop = function (e) {
  console.log("Last data to read (after MediaRecorder.stop() called).");

  const clipName = prompt(
    "Enter a name for your sound clip?",
    "My unnamed clip_" + Math.random(),
  );

  // Si el usuario hace clic en "Cancelar", no añadir el clip al DOM
  if (clipName !== null) {
    const clipContainer = document.createElement("article");
    const clipLabel = document.createElement("p");
    const audio = document.createElement("audio");
    const deleteButton = document.createElement("button");

    clipContainer.classList.add("clip");
    audio.setAttribute("controls", "");
    deleteButton.textContent = "Delete";
    deleteButton.className = "delete";

    clipLabel.textContent = clipName;

    clipContainer.appendChild(audio);
    clipContainer.appendChild(clipLabel);
    clipContainer.appendChild(deleteButton);
    soundClips.appendChild(clipContainer);

    audio.controls = true;
    const blob = new Blob(chunks, { type: mediaRecorder.mimeType });
    chunks = [];
    const audioURL = window.URL.createObjectURL(blob);
    audio.src = audioURL;
    console.log("recorder stopped");

    deleteButton.onclick = function (e) {
      e.target.closest(".clip").remove();
      deleteAudioClip(e.target.closest(".clip"));
    };

    clipLabel.onclick = function () {
      const existingName = clipLabel.textContent;
      const newClipName = prompt("Enter a new name for your sound clip?");
      if (newClipName === null) {
        clipLabel.textContent = existingName;
      } else {
        clipLabel.textContent = newClipName;
      }
    };

    // Guardar automáticamente en el almacenamiento local
    saveAudioData(clipLabel.textContent, audioURL, clipContainer);
  }
};

// ...


    mediaRecorder.ondataavailable = function (e) {
      chunks.push(e.data);
    };
  };

  let onError = function (err) {
    console.log("The following error occured: " + err);
  };

  navigator.mediaDevices.getUserMedia(constraints).then(onSuccess, onError);
} else {
  console.log("MediaDevices.getUserMedia() not supported on your browser!");
}

function visualize(stream) {
  if (!audioCtx) {
    audioCtx = new AudioContext();
  }

  const source = audioCtx.createMediaStreamSource(stream);

  const analyser = audioCtx.createAnalyser();
  analyser.fftSize = 2048;
  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);

  source.connect(analyser);

  draw();

  function draw() {
    const WIDTH = canvas.width;
    const HEIGHT = canvas.height;

    requestAnimationFrame(draw);

    analyser.getByteTimeDomainData(dataArray);

    canvasCtx.fillStyle = "rgb(200, 200, 200)";
    canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

    canvasCtx.lineWidth = 2;
    canvasCtx.strokeStyle = "rgb(0, 0, 0)";

    canvasCtx.beginPath();

    let sliceWidth = (WIDTH * 1.0) / bufferLength;
    let x = 0;

    for (let i = 0; i < bufferLength; i++) {
      let v = dataArray[i] / 128.0;
      let y = (v * HEIGHT) / 2;

      if (i === 0) {
        canvasCtx.moveTo(x, y);
      } else {
        canvasCtx.lineTo(x, y);
      }

      x += sliceWidth;
    }

    canvasCtx.lineTo(canvas.width, canvas.height / 2);
    canvasCtx.stroke();
  }
}

window.onresize = function () {
  canvas.width = mainSection.offsetWidth;
};

// Función para renderizar los audios al cargar la página
window.onload = function () {
  renderAudios();
};


function saveAudioData(name, blobURL, clipContainer) {
  // Obtener la lista actual de audios desde el almacenamiento local
  const audioList = JSON.parse(localStorage.getItem("playcamaudio_notas")) || [];

  // Crear un nuevo objeto con la información del audio
  const newAudio = {
    name: name,
    AUDIO: blobURL,
    text_original: name, // Puedes ajustar esto según tus necesidades
    text_translated: "", // Puedes ajustar esto según tus necesidades
  };

  // Agregar el nuevo objeto a la lista de audios
  audioList.push(newAudio);

  // Guardar la lista actualizada en el almacenamiento local
  localStorage.setItem("playcamaudio_notas", JSON.stringify(audioList));

  // Eliminar el clip del DOM
  clipContainer.remove();

  // Renderizar los audios nuevamente después de guardar
  renderAudios();
}


function deleteAudioClip(clipContainer) {
  // Eliminar el clip del DOM
  const audioElement = clipContainer.querySelector("audio");

  // Revocar la URL del objeto blob
  window.URL.revokeObjectURL(audioElement.src);
  let audioList = JSON.parse(localStorage.getItem("playcamaudio_notas")) || [];

  // Obtener el nombre del audio que se eliminará
  const audioName = clipContainer.querySelector("p").textContent;

  // Filtrar la lista para excluir el audio que se eliminará
  audioList = audioList.filter((audio) => audio.name !== audioName);

  // Guardar la lista actualizada en el almacenamiento local
  localStorage.setItem("playcamaudio_notas", JSON.stringify(audioList));


  clipContainer.remove();
}

function renderAudios() {
  // Obtener la lista de audios desde el almacenamiento local
  const audioList = JSON.parse(localStorage.getItem("playcamaudio_notas")) || [];

  // Limpiar la sección de clips antes de renderizar de nuevo
  soundClips.innerHTML = "";

  // Renderizar cada audio en el DOM
  audioList.forEach((audio) => {
    const clipContainer = document.createElement("article");
    const clipLabel = document.createElement("p");
    const audioElement = document.createElement("audio");
    const deleteButton = document.createElement("button");

    clipContainer.classList.add("clip");
    audioElement.setAttribute("controls", "");
    deleteButton.textContent = "Delete";
    deleteButton.className = "delete";

    clipLabel.textContent = audio.name;

    clipContainer.appendChild(audioElement);
    clipContainer.appendChild(clipLabel);
    clipContainer.appendChild(deleteButton);
    soundClips.appendChild(clipContainer);

    audioElement.controls = true;
    audioElement.src = audio.AUDIO;

    deleteButton.onclick = function () {
      deleteAudioClip(clipContainer);
    };

    clipLabel.onclick = function () {
      const existingName = clipLabel.textContent;
      const newClipName = prompt("Enter a new name for your sound clip?");
      if (newClipName === null) {
        clipLabel.textContent = existingName;
      } else {
        clipLabel.textContent = newClipName;
      }
    };
  });
}