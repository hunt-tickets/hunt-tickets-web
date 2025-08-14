"use client";

import { cn } from "@/lib/utils";
import { Sparkles } from "lucide-react";
import { useCardHover } from "@/hooks/useCardHover";

interface DisplayCardProps {
  className?: string;
  icon?: React.ReactNode;
  title?: string;
  description?: string;
  date?: string;
  iconClassName?: string;
  titleClassName?: string;
}

function DisplayCard({
  className,
  icon = <Sparkles className="size-4 text-blue-300" />,
  title = "Featured",
  description = "Discover amazing content",
  date = "Just now",
  iconClassName = "text-blue-500",
  titleClassName = "text-blue-500",
}: DisplayCardProps) {
  const { setHoveredCard } = useCardHover();

  return (
    <div
      className={cn(
        "relative flex h-48 w-full -skew-y-[8deg] select-none flex-col justify-between rounded-xl border-2 bg-white/10 backdrop-blur-xl border-white/20 px-6 py-5 transition-all duration-700 after:absolute after:-right-1 after:top-[-5%] after:h-[110%] after:w-full after:bg-gradient-to-l after:from-black after:to-transparent after:content-[''] hover:border-white/30 hover:bg-white/15 [&>*]:flex [&>*]:items-center [&>*]:gap-2",
        className
      )}
      onMouseEnter={() => setHoveredCard(title)}
      onMouseLeave={() => setHoveredCard(null)}
    >
      <div>
        <span className="relative inline-block rounded-full bg-white/10 backdrop-blur-xl border border-white/20 p-3">
          <div className="w-6 h-6">{icon}</div>
        </span>
        <p className={cn("text-xl font-medium text-white", titleClassName)}>{title}</p>
      </div>
      <p className="whitespace-nowrap text-xl text-gray-200">{description}</p>
      <p className="text-lg text-gray-400">{date}</p>
    </div>
  );
}

interface DisplayCardsProps {
  cards?: DisplayCardProps[];
}

export default function DisplayCards({ cards }: DisplayCardsProps) {
  const defaultCards = [
    {
      className: "[grid-area:stack] hover:-translate-y-10 before:absolute before:w-[100%] before:outline-1 before:rounded-xl before:outline-border before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-black/50 grayscale-[100%] hover:before:opacity-0 before:transition-opacity before:duration:700 hover:grayscale-0 before:left-0 before:top-0",
    },
    {
      className: "[grid-area:stack] translate-x-16 translate-y-10 hover:-translate-y-1 before:absolute before:w-[100%] before:outline-1 before:rounded-xl before:outline-border before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-black/50 grayscale-[100%] hover:before:opacity-0 before:transition-opacity before:duration:700 hover:grayscale-0 before:left-0 before:top-0",
    },
    {
      className: "[grid-area:stack] translate-x-32 translate-y-20 hover:translate-y-10",
    },
  ];

  const displayCards = cards || defaultCards;

  return (
    <div className="grid [grid-template-areas:'stack'] place-items-center opacity-100 animate-in fade-in-0 duration-700">
      {displayCards.map((cardProps, index) => (
        <DisplayCard key={index} {...cardProps} />
      ))}
    </div>
  );
}