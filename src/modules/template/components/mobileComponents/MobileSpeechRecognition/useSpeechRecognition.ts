import { useEffect, useState } from 'react';

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

function useSpeechRecognition() {
  const [recognition, setRecognition] = useState<any>();

  useEffect(() => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      // Create a new SpeechRecognition object
      const recognition: any = new (window.SpeechRecognition || window?.webkitSpeechRecognition)();
      recognition.lang = 'en-US';
      setRecognition(recognition);

      // Define event handlers
      recognition.onstart = () => {
        console.log('Speech recognition started.');
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        console.log('Recognized speech:', transcript);
        // Do something with the transcribed text
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
      };
    }
  }, []);

  return { recognition };
}

export default useSpeechRecognition;
