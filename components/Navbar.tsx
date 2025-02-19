"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import SearchBar from "./SearchBar";
import { UserMenu } from "./UserMenu";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import cartIcon from "@/public/shopping-cart.png";
import helperbuddyLogo from "@/public/helperbuddy-logo.png";
import SideCart from "./cart";
import { useCart } from "@/src/context/CartContext";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { cart } = useCart();

  // Added "Admin Dashboard" to navigation
  const navigation = [
    { name: "Home", href: "/" },
    { name: "Service", href: "/services" },
    { name: "About", href: "/about" },
    { name: "Blog", href: "/blogs" },
    { name: "Admin Dashboard", href: "https://helperbuddy-admin.onrender.com" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 w-full bg-[#161617] bg-opacity-95 px-4 py-4">
      <div className="mx-auto flex items-center justify-between max-w-7xl">
        {/* Logo - Always visible */}
        <div className="flex items-center w-40">
          <Link href="/">
            <Image
              src={helperbuddyLogo}
              alt="HelperBuddy Logo"
              width={28}
              height={28}
              className="mr-3"
            />
          </Link>
          <Link href="/" className="text-xl font-semibold text-white hidden lg:block">
            HelperBuddy
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex flex-1 justify-center">
          <div className="flex items-center gap-10">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn("text-base text-gray-200 transition-colors hover:text-white")}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Desktop Search, Cart, and User Menu */}
        <div className="hidden lg:flex items-center gap-6 w-96 justify-end">
          <div className="w-64">
            <SearchBar />
          </div>
          <div className="flex items-center gap-6">
            <SideCart>
              <div className="relative">
                <Image
                  src={cartIcon}
                  alt="Cart"
                  width={32}
                  height={32}
                  className="hover:opacity-80 transition-opacity"
                />
                {cart.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
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
          <div className="w-48">
            <SearchBar />
          </div>
          <div className="flex items-center gap-4">
            <Link href="/cart">
              <Image
                src={cartIcon}
                alt="Cart"
                width={32}
                height={32}
                className="hover:opacity-80 transition-opacity"
              />
            </Link>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-200 hover:text-white"
            >
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {isMenuOpen && (
          <div className="lg:hidden fixed inset-0 top-[48px] bg-[#161617] z-50">
            <div className="flex flex-col p-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-base text-gray-200 hover:text-white py-3 border-b border-gray-800"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="mt-4 flex flex-col gap-2">
                <Link
                  href="/login"
                  className="inline-block px-4 py-2 bg-transparent border border-gray-200 text-gray-200 rounded-md transition-colors duration-300 hover:bg-gray-200 hover:text-black"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="inline-block px-4 py-2 bg-transparent border border-gray-200 text-gray-200 rounded-md transition-colors duration-300 hover:bg-gray-200 hover:text-black"
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
