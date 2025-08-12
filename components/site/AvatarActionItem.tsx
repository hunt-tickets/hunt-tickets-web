import React from "react";
import { Avatar } from "../sub/avatar";
import { IconWithBackground } from "../sub/IconWithBackground";
import { IconName } from "@subframe/core";

type AvatarActionItemProps = {
  avatarImage: string;
  avatarLetter?: string;
  label: string;
  icons: {
    icon: string;
    variant?: string;
    size?: "small" | "medium" | "large";
  }[];
};

const AvatarActionItem: React.FC<AvatarActionItemProps> = ({
  avatarImage,
  avatarLetter = "",
  label,
  icons,
}) => {
  return (
    <div className="flex w-full items-center gap-4">
      <Avatar variant="brand" size="large" image={avatarImage} square={false}>
        {avatarLetter}
      </Avatar>
      <span className="line-clamp-1 grow shrink-0 basis-0 text-body-bold font-body-bold text-default-font">
        {label}
      </span>
      <div className="flex items-center gap-2">
        {icons.map((iconItem, index) => (
          <IconWithBackground
            key={index}
            variant={(iconItem.variant as "brand" | "neutral" | "error" | "success" | "warning") || "neutral"}
            size={iconItem.size || "small"}
            icon={iconItem.icon as IconName}
            square={false}
          />
        ))}
      </div>
    </div>
  );
};

export default AvatarActionItem;
