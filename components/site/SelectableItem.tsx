import React from "react";
import { Badge } from "../sub/Badge";
import { IconButton } from "../sub/iconButton";

interface SelectableItemProps {
  title: string;
  price: string;
  description: string;
  min: number;
  max: number;
  count: number;
  disabled?: boolean;
  selected?: boolean;
  onSelect?: (selected: boolean) => void;
  onCountChange: (newCount: number) => void;
}

const SelectableItem: React.FC<SelectableItemProps> = ({
  title,
  price,
  description,
  min = 0,
  max = 0,
  count = 0,
  onCountChange,
  disabled = false,
  selected = false,
  onSelect,
}) => {
  const handleIncrease = () => {
    if (count < max) {
      onCountChange(count + 1);
    }
  };

  const handleDecrease = () => {
    if (count > min) {
      onCountChange(count - 1);
    }
  };

  const handleClick = () => {
    if (!disabled && onSelect) {
      onSelect(!selected);
    }
  };

  return (
    <div
      className={`relative w-full mb-6 transition-all duration-500 cursor-pointer group ${
        disabled 
          ? "opacity-50 pointer-events-none" 
          : ""
      }`}
      onClick={handleClick}
    >
      {/* Ticket-style card */}
      <div 
        className={`relative w-full h-32 rounded-xl border transition-all duration-500 overflow-hidden ${
          selected 
            ? "border-white bg-white/15 shadow-2xl scale-[1.02]" 
            : "border-white/30 bg-white/5 hover:bg-white/10 hover:border-white/50 hover:scale-[1.01]"
        }`}
        style={{
          backdropFilter: 'blur(16px)',
          boxShadow: selected 
            ? '0 25px 80px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1) inset'
            : '0 8px 32px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.05) inset'
        }}
      >
        {/* Ticket perforations on left edge */}
        <div className="absolute left-0 top-0 bottom-0 w-4 flex flex-col justify-evenly items-center">
          {[...Array(6)].map((_, i) => (
            <div 
              key={i} 
              className="w-1.5 h-1.5 rounded-full border border-white/20"
              style={{
                background: selected ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.1)'
              }}
            ></div>
          ))}
        </div>

        {/* Stub separator line */}
        <div 
          className={`absolute right-20 top-4 bottom-4 w-px border-l-2 border-dashed transition-all duration-500 ${
            selected ? 'border-white/40' : 'border-white/20'
          }`}
        ></div>

        {/* Animated gradient overlay */}
        <div 
          className="absolute inset-0 opacity-20 transition-opacity duration-500"
          style={{
            background: selected 
              ? 'linear-gradient(45deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05), rgba(255,255,255,0.1))' 
              : 'linear-gradient(45deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01), rgba(255,255,255,0.03))',
            backgroundSize: '400% 400%',
            animation: selected ? 'shimmer 3s ease-in-out infinite' : 'none'
          }}
        ></div>

        {/* Top accent line */}
        <div 
          className={`absolute top-0 left-4 right-4 h-0.5 rounded-full transition-all duration-500 ${
            selected ? 'bg-gradient-to-r from-transparent via-white to-transparent' : 'bg-white/20'
          }`}
        ></div>
        
        <div className="relative z-10 h-full flex items-center">
          {/* Left padding for perforations */}
          <div className="w-6"></div>
          
          {/* Content area */}
          <div className="flex-1 flex flex-col justify-center gap-2 px-4">
            <h3 className="text-xl font-bold text-white group-hover:text-white/90 transition-colors leading-tight">
              {title}
            </h3>
            {description && (
              <p className="text-sm text-white/60 group-hover:text-white/50 transition-colors line-clamp-2">
                {description}
              </p>
            )}
          </div>
          
          {/* Price tag */}
          <div className={`px-3 py-2 rounded-lg font-bold text-lg transition-all duration-300 ${
            selected 
              ? 'bg-white text-black shadow-lg scale-105' 
              : 'bg-white/20 text-white border border-white/30 group-hover:bg-white/30'
          }`}>
            {price}
          </div>
          
          {/* Stub section with controls */}
          <div className="w-20 flex items-center justify-center">
            {selected ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 bg-white/10 rounded-lg p-1">
                  <IconButton
                    disabled={count === min || disabled}
                    variant="neutral-tertiary"
                    size="small"
                    icon="FeatherMinus"
                    loading={false}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDecrease();
                    }}
                  />
                  <span className="text-white font-bold min-w-[24px] text-center">
                    {count}
                  </span>
                  <IconButton
                    disabled={disabled || (max !== undefined && count >= max)}
                    variant="neutral-tertiary"
                    size="small"
                    icon="FeatherPlus"
                    loading={false}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleIncrease();
                    }}
                  />
                </div>
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-lg">
                  <svg width="14" height="11" viewBox="0 0 12 9" fill="none">
                    <path d="M1 4L4.5 7.5L11 1" stroke="black" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
            ) : (
              <div className="w-8 h-8 rounded-full border-3 border-white/40 group-hover:border-white group-hover:bg-white/10 transition-all duration-300"></div>
            )}
          </div>
        </div>
        
        {/* Bottom glow effect */}
        {selected && (
          <div className="absolute bottom-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent"></div>
        )}
      </div>
      
      {/* CSS for animations */}
      <style jsx>{`
        @keyframes shimmer {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </div>
  );
};

export default SelectableItem;
