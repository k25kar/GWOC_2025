"use client";

import { motion } from "framer-motion";
import { BarChart, Users, Briefcase, FileText, Settings, Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "../ui/button";

interface SidebarProps {
  isOpen: boolean;
  setIsOpenAction: (isOpen: boolean) => void;
}

export function Sidebar({ isOpen, setIsOpenAction }: SidebarProps) {
  const pathname = usePathname();

  const menuItems = [
    { icon: BarChart, label: "Dashboard", href: "/dashboard" },
    { icon: Briefcase, label: "Services", href: "/dashboard/services" },
    { icon: Users, label: "Partners", href: "/dashboard/partners" },
    { icon: FileText, label: "Blog", href: "/dashboard/blog" },
    { icon: Settings, label: "Settings", href: "/dashboard/settings" },
  ];

  return (
    <motion.aside
      className="fixed left-0 top-0 z-40 h-screen bg-[#141414] shadow-lg"
      initial={false}
      animate={{
        width: isOpen ? "280px" : "80px",
      }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex h-16 items-center justify-between px-4 text-[#E8E4D3]">
        <motion.div
          animate={{ opacity: isOpen ? 1 : 0 }}
          transition={{ duration: 0.2 }}
          className="flex items-center gap-2"
        >
          {isOpen && <span className="text-xl font-bold">Helper Buddy</span>}
        </motion.div>
        <Button onClick={() => setIsOpenAction(!isOpen)} className="rounded-lg p-2 group hover:bg-gray-100">
          <Menu size={24} className="text-[#E8E4D3] group-hover:text-[#141414]" />
        </Button>
      </div>
      <nav className="mt-4 space-y-2 px-4">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`group flex items-center gap-4 rounded-lg p-3 transition-colors ${
              pathname === item.href ? "bg-primary text-primary-foreground" : "hover:bg-gray-100 hover:text-[#141414]"
            } text-[#E8E4D3]`}
          >
            <item.icon size={24} className="text-[#E8E4D3] group-hover:text-[#141414]" />
            {isOpen && <span className="group-hover:text-[#141414]">{item.label}</span>}
          </Link>
        ))}
      </nav>
    </motion.aside>
  );
}

