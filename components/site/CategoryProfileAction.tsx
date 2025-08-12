import { IconName } from "@subframe/core";
import { Reorder, useDragControls } from "framer-motion";
import React from "react";
import { IconWithBackground } from "../sub/IconWithBackground";

type CategoryProfileActionProps = {
  icon?: string;
  label: string;
  onDelete: () => void;
  item?: any;
};

const CategoryProfileAction: React.FC<CategoryProfileActionProps> = ({
  icon = "FeatherAlertCircle",
  label,
  onDelete,
  item,
}) => {
  const controls = useDragControls();
  return (
    <Reorder.Item
      value={item}
      dragListener={false}
      dragControls={controls}
      className="flex w-full items-center gap-4 p-2 rounded-md hover:bg-neutral-50 transition"
    >
      <div onPointerDown={(e) => controls.start(e)} className="cursor-move">
        <IconWithBackground
          size="small"
          icon={icon === "" ? "FeatherGripVertical" : (icon as IconName)}
          square={false}
        />
      </div>
      <p className="grow text-body-bold font-body-bold text-default-font">
        {label}
      </p>
      <button
        onClick={onDelete}
        className="p-1 text-neutral-400 hover:text-red-500 transition"
      >
        <IconWithBackground size="small" icon="FeatherTrash" square={false} />
      </button>
    </Reorder.Item>
  );
};

export default CategoryProfileAction;
