// src/components/magicui/interactive-hover-button.tsx
import React from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface InteractiveHoverButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export const InteractiveHoverButton = React.forwardRef<
  HTMLButtonElement,
  InteractiveHoverButtonProps
>(({ children, className, ...props }, ref) => {
  return (
    <button
      ref={ref}
      className={cn(
        "group relative w-auto cursor-pointer overflow-hidden rounded-full border bg-white p-2 px-6 text-center font-semibold transition-all duration-300",
        className
      )}
      {...props}
    >
      <div className="flex items-center gap-2">
        {/* A small dot that scales on hover */}
        <div className="h-2 w-2 rounded-full bg-indigo-500 transition-all duration-300 group-hover:scale-105"></div>
        {/* The default content that slides out */}
        <span className="inline-block transition-all duration-300 group-hover:translate-x-4 group-hover:opacity-0">
          {children}
        </span>
      </div>
      {/* The hover content that slides in */}
      <div className="absolute inset-0 flex items-center justify-center gap-2 text-indigo-700 opacity-0 transition-all duration-300 group-hover:opacity-100">
        <span>{children}</span>
        <ArrowRight />
      </div>
    </button>
  );
});

InteractiveHoverButton.displayName = "InteractiveHoverButton";
