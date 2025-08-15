"use client";

import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

type DropdownMenuProps = {
  options: {
    label: string;
    onClick: () => void;
    Icon?: React.ReactNode;
    isSelected?: boolean;
  }[];
  children: React.ReactNode;
  minWidth?: string;
  stayOpen?: boolean;
};

const DropdownMenu = ({ options, children, minWidth = "min-w-32", stayOpen = false }: DropdownMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        onClick={toggleDropdown}
        variant="ghost"
        className="h-9 px-3 bg-white/5 border border-white/10 rounded-lg text-white text-sm hover:bg-white/10 hover:border-white/20 transition-all duration-200"
      >
        {children ?? "Menu"}
        <>
          <motion.span
            className="ml-2"
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
          >
            <ChevronDown className="h-3 w-3 text-white/60" />
          </motion.span>
        </>
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className={`absolute z-50 w-full ${minWidth} mt-1 p-1 bg-black/90 backdrop-blur-sm rounded-lg border border-white/20 shadow-2xl shadow-black/50 flex flex-col`}
            style={{
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
            }}
          >
            {options && options.length > 0 ? (
              options.map((option, index) => (
                <motion.button
                  key={option.label}
                  onClick={() => {
                    option.onClick();
                    if (!stayOpen) {
                      setIsOpen(false);
                    }
                  }}
                  whileHover={{
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                  }}
                  className="px-3 py-2 text-white/90 hover:text-white hover:bg-white/10 text-sm rounded-md w-full text-left flex items-center justify-between transition-colors duration-150"
                >
                  <div className="flex items-center gap-x-2">
                    {option.Icon}
                    {option.label}
                  </div>
                  <div className={`w-3 h-3 rounded border ${option.isSelected ? 'bg-white/20 border-white/40' : 'border-white/20'} flex items-center justify-center`}>
                    {option.isSelected && (
                      <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                </motion.button>
              ))
            ) : (
              <div className="px-3 py-2 text-white/60 text-xs">Sin opciones</div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export { DropdownMenu };