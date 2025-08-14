"use client"

import * as React from "react"
import { cn } from "@/lib/utils";
import { motion } from "motion/react";

export interface ImageLoadingRevealProps {
  children: React.ReactNode;
  isLoading: boolean;
  className?: string;
  duration?: number;
}

export const ImageLoadingReveal = ({
  children,
  isLoading,
  className,
  duration = 2500
}: ImageLoadingRevealProps) => {
  const [shouldReveal, setShouldReveal] = React.useState(false);
  const [showOverlay, setShowOverlay] = React.useState(true);

  React.useEffect(() => {
    if (isLoading) {
      // Reset states when loading starts
      setShouldReveal(false);
      setShowOverlay(true);
    } else {
      // Start reveal animation when loading finishes
      setShouldReveal(true);
      // Remove overlay after animation completes
      setTimeout(() => {
        setShowOverlay(false);
      }, duration + 100);
    }
  }, [isLoading, duration]);

  return (
    <div className={cn("relative", className)}>
      {children}
      {showOverlay && (
        <motion.div
          className="absolute inset-0 pointer-events-none backdrop-blur-xl bg-black/30 rounded-[inherit]"
          initial={{ clipPath: "polygon(0 0%, 100% 0%, 100% 100%, 0 100%)" }}
          animate={{
            clipPath: shouldReveal 
              ? "polygon(0 100%, 100% 100%, 100% 100%, 0 100%)"
              : "polygon(0 0%, 100% 0%, 100% 100%, 0 100%)"
          }}
          transition={{
            duration: duration / 1000,
            ease: "easeInOut"
          }}
        />
      )}
    </div>
  );
};

ImageLoadingReveal.displayName = "ImageLoadingReveal";