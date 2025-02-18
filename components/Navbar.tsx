"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import SearchBar from "./SearchBar";
import { UserMenu } from "./UserMenu";
import { Menu, X } from "lucide-react"; // Import icons for hamburger menu
import Image from "next/image";
import cartIcon from "@/public/shopping-cart.png"; // Import the cart icon
import helperbuddyLogo from "@/public/helperbuddy-logo.png"; // Import the HelperBuddy logo
import SideCart from "./cart";
import { useCart } from "@/src/context/CartContext";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { cart } = useCart();

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Service", href: "/services" },
    { name: "About", href: "/about" },
    { name: "Blog", href: "/blogs" },
    { name: "Dashboard", href: "/dashboard/admindashboard" } 
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 w-full bg-[#161617] bg-opacity-95 px-4 py-2">
      <div className="mx-auto flex items-center justify-between max-w-7xl">
        {/* Logo - Always visible */}
        <div className="flex items-center w-36">
          <Link href="/">
            <Image src={helperbuddyLogo} alt="HelperBuddy Logo" width={24} height={24} className="mr-2" />
          </Link>
          <Link href="/" className="text-lg font-semibold text-white hidden lg:block">
            HelperBuddy
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex flex-1 justify-center">
          <div className="flex items-center gap-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn("text-sm text-gray-200 transition-colors hover:text-white")}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Desktop Search, Cart, and User Menu */}
        <div className="hidden lg:flex items-center gap-4 w-73 justify-end">
          <SearchBar />
          <div className="flex items-center gap-4">
          <SideCart>
          <div className="relative">
            <Image
              src={cartIcon}
              alt="Cart"
              width={24}
              height={24}
              className="hover:opacity-80 transition-opacity"
            />
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {cart.length}
              </span>
            )}
          </div>
        </SideCart>
            <UserMenu />
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="flex lg:hidden items-center gap-4">
          <SearchBar />
          <div className="flex items-center gap-4">
            <Link href="/cart">
              <Image src={cartIcon} alt="Cart" width={24} height={24} className="hover:opacity-80 transition-opacity" />
            </Link>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-200 hover:text-white"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {isMenuOpen && (
          <div className="lg:hidden fixed inset-0 top-[40px] bg-[#161617] z-50">
            <div className="flex flex-col p-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-gray-200 hover:text-white py-3 border-b border-gray-800"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="mt-4 flex flex-col gap-2">
                <Link
                  href="/login"
                  className="text-gray-200 hover:text-white py-3"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="text-gray-200 hover:text-white py-3"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}