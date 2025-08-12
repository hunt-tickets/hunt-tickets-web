"use client";

import * as SubframeCore from "@subframe/core";
import React from "react";

interface LargeBadgeRootProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: SubframeCore.IconName;
  children?: React.ReactNode;
  className?: string;
}

const LargeBadgeRoot = React.forwardRef<HTMLElement, LargeBadgeRootProps>(
  function LargeBadgeRoot(
    {
      icon = "FeatherPlus",
      children,
      className,
      ...otherProps
    }: LargeBadgeRootProps,
    ref
  ) {
    return (
      <div
        className={SubframeCore.twClassNames(
          "group/f003eb3b flex cursor-pointer items-center gap-2 overflow-hidden rounded-full border border-solid border-neutral-border px-3 py-2 hover:bg-neutral-50 active:bg-[#262626ff]",
          className
        )}
        ref={ref as any}
        {...otherProps}
      >
        <SubframeCore.Icon
          className="text-heading-3 font-heading-3 text-brand-700"
          name={icon}
        />
        {children ? (
          <span className="text-caption-bold font-caption-bold text-default-font">
            {children}
          </span>
        ) : null}
      </div>
    );
  }
);

export const LargeBadge = LargeBadgeRoot;
