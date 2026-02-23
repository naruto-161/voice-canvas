import { Mic } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import ProfileDropdown from './ProfileDropdown';
import SpeechHealthIndicator from './SpeechHealthIndicator';

interface NavbarProps {
  isListening?: boolean;
  isActivated?: boolean;
  hasPermission?: boolean | null;
}

const Navbar = ({ isListening = false, isActivated = false, hasPermission = null }: NavbarProps) => {
  return (
    <nav className="h-16 flex items-center justify-between px-5 border-b border-border bg-card/80 backdrop-blur-sm shrink-0 z-50">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center">
          <Mic className="w-4 h-4 text-primary" />
        </div>
        <span className="text-lg font-semibold tracking-tight text-foreground">
          Voice<span className="text-primary">Scribe</span>
        </span>
      </div>

      <div className="flex items-center gap-4">
        <ThemeToggle />
        <SpeechHealthIndicator
          isListening={isListening}
          isActivated={isActivated}
          hasPermission={hasPermission}
        />
        <ProfileDropdown />
      </div>
    </nav>
  );
};

export default Navbar;
