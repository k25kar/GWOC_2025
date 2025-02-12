"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"; // Update import path
import Image from "next/image";
import userIcon from "@/public/user-icon.png";
import Link from "next/link";

export function UserMenu() {
  return (
    <DropdownMenu modal={false}> {/* Add modal={false} to prevent scroll lock */}
      <DropdownMenuTrigger asChild>
        <button className="focus:outline-none" title="User Menu">
          <Image 
            src={userIcon} 
            alt="User Icon" 
            width={24} 
            height={24} 
            className="text-gray-200 hover:opacity-80 transition-opacity"
          />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="w-48 bg-[#161617] border border-gray-700 rounded-md shadow-lg mt-2"
        sideOffset={8}
      >
        <DropdownMenuItem>
          <Link href="/login" className="text-gray-200 hover:text-white w-full">
            Login
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-gray-700" />
        <DropdownMenuItem>
          <Link href="/signup" className="text-gray-200 hover:text-white w-full">
            Sign Up
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
