"use client";

import React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SelectMultipleProps {
  placeholder?: string;
  items: { label: string; value: string }[];
  selectedValue?: string;
  onValueChange?: (value: string) => void;
}

export function SelectMultiple({
  placeholder = "Seleccionar",
  items,
  selectedValue,
  onValueChange,
}: SelectMultipleProps) {
  return (
    <Select value={selectedValue} onValueChange={onValueChange}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>{placeholder}</SelectLabel>
          {items.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}