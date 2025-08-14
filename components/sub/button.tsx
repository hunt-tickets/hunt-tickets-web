"use client";

import * as SubframeCore from "@subframe/core";
import React from "react";

interface ButtonRootProps
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
  children?: React.ReactNode;
  icon?: SubframeCore.IconName;
  iconRight?: SubframeCore.IconName;
  loading?: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
}

const ButtonRoot = React.forwardRef<HTMLElement, ButtonRootProps>(
  function ButtonRoot(
    {
      variant = "brand-primary",
      size = "medium",
      children,
      icon = null,
      iconRight = null,
      loading = false,
      className,
      type = "button",
      ...otherProps
    }: ButtonRootProps,
    ref
  ) {
    return (
      <button
        className={SubframeCore.twClassNames(
          "group/3b777358 flex !h-12 cursor-pointer items-center justify-center gap-2 rounded-xl border border-gray-300 bg-[#d9d9d9] px-3 transition-all duration-300 hover:bg-[#e5e5e5] hover:border-gray-400 hover:shadow-lg hover:brightness-110 active:bg-[#cccccc] active:scale-[0.98] disabled:cursor-default disabled:bg-gray-200 disabled:border-gray-200 disabled:opacity-50 hover:disabled:cursor-default hover:disabled:bg-gray-200 hover:disabled:scale-100 active:disabled:cursor-default active:disabled:bg-gray-200 active:disabled:scale-100",
          {
            "h-12 w-auto flex-row flex-nowrap gap-1 px-3 py-0": size === "small",
            "h-16 w-auto px-6 py-0": size === "large",
            "bg-transparent hover:bg-[#ffffff29] active:bg-[#ffffff3d]":
              variant === "inverse",
            "bg-transparent hover:bg-error-50 active:bg-error-100":
              variant === "destructive-tertiary",
            "bg-error-50 hover:bg-error-100 active:bg-error-50":
              variant === "destructive-secondary",
            "bg-error-600/20 border-error-500/30 hover:bg-error-600/30 active:bg-error-600/25":
              variant === "destructive-primary",
            "bg-transparent hover:bg-neutral-100 active:bg-neutral-200":
              variant === "neutral-tertiary",
            "border border-solid border-white/20 bg-white/5 backdrop-blur-xl hover:bg-white/15 hover:border-white/30 hover:shadow-lg active:bg-white/8":
              variant === "neutral-secondary",
            "bg-neutral-100 hover:bg-neutral-200 active:bg-neutral-100":
              variant === "neutral-primary",
            "bg-transparent hover:bg-brand-50 active:bg-brand-100":
              variant === "brand-tertiary",
            "bg-brand-50 hover:bg-brand-100 active:bg-brand-50":
              variant === "brand-secondary",
          },
          className
        )}
        ref={ref as any}
        type={type}
        {...otherProps}
      >
        <SubframeCore.Icon
          className={SubframeCore.twClassNames(
            "text-body font-body text-black group-disabled/3b777358:text-gray-400",
            {
              hidden: loading,
              "text-body font-body": size === "small",
              "text-heading-3 font-heading-3": size === "large",
              "text-black": variant === "inverse",
              "text-error-700":
                variant === "destructive-tertiary" ||
                variant === "destructive-secondary",
              "text-black":
                variant === "neutral-tertiary" ||
                variant === "neutral-secondary" ||
                variant === "neutral-primary",
              "text-brand-700":
                variant === "brand-tertiary" || variant === "brand-secondary",
            }
          )}
          name={icon}
        />
        <div
          className={SubframeCore.twClassNames(
            "hidden h-4 w-4 flex-none items-center justify-center gap-2",
            { flex: loading, "h-3 w-3 flex-none": size === "small" }
          )}
        >
          <SubframeCore.Loader
            className={SubframeCore.twClassNames(
              "text-caption font-caption text-black group-disabled/3b777358:text-gray-400",
              {
                "inline-block font-['Inter'] text-[12px] font-[400] leading-[20px] tracking-normal":
                  loading,
                "text-caption font-caption": size === "small",
                "text-error-700":
                  variant === "destructive-tertiary" ||
                  variant === "destructive-secondary",
                "text-black":
                  variant === "neutral-tertiary" ||
                  variant === "neutral-secondary" ||
                  variant === "neutral-primary",
                "text-brand-700":
                  variant === "brand-tertiary" || variant === "brand-secondary",
              }
            )}
          />
        </div>
        {children ? (
          <span
            className={SubframeCore.twClassNames(
              "whitespace-nowrap text-body-bold font-body-bold text-black group-disabled/3b777358:text-gray-400",
              {
                hidden: loading,
                "text-caption-bold font-caption-bold": size === "small",
                "text-body-bold font-body-bold": size === "large",
                "text-black": variant === "inverse",
                "text-error-700":
                  variant === "destructive-tertiary" ||
                  variant === "destructive-secondary",
                "text-black":
                  variant === "neutral-tertiary" ||
                  variant === "neutral-secondary" ||
                  variant === "neutral-primary",
                "text-brand-700":
                  variant === "brand-tertiary" || variant === "brand-secondary",
              }
            )}
          >
            {children}
          </span>
        ) : null}
        <SubframeCore.Icon
          className={SubframeCore.twClassNames(
            "text-body font-body text-black group-disabled/3b777358:text-gray-400",
            {
              "text-body font-body": size === "small",
              "text-heading-3 font-heading-3": size === "large",
              "text-black": variant === "inverse",
              "text-error-700":
                variant === "destructive-tertiary" ||
                variant === "destructive-secondary",
              "text-black":
                variant === "neutral-tertiary" ||
                variant === "neutral-secondary" ||
                variant === "neutral-primary",
              "text-brand-700":
                variant === "brand-tertiary" || variant === "brand-secondary",
            }
          )}
          name={iconRight}
        />
      </button>
    );
  }
);

export const Button = ButtonRoot;
