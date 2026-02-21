import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Pencil, Check, MoreVertical, Trash2, Copy } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNotes } from '@/hooks/useNotes';
import Navbar from '@/components/Navbar';

const Files = () => {
  const navigate = useNavigate();
  const { notes, setActiveNoteId, renameNote, deleteNote, duplicateNote } = useNotes();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [menuId, setMenuId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const startRename = (id: string, title: string) => {
    setEditingId(id);
    setEditTitle(title);
    setMenuId(null);
  };

  const confirmRename = (id: string) => {
    if (editTitle.trim() && editTitle !== notes.find(n => n.id === id)?.title) {
      renameNote(id, editTitle.trim());
    }
    setEditingId(null);
  };

  const openNote = (id: string) => {
    setActiveNoteId(id);
    navigate('/');
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <Navbar />
      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <button onClick={() => navigate('/')} className="toolbar-icon">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-2xl font-semibold text-foreground">Files</h1>
            <span className="text-sm text-muted-foreground">({notes.length})</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {notes.map((note, i) => {
              const wordCount = note.content.trim().split(/\s+/).filter(Boolean).length;
              const preview = note.content.slice(0, 120);
              const date = new Date(note.updatedAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });

              return (
                <motion.div
                  key={note.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="rounded-xl border border-border bg-card p-5 cursor-pointer card-lift relative group"
                  onClick={() => openNote(note.id)}
                >
                  {/* Title area */}
                  <div className="flex items-center justify-between mb-2" onClick={e => e.stopPropagation()}>
                    {editingId === note.id ? (
                      <div className="flex items-center gap-1 flex-1">
                        <input
                          value={editTitle}
                          onChange={e => setEditTitle(e.target.value)}
                          onKeyDown={e => e.key === 'Enter' && confirmRename(note.id)}
                          autoFocus
                          className="bg-transparent outline-none border-b border-primary text-foreground text-sm font-medium flex-1"
                        />
                        <button onClick={() => confirmRename(note.id)} className="text-primary">
                          <Check className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <h3 className="text-sm font-semibold text-foreground truncate flex-1">{note.title}</h3>
                    )}

                    <div className="relative ml-2">
                      <button
                        onClick={() => setMenuId(menuId === note.id ? null : note.id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-foreground"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>

                      <AnimatePresence>
                        {menuId === note.id && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="absolute right-0 top-6 w-36 rounded-lg border border-border bg-card p-1 shadow-xl z-50"
                          >
                            <button onClick={() => startRename(note.id, note.title)} className="flex items-center gap-2 w-full px-3 py-2 rounded-md text-sm text-foreground hover:bg-surface-hover transition-colors">
                              <Pencil className="w-3 h-3" /> Rename
                            </button>
                            <button onClick={() => { duplicateNote(note.id); setMenuId(null); }} className="flex items-center gap-2 w-full px-3 py-2 rounded-md text-sm text-foreground hover:bg-surface-hover transition-colors">
                              <Copy className="w-3 h-3" /> Duplicate
                            </button>
                            <button onClick={() => { setDeleteConfirmId(note.id); setMenuId(null); }} className="flex items-center gap-2 w-full px-3 py-2 rounded-md text-sm text-destructive hover:bg-destructive/10 transition-colors">
                              <Trash2 className="w-3 h-3" /> Delete
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground mb-3">{date} · {wordCount} words</p>
                  <p className="text-sm text-muted-foreground/70 line-clamp-3 leading-relaxed">
                    {preview || 'Empty note'}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Delete confirm modal */}
      <AnimatePresence>
        {deleteConfirmId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={() => setDeleteConfirmId(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-card border border-border rounded-xl p-6 w-80 shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <h3 className="text-foreground font-semibold mb-2">Delete note?</h3>
              <p className="text-sm text-muted-foreground mb-5">This action cannot be undone.</p>
              <div className="flex gap-3 justify-end">
                <button onClick={() => setDeleteConfirmId(null)} className="px-4 py-2 rounded-lg text-sm text-foreground hover:bg-surface-hover transition-colors">
                  Cancel
                </button>
                <button
                  onClick={() => { deleteNote(deleteConfirmId); setDeleteConfirmId(null); }}
                  className="px-4 py-2 rounded-lg text-sm bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Files;
