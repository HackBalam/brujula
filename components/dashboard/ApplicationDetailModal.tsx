"use client";

import {
  Building2,
  MapPin,
  Briefcase,
  Home,
  DollarSign,
  Calendar,
  Link2,
  ExternalLink,
  StickyNote,
  Pencil,
  X,
  Star,
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Application, statusConfig, platformLabels } from "@/lib/types/database";

interface ApplicationDetailModalProps {
  application: Application | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit?: () => void;
}

function InfoRow({
  icon: Icon,
  label,
  value,
  isLink,
  href,
  highlight,
}: {
  icon: React.ElementType;
  label: string;
  value?: string | null;
  isLink?: boolean;
  href?: string | null;
  highlight?: boolean;
}) {
  if (!value) return null;

  return (
    <div className="flex items-start gap-3 py-2">
      <Icon className="w-4 h-4 text-[#737373] mt-0.5 shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-xs text-[#737373] mb-0.5">{label}</p>
        {isLink && href ? (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-[#A4D900] hover:text-[#B8E816] flex items-center gap-1 transition-colors"
          >
            {value}
            <ExternalLink className="w-3 h-3" />
          </a>
        ) : (
          <p className={cn("text-sm", highlight ? "text-[#A4D900] font-medium" : "text-white")}>
            {value}
          </p>
        )}
      </div>
    </div>
  );
}

export function ApplicationDetailModal({
  application,
  open,
  onOpenChange,
  onEdit,
}: ApplicationDetailModalProps) {
  if (!application) return null;

  // Formatear fecha
  const formatDate = (dateStr: string) => {
    try {
      return format(new Date(dateStr), "dd MMM yyyy", { locale: es });
    } catch {
      return dateStr;
    }
  };

  // Formatear salario
  const formatSalary = () => {
    if (application.salary_not_specified) return "No especificado";
    if (!application.salary_min && !application.salary_max) return null;

    const currency = application.salary_currency || "USD";
    const period = application.salary_period === "anual" ? "/año" : "/mes";

    if (application.salary_min && application.salary_max) {
      return `$${application.salary_min.toLocaleString()} - $${application.salary_max.toLocaleString()} ${currency}${period}`;
    }
    if (application.salary_min) {
      return `$${application.salary_min.toLocaleString()}+ ${currency}${period}`;
    }
    if (application.salary_max) {
      return `Hasta $${application.salary_max.toLocaleString()} ${currency}${period}`;
    }
    return null;
  };

  // Obtener modalidad
  const getLocationType = () => {
    if (!application.location_type) return null;
    const types: Record<string, string> = {
      remoto: "Remoto",
      presencial: "Presencial",
      hibrido: "Híbrido",
    };
    return types[application.location_type] || application.location_type;
  };

  // Obtener label de plataforma
  const getPlatformLabel = () => {
    if (application.platform === "otro" && application.platform_other) {
      return application.platform_other;
    }
    return platformLabels[application.platform as keyof typeof platformLabels] || application.platform;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#111111] border-[#262626] text-white w-[95vw] max-w-2xl max-h-[90vh] overflow-y-auto p-4 sm:p-6">
        <DialogHeader className="pb-3 sm:pb-4">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#A4D900]/20 shrink-0">
                <Building2 className="w-5 h-5 sm:w-6 sm:h-6 text-[#A4D900]" />
              </div>
              <div className="min-w-0 flex-1">
                <DialogTitle className="text-base sm:text-xl font-bold text-white flex items-center gap-2">
                  {application.is_priority && (
                    <Star className="w-4 h-4 sm:w-5 sm:h-5 text-[#F59E0B] fill-[#F59E0B] shrink-0" />
                  )}
                  <span className="truncate">{application.position_title}</span>
                </DialogTitle>
                <p className="text-sm sm:text-base text-[#A3A3A3] mt-0.5 sm:mt-1 truncate">{application.company_name}</p>
              </div>
            </div>
            <Badge
              variant="outline"
              className={cn(
                "border font-medium shrink-0 self-start text-xs sm:text-sm",
                statusConfig[application.status].className
              )}
            >
              <span
                className={cn(
                  "w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full mr-1.5 sm:mr-2",
                  statusConfig[application.status].dot
                )}
              />
              {statusConfig[application.status].label}
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-4 sm:space-y-6">
          {/* Información Básica */}
          <div>
            <h3 className="text-xs sm:text-sm font-semibold text-[#A4D900] uppercase tracking-wider mb-2 sm:mb-3">
              Información Básica
            </h3>
            <div className="bg-[#1A1A1A] rounded-lg p-3 sm:p-4 space-y-1">
              <InfoRow
                icon={Building2}
                label="Empresa"
                value={application.company_name}
              />
              <InfoRow
                icon={Briefcase}
                label="Puesto"
                value={application.position_title}
              />
              <InfoRow
                icon={Link2}
                label="Plataforma"
                value={getPlatformLabel()}
              />
              <InfoRow
                icon={Calendar}
                label="Fecha de Postulación"
                value={formatDate(application.application_date)}
              />
            </div>
          </div>

          <Separator className="bg-[#262626]" />

          {/* Detalles del Trabajo */}
          <div>
            <h3 className="text-xs sm:text-sm font-semibold text-[#3B82F6] uppercase tracking-wider mb-2 sm:mb-3">
              Detalles del Trabajo
            </h3>
            <div className="bg-[#1A1A1A] rounded-lg p-3 sm:p-4 space-y-1">
              {getLocationType() && (
                <InfoRow
                  icon={Home}
                  label="Modalidad"
                  value={getLocationType()}
                />
              )}
              {application.location_city && (
                <InfoRow
                  icon={MapPin}
                  label="Ciudad"
                  value={application.location_city}
                />
              )}
              {formatSalary() && (
                <InfoRow
                  icon={DollarSign}
                  label="Salario"
                  value={formatSalary()}
                  highlight={!application.salary_not_specified}
                />
              )}
              {application.job_url && (
                <InfoRow
                  icon={ExternalLink}
                  label="URL del Trabajo"
                  value="Ver publicación original"
                  isLink
                  href={application.job_url}
                />
              )}
            </div>
          </div>

          {/* Notas */}
          {application.personal_notes && (
            <>
              <Separator className="bg-[#262626]" />
              <div>
                <h3 className="text-xs sm:text-sm font-semibold text-[#8B5CF6] uppercase tracking-wider mb-2 sm:mb-3">
                  Notas Personales
                </h3>
                <div className="bg-[#1A1A1A] rounded-lg p-3 sm:p-4">
                  <div className="flex items-start gap-3">
                    <StickyNote className="w-4 h-4 text-[#737373] mt-0.5 shrink-0" />
                    <p className="text-sm text-[#A3A3A3] whitespace-pre-wrap">
                      {application.personal_notes}
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Metadatos */}
          <Separator className="bg-[#262626]" />
          <div className="text-[10px] sm:text-xs text-[#525252] flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
            <span>Creada: {formatDate(application.created_at)}</span>
            <span>Actualizada: {formatDate(application.updated_at)}</span>
          </div>
        </div>

        {/* Footer con acciones */}
        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 sm:gap-3 pt-3 sm:pt-4 mt-3 sm:mt-4 border-t border-[#262626]">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="border-[#262626] text-[#A3A3A3] hover:bg-[#1A1A1A] hover:text-white w-full sm:w-auto"
          >
            <X className="w-4 h-4 mr-2" />
            Cerrar
          </Button>
          {onEdit && (
            <Button
              onClick={onEdit}
              className="bg-[#A4D900] text-black hover:bg-[#B8E816] font-semibold w-full sm:w-auto"
            >
              <Pencil className="w-4 h-4 mr-2" />
              Editar
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
