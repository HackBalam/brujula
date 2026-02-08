"use client";

import { useState, useEffect } from "react";
import {
  Building2,
  MapPin,
  Briefcase,
  Home,
  DollarSign,
  Link2,
  Calendar as CalendarIcon,
  StickyNote,
  Save,
  Loader2,
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useApplicationsContext } from "@/context/ApplicationsContext";
import {
  Application,
  ApplicationStatus,
  statusConfig,
  SalaryCurrency,
  SalaryPeriod,
  LocationType,
} from "@/lib/types/database";

interface EditApplicationModalProps {
  application: Application | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave?: () => void;
}

const platforms = [
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

const currencies = [
  { value: "USD", label: "USD" },
  { value: "MXN", label: "MXN" },
  { value: "EUR", label: "EUR" },
];

const salaryPeriods = [
  { value: "mensual", label: "Mensual" },
  { value: "anual", label: "Anual" },
];

const locationTypes = [
  { value: "remoto", label: "Remoto" },
  { value: "presencial", label: "Presencial" },
  { value: "hibrido", label: "Híbrido" },
];

const allStatuses = [
  { value: "pendiente", label: "Pendiente", description: "Default al crear" },
  { value: "en_revision", label: "En Revisión", description: "Confirmaron recepción" },
  { value: "te_contestaron", label: "Te Contestaron", description: "Primer contacto" },
  { value: "entrevista_programada", label: "Entrevista", description: "Programada o realizada" },
  { value: "aceptada", label: "Aceptada", description: "Oferta aceptada" },
  { value: "rechazada", label: "Rechazada", description: "No continuaron contigo" },
  { value: "descartada_por_mi", label: "Descartada", description: "Tú decidiste no continuar" },
];

export function EditApplicationModal({
  application,
  open,
  onOpenChange,
  onSave,
}: EditApplicationModalProps) {
  const { updateApplication } = useApplicationsContext();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [date, setDate] = useState<Date>();

  const [formData, setFormData] = useState({
    companyName: "",
    positionTitle: "",
    platform: "",
    platformOther: "",
    status: "pendiente" as ApplicationStatus,
    salaryMin: "",
    salaryMax: "",
    salaryCurrency: "USD" as SalaryCurrency,
    salaryPeriod: "mensual" as SalaryPeriod,
    salaryNotSpecified: false,
    locationType: "" as LocationType | "",
    locationCity: "",
    jobUrl: "",
    personalNotes: "",
    isPriority: false,
  });

  // Cargar datos cuando se abre el modal
  useEffect(() => {
    if (application && open) {
      setFormData({
        companyName: application.company_name,
        positionTitle: application.position_title,
        platform: application.platform,
        platformOther: application.platform_other || "",
        status: application.status,
        salaryMin: application.salary_min?.toString() || "",
        salaryMax: application.salary_max?.toString() || "",
        salaryCurrency: application.salary_currency || "USD",
        salaryPeriod: application.salary_period || "mensual",
        salaryNotSpecified: application.salary_not_specified,
        locationType: application.location_type || "",
        locationCity: application.location_city || "",
        jobUrl: application.job_url || "",
        personalNotes: application.personal_notes || "",
        isPriority: application.is_priority,
      });
      setDate(new Date(application.application_date));
      setError(null);
    }
  }, [application, open]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!application) return;

    setIsSubmitting(true);
    setError(null);

    try {
      await updateApplication(application.id, {
        company_name: formData.companyName,
        position_title: formData.positionTitle,
        platform: formData.platform,
        platform_other: formData.platform === "otro" ? formData.platformOther : null,
        application_date: date ? format(date, "yyyy-MM-dd") : application.application_date,
        status: formData.status,
        salary_min: formData.salaryMin ? parseFloat(formData.salaryMin) : null,
        salary_max: formData.salaryMax ? parseFloat(formData.salaryMax) : null,
        salary_currency: formData.salaryCurrency,
        salary_period: formData.salaryPeriod,
        salary_not_specified: formData.salaryNotSpecified,
        location_type: formData.locationType || null,
        location_city: formData.locationCity || null,
        job_url: formData.jobUrl || null,
        personal_notes: formData.personalNotes || null,
        is_priority: formData.isPriority,
      });

      onSave?.();
      onOpenChange(false);
    } catch (err) {
      console.error("Error updating application:", err);
      setError("Error al guardar los cambios. Intenta de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!application) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#111111] border-[#262626] text-white w-[95vw] max-w-2xl max-h-[90vh] p-0">
        <DialogHeader className="p-4 sm:p-6 pb-0">
          <DialogTitle className="text-base sm:text-xl font-bold text-white flex items-center gap-2 sm:gap-3">
            <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#A4D900]/20 shrink-0">
              <Briefcase className="w-4 h-4 sm:w-5 sm:h-5 text-[#A4D900]" />
            </div>
            Editar Postulación
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-160px)] sm:max-h-[calc(90vh-180px)]">
          <form onSubmit={handleSubmit} className="p-4 sm:p-6 pt-3 sm:pt-4 space-y-4 sm:space-y-6">
            {error && (
              <div className="bg-[#EF4444]/10 border border-[#EF4444]/30 rounded-lg p-3 text-sm text-[#EF4444]">
                {error}
              </div>
            )}

            {/* Información Básica */}
            <div className="space-y-3 sm:space-y-4">
              <h3 className="text-xs sm:text-sm font-semibold text-[#A4D900] uppercase tracking-wider">
                Información Básica
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="companyName" className="text-[#A3A3A3]">
                    Empresa <span className="text-[#EF4444]">*</span>
                  </Label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#737373]" />
                    <Input
                      id="companyName"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleInputChange}
                      required
                      className="pl-10 bg-[#1F1F1F] border-[#262626] text-white focus:border-[#A4D900]"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="positionTitle" className="text-[#A3A3A3]">
                    Puesto <span className="text-[#EF4444]">*</span>
                  </Label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#737373]" />
                    <Input
                      id="positionTitle"
                      name="positionTitle"
                      value={formData.positionTitle}
                      onChange={handleInputChange}
                      required
                      className="pl-10 bg-[#1F1F1F] border-[#262626] text-white focus:border-[#A4D900]"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-[#A3A3A3]">Plataforma</Label>
                  <Select
                    value={formData.platform}
                    onValueChange={(value) => handleSelectChange("platform", value)}
                  >
                    <SelectTrigger className="bg-[#1F1F1F] border-[#262626] text-white focus:border-[#A4D900]">
                      <Link2 className="w-4 h-4 mr-2 text-[#737373]" />
                      <SelectValue placeholder="Seleccionar" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1A1A1A] border-[#262626]">
                      {platforms.map((platform) => (
                        <SelectItem
                          key={platform.value}
                          value={platform.value}
                          className="text-[#A3A3A3] focus:bg-[#262626] focus:text-white"
                        >
                          {platform.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-[#A3A3A3]">Estado</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => handleSelectChange("status", value)}
                  >
                    <SelectTrigger className="bg-[#1F1F1F] border-[#262626] text-white focus:border-[#A4D900]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1A1A1A] border-[#262626]">
                      {allStatuses.map((status) => (
                        <SelectItem
                          key={status.value}
                          value={status.value}
                          className="text-[#A3A3A3] focus:bg-[#262626] focus:text-white"
                        >
                          <div className="flex flex-col">
                            <span>{status.label}</span>
                            <span className="text-xs text-[#525252]">{status.description}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-[#A3A3A3]">Fecha de Postulación</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal bg-[#1F1F1F] border-[#262626] hover:bg-[#262626]",
                          !date && "text-[#525252]"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4 text-[#737373]" />
                        {date ? format(date, "PPP", { locale: es }) : "Seleccionar"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-[#1A1A1A] border-[#262626]">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        locale={es}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Campo para "Otro" */}
                {formData.platform === "otro" && (
                  <div className="space-y-2">
                    <Label htmlFor="platformOther" className="text-[#A3A3A3]">
                      Especifica la plataforma
                    </Label>
                    <Input
                      id="platformOther"
                      name="platformOther"
                      value={formData.platformOther}
                      onChange={handleInputChange}
                      className="bg-[#1F1F1F] border-[#262626] text-white focus:border-[#A4D900]"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Detalles del Trabajo */}
            <div className="space-y-3 sm:space-y-4">
              <h3 className="text-xs sm:text-sm font-semibold text-[#3B82F6] uppercase tracking-wider">
                Detalles del Trabajo
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Salario - checkbox "No especificado" */}
                <div className="space-y-2 sm:col-span-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="salaryNotSpecified"
                      name="salaryNotSpecified"
                      checked={formData.salaryNotSpecified}
                      onChange={handleInputChange}
                      className="w-4 h-4 rounded border-[#262626] bg-[#1F1F1F] text-[#A4D900] focus:ring-[#A4D900]"
                    />
                    <Label htmlFor="salaryNotSpecified" className="text-[#A3A3A3]">
                      Salario no especificado
                    </Label>
                  </div>
                </div>

                {!formData.salaryNotSpecified && (
                  <>
                    <div className="space-y-2">
                      <Label className="text-[#A3A3A3]">Salario Mínimo</Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#737373]" />
                        <Input
                          name="salaryMin"
                          value={formData.salaryMin}
                          onChange={handleInputChange}
                          type="number"
                          className="pl-10 bg-[#1F1F1F] border-[#262626] text-white focus:border-[#A4D900]"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-[#A3A3A3]">Salario Máximo</Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#737373]" />
                        <Input
                          name="salaryMax"
                          value={formData.salaryMax}
                          onChange={handleInputChange}
                          type="number"
                          className="pl-10 bg-[#1F1F1F] border-[#262626] text-white focus:border-[#A4D900]"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-[#A3A3A3]">Moneda</Label>
                      <Select
                        value={formData.salaryCurrency}
                        onValueChange={(value) => handleSelectChange("salaryCurrency", value)}
                      >
                        <SelectTrigger className="bg-[#1F1F1F] border-[#262626] text-white focus:border-[#A4D900]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-[#1A1A1A] border-[#262626]">
                          {currencies.map((currency) => (
                            <SelectItem
                              key={currency.value}
                              value={currency.value}
                              className="text-[#A3A3A3] focus:bg-[#262626] focus:text-white"
                            >
                              {currency.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-[#A3A3A3]">Periodo</Label>
                      <Select
                        value={formData.salaryPeriod}
                        onValueChange={(value) => handleSelectChange("salaryPeriod", value)}
                      >
                        <SelectTrigger className="bg-[#1F1F1F] border-[#262626] text-white focus:border-[#A4D900]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-[#1A1A1A] border-[#262626]">
                          {salaryPeriods.map((period) => (
                            <SelectItem
                              key={period.value}
                              value={period.value}
                              className="text-[#A3A3A3] focus:bg-[#262626] focus:text-white"
                            >
                              {period.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                )}

                <div className="space-y-2">
                  <Label className="text-[#A3A3A3]">Modalidad</Label>
                  <Select
                    value={formData.locationType}
                    onValueChange={(value) => handleSelectChange("locationType", value)}
                  >
                    <SelectTrigger className="bg-[#1F1F1F] border-[#262626] text-white focus:border-[#A4D900]">
                      <Home className="w-4 h-4 mr-2 text-[#737373]" />
                      <SelectValue placeholder="Seleccionar" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1A1A1A] border-[#262626]">
                      {locationTypes.map((type) => (
                        <SelectItem
                          key={type.value}
                          value={type.value}
                          className="text-[#A3A3A3] focus:bg-[#262626] focus:text-white"
                        >
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {formData.locationType === "presencial" && (
                  <div className="space-y-2">
                    <Label htmlFor="locationCity" className="text-[#A3A3A3]">
                      Ciudad
                    </Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#737373]" />
                      <Input
                        id="locationCity"
                        name="locationCity"
                        value={formData.locationCity}
                        onChange={handleInputChange}
                        className="pl-10 bg-[#1F1F1F] border-[#262626] text-white focus:border-[#A4D900]"
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="jobUrl" className="text-[#A3A3A3]">
                    URL del Trabajo
                  </Label>
                  <div className="relative">
                    <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#737373]" />
                    <Input
                      id="jobUrl"
                      name="jobUrl"
                      value={formData.jobUrl}
                      onChange={handleInputChange}
                      type="url"
                      className="pl-10 bg-[#1F1F1F] border-[#262626] text-white focus:border-[#A4D900]"
                    />
                  </div>
                </div>

                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="personalNotes" className="text-[#A3A3A3]">
                    Notas Personales
                  </Label>
                  <div className="relative">
                    <StickyNote className="absolute left-3 top-3 w-4 h-4 text-[#737373]" />
                    <Textarea
                      id="personalNotes"
                      name="personalNotes"
                      value={formData.personalNotes}
                      onChange={handleInputChange}
                      rows={2}
                      className="pl-10 bg-[#1F1F1F] border-[#262626] text-white focus:border-[#A4D900] resize-none"
                    />
                  </div>
                </div>

                {/* Marcar como prioritaria */}
                <div className="space-y-2 sm:col-span-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="isPriority"
                      name="isPriority"
                      checked={formData.isPriority}
                      onChange={handleInputChange}
                      className="w-4 h-4 rounded border-[#262626] bg-[#1F1F1F] text-[#A4D900] focus:ring-[#A4D900]"
                    />
                    <Label htmlFor="isPriority" className="text-[#A3A3A3] flex items-center gap-2">
                      <Star className="w-4 h-4 text-[#F59E0B]" />
                      Marcar como Prioritaria
                    </Label>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </ScrollArea>

        {/* Footer con acciones */}
        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 sm:gap-3 p-4 sm:p-6 pt-3 sm:pt-4 border-t border-[#262626]">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="border-[#262626] text-[#A3A3A3] hover:bg-[#1A1A1A] hover:text-white w-full sm:w-auto"
          >
            <X className="w-4 h-4 mr-2" />
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-[#A4D900] text-black hover:bg-[#B8E816] font-semibold w-full sm:w-auto"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Guardando...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Guardar Cambios
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
