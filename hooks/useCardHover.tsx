"use client";

import { useState, createContext, useContext, ReactNode } from 'react';

interface CardHoverContextType {
  hoveredCard: string | null;
  setHoveredCard: (card: string | null) => void;
}

const CardHoverContext = createContext<CardHoverContextType | undefined>(undefined);

export function CardHoverProvider({ children }: { children: ReactNode }) {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  return (
    <CardHoverContext.Provider value={{ hoveredCard, setHoveredCard }}>
      {children}
    </CardHoverContext.Provider>
  );
}

export function useCardHover() {
  const context = useContext(CardHoverContext);
  if (context === undefined) {
    throw new Error('useCardHover must be used within a CardHoverProvider');
  }
  return context;
}