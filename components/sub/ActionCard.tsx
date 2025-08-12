"use client";

import * as SubframeCore from "@subframe/core";
import React from "react";
import { IconWithBackground } from "./IconWithBackground";

interface ActionCardRootProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  icon?: SubframeCore.IconName;
  title?: React.ReactNode;
  desc?: React.ReactNode;
  className?: string;
}

const ActionCardRoot = React.forwardRef<HTMLElement, ActionCardRootProps>(
  function ActionCardRoot(
    {
      icon = "FeatherMousePointerClick",
      title,
      desc,
      className,
      ...otherProps
    }: ActionCardRootProps,
    ref
  ) {
    return (
      <div
        className={SubframeCore.twClassNames(
          "group/c057b814 flex h-full w-full cursor-pointer items-center gap-4 rounded-md border border-solid px-4 py-4 shadow-sm border-[#404040ff] bg-transparent hover:rounded-lg hover:border hover:border-solid hover:border-[#a3a3a3ff] hover:bg-[#171717ff] hover:px-4 hover:py-4",
          className
        )}
        ref={ref as any}
        {...otherProps}
      >
        <IconWithBackground size="large" icon={icon} square={true} />
        <div className="flex grow shrink-0 basis-0 flex-col items-start gap-1">
          {title ? (
            <span className="w-full text-body-bold font-body-bold text-default-font">
              {title}
            </span>
          ) : null}
          {desc ? (
            <span className="w-full text-caption font-caption text-subtext-color">
              {desc}
            </span>
          ) : null}
        </div>
      </div>
    );
  }
);

export const ActionCard = ActionCardRoot;
