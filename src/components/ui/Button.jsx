import React from "react";
import { cn } from "../../lib/utils";

export const Button = React.forwardRef(({ className, variant = "primary", size = "default", children, ...props }, ref) => {
  return (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center font-display tracking-wider uppercase transition-all duration-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-monster-neon disabled:opacity-50 disabled:pointer-events-none clip-diagonal-btn",
        {
          "bg-monster-neon text-monster-dark hover:bg-white hover:glow-border": variant === "primary",
          "bg-monster-gray text-monster-white hover:bg-monster-dark border-2 border-monster-neon hover:glow-border": variant === "outline",
          "bg-monster-gray text-monster-white hover:text-monster-neon": variant === "ghost",
          "h-9 px-4 py-2 text-sm": size === "default",
          "h-8 px-3 text-xs": size === "sm",
          "h-12 px-8 text-lg": size === "lg",
          "h-9 w-9 p-0": size === "icon",
        },
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = "Button";
