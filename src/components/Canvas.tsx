import { useState, useRef, useEffect, useCallback } from 'react';
import { Mic, Volume2, Copy, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import type { Note } from '@/hooks/useNotes';

interface SpeechState {
  isListening: boolean;
  isActivated: boolean;
  hasPermission: boolean | null;
}

interface CanvasProps {
  note: Note | null;
  onContentChange: (content: string) => void;
  autoSave: boolean;
  lastSaved: Date | null;
  zoom: number;
  onSpeechStateChange?: (state: SpeechState) => void;
}

const Canvas = ({ note, onContentChange, autoSave, lastSaved, zoom, onSpeechStateChange }: CanvasProps) => {
  const [copied, setCopied] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const editorRef = useRef<HTMLTextAreaElement>(null);

  // Append-only: always add to existing content
  const handleSpeechResult = useCallback((text: string) => {
    if (!note) return;
    const newContent = note.content + (note.content ? ' ' : '') + text;
    onContentChange(newContent);
  }, [note, onContentChange]);

  const handleActivationChange = useCallback((activated: boolean) => {
    if (activated) {
      toast.success('Recording started');
    } else {
      toast.success('Recording stopped');
    }
  }, []);

  const {
    isListening, isActivated, interimText, startListening, stopListening,
    toggleActivation, hasPermission, requestPermission
  } = useSpeechRecognition(handleSpeechResult, handleActivationChange);

  // Report speech state to parent
  useEffect(() => {
    onSpeechStateChange?.({ isListening, isActivated, hasPermission });
  }, [isListening, isActivated, hasPermission, onSpeechStateChange]);

  // Auto-start listening on mount (for activation word detection)
  useEffect(() => {
    requestPermission().then(allowed => {
      if (allowed) {
        toast.success("Microphone ready. Say 'Start recording' or click the mic.");
        startListening();
      } else {
        toast.warning('Microphone access denied. Please enable microphone to use transcription.');
      }
    });
  }, []);

  const handleMicClick = () => {
    if (isActivated) {
      // If currently transcribing, stop transcription (but keep listening for activation)
      toggleActivation();
    } else if (!isListening) {
      // If not listening at all, start listening
      startListening();
    } else {
      // Listening but not activated — activate transcription
      toggleActivation();
    }
  };

  const handleCopy = () => {
    if (note?.content) {
      navigator.clipboard.writeText(note.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSpeak = () => {
    if (!note?.content) return;
    if (isSpeaking) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }
    const utterance = new SpeechSynthesisUtterance(note.content);
    utterance.onend = () => setIsSpeaking(false);
    setIsSpeaking(true);
    speechSynthesis.speak(utterance);
  };

  const content = note?.content || '';
  const wordCount = content.trim() ? content.trim().split(/\s+/).filter(Boolean).length : 0;
  const charCount = content.length;
  const dateStr = note ? new Date(note.updatedAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : '';

  const insertText = useCallback((text: string) => {
    if (!note) return;
    const newContent = note.content + text;
    onContentChange(newContent);
  }, [note, onContentChange]);

  // Expose insertText globally for helper panel
  useEffect(() => {
    (window as any).__canvasInsertText = insertText;
    return () => { delete (window as any).__canvasInsertText; };
  }, [insertText]);

  const isEmpty = !content;

  return (
    <div className="flex-1 flex flex-col overflow-hidden relative">
      {/* Recording indicator */}
      <AnimatePresence>
        {isActivated && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-3 left-1/2 -translate-x-1/2 flex items-center gap-2 px-3 py-1.5 rounded-full bg-destructive/10 border border-destructive/20 z-10"
          >
            <div className="w-2 h-2 rounded-full bg-destructive recording-dot" />
            <span className="text-xs font-medium text-destructive">Recording…</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="px-10 pt-6 pb-2 flex items-center justify-between shrink-0">
        <div>
          <h2 data-note-title className="text-lg font-semibold text-foreground">{note?.title || 'Untitled'}</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            {dateStr && `${dateStr} · `}
            {wordCount.toLocaleString()} words · {charCount.toLocaleString()} characters
            {autoSave && lastSaved && (
              <span className="ml-1 text-primary/60">· Saved</span>
            )}
          </p>
        </div>

        {/* Mic button */}
        <button
          onClick={handleMicClick}
          className={`w-11 h-11 rounded-full flex items-center justify-center transition-all duration-200 relative ${
            isActivated
              ? 'bg-primary text-primary-foreground mic-pulse'
              : isListening
                ? 'border-2 border-primary/60 text-primary hover:bg-primary/10'
                : 'border border-primary/40 text-primary hover:bg-primary/10 hover:glow-primary-sm'
          }`}
        >
          <Mic className="w-5 h-5" />
          {isActivated && (
            <div className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-destructive border-2 border-background" />
          )}
        </button>
      </div>

      {/* Fixed interim text preview area */}
      <div className="mx-10 h-10 flex items-center">
        <AnimatePresence>
          {interimText && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              className="px-4 py-2 rounded-lg bg-muted/50 text-sm text-muted-foreground italic w-full truncate"
            >
              {interimText}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Editor */}
      <div className="flex-1 overflow-y-auto px-10 pb-20 relative">
        {isEmpty && !isActivated && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-start justify-center pt-8 px-16 pointer-events-none"
          >
            <div className="text-muted-foreground/50 text-sm leading-relaxed max-w-md space-y-3">
              <p className="text-base font-medium text-muted-foreground/70">Click the mic to start dictating.</p>
              <div className="space-y-1.5 text-xs">
                <p className="font-medium text-muted-foreground/60">Quick tips:</p>
                <p>① Use the speaker icon for proof reading.</p>
                <p>② Punctuate by dictating or using the helper panel.</p>
                <p>③ Press Enter to finalize speech.</p>
                <p>④ Say "Start recording" to begin.</p>
                <p>⑤ Say "Stop recording" to end.</p>
              </div>
              <p className="text-xs text-muted-foreground/40 pt-2">Enjoy note-talking :)</p>
            </div>
          </motion.div>
        )}

        <textarea
          ref={editorRef}
          data-canvas-content
          value={content}
          onChange={(e) => onContentChange(e.target.value)}
          placeholder=""
          className="w-full h-full resize-none bg-transparent outline-none text-foreground leading-relaxed placeholder:text-muted-foreground/30 max-w-2xl mx-auto"
          style={{ fontSize: `${zoom}px` }}
        />
      </div>

      {/* Bottom actions */}
      <div className="absolute bottom-4 right-6 flex items-center gap-2">
        <button
          onClick={handleSpeak}
          className={`toolbar-icon ${isSpeaking ? 'active' : ''}`}
          title="Read aloud"
        >
          <Volume2 className="w-5 h-5" />
        </button>
        <button onClick={handleCopy} className="toolbar-icon" title={copied ? 'Copied!' : 'Copy'}>
          {copied ? <Check className="w-5 h-5 text-primary" /> : <Copy className="w-5 h-5" />}
        </button>
      </div>
    </div>
  );
};

export default Canvas;
