"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface SelectorOption {
  id: string;
  label: string;
  description?: string;
  icon?: React.ReactNode;
}

interface FullscreenSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (option: SelectorOption) => void;
  options: SelectorOption[];
  title: string;
  searchPlaceholder?: string;
  selectedId?: string;
}

const FullscreenSelector = ({
  isOpen,
  onClose,
  onSelect,
  options,
  title,
  searchPlaceholder = "Buscar...",
  selectedId
}: FullscreenSelectorProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Filtrar opciones según búsqueda
  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (option.description && option.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // NO auto-focus en el input para mejor experiencia nativa

  // Reset búsqueda al cerrar
  useEffect(() => {
    if (!isOpen) {
      setSearchTerm('');
    }
  }, [isOpen]);

  const handleSelect = (option: SelectorOption) => {
    // Feedback háptico en dispositivos móviles
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }
    
    onSelect(option);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[300] bg-black/20 backdrop-blur-md"
            onClick={onClose}
          />
          
          {/* CSS para scroll nativo */}
          <style jsx>{`
            .native-scroll::-webkit-scrollbar {
              display: none;
            }
            .native-scroll {
              -ms-overflow-style: none;
              scrollbar-width: none;
            }
          `}</style>

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: '100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '100%' }}
            transition={{ 
              duration: 0.4, 
              ease: [0.23, 1, 0.32, 1]
            }}
            className="fixed inset-0 z-[400] overflow-hidden flex flex-col"
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.75)',
              backdropFilter: 'blur(20px) saturate(120%)',
              WebkitBackdropFilter: 'blur(20px) saturate(120%)',
              boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.1)',
            }}
          >
            {/* Header */}
            <div className="flex flex-col">
              {/* Title bar with safe area */}
              <div className="flex items-center justify-between px-6 pt-14 pb-3" style={{
                paddingTop: 'max(env(safe-area-inset-top, 14px), 56px)'
              }}>
                <h2 className="text-xl font-semibold text-white">{title}</h2>
                <button
                  onClick={onClose}
                  className="w-11 h-11 rounded-full flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-all duration-200 active:scale-95"
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>
              
              {/* Search bar */}
              <div className="px-6 pb-4">
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="11" cy="11" r="8"/>
                      <path d="m21 21-4.35-4.35"/>
                    </svg>
                  </div>
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder={searchPlaceholder}
                    className="w-full h-11 pl-9 pr-3 bg-white/5 border border-white/20 rounded-lg text-white text-sm placeholder-white/60 focus:outline-none focus:border-white/40 focus:bg-white/10 transition-all duration-200"
                    style={{ fontSize: '16px' }}
                  />
                </div>
              </div>
            </div>

            {/* Options List - Scrollable */}
            <div className="flex-1 overflow-y-auto native-scroll" style={{
              WebkitOverflowScrolling: 'touch'
            }}>
              {filteredOptions.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center px-6">
                  <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-3">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white/40">
                      <circle cx="11" cy="11" r="8"/>
                      <path d="m21 21-4.35-4.35"/>
                    </svg>
                  </div>
                  <p className="text-white/70 text-base font-medium">No se encontraron resultados</p>
                  <p className="text-white/50 text-sm mt-1">Intenta con otro término de búsqueda</p>
                </div>
              ) : (
                <div className="pb-6" style={{
                  paddingBottom: 'max(env(safe-area-inset-bottom, 6px), 24px)'
                }}>
                  {filteredOptions.map((option, index) => (
                    <motion.button
                      key={option.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ 
                        opacity: 1, 
                        y: 0,
                        transition: { 
                          delay: Math.min(index * 0.015, 0.3),
                          duration: 0.3,
                          ease: [0.23, 1, 0.32, 1]
                        }
                      }}
                      onClick={() => handleSelect(option)}
                      className={`w-full flex items-center gap-3 px-6 py-4 text-left transition-all duration-200 active:scale-[0.98] border-b border-white/5 last:border-b-0 ${
                        selectedId === option.id
                          ? 'bg-white/10'
                          : 'hover:bg-white/5 active:bg-white/8'
                      }`}
                      style={{
                        minHeight: '56px',
                        touchAction: 'manipulation'
                      }}
                    >
                      {option.icon && (
                        <div className="flex-shrink-0">
                          {option.icon}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className={`font-medium text-base ${
                          selectedId === option.id ? 'text-white' : 'text-white/90'
                        }`}>
                          {option.label}
                        </p>
                        {option.description && (
                          <p className="text-sm text-white/60 mt-0.5">
                            {option.description}
                          </p>
                        )}
                      </div>
                      {selectedId === option.id && (
                        <motion.div 
                          className="flex-shrink-0"
                          initial={{ scale: 0, rotate: -90 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ 
                            type: "spring", 
                            stiffness: 500, 
                            damping: 25 
                          }}
                        >
                          <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="text-white">
                              <polyline points="20,6 9,17 4,12"/>
                            </svg>
                          </div>
                        </motion.div>
                      )}
                    </motion.button>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default FullscreenSelector;