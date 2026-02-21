import { useState } from 'react';
import {
  Maximize, Settings, FilePlus, FolderOpen, Mail, Download,
  Printer, ZoomIn, ZoomOut
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface LeftToolbarProps {
  onNewFile: () => void;
  onSave: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  autoSave: boolean;
  onToggleAutoSave: () => void;
  showHelper: boolean;
  onToggleHelper: () => void;
}

const LeftToolbar = ({
  onNewFile, onSave, onZoomIn, onZoomOut,
  autoSave, onToggleAutoSave, showHelper, onToggleHelper
}: LeftToolbarProps) => {
  const [showSettings, setShowSettings] = useState(false);
  const [showDownload, setShowDownload] = useState(false);
  const [showMail, setShowMail] = useState(false);
  const navigate = useNavigate();

  const handleFullscreen = () => {
    if (document.fullscreenElement) document.exitFullscreen();
    else document.documentElement.requestFullscreen();
  };

  const handlePrint = () => window.print();

  const handleDownload = (type: 'txt' | 'doc') => {
    const canvas = document.querySelector('[data-canvas-content]');
    const text = (canvas as HTMLElement)?.innerText || '';
    const blob = type === 'txt'
      ? new Blob([text], { type: 'text/plain' })
      : new Blob([`<html><body>${text}</body></html>`], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `note.${type}`;
    a.click();
    URL.revokeObjectURL(url);
    setShowDownload(false);
    toast.success(`Downloaded as .${type}`);
  };

  const tools = [
    { icon: Maximize, label: 'Fullscreen', onClick: handleFullscreen },
    { icon: Settings, label: 'Settings', onClick: () => setShowSettings(!showSettings) },
    { icon: FilePlus, label: 'New File', onClick: onNewFile },
    { icon: FolderOpen, label: 'Files', onClick: () => navigate('/files') },
    { icon: Mail, label: 'Mail', onClick: () => setShowMail(!showMail) },
    { icon: Download, label: 'Download', onClick: () => setShowDownload(!showDownload) },
    { icon: Printer, label: 'Print', onClick: handlePrint },
    { icon: ZoomIn, label: 'Zoom In', onClick: onZoomIn },
    { icon: ZoomOut, label: 'Zoom Out', onClick: onZoomOut },
  ];

  return (
    <div className="w-14 flex flex-col items-center py-3 gap-1 bg-card/50 border-r border-border shrink-0 relative">
      {tools.map(({ icon: Icon, label, onClick }, i) => (
        <div key={label} className="relative group">
          <button onClick={onClick} className="toolbar-icon" title={label}>
            <Icon className="w-5 h-5" />
          </button>
          <div className="absolute left-14 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-md bg-card border border-border text-xs text-foreground whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 z-50">
            {label}
          </div>
        </div>
      ))}

      {/* Settings Popover */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -8 }}
            className="absolute left-16 top-16 w-56 rounded-lg border border-border bg-card p-4 shadow-xl z-50"
          >
            <h4 className="text-sm font-medium text-foreground mb-3">Settings</h4>
            <div className="space-y-3">
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-sm text-muted-foreground">Auto-save</span>
                <button
                  onClick={onToggleAutoSave}
                  className={`w-10 h-5 rounded-full transition-colors relative ${autoSave ? 'bg-primary' : 'bg-muted'}`}
                >
                  <motion.div
                    className="w-4 h-4 rounded-full bg-foreground absolute top-0.5"
                    animate={{ left: autoSave ? 22 : 2 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                </button>
              </label>
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-sm text-muted-foreground">Helper Panel</span>
                <button
                  onClick={onToggleHelper}
                  className={`w-10 h-5 rounded-full transition-colors relative ${showHelper ? 'bg-primary' : 'bg-muted'}`}
                >
                  <motion.div
                    className="w-4 h-4 rounded-full bg-foreground absolute top-0.5"
                    animate={{ left: showHelper ? 22 : 2 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                </button>
              </label>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Download Dropdown */}
      <AnimatePresence>
        {showDownload && (
          <motion.div
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -8 }}
            className="absolute left-16 bottom-24 w-48 rounded-lg border border-border bg-card p-1.5 shadow-xl z-50"
          >
            <button onClick={() => handleDownload('txt')} className="flex items-center gap-2 w-full px-3 py-2 rounded-md text-sm text-foreground hover:bg-surface-hover transition-colors">
              Download as .txt
            </button>
            <button onClick={() => handleDownload('doc')} className="flex items-center gap-2 w-full px-3 py-2 rounded-md text-sm text-foreground hover:bg-surface-hover transition-colors">
              Download as .doc
            </button>
            <button onClick={() => { onSave(); setShowDownload(false); toast.success('Session saved'); }} className="flex items-center gap-2 w-full px-3 py-2 rounded-md text-sm text-foreground hover:bg-surface-hover transition-colors">
              Save session
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mail Modal */}
      <AnimatePresence>
        {showMail && (
          <motion.div
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -8 }}
            className="absolute left-16 top-40 w-48 rounded-lg border border-border bg-card p-1.5 shadow-xl z-50"
          >
            <button onClick={() => { window.open('https://mail.google.com', '_blank'); setShowMail(false); }} className="flex items-center gap-2 w-full px-3 py-2 rounded-md text-sm text-foreground hover:bg-surface-hover transition-colors">
              Gmail
            </button>
            <button onClick={() => { window.open('https://outlook.live.com', '_blank'); setShowMail(false); }} className="flex items-center gap-2 w-full px-3 py-2 rounded-md text-sm text-foreground hover:bg-surface-hover transition-colors">
              Outlook
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LeftToolbar;
