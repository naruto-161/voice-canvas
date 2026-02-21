import { useState, useRef, useCallback, useEffect } from 'react';

interface UseSpeechRecognitionReturn {
  isListening: boolean;
  interimText: string;
  startListening: () => void;
  stopListening: () => void;
  toggleListening: () => void;
  hasPermission: boolean | null;
  requestPermission: () => Promise<boolean>;
}

export const useSpeechRecognition = (
  onResult: (text: string) => void,
  onActivationWord?: (word: 'start' | 'stop') => void
): UseSpeechRecognitionReturn => {
  const [isListening, setIsListening] = useState(false);
  const [interimText, setInterimText] = useState('');
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const recognitionRef = useRef<any>(null);
  const isActiveRef = useRef(false);

  const requestPermission = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(t => t.stop());
      setHasPermission(true);
      return true;
    } catch {
      setHasPermission(false);
      return false;
    }
  }, []);

  const createRecognition = useCallback(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return null;

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event: any) => {
      let interim = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          const lower = transcript.toLowerCase().trim();
          if (lower.includes('start recording')) {
            onActivationWord?.('start');
            continue;
          }
          if (lower.includes('stop recording')) {
            onActivationWord?.('stop');
            continue;
          }
          onResult(transcript);
          setInterimText('');
        } else {
          interim += transcript;
        }
      }
      if (interim) setInterimText(interim);
    };

    recognition.onerror = (event: any) => {
      if (event.error !== 'no-speech' && event.error !== 'aborted') {
        console.error('Speech recognition error:', event.error);
      }
    };

    recognition.onend = () => {
      if (isActiveRef.current) {
        try { recognition.start(); } catch {}
      } else {
        setIsListening(false);
        setInterimText('');
      }
    };

    return recognition;
  }, [onResult, onActivationWord]);

  const startListening = useCallback(() => {
    if (!recognitionRef.current) {
      recognitionRef.current = createRecognition();
    }
    if (recognitionRef.current) {
      isActiveRef.current = true;
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch {}
    }
  }, [createRecognition]);

  const stopListening = useCallback(() => {
    isActiveRef.current = false;
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch {}
    }
    setIsListening(false);
    setInterimText('');
  }, []);

  const toggleListening = useCallback(() => {
    if (isListening) stopListening();
    else startListening();
  }, [isListening, startListening, stopListening]);

  useEffect(() => {
    return () => {
      isActiveRef.current = false;
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch {}
      }
    };
  }, []);

  return { isListening, interimText, startListening, stopListening, toggleListening, hasPermission, requestPermission };
};
