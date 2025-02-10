"use client"

import Link from "next/link"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export function Navbar() {
  const navigation = [
    { name: "Home", href: "/" },
    { name: "Service", href: "/services" },
    { name: "Feature", href: "#" },
    { name: "Product", href: "#" },
    { name: "Testimonial", href: "#" },
    { name: "FAQ", href: "#" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
    { name: "Dashboard", href: "/dashboard/admindashboard" }
  ]

  return (
    <nav className="sticky top-0 z-50 w-full bg-[#2A323C] px-4 py-4 rounded-lg">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <Link href="/" className="text-lg font-semibold text-white">
          HelperBuddy
        </Link>
        {/* Desktop Navigation */}
        <div className="hidden items-center gap-8 lg:flex">
          <div className="flex items-center gap-6">
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
          <div className="flex items-center gap-2">
            <Button variant="ghost" className="text-sm text-gray-200 hover:text-white">
              Login
            </Button>
            <Button variant="secondary" className="bg-gray-200 text-sm text-gray-900 hover:bg-gray-100">
              Sign up
            </Button>
          </div>
        </div>
        {/* Mobile Navigation */}
        <div className="flex items-center gap-2 lg:hidden">
          <Button variant="ghost" className="text-sm text-gray-200 hover:text-white">
            Login
          </Button>
          <Button variant="secondary" className="bg-gray-200 text-sm text-gray-900 hover:bg-gray-100">
            Sign up
          </Button>
        </div>
      </div>
    </nav>
  )
}