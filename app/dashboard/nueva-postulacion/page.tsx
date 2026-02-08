"use client";

import Link from "next/link";
import { ChevronRight, FileText } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard";
import { NewApplicationForm } from "@/components/dashboard/NewApplicationForm";

export default function NuevaPostulacionPage() {
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
        <span className="text-white">Nueva Postulación</span>
      </nav>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-2">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[#A4D900]/20 glow-green-subtle">
            <FileText className="w-6 h-6 text-[#A4D900]" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Nueva Postulación</h1>
            <p className="text-[#A3A3A3]">
              Registra una nueva postulación para llevar el seguimiento
            </p>
          </div>
        </div>
      </div>

      {/* Formulario */}
      <NewApplicationForm />
    </DashboardLayout>
  );
}
