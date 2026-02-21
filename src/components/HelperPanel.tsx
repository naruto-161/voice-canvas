import { motion } from 'framer-motion';
import { toast } from 'sonner';

const commands = [
  { say: 'Period', insert: '.' },
  { say: 'Comma', insert: ',' },
  { say: 'Question mark', insert: '?' },
  { say: 'Colon', insert: ':' },
  { say: 'Semi Colon', insert: ';' },
  { say: 'Exclamation mark', insert: '!' },
  { say: 'Dash', insert: '-' },
  { say: 'New line', insert: '\n' },
  { say: 'New paragraph', insert: '\n\n' },
  { say: 'Open parentheses', insert: '(' },
  { say: 'Close parentheses', insert: ')' },
  { say: 'Smiley', insert: ':-)' },
  { say: 'Sad face', insert: ':-(' },
];

interface HelperPanelProps {
  visible: boolean;
}

const HelperPanel = ({ visible }: HelperPanelProps) => {
  const handleInsert = (insert: string) => {
    const fn = (window as any).__canvasInsertText;
    if (fn) fn(insert);
  };

  return (
    <motion.div
      initial={false}
      animate={{ width: visible ? 240 : 0, opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.25, ease: 'easeInOut' }}
      className="overflow-hidden border-l border-border bg-card/50 shrink-0"
    >
      <div className="w-60 h-full overflow-y-auto p-4">
        <h3 className="text-sm font-semibold text-foreground mb-1">Say or Click</h3>
        <p className="text-xs text-muted-foreground mb-4">
          Tip: Press Enter to finalize speech instantly.
        </p>

        <div className="space-y-0.5">
          <div className="grid grid-cols-[1fr_auto] gap-2 px-2 pb-1 mb-1 border-b border-border">
            <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Say</span>
            <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Insert</span>
          </div>

          {commands.map(({ say, insert }) => (
            <button
              key={say}
              onClick={() => handleInsert(insert)}
              className="grid grid-cols-[1fr_auto] gap-2 w-full px-2 py-2 rounded-md hover:bg-surface-hover transition-colors text-left group"
            >
              <span className="text-sm text-foreground">{say}</span>
              <span className="text-sm text-primary font-mono group-hover:scale-110 transition-transform inline-block">
                {insert === '\n' ? '↵' : insert === '\n\n' ? '↵↵' : insert}
              </span>
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default HelperPanel;
