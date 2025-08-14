import React, { useState, useEffect } from 'react';
import { Instagram, Linkedin, Menu, X, Mail } from 'lucide-react';

type AvatarProps = {
  imageSrc: string;
  delay: number;
};

const Avatar: React.FC<AvatarProps> = ({ imageSrc, delay }) => {
  return (
    <div 
      className="relative h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10 rounded-full overflow-hidden border-2 border-gray-700 shadow-lg animate-fadeIn"
      style={{ animationDelay: `${delay}ms` }}
    >
      <img 
        src={imageSrc} 
        alt="User avatar" 
        className="h-full w-full object-cover"
        onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=100&auto=format&fit=crop&ixlib=rb-4.0.3' }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
    </div>
  );
};

const TrustElements: React.FC = () => {
  const avatars = [
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&auto=format&fit=crop&ixlib=rb-4.0.3",
    "https://images.unsplash.com/photo-1494790108755-2616b612b786?q=80&w=100&auto=format&fit=crop&ixlib=rb-4.0.3",
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=100&auto=format&fit=crop&ixlib=rb-4.0.3",
    "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=100&auto=format&fit=crop&ixlib=rb-4.0.3",
  ];

  return (
    <div className="inline-flex items-center space-x-3 bg-gray-900/60 backdrop-blur-sm rounded-full py-2 px-3 sm:py-2 sm:px-4 text-xs sm:text-sm">
      <div className="flex -space-x-2 sm:-space-x-3">
        {avatars.map((avatar, index) => (
          <Avatar key={index} imageSrc={avatar} delay={index * 200} />
        ))}
      </div>
      <p className="text-white animate-fadeIn whitespace-nowrap font-medium" style={{ animationDelay: '800ms' }}>
        <span className="text-white font-semibold">5.2K</span> esperando eventos exclusivos
      </p>
    </div>
  );
};

const WaitlistForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;

    setIsSubmitting(true);
    
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setEmail('');
      
      setTimeout(() => {
        setIsSubmitted(false);
      }, 3000);
    }, 1500);
  };

  return (
    <div className="relative z-10 w-full">
      {!isSubmitted ? (
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Ingresa tu email"
            className="flex-1 px-6 sm:px-8 py-3 sm:py-4 rounded-full bg-gray-900/60 border border-gray-700 focus:border-white outline-none text-white text-sm sm:text-base shadow-[0_0_15px_rgba(0,0,0,0.3)] backdrop-blur-sm transition-all duration-300 font-medium"
            required
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-6 sm:px-8 py-3 sm:py-4 rounded-full transition-all duration-300 transform hover:scale-105 whitespace-nowrap text-sm sm:text-base font-medium ${
              isSubmitting 
                ? 'bg-gray-600 text-gray-300 cursor-not-allowed' 
                : 'bg-white hover:bg-gray-100 text-black'
            }`}
          >
            {isSubmitting ? (
              <div className="h-4 w-4 sm:h-5 sm:w-5 border-2 border-gray-300 border-t-black rounded-full animate-spin"></div>
            ) : (
              'Únete a la Lista'
            )}
          </button>
        </form>
      ) : (
        <div className="bg-green-500/20 border border-green-500/30 text-green-300 rounded-full px-6 sm:px-8 py-3 sm:py-4 text-center animate-fadeIn text-sm sm:text-base font-medium">
          ¡Gracias! Te notificaremos cuando lancemos.
        </div>
      )}
    </div>
  );
};

const GradientBars: React.FC = () => {
  const [numBars] = useState(15);

  const calculateHeight = (index: number, total: number) => {
    const position = index / (total - 1);
    const maxHeight = 100;
    const minHeight = 30;
    
    const center = 0.5;
    const distanceFromCenter = Math.abs(position - center);
    const heightPercentage = Math.pow(distanceFromCenter * 2, 1.2);
    
    return minHeight + (maxHeight - minHeight) * heightPercentage;
  };

  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      <div 
        className="flex h-full"
        style={{
          width: '100%',
          transform: 'translateZ(0)',
          backfaceVisibility: 'hidden',
          WebkitFontSmoothing: 'antialiased',
        }}
      >
        {Array.from({ length: numBars }).map((_, index) => {
          const height = calculateHeight(index, numBars);
          return (
            <div
              key={index}
              style={{
                flex: '1 0 calc(100% / 15)',
                maxWidth: 'calc(100% / 15)',
                height: '100%',
                background: 'linear-gradient(to top, rgb(147, 51, 234), transparent)',
                transform: `scaleY(${height / 100})`,
                transformOrigin: 'bottom',
                transition: 'transform 0.5s ease-in-out',
                animation: 'pulseBar 2s ease-in-out infinite alternate',
                animationDelay: `${index * 0.1}s`,
                outline: '1px solid rgba(0, 0, 0, 0)',
                boxSizing: 'border-box',
              }}
            />
          );
        })}
      </div>
    </div>
  );
};

export const HuntHeroSection: React.FC = () => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const [showCursor, setShowCursor] = useState(true);
  
  const words = ["Events...", "Parties...", "Experiences...", "Concerts...", "Festivals...", "Shows..."];

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
    <section className="relative min-h-screen flex flex-col items-center px-6 sm:px-8 md:px-12 overflow-hidden">
      <div className="absolute inset-0 bg-gray-950"></div>
      <GradientBars />
      
      <div className="relative z-10 text-center w-full max-w-4xl mx-auto flex flex-col items-center justify-center min-h-screen py-8 sm:py-16">
        <div className="mb-6 sm:mb-8">
          <TrustElements />
        </div>
        
        <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold text-white leading-none drop-shadow-2xl mb-6 sm:mb-8 animate-fadeIn px-4" style={{ letterSpacing: '-5px', lineHeight: '130%' }}>
          HUNT FOR GOOD<br />
          <span 
            className="relative inline-block italic font-light"
            style={{ 
              fontFamily: "'Amarante', 'Cinzel Decorative', serif",
              letterSpacing: '-5px',
              fontWeight: '400',
              lineHeight: '120%'
            }}
          >
            {displayedText}
            <span 
              className={`inline-block w-1 h-[0.9em] bg-white ml-1 ${
                showCursor ? 'opacity-100' : 'opacity-0'
              } transition-opacity duration-100`}
              style={{ verticalAlign: 'baseline' }}
            />
          </span>
        </h1>
        
        <div className="mb-6 sm:mb-10 px-4">
          <p className="text-[clamp(1rem,3vw,1.5rem)] text-gray-400 leading-relaxed animate-fadeIn animation-delay-200 font-medium">
            Sé el primero en conocer los eventos más exclusivos.
          </p>
          <p className="text-[clamp(1rem,3vw,1.5rem)] text-gray-400 leading-relaxed animate-fadeIn animation-delay-300 font-medium">
            Únete a la lista de espera y obtén acceso anticipado.
          </p>
        </div>
        
        <div className="w-full max-w-2xl mb-6 sm:mb-8 px-4">
          <WaitlistForm />
        </div>
        
        <div className="flex justify-center space-x-4">
          <a href="#" className="w-12 h-12 rounded-full bg-white/10 border border-white/20 backdrop-blur-xl hover:bg-white/20 hover:border-white/30 transition-all duration-300 flex items-center justify-center group shadow-lg">
            <Instagram size={20} className="text-white/80 group-hover:text-white transition-colors duration-300" />
          </a>
          <a href="#" className="w-12 h-12 rounded-full bg-white/10 border border-white/20 backdrop-blur-xl hover:bg-white/20 hover:border-white/30 transition-all duration-300 flex items-center justify-center group shadow-lg">
            <Linkedin size={20} className="text-white/80 group-hover:text-white transition-colors duration-300" />
          </a>
          <a href="https://wa.me/" className="w-12 h-12 rounded-full bg-white/10 border border-white/20 backdrop-blur-xl hover:bg-white/20 hover:border-white/30 transition-all duration-300 flex items-center justify-center group shadow-lg">
            <svg className="w-5 h-5 text-white/80 group-hover:text-white transition-colors duration-300" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
            </svg>
          </a>
          <a href="mailto:" className="w-12 h-12 rounded-full bg-white/10 border border-white/20 backdrop-blur-xl hover:bg-white/20 hover:border-white/30 transition-all duration-300 flex items-center justify-center group shadow-lg">
            <Mail size={20} className="text-white/80 group-hover:text-white transition-colors duration-300" />
          </a>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes pulseBar {
          0% { transform: scaleY(0.8); }
          100% { transform: scaleY(1.2); }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.8s ease-out forwards;
          opacity: 0;
        }
        
        .animation-delay-200 {
          animation-delay: 200ms;
        }
        
        .animation-delay-300 {
          animation-delay: 300ms;
        }
      `}</style>
    </section>
  );
};