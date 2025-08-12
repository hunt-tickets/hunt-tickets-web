import { IconName } from "@subframe/core";
import { Reorder } from "framer-motion";
import React from "react";
import { IconWithBackground } from "../sub/IconWithBackground";

type ProfileActionOrderMyListProps = {
  icon?: string;
  label: string;
  item?: any;
  position?: number;
};

const ProfileActionOrderMyList: React.FC<ProfileActionOrderMyListProps> = ({
  icon = "FeatherGripVertical",
  label,
  item,
  position,
}) => {
  return (
    <Reorder.Item
      value={item}
      className="flex w-full items-center gap-4 p-2 rounded-md hover:bg-neutral-50 transition"
    >
      <IconWithBackground size="small" icon={icon as IconName} square={false} />
      <p className="grow text-body-bold font-body-bold text-default-font">
        {label}
      </p>
      <button
        className="px-1 text-neutral-400 hover:text-red-500 transition"
      >
        {position}
      </button>
    </Reorder.Item>
  );
};

export default ProfileActionOrderMyList;
