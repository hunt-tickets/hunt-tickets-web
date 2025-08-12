import { formatPercentage } from "@/lib/utils";
import { IconName } from "@subframe/core";
import React from "react";
import { Badge } from "../sub/Badge";

type StatCardProps = {
  title: string;
  value: string | number;
  percentage: number;
  badgeVariant: "success" | "neutral" | "error";
  badgeIcon: string;
};

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  percentage,
  badgeVariant,
  badgeIcon,
}) => {
  return (
    <div className="flex grow shrink-0 basis-0 flex-col items-start gap-1 rounded-md border border-solid border-neutral-border bg-default-background px-4 py-4 shadow-sm">
      <div className="flex w-full items-center gap-2">
        <span className="line-clamp-1 grow shrink-0 basis-0 text-caption-bold font-caption-bold text-subtext-color">
          {title}
        </span>
        <Badge variant={badgeVariant} icon={badgeIcon as IconName}>
          {formatPercentage(percentage)}
        </Badge>
      </div>
      <span className="text-heading-3 font-heading-3 text-default-font">
        {value}
      </span>
    </div>
  );
};

export default StatCard;
