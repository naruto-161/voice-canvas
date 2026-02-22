import { useState, useRef, useEffect } from 'react';
import { User, Settings, LogOut, Keyboard } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import KeyboardShortcutsModal from './KeyboardShortcutsModal';

const ProfileDropdown = () => {
  const [open, setOpen] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const items = [
    { icon: User, label: 'Profile', onClick: () => { setOpen(false); navigate('/profile'); } },
    { icon: Settings, label: 'Settings', onClick: () => setOpen(false) },
    { icon: Keyboard, label: 'Keyboard Shortcuts', onClick: () => { setOpen(false); setShowShortcuts(true); } },
    { icon: LogOut, label: 'Logout', onClick: () => setOpen(false) },
  ];

  return (
    <>
      <div ref={ref} className="relative">
        <button
          onClick={() => setOpen(!open)}
          className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center hover:bg-primary/30 transition-colors"
        >
          <User className="w-4 h-4 text-primary" />
        </button>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -4 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 top-12 w-52 rounded-lg border border-border bg-card p-1.5 shadow-xl backdrop-blur-sm z-50"
            >
              {items.map(({ icon: Icon, label, onClick }) => (
                <button
                  key={label}
                  className="flex items-center gap-3 w-full px-3 py-2.5 rounded-md text-sm text-foreground hover:bg-muted/50 transition-colors"
                  onClick={onClick}
                >
                  <Icon className="w-4 h-4 text-muted-foreground" />
                  {label}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <KeyboardShortcutsModal open={showShortcuts} onClose={() => setShowShortcuts(false)} />
    </>
  );
};

export default ProfileDropdown;
