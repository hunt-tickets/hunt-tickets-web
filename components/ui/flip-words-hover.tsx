"use client";
import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const FlipWordsHover = ({
  currentWord,
  className,
}: {
  currentWord: string;
  className?: string;
}) => {
  // Mapeo de palabras para mostrar en español
  const wordMapping: { [key: string]: string } = {
    "Email": "Correo Electrónico",
    "Apple Wallet": "Apple Wallet",
    "WhatsApp": "Notificación WhatsApp",
    "App HUNT": "Hunt Tickets App",
    "HUNT": "HUNT"
  };
  
  // Obtener la palabra mapeada o usar la original
  const displayWord = wordMapping[currentWord] || currentWord;
  
  // Separar palabras para aplicar diferentes estilos
  const words = displayWord.split(' ');
  
  // Lógica especial para "Hunt Tickets App" - App es amarante, resto normal
  const isAppHunt = displayWord === "Hunt Tickets App";
  
  let firstPart = '';
  let secondPart = '';
  
  if (isAppHunt) {
    // Para "Hunt Tickets App" - "Hunt Tickets" normal, "App" amarante
    firstPart = words.slice(0, -1).join(' '); // "Hunt Tickets"
    secondPart = words[words.length - 1]; // "App"
  } else {
    // Para otros casos - primera palabra normal, resto amarante
    firstPart = words[0] || '';
    secondPart = words.slice(1).join(' ') || '';
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={displayWord}
        initial={{
          opacity: 0,
          y: 20,
          filter: "blur(8px)",
        }}
        animate={{
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
        }}
        exit={{
          opacity: 0,
          y: -20,
          filter: "blur(8px)",
        }}
        transition={{
          duration: 0.3,
          ease: "easeInOut",
        }}
        className={cn(
          "inline-block text-4xl md:text-6xl xl:text-7xl text-white leading-tight whitespace-nowrap", 
          !isAppHunt ? "font-bold" : "",
          className
        )}
        style={{ letterSpacing: '-5px', lineHeight: '130%' }}
      >
        {isAppHunt ? (
          <>
            <span className="font-bold">
              {firstPart}
            </span>
            {" "}
            <span style={{ fontFamily: "'Amarante', 'Cinzel Decorative', serif", fontWeight: '400' }} className="italic">
              {secondPart}
            </span>
          </>
        ) : (
          <>
            {firstPart}
            {secondPart && (
              <>
                {" "}
                <span style={{ fontFamily: "'Amarante', 'Cinzel Decorative', serif", fontWeight: '400' }} className="italic">
                  {secondPart}
                </span>
              </>
            )}
          </>
        )}
      </motion.div>
    </AnimatePresence>
  );
};