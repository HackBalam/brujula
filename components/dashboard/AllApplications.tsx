"use client";

import { useState, useEffect } from "react";
import {
  Building2,
  ExternalLink,
  Calendar,
  MoreHorizontal,
  Eye,
  Pencil,
  Trash2,
  Search,
  Filter,
  LayoutGrid,
  List,
  ChevronLeft,
  ChevronRight,
  X,
  MapPin,
  DollarSign,
  RefreshCw,
  Star,
  Loader2,
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

type ViewMode = "table" | "cards";

const platforms = [
  { value: "all", label: "Todas las plataformas" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "indeed", label: "Indeed" },
  { value: "computrabajo", label: "Computrabajo" },
  { value: "occ_mundial", label: "OCC Mundial" },
  { value: "glassdoor", label: "Glassdoor" },
  { value: "sitio_empresa", label: "Sitio de la Empresa" },
  { value: "email_directo", label: "Email Directo" },
  { value: "referido", label: "Referido" },
  { value: "otro", label: "Otro" },
];

const modalities = [
  { value: "all", label: "Todas las modalidades" },
  { value: "remoto", label: "Remoto" },
  { value: "hibrido", label: "Híbrido" },
  { value: "presencial", label: "Presencial" },
];

const statuses = [
  { value: "all", label: "Todos los estados" },
  { value: "pendiente", label: "Pendiente" },
  { value: "en_revision", label: "En Revisión" },
  { value: "te_contestaron", label: "Te Contestaron" },
  { value: "entrevista_programada", label: "Entrevista" },
  { value: "rechazada", label: "Rechazada" },
  { value: "aceptada", label: "Aceptada" },
  { value: "descartada_por_mi", label: "Descartada" },
];

const ITEMS_PER_PAGE = 10;

export function AllApplications() {
  const { address } = useWallet();
  const {
    applications,
    loading,
    error,
    updateStatus,
    deleteApplication,
    fetchApplications,
  } = useApplicationsContext();

  const [viewMode, setViewMode] = useState<ViewMode>("table");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [platformFilter, setPlatformFilter] = useState("all");
  const [modalityFilter, setModalityFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  // Estados para modales
  const [selectedApplication, setSelectedApplication] =
    useState<Application | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState<string | null>(null);

  // Filtrar aplicaciones
  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      app.company_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.position_title.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || app.status === statusFilter;

    const matchesPlatform =
      platformFilter === "all" || app.platform === platformFilter;

    const matchesModality =
      modalityFilter === "all" || app.location_type === modalityFilter;

    return matchesSearch && matchesStatus && matchesPlatform && matchesModality;
  });

  // Paginación
  const totalPages = Math.ceil(filteredApplications.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedApplications = filteredApplications.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  const hasActiveFilters =
    searchQuery ||
    statusFilter !== "all" ||
    platformFilter !== "all" ||
    modalityFilter !== "all";

  const clearFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setPlatformFilter("all");
    setModalityFilter("all");
    setCurrentPage(1);
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
      console.error("Error deleting application:", err);
    }
  };

  const handleStatusChange = async (
    appId: string,
    newStatus: ApplicationStatus
  ) => {
    setIsUpdatingStatus(appId);
    try {
      await updateStatus(appId, newStatus);
    } catch (err) {
      console.error("Error updating status:", err);
    } finally {
      setIsUpdatingStatus(null);
    }
  };

  const handleSaveEdit = () => {
    // El hook ya refresca la lista automáticamente
    setIsEditModalOpen(false);
  };

  // Formatear salario
  const formatSalary = (app: Application) => {
    if (app.salary_not_specified) return null;
    if (!app.salary_min && !app.salary_max) return null;

    const currency = app.salary_currency || "USD";
    const period = app.salary_period === "anual" ? "/año" : "/mes";

    if (app.salary_min && app.salary_max) {
      return `$${app.salary_min.toLocaleString()} - $${app.salary_max.toLocaleString()} ${currency}${period}`;
    }
    if (app.salary_min) {
      return `$${app.salary_min.toLocaleString()}+ ${currency}${period}`;
    }
    if (app.salary_max) {
      return `Hasta $${app.salary_max.toLocaleString()} ${currency}${period}`;
    }
    return null;
  };

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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 text-[#A4D900] animate-spin" />
        <span className="ml-3 text-[#A3A3A3]">Cargando postulaciones...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="bg-[#111111] border-[#262626] p-8">
        <div className="text-center">
          <p className="text-[#EF4444] mb-4">{error}</p>
          <Button
            onClick={() => fetchApplications()}
            className="bg-[#A4D900] text-black hover:bg-[#B8E816]"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Reintentar
          </Button>
        </div>
      </Card>
    );
  }

  if (!address) {
    return (
      <Card className="bg-[#111111] border-[#262626] p-8">
        <div className="text-center text-[#A3A3A3]">
          <p>Conecta tu wallet para ver tus postulaciones</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <Card className="bg-[#111111] border-[#262626] p-4">
        <div className="flex flex-col gap-4">
          {/* Primera fila: Búsqueda y toggle de vista */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#737373]" />
              <Input
                type="text"
                placeholder="Buscar por empresa o puesto..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-10 bg-[#1F1F1F] border-[#262626] text-white placeholder:text-[#525252] focus:border-[#A4D900] focus:ring-1 focus:ring-[#A4D900]/50"
              />
            </div>

            {/* Toggle vista */}
            <div className="flex items-center gap-1 p-1 bg-[#1A1A1A] border border-[#262626] rounded-lg">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setViewMode("table")}
                className={cn(
                  "px-3",
                  viewMode === "table"
                    ? "bg-[#A4D900] text-black hover:bg-[#A4D900]"
                    : "text-[#A3A3A3] hover:text-white hover:bg-[#262626]"
                )}
              >
                <List className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setViewMode("cards")}
                className={cn(
                  "px-3",
                  viewMode === "cards"
                    ? "bg-[#A4D900] text-black hover:bg-[#A4D900]"
                    : "text-[#A3A3A3] hover:text-white hover:bg-[#262626]"
                )}
              >
                <LayoutGrid className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Segunda fila: Filtros */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex items-center gap-2 text-[#737373]">
              <Filter className="w-4 h-4" />
              <span className="text-sm">Filtros:</span>
            </div>

            <Select
              value={statusFilter}
              onValueChange={(value) => {
                setStatusFilter(value);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-full sm:w-[180px] bg-[#1F1F1F] border-[#262626] text-white focus:border-[#A4D900]">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent className="bg-[#1A1A1A] border-[#262626]">
                {statuses.map((status) => (
                  <SelectItem
                    key={status.value}
                    value={status.value}
                    className="text-[#A3A3A3] focus:bg-[#262626] focus:text-white cursor-pointer"
                  >
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={platformFilter}
              onValueChange={(value) => {
                setPlatformFilter(value);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-full sm:w-[180px] bg-[#1F1F1F] border-[#262626] text-white focus:border-[#A4D900]">
                <SelectValue placeholder="Plataforma" />
              </SelectTrigger>
              <SelectContent className="bg-[#1A1A1A] border-[#262626]">
                {platforms.map((platform) => (
                  <SelectItem
                    key={platform.value}
                    value={platform.value}
                    className="text-[#A3A3A3] focus:bg-[#262626] focus:text-white cursor-pointer"
                  >
                    {platform.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={modalityFilter}
              onValueChange={(value) => {
                setModalityFilter(value);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-full sm:w-[180px] bg-[#1F1F1F] border-[#262626] text-white focus:border-[#A4D900]">
                <SelectValue placeholder="Modalidad" />
              </SelectTrigger>
              <SelectContent className="bg-[#1A1A1A] border-[#262626]">
                {modalities.map((modality) => (
                  <SelectItem
                    key={modality.value}
                    value={modality.value}
                    className="text-[#A3A3A3] focus:bg-[#262626] focus:text-white cursor-pointer"
                  >
                    {modality.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-[#A3A3A3] hover:text-[#EF4444] hover:bg-[#EF4444]/10"
              >
                <X className="w-4 h-4 mr-1" />
                Limpiar
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* Resultados info */}
      <div className="flex items-center justify-between text-sm">
        <span className="text-[#A3A3A3]">
          Mostrando{" "}
          <span className="text-white font-medium">
            {paginatedApplications.length}
          </span>{" "}
          de{" "}
          <span className="text-white font-medium">
            {filteredApplications.length}
          </span>{" "}
          postulaciones
        </span>
      </div>

      {/* Vista de Tabla */}
      {viewMode === "table" && (
        <Card className="bg-[#111111] border-[#262626] overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-[#1F1F1F] hover:bg-transparent">
                  <TableHead className="text-[#737373] font-semibold uppercase text-xs">
                    Empresa
                  </TableHead>
                  <TableHead className="text-[#737373] font-semibold uppercase text-xs">
                    Puesto
                  </TableHead>
                  <TableHead className="text-[#737373] font-semibold uppercase text-xs hidden lg:table-cell">
                    Ubicación
                  </TableHead>
                  <TableHead className="text-[#737373] font-semibold uppercase text-xs hidden md:table-cell">
                    Plataforma
                  </TableHead>
                  <TableHead className="text-[#737373] font-semibold uppercase text-xs hidden xl:table-cell">
                    Salario
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
                {paginatedApplications.length > 0 ? (
                  paginatedApplications.map((app) => (
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
                      <TableCell className="text-white max-w-[200px] truncate">
                        {app.position_title}
                      </TableCell>
                      <TableCell className="text-[#A3A3A3] hidden lg:table-cell">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {app.location_type
                            ? app.location_type === "presencial" &&
                              app.location_city
                              ? app.location_city
                              : app.location_type.charAt(0).toUpperCase() +
                                app.location_type.slice(1)
                            : "No especificado"}
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
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
                      <TableCell className="text-[#A3A3A3] hidden xl:table-cell">
                        {formatSalary(app) ? (
                          <div className="flex items-center gap-1">
                            <DollarSign className="w-3 h-3 text-[#A4D900]" />
                            <span className="text-[#A4D900]">
                              {formatSalary(app)}
                            </span>
                          </div>
                        ) : (
                          <span className="text-[#525252]">No especificado</span>
                        )}
                      </TableCell>
                      <TableCell className="text-[#A3A3A3]">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(app.application_date)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild disabled={isUpdatingStatus === app.id}>
                            <button>
                              <Badge
                                variant="outline"
                                className={cn(
                                  "border font-medium cursor-pointer",
                                  statusConfig[app.status].className
                                )}
                              >
                                {isUpdatingStatus === app.id ? (
                                  <Loader2 className="w-3 h-3 mr-2 animate-spin" />
                                ) : (
                                  <span
                                    className={cn(
                                      "w-2 h-2 rounded-full mr-2",
                                      statusConfig[app.status].dot
                                    )}
                                  />
                                )}
                                {statusConfig[app.status].label}
                              </Badge>
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="bg-[#1A1A1A] border-[#262626]">
                            {Object.entries(statusConfig).map(([key, config]) => (
                              <DropdownMenuItem
                                key={key}
                                onClick={() =>
                                  handleStatusChange(
                                    app.id,
                                    key as ApplicationStatus
                                  )
                                }
                                className={cn(
                                  "cursor-pointer",
                                  config.className
                                )}
                              >
                                <span
                                  className={cn(
                                    "w-2 h-2 rounded-full mr-2",
                                    config.dot
                                  )}
                                />
                                {config.label}
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
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
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="h-32 text-center">
                      <div className="flex flex-col items-center gap-2 text-[#737373]">
                        <Search className="w-8 h-8" />
                        <p>No se encontraron postulaciones</p>
                        {hasActiveFilters && (
                          <Button
                            variant="link"
                            onClick={clearFilters}
                            className="text-[#A4D900]"
                          >
                            Limpiar filtros
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </Card>
      )}

      {/* Vista de Cards */}
      {viewMode === "cards" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {paginatedApplications.length > 0 ? (
            paginatedApplications.map((app) => (
              <Card
                key={app.id}
                className="bg-[#111111] border-[#262626] p-5 hover:border-[#A4D900] transition-all group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {app.is_priority && (
                      <Star className="w-4 h-4 text-[#F59E0B] fill-[#F59E0B]" />
                    )}
                    <Building2 className="w-4 h-4 text-[#737373]" />
                    <span className="font-medium text-white">
                      {app.company_name}
                    </span>
                  </div>
                  <Badge
                    variant="outline"
                    className={cn(
                      "border font-medium text-xs",
                      statusConfig[app.status].className
                    )}
                  >
                    <span
                      className={cn(
                        "w-1.5 h-1.5 rounded-full mr-1.5",
                        statusConfig[app.status].dot
                      )}
                    />
                    {statusConfig[app.status].label}
                  </Badge>
                </div>

                <h3 className="text-lg text-white font-medium mb-2">
                  {app.position_title}
                </h3>

                <div className="flex flex-wrap gap-3 mb-4 text-sm text-[#737373]">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {app.location_type
                      ? app.location_type === "presencial" && app.location_city
                        ? app.location_city
                        : app.location_type.charAt(0).toUpperCase() +
                          app.location_type.slice(1)
                      : "No especificado"}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {formatDate(app.application_date)}
                  </span>
                </div>

                {formatSalary(app) && (
                  <div className="flex items-center gap-1 mb-4 text-[#A4D900]">
                    <DollarSign className="w-4 h-4" />
                    <span className="font-medium">{formatSalary(app)}</span>
                  </div>
                )}

                <div className="flex items-center justify-between pt-4 border-t border-[#1F1F1F]">
                  {app.job_url ? (
                    <a
                      href={app.job_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-sm text-[#A3A3A3] hover:text-[#A4D900] transition-colors"
                    >
                      <ExternalLink className="w-3 h-3" />
                      {getPlatformLabel(app.platform)}
                    </a>
                  ) : (
                    <span className="text-sm text-[#A3A3A3]">
                      {getPlatformLabel(app.platform)}
                    </span>
                  )}

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewDetail(app)}
                      className="border-[#A4D900] text-[#A4D900] hover:bg-[#A4D900] hover:text-black"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      Ver
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-[#737373] hover:text-[#A4D900]"
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="bg-[#111111] border-[#262626]"
                      >
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
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <Card className="col-span-full bg-[#111111] border-[#262626] p-12">
              <div className="flex flex-col items-center gap-4 text-[#737373]">
                <Search className="w-12 h-12" />
                <p className="text-lg">No se encontraron postulaciones</p>
                {hasActiveFilters && (
                  <Button
                    variant="outline"
                    onClick={clearFilters}
                    className="border-[#A4D900] text-[#A4D900] hover:bg-[#A4D900] hover:text-black"
                  >
                    Limpiar filtros
                  </Button>
                )}
              </div>
            </Card>
          )}
        </div>
      )}

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="border-[#262626] text-[#A3A3A3] hover:border-[#A4D900] hover:text-[#A4D900] disabled:opacity-50"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Anterior
          </Button>

          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant="ghost"
                size="sm"
                onClick={() => setCurrentPage(page)}
                className={cn(
                  "w-9 h-9",
                  currentPage === page
                    ? "bg-[#A4D900] text-black hover:bg-[#A4D900]"
                    : "text-[#A3A3A3] hover:text-white hover:bg-[#1A1A1A]"
                )}
              >
                {page}
              </Button>
            ))}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="border-[#262626] text-[#A3A3A3] hover:border-[#A4D900] hover:text-[#A4D900] disabled:opacity-50"
          >
            Siguiente
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      )}

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
        description="Esta acción no se puede deshacer. La postulación será eliminada permanentemente."
        itemName={
          selectedApplication
            ? `${selectedApplication.position_title} en ${selectedApplication.company_name}`
            : undefined
        }
      />
    </div>
  );
}
