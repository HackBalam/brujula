"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Building2,
  ExternalLink,
  Calendar,
  MoreHorizontal,
  Eye,
  Pencil,
  Trash2,
  ArrowRight,
  Loader2,
  Star,
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useWallet } from "@/context/WalletContext";
import { useApplicationsContext } from "@/context/ApplicationsContext";
import {
  Application,
  ApplicationStatus,
  statusConfig,
  platformLabels,
} from "@/lib/types/database";
import { ApplicationDetailModal } from "./ApplicationDetailModal";
import { EditApplicationModal } from "./EditApplicationModal";
import { DeleteConfirmModal } from "./DeleteConfirmModal";

const filterTabs = [
  { value: "todas", label: "Todas" },
  { value: "pendiente", label: "Pendientes" },
  { value: "en_revision", label: "En Revisión" },
  { value: "te_contestaron", label: "Te Contestaron" },
  { value: "entrevista_programada", label: "Entrevistas" },
  { value: "aceptada", label: "Aceptadas" },
  { value: "rechazada", label: "Rechazadas" },
  { value: "descartada_por_mi", label: "Descartadas" },
];

export function ApplicationsTable() {
  const { address } = useWallet();
  const {
    applications,
    loading,
    deleteApplication,
  } = useApplicationsContext();

  const [activeFilter, setActiveFilter] = useState("todas");

  // Estados para modales
  const [selectedApplication, setSelectedApplication] =
    useState<Application | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Filtrar y limitar a 5 más recientes
  const filteredApplications = applications
    .filter((app) =>
      activeFilter === "todas" ? true : app.status === activeFilter
    )
    .slice(0, 5);

  // Formatear fecha
  const formatDate = (dateStr: string) => {
    try {
      return format(new Date(dateStr), "dd MMM yyyy", { locale: es });
    } catch {
      return dateStr;
    }
  };

  // Obtener label de plataforma
  const getPlatformLabel = (platform: string) => {
    return (
      platformLabels[platform as keyof typeof platformLabels] || platform
    );
  };

  // Handlers para modales
  const handleViewDetail = (app: Application) => {
    setSelectedApplication(app);
    setIsDetailModalOpen(true);
  };

  const handleEdit = (app: Application) => {
    setSelectedApplication(app);
    setIsEditModalOpen(true);
  };

  const handleEditFromDetail = () => {
    setIsDetailModalOpen(false);
    setIsEditModalOpen(true);
  };

  const handleDelete = (app: Application) => {
    setSelectedApplication(app);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedApplication) return;
    try {
      await deleteApplication(selectedApplication.id);
    } catch (err) {
      console.error("Error deleting:", err);
    }
  };

  const handleSaveEdit = () => {
    setIsEditModalOpen(false);
  };

  if (loading) {
    return (
      <Card className="bg-[#111111] border-[#262626] p-6">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-6 h-6 text-[#A4D900] animate-spin" />
          <span className="ml-3 text-[#A3A3A3]">Cargando...</span>
        </div>
      </Card>
    );
  }

  if (!address) {
    return (
      <Card className="bg-[#111111] border-[#262626] p-6">
        <div className="text-center py-8 text-[#A3A3A3]">
          <p>Conecta tu wallet para ver tus postulaciones</p>
        </div>
      </Card>
    );
  }

  return (
    <>
      <Card className="bg-[#111111] border-[#262626] p-4 sm:p-6 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between gap-4 mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-xl font-bold text-white">Mis Postulaciones</h2>
          <Button
            asChild
            variant="link"
            className="text-[#A4D900] hover:text-[#B8E816] p-0 h-auto font-medium text-sm"
          >
            <Link href="/dashboard/postulaciones">
              Ver todas <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </Button>
        </div>

        {/* Filter Tabs - Scrollable on mobile */}
        <Tabs value={activeFilter} onValueChange={setActiveFilter} className="mb-4 sm:mb-6">
          <div className="overflow-x-auto scrollbar-hide -mx-4 sm:-mx-6 px-4 sm:px-6">
            <TabsList className="bg-[#1A1A1A] border border-[#262626] p-1 inline-flex">
              {filterTabs.map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className={cn(
                    "text-[#A3A3A3] data-[state=active]:bg-[#A4D900] data-[state=active]:text-black data-[state=active]:shadow-[0_0_10px_rgba(164,217,0,0.3)]",
                    "hover:text-[#A4D900] transition-all whitespace-nowrap px-2 py-1 text-[11px] sm:text-sm sm:px-3 sm:py-1.5"
                  )}
                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
        </Tabs>

        {filteredApplications.length === 0 ? (
          <div className="text-center py-8 text-[#737373]">
            <p>No hay postulaciones {activeFilter !== "todas" ? "con este estado" : ""}</p>
            <Button
              asChild
              className="mt-4 bg-[#A4D900] text-black hover:bg-[#B8E816]"
            >
              <Link href="/dashboard/nueva-postulacion">
                Agregar Postulación
              </Link>
            </Button>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-[#1F1F1F] hover:bg-transparent">
                    <TableHead className="text-[#737373] font-semibold uppercase text-xs">
                      Empresa
                    </TableHead>
                    <TableHead className="text-[#737373] font-semibold uppercase text-xs">
                      Puesto
                    </TableHead>
                    <TableHead className="text-[#737373] font-semibold uppercase text-xs">
                      Plataforma
                    </TableHead>
                    <TableHead className="text-[#737373] font-semibold uppercase text-xs">
                      Fecha
                    </TableHead>
                    <TableHead className="text-[#737373] font-semibold uppercase text-xs">
                      Estado
                    </TableHead>
                    <TableHead className="text-[#737373] font-semibold uppercase text-xs text-right">
                      Acciones
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredApplications.map((app) => (
                    <TableRow
                      key={app.id}
                      className="border-b border-[#1F1F1F] hover:bg-[#1A1A1A] transition-colors"
                    >
                      <TableCell className="font-medium text-white">
                        <div className="flex items-center gap-2">
                          {app.is_priority && (
                            <Star className="w-4 h-4 text-[#F59E0B] fill-[#F59E0B]" />
                          )}
                          <Building2 className="w-4 h-4 text-[#737373]" />
                          {app.company_name}
                        </div>
                      </TableCell>
                      <TableCell className="text-white">{app.position_title}</TableCell>
                      <TableCell>
                        {app.job_url ? (
                          <a
                            href={app.job_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-[#A3A3A3] hover:text-[#A4D900] transition-colors"
                          >
                            <ExternalLink className="w-3 h-3" />
                            {getPlatformLabel(app.platform)}
                          </a>
                        ) : (
                          <span className="text-[#A3A3A3]">
                            {getPlatformLabel(app.platform)}
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-[#A3A3A3]">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(app.application_date)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={cn(
                            "border font-medium",
                            statusConfig[app.status].className
                          )}
                        >
                          <span
                            className={cn(
                              "w-2 h-2 rounded-full mr-2",
                              statusConfig[app.status].dot
                            )}
                          />
                          {statusConfig[app.status].label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-[#737373] hover:text-[#A4D900] hover:bg-[#1A1A1A]"
                            >
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="end"
                            className="bg-[#111111] border-[#262626]"
                          >
                            <DropdownMenuItem
                              onClick={() => handleViewDetail(app)}
                              className="text-[#A3A3A3] hover:text-white hover:bg-[#1A1A1A] cursor-pointer"
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              Ver detalle
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleEdit(app)}
                              className="text-[#A3A3A3] hover:text-white hover:bg-[#1A1A1A] cursor-pointer"
                            >
                              <Pencil className="w-4 h-4 mr-2" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="bg-[#262626]" />
                            <DropdownMenuItem
                              onClick={() => handleDelete(app)}
                              className="text-[#EF4444] hover:text-[#EF4444] hover:bg-[#EF4444]/10 cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Eliminar
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-3">
              {filteredApplications.map((app) => (
                <Card
                  key={app.id}
                  className="bg-[#0A0A0A] border-[#262626] p-3 sm:p-4 hover:border-[#A4D900] transition-all"
                >
                  {/* Header: Company + Status */}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-1.5 min-w-0 flex-1">
                      {app.is_priority && (
                        <Star className="w-3 h-3 text-[#F59E0B] fill-[#F59E0B] shrink-0" />
                      )}
                      <Building2 className="w-3 h-3 text-[#737373] shrink-0" />
                      <span className="font-medium text-white text-sm truncate">{app.company_name}</span>
                    </div>
                    <Badge
                      variant="outline"
                      className={cn(
                        "border font-medium text-[10px] px-1.5 py-0.5 shrink-0",
                        statusConfig[app.status].className
                      )}
                    >
                      <span
                        className={cn(
                          "w-1.5 h-1.5 rounded-full mr-1",
                          statusConfig[app.status].dot
                        )}
                      />
                      {statusConfig[app.status].label}
                    </Badge>
                  </div>

                  {/* Position */}
                  <h3 className="text-sm text-[#A3A3A3] mb-2 line-clamp-1">{app.position_title}</h3>

                  {/* Platform + Date */}
                  <div className="flex items-center justify-between text-xs text-[#737373] mb-3">
                    {app.job_url ? (
                      <a
                        href={app.job_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 hover:text-[#A4D900] transition-colors"
                      >
                        <ExternalLink className="w-3 h-3" />
                        {getPlatformLabel(app.platform)}
                      </a>
                    ) : (
                      <span>{getPlatformLabel(app.platform)}</span>
                    )}
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatDate(app.application_date)}
                    </div>
                  </div>

                  {/* Action Buttons - Icon only on very small screens */}
                  <div className="flex items-center gap-1.5">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewDetail(app)}
                      className="flex-1 h-8 border-[#A4D900] text-[#A4D900] hover:bg-[#A4D900] hover:text-black text-xs px-2"
                    >
                      <Eye className="w-3 h-3 sm:mr-1" />
                      <span className="hidden sm:inline">Ver</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(app)}
                      className="flex-1 h-8 border-[#262626] text-[#A3A3A3] hover:border-[#A4D900] hover:text-[#A4D900] text-xs px-2"
                    >
                      <Pencil className="w-3 h-3 sm:mr-1" />
                      <span className="hidden sm:inline">Editar</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(app)}
                      className="h-8 border-[#262626] text-[#EF4444] hover:border-[#EF4444] hover:bg-[#EF4444]/10 text-xs px-2"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </>
        )}
      </Card>

      {/* Modales */}
      <ApplicationDetailModal
        application={selectedApplication}
        open={isDetailModalOpen}
        onOpenChange={setIsDetailModalOpen}
        onEdit={handleEditFromDetail}
      />

      <EditApplicationModal
        application={selectedApplication}
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        onSave={handleSaveEdit}
      />

      <DeleteConfirmModal
        open={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        onConfirm={handleConfirmDelete}
        title="Eliminar Postulación"
        description="Esta acción no se puede deshacer."
        itemName={
          selectedApplication
            ? `${selectedApplication.position_title} en ${selectedApplication.company_name}`
            : undefined
        }
      />
    </>
  );
}
