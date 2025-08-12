"use client";

import { cn } from "@/lib/utils";

interface TabNavigationProps {
  tabs: string[];
  activeTab: number;
  onTabChange: (index: number) => void;
}

const TabNavigation = ({ tabs, activeTab, onTabChange }: TabNavigationProps) => {
  return (
    <div className="flex w-full border-b border-neutral-border">
      {tabs.map((tab, index) => (
        <button
          key={index}
          onClick={() => onTabChange(index)}
          className={cn(
            "flex-1 px-4 py-3 text-body font-body transition-all duration-200",
            "hover:text-default-font",
            activeTab === index
              ? "text-default-font border-b-2 border-brand-600"
              : "text-subtext-color"
          )}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};

export default TabNavigation;