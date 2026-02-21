import { useTheme } from '@/contexts/ThemeContext';
import { Sun, Moon } from 'lucide-react';
import { motion } from 'framer-motion';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      onClick={toggleTheme}
      className="relative flex items-center w-16 h-8 rounded-full p-1 transition-colors duration-300"
      style={{
        backgroundColor: isDark ? 'hsl(var(--secondary))' : 'hsl(var(--muted))',
      }}
      aria-label="Toggle theme"
    >
      <Sun className="absolute left-2 w-4 h-4 text-amber-400" />
      <Moon className="absolute right-2 w-4 h-4 text-primary" />
      <motion.div
        className="w-6 h-6 rounded-full bg-foreground"
        animate={{ x: isDark ? 32 : 0 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      />
    </button>
  );
};

export default ThemeToggle;
