"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface EventDescriptionProps {
  text: string;
  className?: string;
}

const EventDescription = ({ text, className }: EventDescriptionProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showExpandButton, setShowExpandButton] = useState(false);
  const [lineHeight, setLineHeight] = useState(28);
  const textRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (textRef.current) {
      const computedStyle = window.getComputedStyle(textRef.current);
      const lineHeightValue = parseFloat(computedStyle.lineHeight);
      setLineHeight(lineHeightValue);
      
      const maxHeight = lineHeightValue * 3;
      const actualHeight = textRef.current.scrollHeight;
      
      setShowExpandButton(actualHeight > maxHeight);
    }
  }, [text]);

  return (
    <div className={cn("w-full relative", className)}>
      {/* Título Info */}
      <div className="flex w-full flex-row items-start gap-4 mb-4">
        <span className="text-heading-2 font-heading-2 text-default-font">
          Info
        </span>
      </div>

      {/* Texto flotante */}
      <motion.div
        className="relative"
      >
        <motion.div
          className="relative overflow-hidden"
          animate={{ 
            height: isExpanded ? "auto" : `${lineHeight * 3}px`
          }}
          transition={{ 
            duration: 0.6, 
            ease: [0.23, 1, 0.32, 1]
          }}
        >
          <motion.p 
            ref={textRef}
            className="text-body font-body text-default-font whitespace-pre-wrap text-justify leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            {text}
          </motion.p>
          
          {/* Fade gradient que se funde naturalmente con el fondo negro */}
          <AnimatePresence>
            {!isExpanded && showExpandButton && (
              <motion.div 
                className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none bg-gradient-to-b from-transparent to-black"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              />
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>

      {/* Flecha flotante minimalista */}
      <AnimatePresence>
        {showExpandButton && (
          <motion.div
            className="flex justify-center mt-4"
            initial={{ opacity: 0, y: 10, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.8 }}
            transition={{ 
              duration: 0.4, 
              ease: [0.23, 1, 0.32, 1],
              delay: 0.1
            }}
          >
            <motion.button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-neutral-400 hover:text-neutral-300 transition-colors duration-300 text-sm font-normal flex items-center gap-1"
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.95 }}
            >
              {isExpanded ? (
                <>
                  Leer menos
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="m18 15-6-6-6 6"/>
                  </svg>
                </>
              ) : (
                <>
                  Leer más
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="m6 9 6 6 6-6"/>
                  </svg>
                </>
              )}
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EventDescription;