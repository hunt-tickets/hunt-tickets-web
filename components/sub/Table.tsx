"use client";

import * as SubframeCore from "@subframe/core";
import React from "react";

interface RowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  children?: React.ReactNode;
  clickable?: boolean;
  className?: string;
}

const Row = React.forwardRef<HTMLElement, RowProps>(function Row(
  { children, clickable = false, className, ...otherProps }: RowProps,
  ref
) {
  return (
    <tr
      className={SubframeCore.twClassNames(
        "group/5d119f8d border-t border-solid border-neutral-border",
        { "hover:bg-neutral-50": clickable },
        className
      )}
      ref={ref as any}
      {...otherProps}
    >
      {children}
    </tr>
  );
});

interface CellProps extends React.TdHTMLAttributes<HTMLTableDataCellElement> {
  children?: React.ReactNode;
  className?: string;
}

const Cell = React.forwardRef<HTMLElement, CellProps>(function Cell(
  { children, className, ...otherProps }: CellProps,
  ref
) {
  return (
    <td {...otherProps}>
      <div
        className={SubframeCore.twClassNames(
          "flex h-12 w-full items-center gap-1 px-3",
          className
        )}
        ref={ref as any}
      >
        {children}
      </div>
    </td>
  );
});

interface HeaderRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  children?: React.ReactNode;
  className?: string;
}

const HeaderRow = React.forwardRef<HTMLElement, HeaderRowProps>(
  function HeaderRow(
    { children, className, ...otherProps }: HeaderRowProps,
    ref
  ) {
    return (
      <tr className={className} ref={ref as any} {...otherProps}>
        {children}
      </tr>
    );
  }
);

interface HeaderCellProps
  extends React.ThHTMLAttributes<HTMLTableHeaderCellElement> {
  children?: React.ReactNode;
  icon?: SubframeCore.IconName;
  className?: string;
}

const HeaderCell = React.forwardRef<HTMLElement, HeaderCellProps>(
  function HeaderCell(
    { children, icon = null, className, ...otherProps }: HeaderCellProps,
    ref
  ) {
    return (
      <th {...otherProps}>
        <div
          className={SubframeCore.twClassNames(
            "flex h-8 w-full items-center gap-1 px-3",
            className
          )}
          ref={ref as any}
        >
          {children ? (
            <span className="whitespace-nowrap text-caption-bold font-caption-bold text-subtext-color">
              {children}
            </span>
          ) : null}
          <SubframeCore.Icon
            className="text-caption font-caption text-subtext-color"
            name={icon}
          />
        </div>
      </th>
    );
  }
);

interface TableRootProps extends React.TableHTMLAttributes<HTMLTableElement> {
  header?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}

const TableRoot = React.forwardRef<HTMLElement, TableRootProps>(
  function TableRoot(
    { header, children, className, ...otherProps }: TableRootProps,
    ref
  ) {
    return (
      <table
        className={SubframeCore.twClassNames("w-full", className)}
        ref={ref as any}
        {...otherProps}
      >
        <thead>{header}</thead>
        <tbody className="border-b border-solid border-neutral-border">
          {children}
        </tbody>
      </table>
    );
  }
);

export const Table = Object.assign(TableRoot, {
  Row,
  Cell,
  HeaderRow,
  HeaderCell,
});
