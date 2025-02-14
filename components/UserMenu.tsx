"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import Link from "next/link";
import userIcon from "@/public/user-icon.png";
import { useState, useEffect, useRef } from "react";

export function UserMenu() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
      setIsMenuOpen(false);
    }
  };

  useEffect(() => {
    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

  return (
    <DropdownMenu>
      <div className="focus:outline-none" ref={menuRef}>
        <DropdownMenuTrigger onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <div className="rounded-full hover:opacity-80 transition-opacity">
            <Image 
              src={userIcon} 
              alt="User Menu" 
              width={24} 
              height={24}
              className="rounded-full"
            />
          </div>
        </DropdownMenuTrigger>
      </div>
      
      {isMenuOpen && (
        <DropdownMenuContent 
          align="end"
          className="w-48 transform-gpu transition-all duration-200 ease-out"
        >
          <div className="bg-[#161617] border border-gray-700 rounded-md overflow-hidden">
            <DropdownMenuItem onClick={() => setIsMenuOpen(false)}>
              <Link 
                href="/login" 
                className="block w-full px-4 py-2 text-sm text-gray-200 hover:text-white hover:bg-gray-800/50"
              >
                Login
              </Link>
            </DropdownMenuItem>
          
            <DropdownMenuItem onClick={() => setIsMenuOpen(false)}>
              <Link 
                href="/signup" 
                className="block w-full px-4 py-2 text-sm text-gray-200 hover:text-white hover:bg-gray-800/50"
              >
                Sign Up
              </Link>
            </DropdownMenuItem>
          </div>
        </DropdownMenuContent>
      )}
    </DropdownMenu>
  );
}