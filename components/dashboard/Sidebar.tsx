"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  PlusCircle,
  ClipboardList,
  Search,
  Briefcase,
  Upload,
  Bookmark,
  User,
  Gem,
  Settings,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const menuSections = [
  {
    title: "Postulaciones",
    items: [
      {
        href: "/dashboard",
        label: "Dashboard",
        icon: LayoutDashboard,
      },
      {
        href: "/dashboard/nueva-postulacion",
        label: "Nueva Postulación",
        icon: PlusCircle,
      },
      {
        href: "/dashboard/postulaciones",
        label: "Todas las Postulaciones",
        icon: ClipboardList,
      },
    ],
  },
  {
    title: "Trabajos",
    items: [
      {
        href: "/dashboard/explorar",
        label: "Explorar Trabajos",
        icon: Search,
      },
      {
        href: "/dashboard/mis-aplicaciones",
        label: "Mis Aplicaciones",
        icon: Briefcase,
      },
      {
        href: "/dashboard/publicados",
        label: "Trabajos Publicados",
        icon: Upload,
      },
      {
        href: "/dashboard/guardados",
        label: "Guardados",
        icon: Bookmark,
      },
    ],
  },
  {
    title: "Cuenta",
    items: [
      {
        href: "/dashboard/perfil",
        label: "Mi Perfil",
        icon: User,
      },
      {
        href: "/dashboard/premium",
        label: "Upgrade a Premium",
        icon: Gem,
        isPremium: true,
      },
      {
        href: "/dashboard/configuracion",
        label: "Configuración",
        icon: Settings,
      },
    ],
  },
];

interface SidebarContentProps {
  pathname: string;
  onLinkClick?: () => void;
}

function SidebarContent({ pathname, onLinkClick }: SidebarContentProps) {
  return (
    <div className="py-6 px-4">
      {menuSections.map((section, idx) => (
        <div key={section.title} className={cn(idx > 0 && "mt-6")}>
          <h3 className="px-3 mb-3 text-xs font-semibold text-[#737373] uppercase tracking-wider">
            {section.title}
          </h3>
          <nav className="space-y-1">
            {section.items.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onLinkClick}
                  className={cn(
                    "flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-[#1A1A1A] text-white border-l-[3px] border-[#A4D900] glow-green-subtle"
                      : "text-[#A3A3A3] hover:bg-[#1A1A1A] hover:text-white"
                  )}
                >
                  <Icon
                    className={cn(
                      "w-5 h-5 transition-colors",
                      isActive
                        ? "text-[#A4D900]"
                        : "text-[#A3A3A3] group-hover:text-[#A4D900]"
                    )}
                  />
                  <span className="flex-1">{item.label}</span>
                  {item.isPremium && (
                    <span className="px-2 py-0.5 text-[10px] font-bold text-black rounded gradient-gold">
                      PRO
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
          {idx < menuSections.length - 1 && (
            <div className="mt-6 border-b border-[#262626]" />
          )}
        </div>
      ))}
    </div>
  );
}

export function MobileMenuButton() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden text-[#A3A3A3] hover:text-[#A4D900]"
        onClick={() => setIsOpen(true)}
      >
        <Menu className="w-6 h-6" />
      </Button>

      {/* Mobile Sidebar Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />

          {/* Sidebar */}
          <aside className="absolute left-0 top-0 bottom-0 w-[280px] bg-black border-r border-[#262626] overflow-y-auto animate-in slide-in-from-left duration-300">
            <div className="flex items-center justify-between p-4 border-b border-[#262626]">
              <span className="text-xl font-bold text-[#A4D900] text-glow-green">
                Brújula
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="text-[#A3A3A3] hover:text-[#A4D900]"
                onClick={() => setIsOpen(false)}
              >
                <X className="w-6 h-6" />
              </Button>
            </div>
            <SidebarContent pathname={pathname} onLinkClick={() => setIsOpen(false)} />
          </aside>
        </div>
      )}
    </>
  );
}

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:block fixed left-0 top-16 bottom-0 w-[260px] bg-black border-r border-[#262626] overflow-y-auto">
      <div className="py-6 px-4">
        {menuSections.map((section, idx) => (
          <div key={section.title} className={cn(idx > 0 && "mt-6")}>
            <h3 className="px-3 mb-3 text-xs font-semibold text-[#737373] uppercase tracking-wider">
              {section.title}
            </h3>
            <nav className="space-y-1">
              {section.items.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200",
                      isActive
                        ? "bg-[#1A1A1A] text-white border-l-[3px] border-[#A4D900] glow-green-subtle"
                        : "text-[#A3A3A3] hover:bg-[#1A1A1A] hover:text-white"
                    )}
                  >
                    <Icon
                      className={cn(
                        "w-5 h-5 transition-colors",
                        isActive
                          ? "text-[#A4D900]"
                          : "text-[#A3A3A3] group-hover:text-[#A4D900]"
                      )}
                    />
                    <span className="flex-1">{item.label}</span>
                    {item.isPremium && (
                      <span className="px-2 py-0.5 text-[10px] font-bold text-black rounded gradient-gold">
                        PRO
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
            {idx < menuSections.length - 1 && (
              <div className="mt-6 border-b border-[#262626]" />
            )}
          </div>
        ))}
      </div>
    </aside>
  );
}
