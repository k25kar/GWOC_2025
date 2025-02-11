"use client"

import Link from "next/link"
import { cn } from "@/lib/utils"
import Image from "next/image"
import userIcon from "@/public/user-icon.png" // Correctly import the UserIcon image

export function Navbar() {
  const navigation = [
    { name: "Home", href: "/" },
    { name: "Service", href: "/services" },
    // { name: "Feature", href: "#" },
    // { name: "Product", href: "#" },
    // { name: "Testimonial", href: "#" },
    // { name: "FAQ", href: "#" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
    { name: "Dashboard", href: "/dashboard/admindashboard" },
    { name: "SPDashboard", href: "/dashboard/spdashboard/overview" } // Ensure this line is correct
  ]

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 w-full bg-[#161617] bg-opacity-95 px-8 py-2">
      <div className="mx-auto flex max-w-4xl items-center justify-between">
        <Link href="/" className="text-base font-semibold text-white">
          HelperBuddy
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex flex-1 justify-center">
          <div className="flex items-center gap-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn("text-xs text-gray-200 transition-colors hover:text-white")}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
        <div className="hidden lg:flex items-center gap-2">
          <Image src={userIcon} alt="User Icon" width={24} height={24} className="text-gray-200 hover:text-white" />
        </div>

        {/* Mobile Navigation */}
        <div className="flex items-center gap-2 lg:hidden">
          <Image src={userIcon} alt="User Icon" width={24} height={24} className="text-gray-200 hover:text-white" />
        </div>
      </div>
    </nav>
  )
}