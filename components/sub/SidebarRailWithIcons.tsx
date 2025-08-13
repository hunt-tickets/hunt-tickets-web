"use client";

import * as SubframeCore from "@subframe/core";
import React from "react";
import { Tooltip } from "./tooltip";

interface NavItemProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: SubframeCore.IconName;
  children?: React.ReactNode;
  selected?: boolean;
  className?: string;
}

const NavItem = React.forwardRef<HTMLElement, NavItemProps>(function NavItem(
  {
    icon = "FeatherCircleDashed",
    children,
    selected = false,
    className,
    ...otherProps
  }: NavItemProps,
  ref
) {
  return (
    <SubframeCore.Tooltip.Provider>
      <SubframeCore.Tooltip.Root>
        <SubframeCore.Tooltip.Trigger asChild={true}>
          <div
            className={SubframeCore.twClassNames(
              "group/ba3a61e5 flex cursor-pointer items-center gap-2 rounded-lg px-2 py-2 hover:bg-white/10 active:bg-white/20 transition-all duration-200",
              {
                "bg-white/20 hover:bg-white/30 border border-white/20":
                  selected,
              },
              className
            )}
            ref={ref as any}
            {...otherProps}
          >
            <SubframeCore.Icon
              className={SubframeCore.twClassNames(
                "text-white/80 h-5 w-5 transition-colors duration-200",
                { "text-white": selected }
              )}
              name={icon}
            />
          </div>
        </SubframeCore.Tooltip.Trigger>
        <SubframeCore.Tooltip.Portal>
          <SubframeCore.Tooltip.Content
            side="right"
            align="center"
            sideOffset={4}
            asChild={true}
          >
            <Tooltip
              className={SubframeCore.twClassNames(
                "bg-black/80 backdrop-blur-xl text-white border border-white/20",
                {
                  "group-active/ba3a61e5:bg-black/80 group-active/ba3a61e5:text-white group-active/ba3a61e5:border group-active/ba3a61e5:border-white/20":
                    selected,
                }
              )}
            >
              {children}
            </Tooltip>
          </SubframeCore.Tooltip.Content>
        </SubframeCore.Tooltip.Portal>
      </SubframeCore.Tooltip.Root>
    </SubframeCore.Tooltip.Provider>
  );
});

interface SidebarRailWithIconsRootProps
  extends React.HTMLAttributes<HTMLElement> {
  header?: React.ReactNode;
  footer?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}

const SidebarRailWithIconsRoot = React.forwardRef<
  HTMLElement,
  SidebarRailWithIconsRootProps
>(function SidebarRailWithIconsRoot(
  {
    header,
    footer,
    children,
    className,
    ...otherProps
  }: SidebarRailWithIconsRootProps,
  ref
) {
  return (
    <nav
      className={SubframeCore.twClassNames(
        "group/0d7efe0e flex h-full flex-col items-start border-r border-white/10 bg-black/20 backdrop-blur-xl",
        className
      )}
      ref={ref as any}
      style={{
        backdropFilter: 'blur(20px)',
      }}
      {...otherProps}
    >
      {header ? (
        <div className="flex w-full flex-col items-center justify-center gap-2 px-3 py-3">
          {header}
        </div>
      ) : null}
      {children ? (
        <div className="flex w-full grow shrink-0 basis-0 flex-col items-center gap-1 px-3 py-3 overflow-auto">
          {children}
        </div>
      ) : null}
      {footer ? (
        <div className="flex w-full flex-col items-center justify-end gap-1 border-t border-solid border-white/10 px-3 py-3">
          {footer}
        </div>
      ) : null}
    </nav>
  );
});

export const SidebarRailWithIcons = Object.assign(SidebarRailWithIconsRoot, {
  NavItem,
});
