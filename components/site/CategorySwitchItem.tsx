import { IconName } from "@subframe/core";
import React from "react";
import { IconWithBackground } from "../sub/IconWithBackground";
import { Switch } from "./Switch";

type CategorySwitchItemProps = {
  icon: string; // El ícono a mostrar, por ejemplo: "FeatherBeer"
  label: string; // El texto de la categoría
  checked: boolean; // El estado inicial del switch
  onCheckedChange: (checked: boolean) => void; // Función que maneja el cambio del switch
};

const CategorySwitchItem: React.FC<CategorySwitchItemProps> = ({
  icon,
  label,
  checked,
  onCheckedChange,
}) => {
  return (
    <div className="flex w-full items-center gap-4">
      <IconWithBackground
        size="large"
        icon={icon === "" ? "FeatherAlertCircle" : (icon as IconName)}
        square={true}
      />
      <span className="line-clamp-1 grow shrink-0 basis-0 text-body-bold font-body-bold text-default-font">
        {label}
      </span>
      <Switch checked={checked} onCheckedChange={onCheckedChange} />
    </div>
  );
};

export default CategorySwitchItem;
