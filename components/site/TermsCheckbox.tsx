import React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

interface TermsCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  className?: string;
}

const TermsCheckbox: React.FC<TermsCheckboxProps> = ({ 
  checked, 
  onChange, 
  className = "" 
}) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className="relative flex-shrink-0"
      >
        <div
          className={`w-5 h-5 rounded-md transition-all duration-200 ${ 
            checked 
              ? 'bg-white' 
              : 'bg-transparent'
          }`}
          style={{
            border: checked ? 'none' : '2px solid rgba(255, 255, 255, 0.3)',
            boxShadow: checked ? '0 2px 8px rgba(255, 255, 255, 0.3)' : 'none'
          }}
        >
          <AnimatePresence>
            {checked && (
              <motion.svg
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="w-full h-full"
                viewBox="0 0 20 20"
                fill="none"
              >
                <motion.path
                  d="M6 10L9 13L14 7"
                  stroke="black"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                />
              </motion.svg>
            )}
          </AnimatePresence>
        </div>
      </button>
      
      <label 
        htmlFor="terms-custom-checkbox" 
        onClick={() => onChange(!checked)}
        className="text-xs text-neutral-400 leading-[1.5] cursor-pointer select-none flex-1"
      >
        Acepto los{" "}
        <Link 
          href="/terms" 
          className="text-neutral-400 underline hover:text-neutral-300 transition-colors duration-200"
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
        >
          Términos y Condiciones
        </Link>{" "}
        y la{" "}
        <Link 
          href="/privacy" 
          className="text-neutral-400 underline hover:text-neutral-300 transition-colors duration-200"
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
        >
          Política de Privacidad
        </Link>
      </label>
    </div>
  );
};

export default TermsCheckbox;