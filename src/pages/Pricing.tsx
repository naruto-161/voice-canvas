import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Mic } from 'lucide-react';
import { showToast } from '@/components/ui/custom-toast';
import Navbar from '@/components/Navbar';

const Pricing = () => {
  const navigate = useNavigate();

  return (
    <div className="h-screen flex flex-col overflow-hidden" style={{ background: 'linear-gradient(180deg, #0B1220 0%, #0F1F1B 50%, #0B1220 100%)' }}>
      <Navbar />

      <div className="flex-1 relative flex items-center justify-center">
        {/* SVG wireframe diamond */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <svg className="w-[500px] h-[500px] opacity-20 animate-pulse" style={{ animationDuration: '6s' }} viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <path d="M100,20 L140,60 L180,100 L140,140 L100,180 L60,140 L20,100 L60,60 Z" fill="none" stroke="hsl(var(--primary))" strokeWidth="0.5" />
            <path d="M100,0 L200,100 L100,200 L0,100 Z" fill="none" stroke="hsl(var(--primary))" strokeWidth="0.5" />
            <circle cx="100" cy="100" r="80" fill="none" stroke="hsl(var(--primary))" strokeWidth="0.2" />
          </svg>
        </div>

        {/* Content */}
        <main className="relative z-10 w-full max-w-2xl px-6 text-center">
          {/* Logo icon */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} className="mb-12">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 border border-primary/20">
              <Mic className="w-6 h-6 text-primary" />
            </div>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="text-5xl md:text-6xl font-extrabold tracking-tight text-foreground mb-6">
            Premium Features <br />
            <span className="text-gradient-primary">Coming Soon</span>
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }} className="text-lg text-muted-foreground font-light max-w-lg mx-auto leading-relaxed mb-6">
            We're building advanced AI capabilities to enhance your VoiceScribe experience.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }}>
            <span className="inline-block px-4 py-1.5 rounded-full bg-card/60 backdrop-blur-sm border border-border text-xs font-semibold tracking-widest uppercase text-primary/80">
              Early access launching soon
            </span>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.5 }} className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button onClick={() => navigate('/')} className="px-8 py-4 bg-primary text-primary-foreground font-bold rounded-full transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_hsl(var(--primary)/0.4)]">
              Back to Dashboard
            </button>
            <button onClick={() => showToast("We'll notify you when premium features launch.", 'info')} className="px-8 py-4 bg-foreground/5 hover:bg-foreground/10 text-foreground font-medium rounded-full border border-border transition-all duration-300 backdrop-blur-sm">
              Notify Me
            </button>
          </motion.div>

          <motion.footer initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.6 }} className="mt-20 text-muted-foreground text-sm">
            <p>© 2025 VoiceScribe AI. All rights reserved.</p>
          </motion.footer>
        </main>
      </div>
    </div>
  );
};

export default Pricing;
