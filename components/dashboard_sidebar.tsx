import Link from "next/link"
import { BarChart2, Users, FileText, Settings, Terminal, LogOut } from "lucide-react"

export function DashboardSidebar() {
  return (
    <aside className="w-64 bg-[#1a1f36] text-white">
      <div className="p-6">
        <h2 className="text-2xl font-bold">NexaVerse</h2>
      </div>
      <nav className="space-y-1">
        <Link href="#" className="flex items-center px-6 py-3 text-gray-300 hover:bg-gray-800 hover:text-white">
          <BarChart2 className="mr-3 h-5 w-5" />
          Overview
        </Link>
        <Link href="#" className="flex items-center px-6 py-3 text-gray-300 hover:bg-gray-800 hover:text-white">
          <FileText className="mr-3 h-5 w-5" />
          Transactions
        </Link>
        <Link href="#" className="flex items-center px-6 py-3 text-gray-300 hover:bg-gray-800 hover:text-white">
          <Users className="mr-3 h-5 w-5" />
          Customers
        </Link>
        <Link href="#" className="flex items-center px-6 py-3 text-gray-300 hover:bg-gray-800 hover:text-white">
          <BarChart2 className="mr-3 h-5 w-5" />
          Reports
        </Link>
        <Link href="#" className="flex items-center px-6 py-3 text-gray-300 hover:bg-gray-800 hover:text-white">
          <Settings className="mr-3 h-5 w-5" />
          Settings
        </Link>
        <Link href="#" className="flex items-center px-6 py-3 text-gray-300 hover:bg-gray-800 hover:text-white">
          <Terminal className="mr-3 h-5 w-5" />
          Developer
        </Link>
      </nav>
      <div className="absolute bottom-0 w-64 p-6">
        <Link href="#" className="flex items-center text-gray-300 hover:text-white">
          <LogOut className="mr-3 h-5 w-5" />
          Log out
        </Link>
      </div>
    </aside>
  )
}

