"use client";

import * as SubframeUtils from "@/lib/utils";
import * as SubframeCore from "@subframe/core";
import React from "react";
import { Accordion } from "./Accordion";
import { IconButton } from "./iconButton";

interface FolderProps extends React.ComponentProps<typeof Accordion> {
  children?: React.ReactNode;
  label?: React.ReactNode;
  icon?: SubframeCore.IconName;
  className?: string;
}

const Folder = React.forwardRef<HTMLDivElement, FolderProps>(function Folder(
  { children, label, icon = null, className, ...otherProps }: FolderProps,
  ref
) {
  return (
    <Accordion
      className={SubframeUtils.cn("group/05c886b1 cursor-pointer", className)}
      trigger={
        <div className="flex w-full items-center gap-2 rounded-md pl-3 pr-4 pt-6 pb-2 group-hover/05c886b1:bg-neutral-50">
          <SubframeCore.Icon
            className="text-body font-body text-default-font"
            name={icon}
          />
          {label ? (
            <span className="line-clamp-1 grow shrink-0 basis-0 text-body-bold font-body-bold text-subtext-color">
              {label}
            </span>
          ) : null}
          <IconButton size="small" />
          <Accordion.Chevron />
        </div>
      }
      defaultOpen={true}
      ref={ref}
      {...otherProps}
    >
      {children ? (
        <div className="flex w-full flex-col items-start gap-1 pt-1">
          {children}
        </div>
      ) : null}
    </Accordion>
  );
});

interface ItemProps extends React.HTMLAttributes<HTMLDivElement> {
  selected?: boolean;
  children?: React.ReactNode;
  icon?: SubframeCore.IconName;
  rightSlot?: React.ReactNode;
  className?: string;
}

const Item = React.forwardRef<HTMLDivElement, ItemProps>(function Item(
  {
    selected = false,
    children,
    icon = "FeatherFile",
    rightSlot,
    className,
    ...otherProps
  }: ItemProps,
  ref
) {
  return (
    <div
      className={SubframeUtils.cn(
        "group/eb5db798 flex w-full cursor-pointer items-center gap-2 rounded-md px-3 py-2 hover:bg-black",
        { "bg-neutral-100 hover:bg-neutral-100": selected },
        className
      )}
      ref={ref}
      {...otherProps}
    >
      <div className="flex items-center gap-2 rounded-md border border-solid border-neutral-border bg-default-background px-1 py-1">
        <SubframeCore.Icon
          className={SubframeUtils.cn(
            "text-body font-body text-subtext-color",
            { "text-default-font": selected }
          )}
          name={icon}
        />
      </div>
      {children ? (
        <span
          className={SubframeUtils.cn(
            "line-clamp-1 grow shrink-0 basis-0 text-body font-body text-subtext-color",
            { "text-body-bold font-body-bold text-default-font": selected }
          )}
        >
          {children}
        </span>
      ) : null}
      {rightSlot ? (
        <div className="flex flex-col items-start gap-2">{rightSlot}</div>
      ) : null}
    </div>
  );
});

interface ChatChannelsMenuRootProps
  extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  className?: string;
}

const ChatChannelsMenuRoot = React.forwardRef<
  HTMLDivElement,
  ChatChannelsMenuRootProps
>(function ChatChannelsMenuRoot(
  { children, className, ...otherProps }: ChatChannelsMenuRootProps,
  ref
) {
  return children ? (
    <div
      className={SubframeUtils.cn(
        "flex w-full flex-col items-start",
        className
      )}
      ref={ref}
      {...otherProps}
    >
      {children}
    </div>
  ) : null;
});

export const ChatChannelsMenu = Object.assign(ChatChannelsMenuRoot, {
  Folder,
  Item,
});
