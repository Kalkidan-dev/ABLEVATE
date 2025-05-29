import { useEffect, useRef } from 'react';

const useVoiceControl = (onTranscript, setListening) => {
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.warn('Speech Recognition API not supported in this browser.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      const transcript = event.results[event.resultIndex][0].transcript.trim().toLowerCase();
      onTranscript(transcript);
    };

    recognition.onstart = () => {
      setListening(true);
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.stop();
    };
  }, [onTranscript, setListening]);

  const toggleListening = () => {
    const recognition = recognitionRef.current;
    if (!recognition) return;

    // Start/stop based on internal running state
    try {
      recognition.start();
    } catch (e) {
      // Already started; stop instead
      recognition.stop();
    }
  };

  return toggleListening;
};

export default useVoiceControl;
