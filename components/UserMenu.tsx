"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";

export function UserMenu() {
  const { data: session } = useSession(); // For checking if user is logged in
  const isLoggedIn = !!session?.user;
  const userImage = session?.user?.image || "/user-icon.png"; // If user used Google, session.user.image is set. Otherwise fallback.
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

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

  const handleLoginClick = () => {
    router.push("/login");
  };

  const handleDashboardClick = () => {
    setIsMenuOpen(false);
    router.push("/dashboard");
  };

  const handleLogoutClick = () => {
    setIsMenuOpen(false);
    signOut(); // NextAuth signOut, or replace with your own logout logic
  };

  return (
    <div className="focus:outline-none" ref={menuRef}>
      {!isLoggedIn ? (
        // 1) If user is NOT logged in, show a maroon "Login" button
        <button
          onClick={handleLoginClick}
          className="bg-[#800000] text-white px-4 py-2 rounded hover:bg-[#8B0000]"
        >
          Login
        </button>
      ) : (
        // 2) If user IS logged in, show profile icon & dropdown
        <DropdownMenu>
         <DropdownMenuTrigger onClick={() => setIsMenuOpen(!isMenuOpen)}>
  <button 
    type="button"
    className="rounded-full hover:opacity-80 transition-opacity"
  >
    <Image
      src="/user-icon.png"
      alt="User Menu"
      width={32}
      height={32}
      className="rounded-full"
    />
  </button>
</DropdownMenuTrigger>


          {isMenuOpen && (
            <DropdownMenuContent
              align="end"
              className="w-48 transform-gpu transition-all duration-200 ease-out"
            >
              <div className="bg-[#161617] border border-gray-700 rounded-md overflow-hidden">
                <DropdownMenuItem onClick={handleDashboardClick}>
                  <div className="block w-full px-4 py-2 text-sm text-gray-200 hover:text-white hover:bg-gray-800/50">
                    User Dashboard
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogoutClick}>
                  <div className="block w-full px-4 py-2 text-sm text-gray-200 hover:text-white hover:bg-gray-800/50">
                    Logout
                  </div>
                </DropdownMenuItem>
              </div>
            </DropdownMenuContent>
          )}
        </DropdownMenu>
      )}
    </div>
  );
}
