"use client";

import React from "react";
import * as SubframeCore from "@subframe/core";

interface OAuthSocialButtonRootProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
  logo?: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
}

const OAuthSocialButtonRoot = React.forwardRef<
  HTMLElement,
  OAuthSocialButtonRootProps
>(function OAuthSocialButtonRoot(
  {
    children,
    logo,
    className,
    type = "button",
    ...otherProps
  }: OAuthSocialButtonRootProps,
  ref
) {
  return (
    <button
      className={SubframeCore.twClassNames(
        "group/f1948f75 flex h-[60px] cursor-pointer items-center justify-center gap-2 rounded-md border border-solid border-neutral-border bg-black px-4 hover:bg-neutral-50 active:bg-black disabled:cursor-default disabled:bg-black hover:disabled:cursor-default hover:disabled:bg-black active:disabled:cursor-default active:disabled:bg-black",
        className
      )}
      ref={ref as any}
      type={type}
      {...otherProps}
    >
      {logo ? (
        <img className="h-[140px] w-full flex-none object-cover" src={logo} />
      ) : null}
      {children ? (
        <span className="text-body-bold font-body-bold text-neutral-700 group-disabled/f1948f75:text-neutral-400">
          {children}
        </span>
      ) : null}
    </button>
  );
});

export const OAuthSocialButton = OAuthSocialButtonRoot;