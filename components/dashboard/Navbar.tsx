"use client";

import Image from "next/image";
import { Bell, LogOut, Settings, User, ChevronDown } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useWallet } from "@/context/WalletContext";
import { MobileMenuButton } from "./Sidebar";

export function Navbar() {
  const { address, disconnect } = useWallet();

  const truncatedAddress = address
    ? `${address.slice(0, 6)}...${address.slice(-4)}`
    : "";

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-16 bg-black border-b border-[#262626] glow-green-subtle">
      <div className="flex items-center justify-between h-full px-6">
        {/* Left - Mobile Menu + Logo */}
        <div className="flex items-center gap-3">
          <MobileMenuButton />
          <div className="relative w-10 h-10">
            <Image
              src="/brujula.png"
              alt="Brújula Logo"
              fill
              className="object-contain"
            />
          </div>
          <span className="text-xl font-bold text-[#A4D900] text-glow-green">
            Brújula
          </span>
        </div>

        {/* Right - Notifications, Profile */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Notifications */}
          <button className="relative p-2 text-[#A3A3A3] hover:text-[#A4D900] transition-colors">
            <Bell className="w-6 h-6" />
            <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-[#EF4444] rounded-full pulse-green">
              3
            </span>
          </button>

          {/* Wallet Address */}
          {address && (
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-[#1A1A1A] border border-[#262626] rounded-lg">
              <div className="w-2 h-2 bg-[#10B981] rounded-full" />
              <span className="text-sm text-[#A3A3A3] font-mono">
                {truncatedAddress}
              </span>
            </div>
          )}

          {/* User Avatar & Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 p-1 rounded-full hover:ring-2 hover:ring-[#A4D900]/50 transition-all">
                <Avatar className="w-10 h-10 border-2 border-[#A4D900]">
                  <AvatarImage src="/avatar.png" alt="Usuario" />
                  <AvatarFallback className="bg-[#1A1A1A] text-[#A4D900]">
                    US
                  </AvatarFallback>
                </Avatar>
                <ChevronDown className="w-4 h-4 text-[#A3A3A3] hidden sm:block" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-56 bg-[#111111] border-[#262626] text-white"
            >
              <div className="px-3 py-2">
                <p className="text-sm font-medium">Mi Cuenta</p>
                <p className="text-xs text-[#737373] font-mono truncate">
                  {truncatedAddress}
                </p>
              </div>
              <DropdownMenuSeparator className="bg-[#262626]" />
              <DropdownMenuItem className="text-[#A3A3A3] hover:text-white hover:bg-[#1A1A1A] cursor-pointer">
                <User className="w-4 h-4 mr-2" />
                Mi Perfil
              </DropdownMenuItem>
              <DropdownMenuItem className="text-[#A3A3A3] hover:text-white hover:bg-[#1A1A1A] cursor-pointer">
                <Settings className="w-4 h-4 mr-2" />
                Configuración
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-[#262626]" />
              <DropdownMenuItem
                onClick={disconnect}
                className="text-[#EF4444] hover:text-[#EF4444] hover:bg-[#EF4444]/10 cursor-pointer"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Desconectar Wallet
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
}
