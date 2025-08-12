"use client";

import * as SubframeCore from "@subframe/core";
import React from "react";

interface BarChartRootProps
  extends React.ComponentProps<typeof SubframeCore.BarChart> {
  stacked?: boolean;
  className?: string;
}

const BarChartRoot = React.forwardRef<HTMLElement, BarChartRootProps>(
  function BarChartRoot(
    { stacked = false, className, ...otherProps }: BarChartRootProps,
    ref
  ) {
    return (
      <SubframeCore.BarChart
        className={SubframeCore.twClassNames("h-80 w-full", className)}
        ref={ref as any}
        stacked={stacked}
        colors={[
          "#a3a3a3",
          "#404040",
          "#d4d4d4",
          "#262626",
          "#e5e5e5",
          "#737373",
        ]}
        dark={true}
        {...otherProps}
      />
    );
  }
);

export const BarChart = BarChartRoot;
