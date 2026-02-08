"use client";

import Link from "next/link";
import { ChevronRight, ClipboardList, Plus } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard";
import { AllApplications } from "@/components/dashboard/AllApplications";
import { Button } from "@/components/ui/button";

export default function PostulacionesPage() {
  return (
    <DashboardLayout>
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm mb-6">
        <Link
          href="/dashboard"
          className="text-[#A3A3A3] hover:text-[#A4D900] transition-colors"
        >
          Dashboard
        </Link>
        <ChevronRight className="w-4 h-4 text-[#525252]" />
        <span className="text-white">Todas las Postulaciones</span>
      </nav>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[#A4D900]/20 glow-green-subtle">
            <ClipboardList className="w-6 h-6 text-[#A4D900]" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">
              Todas las Postulaciones
            </h1>
            <p className="text-[#A3A3A3]">
              Gestiona y da seguimiento a todas tus postulaciones
            </p>
          </div>
        </div>

        <Button
          asChild
          className="bg-[#A4D900] text-black hover:bg-[#B8E816] font-semibold shadow-[0_0_20px_rgba(164,217,0,0.4)] hover:shadow-[0_0_30px_rgba(164,217,0,0.5)] transition-all duration-300"
        >
          <Link href="/dashboard/nueva-postulacion">
            <Plus className="w-5 h-5 mr-2" />
            Nueva Postulación
          </Link>
        </Button>
      </div>

      {/* Contenido */}
      <AllApplications />
    </DashboardLayout>
  );
}
