"use client";

import * as SubframeCore from "@subframe/core";
import React from "react";

interface ContentProps
  extends React.ComponentProps<typeof SubframeCore.Drawer.Content> {
  children?: React.ReactNode;
  className?: string;
}

const Content = React.forwardRef<HTMLElement, ContentProps>(function Content(
  { children, className, ...otherProps }: ContentProps,
  ref
) {
  return children ? (
    <SubframeCore.Drawer.Content asChild={true} {...otherProps}>
      <div
        className={SubframeCore.twClassNames(
          "flex h-full max-w-[450px] sm:max-w-[600px] flex-col items-start gap-2 border-l border-solid border-neutral-border bg-default-background",
          className
        )}
        ref={ref as any}
      >
        {children}
      </div>
    </SubframeCore.Drawer.Content>
  ) : null;
});

interface DrawerRootProps
  extends React.ComponentProps<typeof SubframeCore.Drawer.Root> {
  children?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
}

const DrawerRoot = React.forwardRef<HTMLElement, DrawerRootProps>(
  function DrawerRoot(
    { children, className, ...otherProps }: DrawerRootProps,
    ref
  ) {
    return children ? (
      <SubframeCore.Drawer.Root asChild={true} {...otherProps}>
        <div
          className={SubframeCore.twClassNames(
            "flex h-full w-full flex-col items-end justify-center gap-2 bg-[#00000066]",
            className
          )}
          ref={ref as any}
        >
          {children}
        </div>
      </SubframeCore.Drawer.Root>
    ) : null;
  }
);

export const Drawer = Object.assign(DrawerRoot, {
  Content,
});
