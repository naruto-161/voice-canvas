import { useEffect } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface KeyboardShortcutsModalProps {
  open: boolean;
  onClose: () => void;
}

const Key = ({ children }: { children: string }) => (
  <span className="inline-flex items-center justify-center min-w-[28px] h-7 px-2 rounded-md bg-muted/60 border border-border text-xs font-mono font-medium text-foreground shadow-sm">
    {children}
  </span>
);

const shortcuts = [
  { keys: ['Ctrl', 'S'], action: 'Save' },
  { keys: ['Ctrl', 'N'], action: 'New File' },
  { keys: ['Ctrl', 'P'], action: 'Print' },
  { keys: ['Ctrl', '+/-'], action: 'Zoom' },
  { keys: ['ESC'], action: 'Stop Recording' },
];

const KeyboardShortcutsModal = ({ open, onClose }: KeyboardShortcutsModalProps) => {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] flex items-center justify-center"
          onClick={onClose}
        >
          {/* Glass backdrop */}
          <div className="absolute inset-0 bg-background/60 backdrop-blur-md" />

          {/* Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            onClick={e => e.stopPropagation()}
            className="relative w-full max-w-md rounded-2xl border border-primary/20 bg-card/90 backdrop-blur-lg shadow-2xl shadow-primary/10 p-6"
          >
            {/* Close */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <h2 className="text-lg font-semibold text-foreground mb-6">Keyboard Shortcuts</h2>

            <div className="space-y-3">
              {shortcuts.map(({ keys, action }) => (
                <div
                  key={action}
                  className="flex items-center justify-between py-2.5 px-3 rounded-lg hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    {keys.map((k, i) => (
                      <span key={i} className="flex items-center gap-1.5">
                        {i > 0 && <span className="text-muted-foreground text-xs">+</span>}
                        <Key>{k}</Key>
                      </span>
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">{action}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default KeyboardShortcutsModal;
