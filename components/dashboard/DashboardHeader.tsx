"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DashboardHeaderProps {
  userName?: string;
}

export function DashboardHeader({
  userName = "Usuario",
}: DashboardHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white">
          Hola, {userName} <span className="inline-block animate-bounce">👋</span>
        </h1>
        <p className="text-sm sm:text-base text-[#A3A3A3] mt-1">
          Gestiona tus postulaciones de trabajo con <span className="text-[#A4D900] font-medium">Brújula</span>
        </p>
      </div>

      <Button asChild className="w-full sm:w-auto bg-[#A4D900] text-black hover:bg-[#B8E816] font-semibold shadow-[0_0_20px_rgba(164,217,0,0.4),0_4px_12px_rgba(0,0,0,0.3)] hover:shadow-[0_0_30px_rgba(164,217,0,0.5),0_6px_16px_rgba(0,0,0,0.4)] transition-all duration-300">
        <Link href="/dashboard/nueva-postulacion">
          <Plus className="w-5 h-5 mr-2" />
          Nueva Postulación
        </Link>
      </Button>
    </div>
  );
}
