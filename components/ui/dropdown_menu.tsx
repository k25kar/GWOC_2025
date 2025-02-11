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
    <div onClick={onClick} className="inline-flex justify-center w-full">
      {children}
    </div>
  );
}

interface DropdownMenuContentProps {
  children: React.ReactNode;
  align?: "start" | "end";
}

export function DropdownMenuContent({ children, align = "start" }: DropdownMenuContentProps) {
  return (
    <div className={`absolute ${align === "end" ? "right-0" : "left-0"} mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none`}>
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
    <button
      onClick={onClick}
      className="text-gray-700 group flex rounded-md items-center w-full px-2 py-2 text-sm hover:bg-gray-100 hover:text-gray-900"
    >
      {children}
    </button>
  );
}