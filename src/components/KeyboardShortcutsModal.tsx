import { useEffect } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface KeyboardShortcutsModalProps {
  open: boolean;
  onClose: () => void;
}

const Key = ({ children, large }: { children: string; large?: boolean }) => (
  <kbd className={`inline-flex items-center justify-center rounded-md bg-foreground/5 border border-foreground/10 text-xs font-bold text-foreground transition-all duration-200 hover:border-primary hover:shadow-[0_0_10px_hsl(var(--primary)/0.4)] hover:bg-primary/10 ${large ? 'px-4 py-1.5 min-w-[60px] rounded-full border-primary/40' : 'px-2 py-1 min-w-[32px]'} text-center`}>
    {children}
  </kbd>
);

const shortcuts = [
  { action: 'Save', keys: ['Ctrl', 'S'] },
  { action: 'New File', keys: ['Ctrl', 'N'] },
  { action: 'Print', keys: ['Ctrl', 'P'] },
  { action: 'Zoom', keys: ['Ctrl', '+/-'] },
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
          className="fixed inset-0 z-[100] flex items-center justify-center p-6"
          onClick={onClose}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-xl" />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            onClick={e => e.stopPropagation()}
            className="relative w-full max-w-xl rounded-2xl overflow-hidden"
            style={{
              background: 'rgba(16, 34, 31, 0.8)',
              backdropFilter: 'blur(24px)',
              border: '1px solid hsl(var(--primary) / 0.3)',
              boxShadow: '0 0 40px hsl(var(--primary) / 0.1), 0 25px 50px -12px rgba(0, 0, 0, 0.5)',
            }}
          >
            {/* Close */}
            <button
              onClick={onClose}
              className="absolute top-6 right-6 p-2 rounded-full bg-foreground/5 hover:bg-foreground/10 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="px-8 pt-10 pb-6">
              <h2 className="text-2xl font-semibold tracking-tight text-foreground flex items-center gap-3">
                <span className="text-primary">⌨️</span>
                Keyboard Shortcuts
              </h2>
              <p className="text-muted-foreground text-sm mt-2">Boost your productivity with quick access commands</p>
            </div>

            {/* Grid */}
            <div className="px-8 pb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
                {shortcuts.map(({ action, keys }) => (
                  <div key={action} className="flex items-center justify-between group">
                    <span className="text-foreground/80 font-medium">{action}</span>
                    <div className="flex items-center gap-1">
                      {keys.map((k, i) => (
                        <span key={i} className="flex items-center gap-1">
                          {i > 0 && <span className="text-muted-foreground text-xs">+</span>}
                          <Key>{k}</Key>
                        </span>
                      ))}
                    </div>
                  </div>
                ))}

                {/* Stop Recording - full width */}
                <div className="flex items-center justify-between group md:col-span-2 pt-4 border-t border-foreground/5">
                  <span className="text-primary font-semibold">Stop Recording</span>
                  <Key large>ESC</Key>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-black/20 px-8 py-4 flex justify-center border-t border-foreground/5">
              <p className="text-muted-foreground text-xs tracking-widest uppercase font-medium">
                Press <span className="text-foreground">ESC</span> to close this menu
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default KeyboardShortcutsModal;
