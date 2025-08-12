"use client";

import * as SubframeCore from "@subframe/core";
import React from "react";

interface ItemProps extends React.HTMLAttributes<HTMLSpanElement> {
  children?: React.ReactNode;
  active?: boolean;
  className?: string;
}

const Item = React.forwardRef<HTMLElement, ItemProps>(function Item(
  { children, active = false, className, ...otherProps }: ItemProps,
  ref
) {
  return children ? (
    <span
      className={SubframeCore.twClassNames(
        "group/bbdc1640 line-clamp-1 cursor-pointer break-words text-body font-body text-subtext-color hover:text-default-font",
        { "text-default-font": active },
        className
      )}
      ref={ref as any}
      {...otherProps}
    >
      {children}
    </span>
  ) : null;
});

interface DividerProps
  extends SubframeCore.TypescriptHelpers.Optional<
    React.ComponentProps<typeof SubframeCore.Icon>,
    "name"
  > {
  className?: string;
}

const Divider = React.forwardRef<HTMLElement, DividerProps>(function Divider(
  { className, ...otherProps }: DividerProps,
  ref
) {
  return (
    <SubframeCore.Icon
      className={SubframeCore.twClassNames(
        "text-body font-body text-subtext-color",
        className
      )}
      name="FeatherChevronRight"
      ref={ref as any}
      {...otherProps}
    />
  );
});

interface BreadcrumbsRootProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  className?: string;
}

const BreadcrumbsRoot = React.forwardRef<HTMLElement, BreadcrumbsRootProps>(
  function BreadcrumbsRoot(
    { children, className, ...otherProps }: BreadcrumbsRootProps,
    ref
  ) {
    return children ? (
      <div
        className={SubframeCore.twClassNames(
          "flex items-center gap-2",
          className
        )}
        ref={ref as any}
        {...otherProps}
      >
        {children}
      </div>
    ) : null;
  }
);

export const Breadcrumbs = Object.assign(BreadcrumbsRoot, {
  Item,
  Divider,
});
