import AudioMotionAnalyzer from "audiomotion-analyzer";
import { postAPISpeech } from "src/lib/axios";

export const messageHandlers = new Set();

export const addMessageHandler = (handler: Function) => {
  messageHandlers.add(handler);
};

export const removeMessageHandler = (handler: Function) => {
  messageHandlers.delete(handler);
};

function blobToArrayBuffer(blob: any) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const arrayBuffer = reader.result;
      resolve(arrayBuffer);
    };

    reader.onerror = (error) => {
      reject(error);
    };

    reader.readAsArrayBuffer(blob);
  });
}

export const streamMicrophoneAudioToSocket = async ({
  socket,
  setAudioRecorderState,
  setIsSpeaking,
}: any) => {
  const VOICE_MIN_DECIBELS = -35;
  const DELAY_BETWEEN_DIALOGS = 2000;
  const DIALOG_MAX_LENGTH = 60 * 1000;
  const blobs: any = [];
  // instantiate analyzer

  const analyserElement: any = document.createElement("audio-analyser");
  document.getElementById("analyser-container")?.appendChild(analyserElement);
  const audioMotion = new AudioMotionAnalyzer(analyserElement, {
    gradient: "rainbow",
    height: 100,
    showScaleY: true,
  });
  let stream: any = null;
  const constraints = {
    video: false,
    audio: {
      autoGainControl: false,
      echoCancellation: false,
      noiseSuppression: false,
    },
  };

  try {
    stream = await navigator.mediaDevices.getUserMedia(constraints);
    // create stream using audioMotion audio context
    const micStream = audioMotion.audioCtx.createMediaStreamSource(stream);
    // connect microphone stream to analyzer
    audioMotion.connectInput(micStream);
    // mute output to prevent feedback loops from the speakers
    audioMotion.volume = 0;
    console.log("stream", stream);
  } catch (error) {
    throw new Error(`
		  MediaDevices.getUserMedia() threw an error. 
		  Stream did not open
		`);
  }

  const time = new Date();
  let startTime: number = time.getTime();
  let lastDetectedTime: number = time.getTime();
  let soundDetected = false;
  const recorder = new MediaRecorder(stream);

  const audioContext = new AudioContext();
  const audioStreamSource = audioContext.createMediaStreamSource(stream);
  const analyser = audioContext.createAnalyser();
  analyser.minDecibels = VOICE_MIN_DECIBELS;
  audioStreamSource.connect(analyser);

  const bufferLength = analyser.frequencyBinCount;
  const domainData = new Uint8Array(bufferLength);

  function stopAudioActivity() {
    console.log("Recorder Stopped");
    soundDetected = false;
    recorder.stop();
    setAudioRecorderState("inactive");
    setIsSpeaking(false);
    audioMotion.disconnectInput();
    stream.getTracks().forEach((track: any) => track.stop());
    if (analyserElement) analyserElement.remove();
  }

  const detectSound = () => {
    // stop detection only when recording is stopped
    if (recorder.state === "inactive") return;

    let time: Date = new Date();
    let currentTime: number = time.getTime();

    // stop after max dialog length is reached
    // if (currentTime > startTime + DIALOG_MAX_LENGTH) {
    //   const abortTimeInMin = (DIALOG_MAX_LENGTH / (1000 * 60)).toFixed(2);
    //   console.log(
    //     `Aborting recording: You have reached max dialog length of ${abortTimeInMin} minutes`,
    //   );
    //   stopAudioActivity();
    // }

    // timeout after long delay
    if (soundDetected === true && currentTime > lastDetectedTime + DELAY_BETWEEN_DIALOGS) {
      console.log("stopped: large deplay between dialogs");
      // recorder.requestData()
      soundDetected = false;
      setIsSpeaking(false);
    }

    // check for detection:
    analyser.getByteFrequencyData(domainData);
    for (let i = 0; i < bufferLength; i++) {
      if (domainData[i] > 0) {
        console.log("sound");
        soundDetected = true;
        setIsSpeaking(true);
        time = new Date();
        lastDetectedTime = time.getTime();
      }
    }

    // start recursion
    window.requestAnimationFrame(detectSound);
  };

  window.requestAnimationFrame(detectSound);

  recorder.addEventListener("dataavailable", async ({ data }) => {
    if (data.size > 0) {
      blobs.push(data);
      if (socket?.readyState === 1) {
        // const blobData = new Blob([data]);
        // const arrayBuffer = await data.arrayBuffer();
        // const binaryData = new Uint8Array(arrayBuffer);
        // this way no data will be missed in sending if socket got reconnected during speaking
        socket.send(blobs.splice(0, blobs.length));
      } else {
        console.log("socket not ready", socket?.readyState);
      }
    } else {
      console.log("found null blobChunk", data);
    }
  });

  recorder.onstop = () => {
    console.log("Recorder Stopped");
    stopAudioActivity();
  };

  // recorder.start(500); // for streaming in real
  recorder.start(3000); // for emmergency demo, sending files on manual stop.
  setAudioRecorderState(recorder.state);
  return recorder;
};

export const speechToText = async ({
  setAudioRecorderState,
  setIsSpeaking,
  setRecognizedSpeechText,
  setIsSpeechLoading,
  enqueueSnackbar,
}: any) => {
  const VOICE_MIN_DECIBELS = -50;
  const DELAY_BETWEEN_DIALOGS = 6000;
  const DIALOG_MAX_LENGTH = 60 * 1000;
  // instantiate analyzer

  const analyserElement: any = document.createElement("audio-analyser");
  document.getElementById("analyser-container")?.appendChild(analyserElement);
  const audioMotion = new AudioMotionAnalyzer(analyserElement, {
    gradient: "rainbow",
    height: 100,
    showScaleY: true,
  });
  let stream: any = null;
  const constraints = {
    video: false,
    audio: {
      autoGainControl: false,
      echoCancellation: false,
      noiseSuppression: false,
    },
  };

  try {
    stream = await navigator.mediaDevices.getUserMedia(constraints);
    // create stream using audioMotion audio context
    const micStream = audioMotion.audioCtx.createMediaStreamSource(stream);
    // connect microphone stream to analyzer
    audioMotion.connectInput(micStream);
    // mute output to prevent feedback loops from the speakers
    audioMotion.volume = 0;
    enqueueSnackbar(`Listening`, { variant: "success" });
    console.log("stream", stream);
  } catch (error) {
    throw new Error(`
		  MediaDevices.getUserMedia() threw an error. 
		  Stream did not open
		`);
  }

  const time = new Date();
  let startTime: number = time.getTime();
  let lastDetectedTime: number = time.getTime();
  let soundDetected = false;
  const recorder = new MediaRecorder(stream);

  const audioContext = new AudioContext();
  const audioStreamSource = audioContext.createMediaStreamSource(stream);
  const analyser = audioContext.createAnalyser();
  analyser.minDecibels = VOICE_MIN_DECIBELS;
  audioStreamSource.connect(analyser);

  const bufferLength = analyser.frequencyBinCount;
  const domainData = new Uint8Array(bufferLength);

  function stopAudioActivity() {
    console.log("Recorder Stopped");
    soundDetected = false;
    recorder.stop();
    setAudioRecorderState("inactive");
    setIsSpeaking(false);
    audioMotion.disconnectInput();
    stream.getTracks().forEach((track: any) => track.stop());
    if (analyserElement) analyserElement.remove();
  }

  const detectSound = () => {
    // stop detection only when recording is stopped
    if (recorder.state === "inactive") return;

    let time: Date = new Date();
    let currentTime: number = time.getTime();

    // stop after max dialog length is reached
    // if (currentTime > startTime + DIALOG_MAX_LENGTH) {
    //   const abortTimeInMin = (DIALOG_MAX_LENGTH / (1000 * 60)).toFixed(2);
    //   console.log(
    //     `Aborting recording: You have reached max dialog length of ${abortTimeInMin} minutes`,
    //   );
    //   stopAudioActivity();
    // }

    // timeout after long delay
    if (currentTime > lastDetectedTime + DELAY_BETWEEN_DIALOGS) {
      console.log("stopped: large deplay between dialogs");
      // soundDetected = false;
      // setIsSpeaking(false);
      stopAudioActivity();
      return;
    }

    // check for detection:
    analyser.getByteFrequencyData(domainData);
    for (let i = 0; i < bufferLength; i++) {
      if (domainData[i] > 0) {
        console.log("sound");
        time = new Date();
        lastDetectedTime = time.getTime();
        soundDetected = true;
        setIsSpeaking(true);
      }
    }

    // start recursion
    window.requestAnimationFrame(detectSound);
  };

  window.requestAnimationFrame(detectSound);

  recorder.addEventListener("dataavailable", async ({ data }) => {
    if (data.size > 0) {
      console.log("loading");
      setIsSpeechLoading(true);
      const blobData = new Blob([data], { type: "audio/wav" });
      // const arrayBuffer = await data.arrayBuffer();
      // const binaryData = new Uint8Array(arrayBuffer);
      // socket.send(data);
      const formData = new FormData();
      formData.append("file", blobData, "recording.wav");
      postAPISpeech("/speech_recognition", formData)
        .then((res) => {
          const { data } = res;
          setRecognizedSpeechText(data?.text);
          setIsSpeechLoading(false);
        })
        .catch((err) => console.log("error in speech posting", err));
    } else {
      console.log("found null blobChunk", data);
      setIsSpeechLoading(false);
    }
  });

  recorder.onstop = () => {
    console.log("Recorder Stopped");
    stopAudioActivity();
  };

  // recorder.start(500); // for streaming in real
  recorder.start(); // for emmergency demo, sending files on manual stop.
  setAudioRecorderState(recorder.state);
  return recorder;
};

let mainInterval: any = null;

export const streamAudioFileToSocket = async ({
  socket,
  setAudioRecorderState,
  setIsSpeaking,
}: any) => {
  const VOICE_MIN_DECIBELS = -45; // -100 default -lowest while 0 is the loudest;
  const DELAY_BETWEEN_DIALOGS = 500;
  const LARGE_DELAY = 4000;
  const DIALOG_MAX_LENGTH = 60 * 1000;

  const analyserElement: any = document.createElement("audio-analyser");
  document.getElementById("analyser-container")?.appendChild(analyserElement);
  const audioMotion = new AudioMotionAnalyzer(analyserElement, {
    gradient: "rainbow",
    height: 100,
    showScaleY: true,
  });
  let stream: any = null;
  let audioRecorder: any = null;
  // let silenceRecorder:any = null;
  const constraints = {
    video: false,
    audio: { noiseSuppression: false },
  };
  try {
    stream = await navigator.mediaDevices.getUserMedia(constraints);
    // create stream using audioMotion audio context
    const micStream = audioMotion.audioCtx.createMediaStreamSource(stream);
    // connect microphone stream to analyzer
    audioMotion.connectInput(micStream);
    // mute output to prevent feedback loops from the speakers
    audioMotion.volume = 0;
  } catch (error) {
    throw new Error(`
      MediaDevices.getUserMedia() threw an error.
      Stream did not open
    `);
  }

  const audioContext = new AudioContext();
  const audioStreamSource = audioContext.createMediaStreamSource(stream);
  const analyser = audioContext.createAnalyser();
  analyser.minDecibels = VOICE_MIN_DECIBELS;
  audioStreamSource.connect(analyser);
  const bufferLength = analyser.frequencyBinCount;
  const domainData = new Uint8Array(bufferLength);
  audioRecorder = new MediaRecorder(stream);
  audioRecorder.start();
  setAudioRecorderState(audioRecorder.state);
  audioRecorder.addEventListener("dataavailable", async (event: any) => {
    const data = event.data;
    if (socket.readyState !== 1) {
      console.log("socket is off");
      return;
    }
    if (data.size > 0) {
      if (audioRecorder.state === "recording") socket.send(data);
    } else {
      console.log("found null blobChunk", data);
    }
  });

  audioRecorder.addEventListener("stop", async () => {
    // console.log('recorder stopped');
  });

  function stopAudioActivity() {
    setAudioRecorderState("inactive");
    setIsSpeaking(false);
    if (audioRecorder.state === "recording") audioRecorder.stop();
    audioMotion.disconnectInput();
    if (stream) {
      stream.getTracks().forEach((track: any) => track.stop());
      stream = null;
    }
    if (analyserElement) analyserElement.remove();
  }

  let lastDetectedTime: number = 0;
  let soundDetected = false;
  let shouldSendBlob = true;
  const detectSound = () => {
    // stop detection only when recording is stopped
    if (!stream) return;

    let currentTime: number = new Date().getTime();

    // console.log(lastDetectedTime-currentTime);
    // debouce the if statement
    if (
      shouldSendBlob &&
      lastDetectedTime &&
      currentTime > lastDetectedTime + DELAY_BETWEEN_DIALOGS
    ) {
      // console.log('restaring recorder');
      soundDetected = false;
      setIsSpeaking(false);
      shouldSendBlob = false;
      if (audioRecorder.state === "recording") audioRecorder.stop();
      if (audioRecorder.state === "inactive") audioRecorder.start();
    }

    if (
      lastDetectedTime &&
      soundDetected === false &&
      currentTime > lastDetectedTime + LARGE_DELAY
    ) {
      // console.log('aborting recording due to large delay in speaking');
      stopAudioActivity();
    }

    analyser.getByteFrequencyData(domainData);

    for (let i = 0; i < bufferLength; i++) {
      if (domainData[i] > 0) {
        // console.log('sound');
        soundDetected = true;
        shouldSendBlob = true;
        lastDetectedTime = new Date().getTime();
        setIsSpeaking(true);
      }
    }
    window.requestAnimationFrame(detectSound);
  };

  window.requestAnimationFrame(detectSound);
  return stopAudioActivity;
};

// export const streamMicrophoneAudioToSocketScriptNode = async ({ socket }: any) => {
//   let stream: any = null;
//   let scriptNode: any = null;
//   let audioContext: any = null;
//   let timeInterval: any = null;
//   let blobs: any = [];

//   // Stop audio processing
//   function stopAudioProcessing() {
//     if (audioContext) {
//       // Disconnect the audio nodes
//       scriptNode.disconnect();
//       audioContext.close();
//       audioContext = null;
//       scriptNode = null;
//       clearInterval(timeInterval);

//       timeInterval = null;
//     }
//   }

//   const constraints = {
//     video: false,
//     audio: true,
//   };

//   try {
//     stream = await navigator.mediaDevices.getUserMedia(constraints);
//     // Access the audio track
//     const audioTrack = stream.getAudioTracks()[0];

//     // Create an audio context
//     audioContext = new AudioContext();

//     // Create a MediaStreamAudioSourceNode
//     const sourceNode = audioContext.createMediaStreamSource(new MediaStream([audioTrack]));

//     // Create a ScriptProcessorNode to process audio data
//     scriptNode = audioContext.createScriptProcessor(4096, 1, 1);

//     // Connect the audio nodes
//     sourceNode.connect(scriptNode);
//     scriptNode.connect(audioContext.destination);

//     // Process audio data
//     scriptNode.onaudioprocess = async (event: any) => {
//       const input = event.inputBuffer.getChannelData(0);
//       console.log('input', input);
//       blobs.push(input);

//       // Process the audio data here
//     };

//     timeInterval = setInterval(() => {
//       async function sendData() {
//         // const blobData: any = new Blob(blobs);
//         // const arrayBuffer = await blob.arrayBuffer();
//         // console.log('arrayBuffer', arrayBuffer);
//         const binaryData = new Uint8Array(blobs);
//         // console.log('audioData', binaryData);
//         socket.send(binaryData);
//         blobs = [];
//       }
//       sendData();
//     }, 5000);

//     return stopAudioProcessing;
//   } catch (error) {
//     throw new Error(`
// 		  MediaDevices.getUserMedia() threw an error.
// 		  Stream did not open
// 		`);
//   }
// };
