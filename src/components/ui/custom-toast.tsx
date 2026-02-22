import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';

type ToastVariant = 'success' | 'error' | 'warning' | 'info';

interface ToastItem {
  id: number;
  message: string;
  variant: ToastVariant;
}

let toastId = 0;
const listeners: Array<(t: ToastItem) => void> = [];

const variantConfig: Record<ToastVariant, { icon: typeof CheckCircle; borderColor: string; iconColor: string }> = {
  success: { icon: CheckCircle, borderColor: 'border-l-primary', iconColor: 'text-primary' },
  error: { icon: XCircle, borderColor: 'border-l-destructive', iconColor: 'text-destructive' },
  warning: { icon: AlertTriangle, borderColor: 'border-l-amber-400', iconColor: 'text-amber-400' },
  info: { icon: Info, borderColor: 'border-l-slate-400', iconColor: 'text-slate-400' },
};

export function showToast(message: string, variant: ToastVariant = 'info') {
  const item: ToastItem = { id: ++toastId, message, variant };
  listeners.forEach(fn => fn(item));
}

export function CustomToaster() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const addToast = useCallback((t: ToastItem) => {
    setToasts(prev => [...prev, t]);
    setTimeout(() => {
      setToasts(prev => prev.filter(x => x.id !== t.id));
    }, 3500);
  }, []);

  useEffect(() => {
    listeners.push(addToast);
    return () => {
      const i = listeners.indexOf(addToast);
      if (i > -1) listeners.splice(i, 1);
    };
  }, [addToast]);

  return (
    <div className="fixed bottom-6 right-6 z-[200] flex flex-col gap-3 pointer-events-none">
      <AnimatePresence>
        {toasts.map(t => {
          const config = variantConfig[t.variant];
          const Icon = config.icon;
          return (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20, x: 20 }}
              animate={{ opacity: 1, y: 0, x: 0 }}
              exit={{ opacity: 0, x: 40 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl border-l-4 ${config.borderColor} border border-border bg-card/80 backdrop-blur-md shadow-xl max-w-sm`}
            >
              <Icon className={`w-5 h-5 shrink-0 ${config.iconColor}`} />
              <span className="text-sm text-foreground flex-1">{t.message}</span>
              <button
                onClick={() => setToasts(prev => prev.filter(x => x.id !== t.id))}
                className="text-muted-foreground hover:text-foreground transition-colors shrink-0"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
