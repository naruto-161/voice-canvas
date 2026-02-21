import { useState, useRef, useEffect } from 'react';
import { User, Settings, LogOut, Keyboard } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ProfileDropdown = () => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const items = [
    { icon: User, label: 'Profile' },
    { icon: Settings, label: 'Settings' },
    { icon: Keyboard, label: 'Keyboard Shortcuts' },
    { icon: LogOut, label: 'Logout' },
  ];

  return (
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
            {items.map(({ icon: Icon, label }) => (
              <button
                key={label}
                className="flex items-center gap-3 w-full px-3 py-2.5 rounded-md text-sm text-foreground hover:bg-surface-hover transition-colors"
                onClick={() => setOpen(false)}
              >
                <Icon className="w-4 h-4 text-muted-foreground" />
                {label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProfileDropdown;
