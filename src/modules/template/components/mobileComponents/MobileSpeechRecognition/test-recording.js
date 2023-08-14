let mediaRecorder;

let chunks = [];

let isRecording = false;

let socket;

if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
  console.log('getUserMedia supported.');

  navigator.mediaDevices
    .getUserMedia({ audio: true })
    .then((stream) => {
      const audioElement = document.getElementById('audio');

      audioElement.srcObject = stream;
      const audioContext = new AudioContext();

      const sourceNode = audioContext.createMediaStreamSource(stream);

      const processorNode = audioContext.createScriptProcessor(1024, 1, 1);

      sourceNode.connect(processorNode);

      processorNode.connect(audioContext.destination);

      processorNode.onaudioprocess = (event) => {
        if (isRecording) {
          const audioData = event.inputBuffer.getChannelData(0);

          console.log(audioData, 'audio data');

          sendAudioFrame(audioData);
        }
      };

      mediaRecorder = {
        start: () => {
          isRecording = true;
        },

        stop: () => {
          isRecording = false;
        },
      };
    })

    .catch((error) => {
      console.error('Failed to get user media:', error);
    });
} else {
  console.log('getUserMedia not supported.');
}

function startRecording() {
  if (mediaRecorder && mediaRecorder.start) {
    mediaRecorder.start();

    isRecording = true;

    // Set a timeout to stop recording after 5 seconds

    streamTimeout = setTimeout(() => {
      stopRecording();
    }, 5000);

    // Create a WebSocket connection if it doesn't exist

    if (!socket || socket.readyState !== socket.OPEN) {
      socket = new WebSocket('ws://localhost:8001/audio');

      socket.onopen = () => {
        console.log('WebSocket connection established.');
      };

      socket.onclose = () => {
        console.log('WebSocket connection closed.');
      };

      socket.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
    }
  }
}

function stopRecording() {
  if (mediaRecorder && mediaRecorder.stop) {
    mediaRecorder.stop();

    isRecording = false;

    // Clear the timeout if it hasn't expired yet

    clearTimeout(streamTimeout);
  }
}

function sendAudioFrame(frameData) {
  // Create a WebSocket connection to the server

  console.log(frameData);

  if (!socket || socket.readyState !== socket.OPEN) {
    socket = new WebSocket('ws://localhost:8001/audio');

    socket.onopen = () => {
      console.log('WebSocket connection established.');
    };

    socket.onclose = () => {
      console.log('WebSocket connection closed.');
    };

    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  }

  // Send the audio frame data to the server

  socket.send(frameData);
}
