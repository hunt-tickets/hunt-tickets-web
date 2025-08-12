import { IconName } from "@subframe/core";
import React from "react";
import { IconWithBackground } from "../sub/IconWithBackground";

type ProfileActionListProps = {
  icon?: string;
  label: string;
  onDelete: () => void;
};

const ProfileActionList: React.FC<ProfileActionListProps> = ({
  icon,
  label,
  onDelete,
}) => {
  return (
    <div className="flex w-full items-center gap-4 p-2 rounded-md hover:bg-neutral-50 transition">
      <IconWithBackground
        size="small"
        icon={(icon as IconName) || "FeatherAlertCircle"}
        square={false}
      />
      <p className="grow text-body-bold font-body-bold text-default-font">
        {label}
      </p>
      <button
        onClick={onDelete}
        className="px-1 text-neutral-400 hover:text-red-500 transition"
      >
        <IconWithBackground size="small" icon="FeatherTrash" square={false} />
      </button>
    </div>
  );
};

export default ProfileActionList;
