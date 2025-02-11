"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Sidebar } from "./sidebar"
import { Header } from "./header"
import type React from "react" // Added import for React

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  return (
    <div className="min-h-screen bg-white-100">
      <Sidebar isOpen={isSidebarOpen} setIsOpenAction={setIsSidebarOpen} />
      <motion.div
        className="flex flex-col"
        initial={false}
        animate={{
          marginLeft: isSidebarOpen ? "280px" : "80px",
        }}
        transition={{ duration: 0.3 }}
      >
        <Header toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
        <main className="flex-1 p-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            {children}
          </motion.div>
        </main>
      </motion.div>
    </div>
  )
}

