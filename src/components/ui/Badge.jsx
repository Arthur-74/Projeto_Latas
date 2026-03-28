import React from "react";
import { cn } from "../../lib/utils";

export const Badge = ({ children, variant = "Comum", className }) => {
  const variantStyles = {
    "Comum": "bg-monster-gray text-monster-white border border-gray-600",
    "Raro": "bg-blue-900/40 text-blue-400 border border-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]",
    "Ultra Raro": "bg-purple-900/40 text-purple-400 border border-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.5)]",
    "Edição Limitada": "bg-yellow-900/40 text-yellow-500 border border-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.5)]",
    "Exclusivo Regional": "bg-monster-red/40 text-red-500 border border-monster-red shadow-[0_0_8px_rgba(204,0,0,0.5)]"
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-sm px-2 py-0.5 text-xs font-semibold font-body uppercase tracking-wider",
        variantStyles[variant] || variantStyles["Comum"],
        className
      )}
    >
      {children}
    </span>
  );
};
