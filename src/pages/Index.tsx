import { useState, useEffect, useCallback } from 'react';
import Navbar from '@/components/Navbar';
import LeftToolbar from '@/components/LeftToolbar';
import Canvas from '@/components/Canvas';
import HelperPanel from '@/components/HelperPanel';
import { useNotes } from '@/hooks/useNotes';
import { toast } from 'sonner';

const Index = () => {
  const {
    notes, activeNote, activeNoteId, setActiveNoteId,
    updateContent, createNote, deleteNote, renameNote, duplicateNote,
    saveNow, autoSave, toggleAutoSave, lastSaved,
  } = useNotes();

  const [showHelper, setShowHelper] = useState(true);
  const [zoom, setZoom] = useState(16);

  // Speech state lifted from Canvas
  const [speechState, setSpeechState] = useState({
    isListening: false,
    isActivated: false,
    hasPermission: null as boolean | null,
  });

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 2, 28));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 2, 12));

  const handleNewFile = () => {
    createNote();
    toast.success('New note created');
  };

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        saveNow();
        toast.success('Saved');
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        handleNewFile();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
        e.preventDefault();
        window.print();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [saveNow]);

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <Navbar
        isListening={speechState.isListening}
        isActivated={speechState.isActivated}
        hasPermission={speechState.hasPermission}
      />
      <div className="flex flex-1 overflow-hidden" style={{ height: 'calc(100vh - 64px)' }}>
        <LeftToolbar
          onNewFile={handleNewFile}
          onSave={saveNow}
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          autoSave={autoSave}
          onToggleAutoSave={toggleAutoSave}
          showHelper={showHelper}
          onToggleHelper={() => setShowHelper(!showHelper)}
        />
        <Canvas
          note={activeNote}
          onContentChange={updateContent}
          autoSave={autoSave}
          lastSaved={lastSaved}
          zoom={zoom}
          onSpeechStateChange={setSpeechState}
        />
        <HelperPanel visible={showHelper} />
      </div>
    </div>
  );
};

export default Index;
