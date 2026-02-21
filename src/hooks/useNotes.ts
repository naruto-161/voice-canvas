import { useState, useCallback, useEffect, useRef } from 'react';

export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

const generateId = () => Math.random().toString(36).substring(2, 10);

const loadNotes = (): Note[] => {
  try {
    const saved = localStorage.getItem('voicescribe-notes');
    return saved ? JSON.parse(saved) : [];
  } catch { return []; }
};

const saveNotes = (notes: Note[]) => {
  localStorage.setItem('voicescribe-notes', JSON.stringify(notes));
};

export const useNotes = () => {
  const [notes, setNotes] = useState<Note[]>(loadNotes);
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
  const [autoSave, setAutoSave] = useState(() => {
    return localStorage.getItem('voicescribe-autosave') !== 'false';
  });
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const autoSaveTimerRef = useRef<NodeJS.Timeout>();

  const activeNote = notes.find(n => n.id === activeNoteId) || null;

  // Create initial note if none
  useEffect(() => {
    if (notes.length === 0) {
      const newNote: Note = {
        id: generateId(),
        title: 'Note_1',
        content: '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setNotes([newNote]);
      setActiveNoteId(newNote.id);
    } else if (!activeNoteId) {
      setActiveNoteId(notes[notes.length - 1].id);
    }
  }, []);

  const persistNotes = useCallback((updated: Note[]) => {
    setNotes(updated);
    saveNotes(updated);
    setLastSaved(new Date());
  }, []);

  const updateContent = useCallback((content: string) => {
    setNotes(prev => {
      const updated = prev.map(n =>
        n.id === activeNoteId ? { ...n, content, updatedAt: new Date().toISOString() } : n
      );
      if (autoSave) {
        if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
        autoSaveTimerRef.current = setTimeout(() => {
          saveNotes(updated);
          setLastSaved(new Date());
        }, 1000);
      }
      return updated;
    });
  }, [activeNoteId, autoSave]);

  const saveNow = useCallback(() => {
    saveNotes(notes);
    setLastSaved(new Date());
  }, [notes]);

  const createNote = useCallback(() => {
    const num = notes.length + 1;
    const newNote: Note = {
      id: generateId(),
      title: `Note_${num}`,
      content: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const updated = [...notes, newNote];
    persistNotes(updated);
    setActiveNoteId(newNote.id);
    return newNote;
  }, [notes, persistNotes]);

  const deleteNote = useCallback((id: string) => {
    const updated = notes.filter(n => n.id !== id);
    persistNotes(updated);
    if (activeNoteId === id) {
      setActiveNoteId(updated.length > 0 ? updated[updated.length - 1].id : null);
    }
  }, [notes, activeNoteId, persistNotes]);

  const renameNote = useCallback((id: string, title: string) => {
    const updated = notes.map(n => n.id === id ? { ...n, title } : n);
    persistNotes(updated);
  }, [notes, persistNotes]);

  const duplicateNote = useCallback((id: string) => {
    const source = notes.find(n => n.id === id);
    if (!source) return;
    const dup: Note = {
      ...source,
      id: generateId(),
      title: `${source.title} (copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const updated = [...notes, dup];
    persistNotes(updated);
  }, [notes, persistNotes]);

  const toggleAutoSave = useCallback(() => {
    setAutoSave(prev => {
      const next = !prev;
      localStorage.setItem('voicescribe-autosave', String(next));
      return next;
    });
  }, []);

  return {
    notes, activeNote, activeNoteId, setActiveNoteId,
    updateContent, createNote, deleteNote, renameNote, duplicateNote,
    saveNow, autoSave, toggleAutoSave, lastSaved,
  };
};
