import * as SubframeCore from "@subframe/core";
import React from "react";

interface InfoItem {
  icon: SubframeCore.IconName;
  label: string;
  value: string;
}

interface InfoDisplayProps {
  items: InfoItem[];
  className?: string;
}

const InfoDisplay: React.FC<InfoDisplayProps> = ({ items, className }) => {
  return (
    <div
      className={`flex flex-col md:flex-row w-full items-center gap-6 rounded-lg bg-[#171717ff] px-6 py-6 shadow-sm ${className}`}
    >
      {items.map((item, index) => (
        <React.Fragment key={index}>
          <div className="flex grow shrink-0 basis-0 items-center justify-center gap-2">
            <div className="flex flex-col items-center justify-center gap-2">
              <div className="flex items-center gap-1">
                <SubframeCore.Icon
                  className="text-caption-bold font-caption-bold text-subtext-color"
                  name={item.icon}
                />
                <span className="text-caption font-caption text-subtext-color">
                  {item.label}
                </span>
              </div>
              <span className="text-body-bold font-body-bold text-default-font">
                {item.value}
              </span>
            </div>
          </div>
          {index < items.length - 1 && (
            <div className="flex h-px md:h-8 w-8 md:w-px flex-none flex-col items-center gap-2 bg-neutral-300" />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default InfoDisplay;
