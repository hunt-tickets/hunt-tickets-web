import React from "react";

export const HelpText = ({ children }: { children: React.ReactNode }) => {
  return <p className="text-xs text-gray-500">{children}</p>;
};
