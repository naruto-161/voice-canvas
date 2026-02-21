import { useState, useRef, useCallback, useEffect } from 'react';

interface UseSpeechRecognitionReturn {
  isListening: boolean;
  isActivated: boolean;
  interimText: string;
  startListening: () => void;
  stopListening: () => void;
  toggleActivation: () => void;
  hasPermission: boolean | null;
  requestPermission: () => Promise<boolean>;
}

const ACTIVATION_WORD = 'start recording';
const DEACTIVATION_WORD = 'stop recording';

export const useSpeechRecognition = (
  onResult: (text: string) => void,
  onActivationChange?: (activated: boolean) => void
): UseSpeechRecognitionReturn => {
  const [isListening, setIsListening] = useState(false);
  const [isActivated, setIsActivated] = useState(false);
  const [interimText, setInterimText] = useState('');
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const recognitionRef = useRef<any>(null);
  const isActiveRef = useRef(false);
  const isActivatedRef = useRef(false);

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

  const activateTranscription = useCallback(() => {
    isActivatedRef.current = true;
    setIsActivated(true);
    onActivationChange?.(true);
  }, [onActivationChange]);

  const deactivateTranscription = useCallback(() => {
    isActivatedRef.current = false;
    setIsActivated(false);
    setInterimText('');
    onActivationChange?.(false);
  }, [onActivationChange]);

  const createRecognition = useCallback(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return null;

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event: any) => {
      const result = event.results[event.results.length - 1];
      const transcript = result[0].transcript;
      const lower = transcript.toLowerCase().trim();
      const isFinal = result.isFinal;

      // Check activation/deactivation words
      if (!isActivatedRef.current && lower.includes(ACTIVATION_WORD)) {
        if (isFinal) {
          activateTranscription();
        }
        return;
      }

      if (isActivatedRef.current && lower.includes(DEACTIVATION_WORD)) {
        if (isFinal) {
          deactivateTranscription();
        }
        return;
      }

      // Only transcribe when activated
      if (isActivatedRef.current) {
        if (!isFinal) {
          setInterimText(transcript);
        } else {
          onResult(transcript);
          setInterimText('');
        }
      }
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
  }, [onResult, activateTranscription, deactivateTranscription]);

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
    isActivatedRef.current = false;
    setIsActivated(false);
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch {}
    }
    setIsListening(false);
    setInterimText('');
  }, []);

  const toggleActivation = useCallback(() => {
    if (isActivatedRef.current) {
      deactivateTranscription();
    } else {
      activateTranscription();
    }
  }, [activateTranscription, deactivateTranscription]);

  useEffect(() => {
    return () => {
      isActiveRef.current = false;
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch {}
      }
    };
  }, []);

  return { isListening, isActivated, interimText, startListening, stopListening, toggleActivation, hasPermission, requestPermission };
};
