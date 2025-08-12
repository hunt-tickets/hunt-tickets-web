"use client";

import * as SubframeCore from "@subframe/core";
import React from "react";

interface TooltipRootProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  className?: string;
}

const TooltipRoot = React.forwardRef<HTMLElement, TooltipRootProps>(
  function TooltipRoot(
    { children, className, ...otherProps }: TooltipRootProps,
    ref
  ) {
    return (
      <div
        className={SubframeCore.twClassNames(
          "flex flex-col items-start gap-2 rounded-md border border-solid border-neutral-900 bg-neutral-800 px-2 py-1 shadow-lg",
          className
        )}
        ref={ref as any}
        {...otherProps}
      >
        {children ? (
          <span className="text-caption font-caption text-black">
            {children}
          </span>
        ) : null}
      </div>
    );
  }
);

export const Tooltip = TooltipRoot;
