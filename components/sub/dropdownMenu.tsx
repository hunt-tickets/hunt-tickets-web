"use client";

import React from "react";
import * as SubframeCore from "@subframe/core";

interface DropdownItemProps
  extends React.ComponentProps<typeof SubframeCore.DropdownMenu.Item> {
  children?: React.ReactNode;
  icon?: SubframeCore.IconName;
  className?: string;
}

const DropdownItem = React.forwardRef<HTMLElement, DropdownItemProps>(
  function DropdownItem(
    {
      children,
      icon = "FeatherStar",
      className,
      ...otherProps
    }: DropdownItemProps,
    ref
  ) {
    return (
      <SubframeCore.DropdownMenu.Item asChild={true} {...otherProps}>
        <div
          className={SubframeCore.twClassNames(
            "group/adcae8d6 flex h-8 w-full cursor-pointer items-center gap-2 rounded-md px-3 hover:bg-white/10 active:bg-white/20 data-[highlighted]:bg-white/10 transition-all duration-200",
            className
          )}
          ref={ref as any}
        >
          <SubframeCore.Icon
            className="text-white/80 h-4 w-4"
            name={icon}
          />
          {children ? (
            <span className="line-clamp-1 grow shrink-0 basis-0 text-white/80 text-sm group-hover/adcae8d6:text-white">
              {children}
            </span>
          ) : null}
        </div>
      </SubframeCore.DropdownMenu.Item>
    );
  }
);

interface DropdownDividerProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

const DropdownDivider = React.forwardRef<HTMLElement, DropdownDividerProps>(
  function DropdownDivider(
    { className, ...otherProps }: DropdownDividerProps,
    ref
  ) {
    return (
      <div
        className={SubframeCore.twClassNames(
          "flex w-full items-start gap-2 px-1 py-1",
          className
        )}
        ref={ref as any}
        {...otherProps}
      >
        <div className="flex h-px grow shrink-0 basis-0 flex-col items-center gap-2 bg-white/20" />
      </div>
    );
  }
);

interface DropdownMenuRootProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  className?: string;
}

const DropdownMenuRoot = React.forwardRef<HTMLElement, DropdownMenuRootProps>(
  function DropdownMenuRoot(
    { children, className, ...otherProps }: DropdownMenuRootProps,
    ref
  ) {
    return children ? (
      <div
        className={SubframeCore.twClassNames(
          "flex min-w-[192px] flex-col items-start rounded-lg border border-solid border-white/20 bg-black/80 backdrop-blur-xl px-1 py-1 shadow-lg",
          className
        )}
        ref={ref as any}
        style={{
          backdropFilter: 'blur(20px)',
        }}
        {...otherProps}
      >
        {children}
      </div>
    ) : null;
  }
);

export const DropdownMenu = Object.assign(DropdownMenuRoot, {
  DropdownItem,
  DropdownDivider,
});