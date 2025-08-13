import * as React from "react";

import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input"> & { showEmailIcon?: boolean }>(
  ({ className, type, disabled, showEmailIcon = false, ...props }, ref) => {
    const hasIcon = showEmailIcon && type === "email";
    
    return (
      <div className="relative">
        {/* Email icon */}
        {hasIcon && (
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-white/60"
            >
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
              <polyline points="22,6 12,13 2,6"/>
            </svg>
          </div>
        )}
        
        <input
          type={type}
          disabled={disabled}
          className={cn(
            "flex !h-12 w-full rounded-xl border border-white/20 bg-white/5 backdrop-blur-md py-3 text-base text-white placeholder:text-white/50 transition-all duration-300 file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:border-white/40 focus-visible:bg-white/10 focus-visible:shadow-lg hover:border-white/30 hover:bg-white/8 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
            hasIcon ? "pl-12 pr-4" : "px-4",
            className
          )}
          style={{
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
          }}
          ref={ref}
          {...props}
        />
        
        {/* Subtle glow effect on focus */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-white/5 via-transparent to-white/5 opacity-0 transition-opacity duration-300 pointer-events-none focus-within:opacity-100"></div>
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
