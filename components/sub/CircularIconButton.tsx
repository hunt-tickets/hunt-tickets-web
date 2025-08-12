"use client";

import * as SubframeCore from "@subframe/core";
import React from "react";

interface CircularIconButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "brand-primary"
    | "brand-secondary"
    | "brand-tertiary"
    | "neutral-primary"
    | "neutral-secondary"
    | "neutral-tertiary"
    | "destructive-primary"
    | "destructive-secondary"
    | "destructive-tertiary"
    | "inverse";
  size?: "large" | "medium" | "small";
  icon?: SubframeCore.IconName;
  loading?: boolean;
  className?: string;
}

const CircularIconButton = React.forwardRef<
  HTMLButtonElement,
  CircularIconButtonProps
>(function CircularIconButton(
  {
    variant = "neutral-tertiary",
    size = "medium",
    icon = "FeatherPlus",
    loading = false,
    className,
    type = "button",
    ...otherProps
  }: CircularIconButtonProps,
  ref
) {
  return (
    <button
      className={SubframeCore.twClassNames(
        "flex h-8 w-8 items-center justify-center gap-2 rounded-full border border-solid border-neutral-border bg-default-background transition-colors",
        "hover:bg-neutral-100 active:bg-neutral-50 disabled:cursor-default disabled:bg-neutral-100",
        "hover:disabled:cursor-default hover:disabled:bg-neutral-100 active:disabled:cursor-default active:disabled:bg-neutral-100",
        {
          "h-6 w-6": size === "small",
          "h-10 w-10": size === "large",
          "hover:bg-[#ffffff29] active:bg-[#ffffff3d]": variant === "inverse",
          "hover:bg-error-50 active:bg-error-100":
            variant === "destructive-tertiary",
          "bg-error-50 hover:bg-error-100 active:bg-error-50":
            variant === "destructive-secondary",
          "bg-error-600 hover:bg-error-500 active:bg-error-600":
            variant === "destructive-primary",
          "border border-solid border-neutral-border bg-black hover:bg-neutral-100 active:bg-black":
            variant === "neutral-secondary",
          "bg-neutral-100 hover:bg-neutral-200 active:bg-neutral-100":
            variant === "neutral-primary",
          "hover:bg-brand-50 active:bg-brand-100": variant === "brand-tertiary",
          "bg-brand-50 hover:bg-brand-100 active:bg-brand-50":
            variant === "brand-secondary",
          "bg-brand-600 hover:bg-brand-500 active:bg-brand-600":
            variant === "brand-primary",
        },
        className
      )}
      ref={ref}
      type={type}
      {...otherProps}
    >
      {!loading ? (
        <SubframeCore.Icon
          className={SubframeCore.twClassNames(
            "text-heading-3 font-heading-3 text-neutral-700 group-disabled/af9405b1:text-neutral-400",
            {
              "text-body font-body": size === "small",
              "text-heading-3 font-heading-3": size === "large",
              "text-black group-hover/af9405b1:text-black":
                variant === "inverse",
              "text-error-700 group-hover/af9405b1:text-error-700 group-active/af9405b1:text-error-700":
                variant === "destructive-tertiary" ||
                variant === "destructive-secondary",
              "text-black group-hover/af9405b1:text-black group-active/af9405b1:text-black":
                variant === "destructive-primary" ||
                variant === "brand-primary",
              "text-neutral-700": variant === "neutral-secondary",
              "text-neutral-700 group-hover/af9405b1:text-neutral-700 group-active/af9405b1:text-neutral-700":
                variant === "neutral-primary",
              "text-brand-700 group-hover/af9405b1:text-brand-700 group-active/af9405b1:text-brand-700":
                variant === "brand-tertiary" || variant === "brand-secondary",
            }
          )}
          name={icon}
        />
      ) : (
        <SubframeCore.Loader className="inline-block text-neutral-700" />
      )}
    </button>
  );
});

export default CircularIconButton;
