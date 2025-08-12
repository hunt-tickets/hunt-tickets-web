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
              "group/ba3a61e5 flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 hover:bg-neutral-50 active:bg-neutral-100",
              {
                "bg-brand-50 hover:bg-brand-50 active:border active:border-solid active:border-neutral-border active:bg-default-background":
                  selected,
              },
              className
            )}
            ref={ref as any}
            {...otherProps}
          >
            <SubframeCore.Icon
              className={SubframeCore.twClassNames(
                "text-heading-3 font-heading-3 text-neutral-600",
                { "text-brand-700": selected }
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
                "bg-black text-white border border-gray-500",
                {
                  "group-active/ba3a61e5:bg-black group-active/ba3a61e5:text-white group-active/ba3a61e5:border group-active/ba3a61e5:border-gray-500":
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
        "group/0d7efe0e flex h-full flex-col items-start border-r border-neutral-border border-none bg-[#0f0f0fff]",
        className
      )}
      ref={ref as any}
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
        <div className="flex w-full flex-col items-center justify-end gap-1 border-t border-solid border-neutral-border px-3 py-3">
          {footer}
        </div>
      ) : null}
    </nav>
  );
});

export const SidebarRailWithIcons = Object.assign(SidebarRailWithIconsRoot, {
  NavItem,
});
