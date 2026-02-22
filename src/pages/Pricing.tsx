// R3F v8.18 + drei v9.122 + three v0.160
import { Suspense, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { Float, MeshDistortMaterial } from '@react-three/drei';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';

const FloatingBlob = () => {
  const meshRef = useRef<any>(null);

  return (
    <Float speed={1.5} rotationIntensity={0.4} floatIntensity={1.2}>
      <mesh ref={meshRef} scale={2.2}>
        <icosahedronGeometry args={[1, 4]} />
        <MeshDistortMaterial
          color="#13DEBC"
          transparent
          opacity={0.15}
          distort={0.35}
          speed={1.5}
          roughness={0.2}
        />
      </mesh>
    </Float>
  );
};

const Pricing = () => {
  const navigate = useNavigate();

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-background">
      <Navbar />

      <div className="flex-1 relative flex items-center justify-center">
        {/* Three.js background */}
        <div className="absolute inset-0 z-0">
          <Suspense fallback={null}>
            <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
              <ambientLight intensity={0.5} />
              <pointLight position={[10, 10, 10]} intensity={0.8} />
              <FloatingBlob />
            </Canvas>
          </Suspense>
        </div>

        {/* Content overlay */}
        <div className="relative z-10 text-center max-w-lg px-6">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold text-foreground mb-4"
          >
            Premium Features{' '}
            <span className="text-gradient-primary">Coming Soon</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-muted-foreground mb-2"
          >
            We're building advanced AI capabilities to enhance your VoiceScribe experience.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="text-sm text-muted-foreground/60 mb-8"
          >
            Early access launching soon. Stay tuned.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="flex items-center justify-center gap-4"
          >
            <button
              onClick={() => navigate('/')}
              className="px-6 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20 active:scale-[0.97] transition-all"
            >
              Back to Dashboard
            </button>
            <button className="px-6 py-2.5 rounded-lg border border-border text-foreground text-sm font-medium hover:bg-muted/50 active:scale-[0.97] transition-all">
              Notify Me
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
