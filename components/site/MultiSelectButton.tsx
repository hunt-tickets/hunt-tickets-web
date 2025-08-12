import { useState } from "react";
import { Button } from "../sub/button";

type MultiSelectButtonProps = {
  label: string;
  isSelected: boolean;
  onSelect: (label: string) => void;
};

const MultiSelectButton = ({
  label,
  isSelected,
  onSelect,
}: MultiSelectButtonProps) => {
  const [selected, setSelected] = useState(isSelected);

  const handleClick = () => {
    setSelected(!selected);
    onSelect(label);
  };

  return (
    <Button
      icon={selected ? "FeatherCheck" : "FeatherPlus"}
      variant={selected ? "neutral-primary" : "neutral-secondary"}
      onClick={handleClick}
      size="small"
    >
      {label}
    </Button>
  );
};

export default MultiSelectButton;
