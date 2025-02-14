// dropdown-menu.tsx
import * as React from "react";

interface DropdownMenuProps {
  children: React.ReactNode;
}

export function DropdownMenu({ children }: DropdownMenuProps) {
  return (
    <div className="relative inline-block text-left">
      {children}
    </div>
  );
}

interface DropdownMenuTriggerProps {
  children: React.ReactNode;
  onClick: () => void;
}

export function DropdownMenuTrigger({ children, onClick }: DropdownMenuTriggerProps) {
  return (
    <div onClick={onClick} className="inline-flex justify-center">
      {children}
    </div>
  );
}

interface DropdownMenuContentProps {
  children: React.ReactNode;
  align?: "start" | "end";
  className?: string;
}

export function DropdownMenuContent({ children, align = "start", className }: DropdownMenuContentProps) {
  return (
    <div 
      className={`absolute ${align === "end" ? "right-0" : "left-0"} mt-2 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none ${className} min-w-max`}
    >
      {children}
    </div>
  );
}

interface DropdownMenuItemProps {
  children: React.ReactNode;
  onClick: () => void;
}

export function DropdownMenuItem({ children, onClick }: DropdownMenuItemProps) {
  return (
    <div
      onClick={onClick}
      className="w-full cursor-pointer"
    >
      {children}
    </div>
  );
}

export function DropdownMenuSeparator() {
  return (
    <div className="border-t border-gray-100 my-1"></div>
  );
}