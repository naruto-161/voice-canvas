import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface SpeechHealthIndicatorProps {
  isListening: boolean;
  isActivated: boolean;
  hasPermission: boolean | null;
}

const BAR_HEIGHTS = [6, 10, 14, 18, 22];

type SignalStrength = 0 | 1 | 3 | 5;

const TOOLTIP_MAP: Record<SignalStrength, string> = {
  5: 'Excellent – Instant transcription',
  3: 'Moderate – Slight lag detected',
  1: 'Poor – Network unstable',
  0: 'Microphone access denied',
};

const SpeechHealthIndicator = ({
  isListening,
  isActivated,
  hasPermission,
}: SpeechHealthIndicatorProps) => {
  const [strength, setStrength] = useState<SignalStrength>(0);

  // Simulate signal strength based on speech recognition state
  useEffect(() => {
    if (hasPermission === false) {
      setStrength(0);
      return;
    }
    if (isActivated) {
      setStrength(5);
    } else if (isListening) {
      setStrength(3);
    } else {
      setStrength(1);
    }
  }, [isListening, isActivated, hasPermission]);

  const denied = hasPermission === false;
  const activeBars = strength === 5 ? 5 : strength === 3 ? 3 : strength === 1 ? 1 : 0;

  const getBarColor = (index: number) => {
    if (denied) return 'bg-foreground/15';
    if (index >= activeBars) return 'bg-foreground/15 dark:bg-white/15';
    if (strength === 1) return 'bg-[hsl(0_72%_51%)]'; // red / destructive
    return 'bg-primary';
  };

  const tooltip = TOOLTIP_MAP[strength] ?? '';

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div
          className={`relative inline-flex items-end gap-[3px] px-3 py-2 rounded-xl border transition-all duration-200 cursor-pointer
            ${denied ? 'opacity-50' : ''}
            bg-foreground/[0.03] dark:bg-white/[0.03]
            border-foreground/[0.06] dark:border-white/[0.06]
            hover:border-primary/30 hover:bg-primary/[0.04]
          `}
        >
          {BAR_HEIGHTS.map((h, i) => (
            <motion.div
              key={i}
              initial={{ height: 0 }}
              animate={{
                height: h,
                scaleY: strength === 5 && i < activeBars ? [1, 1.05, 1] : 1,
              }}
              transition={{
                height: { duration: 0.4, delay: i * 0.05, ease: 'easeOut' },
                scaleY: strength === 5
                  ? { duration: 1.8, repeat: Infinity, ease: 'easeInOut' }
                  : { duration: 0 },
              }}
              className={`w-[3px] rounded-full transition-colors duration-250 ${getBarColor(i)}`}
              style={{
                boxShadow:
                  strength === 5 && i < activeBars
                    ? '0 0 6px hsl(var(--primary) / 0.4)'
                    : 'none',
              }}
            />
          ))}

          {/* Active transcription dot */}
          {isActivated && !denied && (
            <motion.div
              className="absolute -top-0.5 -right-0.5 w-[5px] h-[5px] rounded-full bg-primary"
              animate={{ opacity: [1, 0.4, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          )}
        </div>
      </TooltipTrigger>
      <TooltipContent
        side="bottom"
        className="bg-popover/90 backdrop-blur-md border-border/50 text-xs"
      >
        {tooltip}
      </TooltipContent>
    </Tooltip>
  );
};

export default SpeechHealthIndicator;
