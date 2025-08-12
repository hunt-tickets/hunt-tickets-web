"use client";

import * as SubframeCore from "@subframe/core";
import React from "react";

interface BadgeRootProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "brand" | "neutral" | "error" | "warning" | "success";
  icon?: SubframeCore.IconName;
  children?: React.ReactNode;
  iconRight?: SubframeCore.IconName;
  className?: string;
}

const BadgeRoot = React.forwardRef<HTMLElement, BadgeRootProps>(
  function BadgeRoot(
    {
      variant = "brand",
      icon = null,
      children,
      iconRight = null,
      className,
      ...otherProps
    }: BadgeRootProps,
    ref
  ) {
    return (
      <div
        className={SubframeCore.twClassNames(
          "group/97bdb082 flex h-6 items-center gap-1 rounded-md border border-solid border-brand-100 bg-brand-100 px-2",
          {
            "border border-solid border-success-100 bg-success-100":
              variant === "success",
            "border border-solid border-warning-100 bg-[#352800ff]":
              variant === "warning",
            "border border-solid border-[#470606ff] bg-[#470606ff]":
              variant === "error",
            "border border-solid border-neutral-100 bg-neutral-100":
              variant === "neutral",
          },
          className
        )}
        ref={ref as any}
        {...otherProps}
      >
        <SubframeCore.Icon
          className={SubframeCore.twClassNames(
            "text-caption font-caption text-brand-700",
            {
              "text-success-800": variant === "success",
              "text-warning-800": variant === "warning",
              "text-[#ffe0e0ff]": variant === "error",
              "text-neutral-700": variant === "neutral",
            }
          )}
          name={icon}
        />
        {children ? (
          <span
            className={SubframeCore.twClassNames(
              "whitespace-nowrap text-caption font-caption text-brand-800",
              {
                "text-success-800": variant === "success",
                "text-warning-800": variant === "warning",
                "text-[#ffe0e0ff]": variant === "error",
                "text-neutral-700": variant === "neutral",
              }
            )}
          >
            {children}
          </span>
        ) : null}
        <SubframeCore.Icon
          className={SubframeCore.twClassNames(
            "text-caption font-caption text-brand-700",
            {
              "text-success-800": variant === "success",
              "text-warning-800": variant === "warning",
              "text-error-700": variant === "error",
              "text-neutral-700": variant === "neutral",
            }
          )}
          name={iconRight}
        />
      </div>
    );
  }
);

export const Badge = BadgeRoot;
