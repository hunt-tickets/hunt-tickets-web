"use client";

import React from "react";
import { Drawer } from "../sub/drawer";

interface DrawerLayoutRootProps extends React.ComponentProps<typeof Drawer> {
  children?: React.ReactNode;
  className?: string;
}

const DrawerLayoutRoot = React.forwardRef<HTMLElement, DrawerLayoutRootProps>(
  function DrawerLayoutRoot(
    { children, className, ...otherProps }: DrawerLayoutRootProps,
    ref
  ) {
    return (
      <Drawer className={className} ref={ref as any} {...otherProps}>
        <Drawer.Content>
          {children ? (
            <div className="flex w-full grow shrink-0 basis-0 flex-col items-start gap-8 overflow-y-scroll">
              {children}
            </div>
          ) : null}
        </Drawer.Content>
      </Drawer>
    );
  }
);

export const DrawerLayout = DrawerLayoutRoot;
