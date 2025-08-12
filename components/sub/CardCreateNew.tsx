"use client";

import * as SubframeCore from "@subframe/core";
import React from "react";

interface CardCreateNewRootProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: SubframeCore.IconName;
  text?: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

const CardCreateNewRoot = React.forwardRef<HTMLElement, CardCreateNewRootProps>(
  function CardCreateNewRoot(
    {
      icon = "FeatherPlus",
      text,
      className,
      onClick,
      ...otherProps
    }: CardCreateNewRootProps,
    ref
  ) {
    return (
      <div
        className={SubframeCore.twClassNames(
          "group/86a8b33f flex h-full max-h-[576px] min-h-[385px] w-full cursor-pointer flex-col items-center justify-center gap-1 rounded-lg bg-[#404040ff] hover:bg-[#404040ff]",
          className
        )}
        ref={ref as any}
        {...otherProps}
        onClick={onClick}
      >
        <SubframeCore.Icon
          className="font-poppins text-[50px] font-[700] leading-[36px] text-default-font"
          name={icon}
        />
        {text ? (
          <span className="text-heading-3 font-heading-3 text-default-font">
            {text}
          </span>
        ) : null}
      </div>
    );
  }
);

export const CardCreateNew = CardCreateNewRoot;
