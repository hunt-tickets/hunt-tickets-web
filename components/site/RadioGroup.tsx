"use client";

import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import React from "react";

interface RadioGroupCustomProps {
  options: { label: string; value: string }[]; // Lista de opciones
  defaultValue?: string; // Valor inicial seleccionado
  onValueChange?: (value: string) => void; // Callback al seleccionar un valor
}

export const RadioGroupCustom: React.FC<RadioGroupCustomProps> = ({
  options,
  defaultValue,
  onValueChange,
}) => {
  return (
    <RadioGroup
      defaultValue={defaultValue}
      onValueChange={onValueChange}
      className="space-y-4"
    >
      {options.map((option) => (
        <div key={option.value} className="flex items-center space-x-2">
          <RadioGroupItem value={option.value} id={option.value} />
          <Label htmlFor={option.value}>{option.label}</Label>
        </div>
      ))}
    </RadioGroup>
  );
};
