import { Bell, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState } from "react";

interface HeaderProps {
  toggleSidebar: () => void;
}

export function Header({ toggleSidebar }: HeaderProps) {
  const [isNotificationOpen, setNotificationOpen] = useState(false);
  const [isProfileOpen, setProfileOpen] = useState(false);

  return (
    <header className="flex h-16 items-center justify-between border-b bg-[#141414] px-6 text-[#E8E4D3]">
      <div className="flex items-center gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#E8E4D3]" />
          <Input placeholder="Search..." className="w-[300px] pl-9 bg-[#141414] text-[#E8E4D3] border-[#E8E4D3]" />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger onClick={() => setNotificationOpen(!isNotificationOpen)}>
            <Button variant="ghost" className="group">
              <Bell className="h-5 w-5 text-[#E8E4D3] group-hover:text-[#141414]" />
            </Button>
          </DropdownMenuTrigger>
          {isNotificationOpen && (
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setNotificationOpen(false)}>New notification</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setNotificationOpen(false)}>View all</DropdownMenuItem>
            </DropdownMenuContent>
          )}
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger onClick={() => setProfileOpen(!isProfileOpen)}>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar>
                <AvatarImage src="/placeholder-avatar.jpg" alt="Admin" />
                <AvatarFallback>AD</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          {isProfileOpen && (
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setProfileOpen(false)}>Profile</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setProfileOpen(false)}>Settings</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setProfileOpen(false)}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          )}
        </DropdownMenu>
      </div>
    </header>
  );
}