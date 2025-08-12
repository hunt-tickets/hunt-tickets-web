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
      className={`relative w-full mb-4 transition-all duration-300 cursor-pointer group ${
        disabled 
          ? "opacity-50 pointer-events-none" 
          : ""
      }`}
      onClick={handleClick}
    >
      {/* Card background */}
      <div 
        className={`relative w-full h-full rounded-xl border-2 transition-all duration-300 ${
          selected 
            ? "border-white bg-white/10 shadow-xl" 
            : "border-white/30 bg-white/5 hover:bg-white/8 hover:border-white/50"
        }`}
        style={{
          backdropFilter: 'blur(8px)',
          boxShadow: selected 
            ? '0 10px 40px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1) inset'
            : '0 4px 20px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.05) inset'
        }}
      >
        {/* Top accent line */}
        <div className={`absolute top-0 left-0 right-0 h-1 rounded-t-xl transition-all duration-300 ${
          selected ? 'bg-white' : 'bg-white/30 group-hover:bg-white/50'
        }`}></div>
        
        <div className="relative z-10 p-6">
          <div className="flex w-full items-center justify-between">
            <div className="flex flex-col gap-2">
              <h3 className="text-lg font-semibold text-white group-hover:text-white/90 transition-colors">
                {title}
              </h3>
              {description && (
                <p className="text-sm text-white/70 group-hover:text-white/60 transition-colors">
                  {description}
                </p>
              )}
            </div>
            
            <div className="flex items-center gap-4">
              <div className={`px-4 py-2 rounded-lg font-bold transition-all duration-300 ${
                selected 
                  ? 'bg-white text-black shadow-lg' 
                  : 'bg-white/20 text-white border border-white/30 group-hover:bg-white/30'
              }`}>
                {price}
              </div>
            
            {/* Selection indicator */}
            <div className="flex items-center">
              {selected ? (
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
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
                    <span className="text-white font-medium min-w-[20px] text-center">
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
                  <div className="w-6 h-6 rounded-full bg-white border-2 border-white flex items-center justify-center shadow-lg">
                    <svg width="12" height="9" viewBox="0 0 12 9" fill="none">
                      <path d="M1 4L4.5 7.5L11 1" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>
              ) : (
                <div className="w-6 h-6 rounded-full border-2 border-white/50 group-hover:border-white transition-colors"></div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectableItem;
