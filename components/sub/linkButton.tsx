"use client";

import * as SubframeCore from "@subframe/core";
import React from "react";

interface LinkButtonRootProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "brand" | "neutral" | "inverse";
  size?: "large" | "medium" | "small";
  icon?: SubframeCore.IconName;
  children?: React.ReactNode;
  iconRight?: SubframeCore.IconName;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
}

const LinkButtonRoot = React.forwardRef<HTMLElement, LinkButtonRootProps>(
  function LinkButtonRoot(
    {
      variant = "neutral",
      size = "medium",
      icon = null,
      children,
      iconRight = null,
      className,
      type = "button",
      ...otherProps
    }: LinkButtonRootProps,
    ref
  ) {
    return (
      <button
        className={SubframeCore.twClassNames(
          "group/a4ee726a flex cursor-pointer items-center gap-1 border-none bg-transparent",
          { "flex-row flex-nowrap gap-1": size === "large" },
          className
        )}
        ref={ref as any}
        type={type}
        {...otherProps}
      >
        <SubframeCore.Icon
          className={SubframeCore.twClassNames(
            "text-body font-body text-neutral-700 group-hover/a4ee726a:text-brand-700 group-disabled/a4ee726a:text-neutral-400 group-hover/a4ee726a:group-disabled/a4ee726a:text-neutral-400",
            {
              "text-caption font-caption": size === "small",
              "text-heading-3 font-heading-3": size === "large",
              "text-black group-hover/a4ee726a:text-black":
                variant === "inverse",
              "text-brand-700 group-hover/a4ee726a:text-brand-700":
                variant === "brand",
            }
          )}
          name={icon}
        />
        {children ? (
          <span
            className={SubframeCore.twClassNames(
              "text-body font-body text-neutral-700 group-hover/a4ee726a:text-brand-700 group-hover/a4ee726a:underline group-disabled/a4ee726a:text-neutral-400 group-hover/a4ee726a:group-disabled/a4ee726a:text-neutral-400 group-hover/a4ee726a:group-disabled/a4ee726a:no-underline",
              {
                "text-caption font-caption": size === "small",
                "text-heading-3 font-heading-3": size === "large",
                "text-black group-hover/a4ee726a:text-black":
                  variant === "inverse",
                "text-brand-700 group-hover/a4ee726a:text-brand-700":
                  variant === "brand",
              }
            )}
          >
            {children}
          </span>
        ) : null}
        <SubframeCore.Icon
          className={SubframeCore.twClassNames(
            "text-body font-body text-neutral-700 group-hover/a4ee726a:text-brand-700 group-disabled/a4ee726a:text-neutral-400 group-hover/a4ee726a:group-disabled/a4ee726a:text-neutral-400",
            {
              "text-caption font-caption": size === "small",
              "text-heading-3 font-heading-3": size === "large",
              "text-black group-hover/a4ee726a:text-black":
                variant === "inverse",
              "text-brand-700 group-hover/a4ee726a:text-brand-700":
                variant === "brand",
            }
          )}
          name={iconRight}
        />
      </button>
    );
  }
);

export const LinkButton = LinkButtonRoot;
