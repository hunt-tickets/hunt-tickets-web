import { Button } from "@/components/sub/button";
import Link from "next/link";
import { useEffect, useState } from "react";

const Banner = () => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const [showCursor, setShowCursor] = useState(true);
  
  const words = ["EXPERIENCES...", "PARTIES...", "EVENTS...", "CONCERTS...", "FESTIVALS...", "SHOWS..."];

  useEffect(() => {
    const currentWord = words[currentWordIndex];
    let timeouts: NodeJS.Timeout[] = [];

    if (isTyping) {
      // Typing animation
      for (let i = 0; i <= currentWord.length; i++) {
        const timeout = setTimeout(() => {
          setDisplayedText(currentWord.slice(0, i));
          if (i === currentWord.length) {
            // Word complete, wait then start deleting
            const waitTimeout = setTimeout(() => {
              setIsTyping(false);
            }, 2000); // Wait 2 seconds before deleting
            timeouts.push(waitTimeout);
          }
        }, i * 100); // Type each letter every 100ms
        timeouts.push(timeout);
      }
    } else {
      // Deleting animation
      for (let i = currentWord.length; i >= 0; i--) {
        const timeout = setTimeout(() => {
          setDisplayedText(currentWord.slice(0, i));
          if (i === 0) {
            // Deletion complete, move to next word
            setCurrentWordIndex((prev) => (prev + 1) % words.length);
            setIsTyping(true);
          }
        }, (currentWord.length - i) * 50); // Delete faster than typing
        timeouts.push(timeout);
      }
    }

    // Cursor blinking
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);
    timeouts.push(cursorInterval as any);

    return () => {
      timeouts.forEach(timeout => clearTimeout(timeout));
    };
  }, [currentWordIndex, isTyping]);

  return (
    <div className="relative w-full h-screen overflow-hidden">
      
      {/* Video Background */}
      <video
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        loop
        muted
        playsInline
      >
        <source src="https://jtfcfsnksywotlbsddqb.supabase.co/storage/v1/object/public/website/video_hero.mp4" type="video/mp4" />
      </video>

      {/* Grain texture overlay */}
      <div 
        className="absolute inset-0 opacity-60 mix-blend-multiply pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.8' numOctaves='6' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          backgroundSize: '200px 200px'
        }}
      ></div>

      {/* Gradient overlay for smooth transition to next section */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            linear-gradient(to bottom, 
              rgba(10,10,10,0.2) 0%, 
              rgba(10,10,10,0.3) 30%, 
              rgba(10,10,10,0.5) 60%, 
              rgba(10,10,10,0.8) 80%, 
              rgba(10,10,10,0.95) 95%, 
              rgb(10,10,10) 100%
            )
          `
        }}
      ></div>

      {/* Advanced decorative elements - Monochromatic */}
      <div className="absolute inset-0 pointer-events-none z-5">
        
        {/* Top Left - Monochromatic glowing orbs */}
        <div className="absolute top-32 left-32">
          <div className="w-8 h-8 rounded-full bg-white/20 blur-sm animate-glow-pulse"></div>
          <div className="w-4 h-4 rounded-full bg-white/30 absolute top-2 left-2 animate-orbit-slow"></div>
          <div className="w-12 h-12 border border-white/15 rounded-full absolute -top-2 -left-2 animate-spin-slow"></div>
        </div>
        
        {/* Top Right - Geometric cluster */}
        <div className="absolute top-40 right-32 transform perspective-1000">
          <div className="w-10 h-10 bg-white/15 transform rotate-45 skew-y-12 animate-3d-float"></div>
          <div className="w-6 h-6 border-2 border-white/20 absolute top-6 right-4 transform rotate-12 animate-geometric-dance"></div>
          <div className="w-16 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent absolute top-8 -left-3 animate-laser-sweep"></div>
        </div>
        
        {/* Left Side - Flowing energy lines */}
        <div className="absolute top-1/3 left-24">
          <svg width="60" height="120" className="animate-energy-flow">
            <path d="M10 0 Q30 30 10 60 Q50 90 10 120" stroke="rgba(255, 255, 255, 0.2)" strokeWidth="2" fill="none" strokeDasharray="5,10" />
            <path d="M20 10 Q40 40 20 70 Q60 100 20 120" stroke="rgba(255, 255, 255, 0.15)" strokeWidth="1" fill="none" strokeDasharray="3,8" />
          </svg>
          <div className="w-3 h-3 bg-white/25 rounded-full absolute top-0 left-2 animate-flow-particle"></div>
        </div>
        
        {/* Right Side - Holographic elements */}
        <div className="absolute top-1/2 right-24 -translate-y-1/2">
          <div className="w-14 h-14 border border-white/15 rounded-lg transform rotate-12 animate-hologram-flicker">
            <div className="w-full h-full bg-white/8 rounded-lg"></div>
            <div className="w-8 h-8 border border-white/20 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded animate-inner-rotation"></div>
          </div>
          <div className="w-20 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent absolute top-7 -left-3 animate-scan-line"></div>
        </div>
        
        {/* Bottom Left - Particle constellation */}
        <div className="absolute bottom-48 left-32">
          <div className="relative w-16 h-16">
            <div className="w-2 h-2 bg-white/40 rounded-full absolute top-0 left-0 animate-constellation-1"></div>
            <div className="w-1.5 h-1.5 bg-white/30 rounded-full absolute top-4 right-2 animate-constellation-2"></div>
            <div className="w-1 h-1 bg-white/25 rounded-full absolute bottom-2 left-6 animate-constellation-3"></div>
            <svg width="64" height="64" className="absolute top-0 left-0 animate-constellation-connect">
              <line x1="8" y1="8" x2="56" y2="24" stroke="rgba(255, 255, 255, 0.15)" strokeWidth="1" />
              <line x1="56" y1="24" x2="24" y2="56" stroke="rgba(255, 255, 255, 0.15)" strokeWidth="1" />
            </svg>
          </div>
        </div>
        
        {/* Bottom Right - Digital grid */}
        <div className="absolute bottom-36 right-32">
          <div className="grid grid-cols-4 gap-1 w-12 h-12 animate-digital-matrix">
            <div className="w-2 h-2 bg-white/15 animate-matrix-cell-1"></div>
            <div className="w-2 h-2 bg-white/20 animate-matrix-cell-2"></div>
            <div className="w-2 h-2 bg-white/10 animate-matrix-cell-3"></div>
            <div className="w-2 h-2 bg-white/25 animate-matrix-cell-4"></div>
            <div className="w-2 h-2 bg-white/20 animate-matrix-cell-5"></div>
            <div className="w-2 h-2 bg-white/10 animate-matrix-cell-6"></div>
            <div className="w-2 h-2 bg-white/30 animate-matrix-cell-7"></div>
            <div className="w-2 h-2 bg-white/15 animate-matrix-cell-8"></div>
          </div>
        </div>
        
        {/* Center floating elements - Ambient particles */}
        <div className="absolute top-1/4 left-1/3">
          <div className="w-3 h-3 bg-white/20 rounded-full blur-sm animate-ambient-float-1"></div>
        </div>
        <div className="absolute top-2/3 right-1/3">
          <div className="w-2 h-2 bg-white/25 rounded-full blur-sm animate-ambient-float-2"></div>
        </div>
        <div className="absolute top-1/2 left-2/3">
          <div className="w-4 h-4 bg-white/15 rounded-full blur-sm animate-ambient-float-3"></div>
        </div>
        
        {/* Dynamic light rays */}
        <div className="absolute top-24 left-1/2 -translate-x-1/2">
          <div className="w-px h-16 bg-gradient-to-b from-white/25 to-transparent animate-light-ray-1"></div>
        </div>
        <div className="absolute bottom-32 right-2/5">
          <div className="w-20 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent animate-light-ray-2"></div>
        </div>
        
      </div>

      {/* Central content */}
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <div className="text-center space-y-8 px-6">
          
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-black text-white leading-none tracking-tight drop-shadow-2xl">
            HUNT FOR GOOD<br />
            <span className="relative inline-block">
              {displayedText}
              <span 
                className={`inline-block w-1 h-[0.9em] bg-white ml-1 ${
                  showCursor ? 'opacity-100' : 'opacity-0'
                } transition-opacity duration-100`}
                style={{ verticalAlign: 'baseline' }}
              />
            </span>
          </h1>
          
          <div className="pt-12 flex justify-center">
            <Link href="/events">
              <button 
                className="px-16 py-5 text-xl font-medium transition-all duration-300 backdrop-blur-md border border-white/20 shadow-xl text-white cursor-pointer group"
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(20px)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
                  borderRadius: '9999px'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'rgba(255, 255, 255, 0.4)';
                  e.target.style.color = 'white';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                  e.target.style.color = 'white';
                }}
              >
                Descubrir Eventos
              </button>
            </Link>
          </div>

        </div>
      </div>

      {/* Scroll indicator - positioned at bottom of hero */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
        <div className="flex flex-col items-center animate-bounce-slow">
          <div className="w-8 h-12 border-2 border-white/40 rounded-full flex justify-center relative">
            <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-scroll-wheel"></div>
          </div>
          <span className="text-white/50 text-xs mt-2 font-medium">SCROLL</span>
        </div>
      </div>

      {/* Advanced animations for decorative elements */}
      <style jsx>{`
        @keyframes glow-pulse {
          0%, 100% { transform: scale(1); filter: blur(4px); opacity: 0.3; }
          50% { transform: scale(1.2); filter: blur(2px); opacity: 0.8; }
        }
        
        @keyframes orbit-slow {
          0% { transform: translate(0px, 0px); }
          25% { transform: translate(8px, -4px); }
          50% { transform: translate(4px, -8px); }
          75% { transform: translate(-4px, -4px); }
          100% { transform: translate(0px, 0px); }
        }
        
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes 3d-float {
          0%, 100% { transform: rotate(45deg) skew(12deg) translateZ(0px) scale(1); }
          50% { transform: rotate(45deg) skew(12deg) translateZ(10px) scale(1.1); }
        }
        
        @keyframes geometric-dance {
          0%, 100% { transform: rotate(12deg) scale(1); }
          33% { transform: rotate(72deg) scale(1.2); }
          66% { transform: rotate(132deg) scale(0.8); }
        }
        
        @keyframes laser-sweep {
          0% { opacity: 0; transform: scaleX(0); }
          50% { opacity: 1; transform: scaleX(1); }
          100% { opacity: 0; transform: scaleX(0); }
        }
        
        @keyframes energy-flow {
          0% { stroke-dashoffset: 0; }
          100% { stroke-dashoffset: 100; }
        }
        
        @keyframes flow-particle {
          0% { transform: translateY(0px); opacity: 0.4; }
          50% { transform: translateY(-60px); opacity: 0.8; }
          100% { transform: translateY(-120px); opacity: 0; }
        }
        
        @keyframes hologram-flicker {
          0%, 100% { opacity: 0.2; transform: rotate(12deg); }
          25% { opacity: 0.6; transform: rotate(12deg) scale(1.05); }
          50% { opacity: 0.3; transform: rotate(12deg); }
          75% { opacity: 0.8; transform: rotate(12deg) scale(0.95); }
        }
        
        @keyframes inner-rotation {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(360deg); }
        }
        
        @keyframes scan-line {
          0%, 100% { opacity: 0; transform: scaleX(0); }
          50% { opacity: 1; transform: scaleX(1); }
        }
        
        @keyframes constellation-1 {
          0%, 100% { transform: scale(1); opacity: 0.6; }
          50% { transform: scale(1.5); opacity: 1; }
        }
        
        @keyframes constellation-2 {
          0%, 100% { transform: scale(1); opacity: 0.4; }
          50% { transform: scale(1.3); opacity: 0.8; }
        }
        
        @keyframes constellation-3 {
          0%, 100% { transform: scale(1); opacity: 0.3; }
          50% { transform: scale(1.2); opacity: 0.6; }
        }
        
        @keyframes constellation-connect {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.6; }
        }
        
        @keyframes digital-matrix {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes matrix-cell-1 { 0%, 100% { opacity: 0.2; } 12.5% { opacity: 0.5; } }
        @keyframes matrix-cell-2 { 0%, 100% { opacity: 0.3; } 25% { opacity: 0.6; } }
        @keyframes matrix-cell-3 { 0%, 100% { opacity: 0.1; } 37.5% { opacity: 0.4; } }
        @keyframes matrix-cell-4 { 0%, 100% { opacity: 0.4; } 50% { opacity: 0.8; } }
        @keyframes matrix-cell-5 { 0%, 100% { opacity: 0.3; } 62.5% { opacity: 0.7; } }
        @keyframes matrix-cell-6 { 0%, 100% { opacity: 0.1; } 75% { opacity: 0.3; } }
        @keyframes matrix-cell-7 { 0%, 100% { opacity: 0.5; } 87.5% { opacity: 0.9; } }
        @keyframes matrix-cell-8 { 0%, 100% { opacity: 0.2; } 100% { opacity: 0.5; } }
        
        @keyframes ambient-float-1 {
          0%, 100% { transform: translate(0px, 0px); opacity: 0.3; }
          50% { transform: translate(20px, -30px); opacity: 0.7; }
        }
        
        @keyframes ambient-float-2 {
          0%, 100% { transform: translate(0px, 0px); opacity: 0.4; }
          50% { transform: translate(-15px, 25px); opacity: 0.8; }
        }
        
        @keyframes ambient-float-3 {
          0%, 100% { transform: translate(0px, 0px); opacity: 0.2; }
          50% { transform: translate(10px, -20px); opacity: 0.6; }
        }
        
        @keyframes light-ray-1 {
          0%, 100% { opacity: 0; transform: scaleY(0); }
          50% { opacity: 0.4; transform: scaleY(1); }
        }
        
        @keyframes light-ray-2 {
          0%, 100% { opacity: 0; transform: scaleX(0); }
          50% { opacity: 0.3; transform: scaleX(1); }
        }
        
        .animate-glow-pulse { animation: glow-pulse 4s ease-in-out infinite; }
        .animate-orbit-slow { animation: orbit-slow 8s ease-in-out infinite; }
        .animate-spin-slow { animation: spin-slow 15s linear infinite; }
        .animate-3d-float { animation: 3d-float 6s ease-in-out infinite; }
        .animate-geometric-dance { animation: geometric-dance 5s ease-in-out infinite 1s; }
        .animate-laser-sweep { animation: laser-sweep 3s ease-in-out infinite 2s; }
        .animate-energy-flow { animation: energy-flow 4s linear infinite; }
        .animate-flow-particle { animation: flow-particle 6s ease-out infinite; }
        .animate-hologram-flicker { animation: hologram-flicker 2s ease-in-out infinite; }
        .animate-inner-rotation { animation: inner-rotation 10s linear infinite; }
        .animate-scan-line { animation: scan-line 4s ease-in-out infinite 1s; }
        .animate-constellation-1 { animation: constellation-1 3s ease-in-out infinite; }
        .animate-constellation-2 { animation: constellation-2 3s ease-in-out infinite 0.5s; }
        .animate-constellation-3 { animation: constellation-3 3s ease-in-out infinite 1s; }
        .animate-constellation-connect { animation: constellation-connect 4s ease-in-out infinite; }
        .animate-digital-matrix { animation: digital-matrix 20s linear infinite; }
        .animate-matrix-cell-1 { animation: matrix-cell-1 2s ease-in-out infinite; }
        .animate-matrix-cell-2 { animation: matrix-cell-2 2s ease-in-out infinite 0.25s; }
        .animate-matrix-cell-3 { animation: matrix-cell-3 2s ease-in-out infinite 0.5s; }
        .animate-matrix-cell-4 { animation: matrix-cell-4 2s ease-in-out infinite 0.75s; }
        .animate-matrix-cell-5 { animation: matrix-cell-5 2s ease-in-out infinite 1s; }
        .animate-matrix-cell-6 { animation: matrix-cell-6 2s ease-in-out infinite 1.25s; }
        .animate-matrix-cell-7 { animation: matrix-cell-7 2s ease-in-out infinite 1.5s; }
        .animate-matrix-cell-8 { animation: matrix-cell-8 2s ease-in-out infinite 1.75s; }
        .animate-ambient-float-1 { animation: ambient-float-1 12s ease-in-out infinite; }
        .animate-ambient-float-2 { animation: ambient-float-2 10s ease-in-out infinite 2s; }
        .animate-ambient-float-3 { animation: ambient-float-3 14s ease-in-out infinite 4s; }
        .animate-light-ray-1 { animation: light-ray-1 5s ease-in-out infinite; }
        .animate-light-ray-2 { animation: light-ray-2 6s ease-in-out infinite 2s; }
        
        @keyframes scroll-wheel {
          0%, 100% { transform: translateY(0); opacity: 0.6; }
          50% { transform: translateY(16px); opacity: 0.2; }
        }
        
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        
        .animate-scroll-wheel { animation: scroll-wheel 2s ease-in-out infinite; }
        .animate-bounce-slow { animation: bounce-slow 3s ease-in-out infinite; }
      `}</style>

    </div>
  );
};

export default Banner;
