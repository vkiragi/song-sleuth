const webAudioBeatDetector = require("web-audio-beat-detector");

let audioContext;
let audioBuffer;

async function initAudio() {
  audioContext = new (window.AudioContext || window.webkitAudioContext)();
}

async function loadAudioFile(file) {
  const arrayBuffer = await file.arrayBuffer();
  audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
}

async function analyzeAudio() {
  if (!audioBuffer) {
    alert("Please select an audio file first.");
    return;
  }

  try {
    console.log("Starting analysis...");
    const tempo = await webAudioBeatDetector.analyze(audioBuffer);
    console.log("Tempo analysis complete:", tempo);
    const guess = await webAudioBeatDetector.guess(audioBuffer);
    console.log("BPM guess complete:", guess);
    displayResults({ tempo, ...guess });
  } catch (error) {
    console.error("Detailed error:", error);
    displayError(
      "An error occurred while analyzing the audio: " + error.message
    );
  }
}

function displayResults(data) {
  document.getElementById("tempo").textContent = data.tempo.toFixed(2);
  document.getElementById("bpm").textContent = data.bpm;
  document.getElementById("offset").textContent = data.offset.toFixed(2);
}

function displayError(message) {
  console.error(message);
  alert(message);
}

document
  .getElementById("audioFile")
  .addEventListener("change", async (event) => {
    await initAudio();
    await loadAudioFile(event.target.files[0]);
  });

document
  .getElementById("analyzeButton")
  .addEventListener("click", analyzeAudio);
