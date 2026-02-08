"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Building2,
  MapPin,
  Briefcase,
  Home,
  DollarSign,
  Link2,
  Calendar as CalendarIcon,
  StickyNote,
  ArrowLeft,
  Save,
  Loader2,
  Star,
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Card } from "@/components/ui/card";
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
import { cn } from "@/lib/utils";
import { useWallet } from "@/context/WalletContext";
import { useApplicationsContext } from "@/context/ApplicationsContext";
import type { ApplicationStatus, SalaryCurrency, SalaryPeriod, LocationType } from "@/lib/types/database";

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

export function NewApplicationForm() {
  const router = useRouter();
  const { address } = useWallet();
  const { createApplication } = useApplicationsContext();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [date, setDate] = useState<Date>(new Date());

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

    if (!address) {
      setError("Debes conectar tu wallet para guardar postulaciones");
      return;
    }

    if (!formData.companyName || !formData.positionTitle || !formData.platform) {
      setError("Por favor completa los campos obligatorios");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await createApplication({
        company_name: formData.companyName,
        position_title: formData.positionTitle,
        platform: formData.platform,
        platform_other: formData.platform === "otro" ? formData.platformOther : null,
        application_date: date ? format(date, "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd"),
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

      router.push("/dashboard/postulaciones");
    } catch (err) {
      console.error("Error creating application:", err);
      setError("Error al guardar la postulación. Intenta de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!address) {
    return (
      <Card className="bg-[#111111] border-[#262626] p-8">
        <div className="text-center">
          <p className="text-[#A3A3A3] mb-4">Conecta tu wallet para crear una postulación</p>
          <Button
            onClick={() => router.push("/")}
            className="bg-[#A4D900] text-black hover:bg-[#B8E816]"
          >
            Conectar Wallet
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="bg-[#EF4444]/10 border border-[#EF4444]/30 rounded-lg p-4 text-[#EF4444]">
          {error}
        </div>
      )}

      {/* Información Básica (Obligatoria) */}
      <Card className="bg-[#111111] border-[#262626] p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#A4D900]/20">
            <Briefcase className="w-5 h-5 text-[#A4D900]" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">
              Información Básica
            </h2>
            <p className="text-sm text-[#737373]">
              Campos obligatorios para la postulación
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Nombre de la empresa */}
          <div className="space-y-2">
            <Label htmlFor="companyName" className="text-[#A3A3A3]">
              Nombre de la Empresa <span className="text-[#EF4444]">*</span>
            </Label>
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#737373]" />
              <Input
                id="companyName"
                name="companyName"
                value={formData.companyName}
                onChange={handleInputChange}
                placeholder="Ej: Google, Startup XYZ"
                required
                className="pl-10 bg-[#1F1F1F] border-[#262626] text-white placeholder:text-[#525252] focus:border-[#A4D900] focus:ring-1 focus:ring-[#A4D900]/50"
              />
            </div>
          </div>

          {/* Título del puesto */}
          <div className="space-y-2">
            <Label htmlFor="positionTitle" className="text-[#A3A3A3]">
              Puesto al que Aplicaste <span className="text-[#EF4444]">*</span>
            </Label>
            <div className="relative">
              <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#737373]" />
              <Input
                id="positionTitle"
                name="positionTitle"
                value={formData.positionTitle}
                onChange={handleInputChange}
                placeholder="Ej: Senior Developer, Product Manager"
                required
                className="pl-10 bg-[#1F1F1F] border-[#262626] text-white placeholder:text-[#525252] focus:border-[#A4D900] focus:ring-1 focus:ring-[#A4D900]/50"
              />
            </div>
          </div>

          {/* Plataforma */}
          <div className="space-y-2">
            <Label className="text-[#A3A3A3]">
              Plataforma donde Aplicaste <span className="text-[#EF4444]">*</span>
            </Label>
            <Select
              value={formData.platform}
              onValueChange={(value) => handleSelectChange("platform", value)}
            >
              <SelectTrigger className="bg-[#1F1F1F] border-[#262626] text-white focus:border-[#A4D900] focus:ring-1 focus:ring-[#A4D900]/50">
                <Link2 className="w-4 h-4 mr-2 text-[#737373]" />
                <SelectValue placeholder="Selecciona la plataforma" />
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
                placeholder="Nombre de la plataforma"
                className="bg-[#1F1F1F] border-[#262626] text-white placeholder:text-[#525252] focus:border-[#A4D900] focus:ring-1 focus:ring-[#A4D900]/50"
              />
            </div>
          )}

          {/* Fecha de postulación */}
          <div className="space-y-2">
            <Label className="text-[#A3A3A3]">
              Fecha de Postulación <span className="text-[#EF4444]">*</span>
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal bg-[#1F1F1F] border-[#262626] hover:bg-[#262626] hover:text-white",
                    !date && "text-[#525252]"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4 text-[#737373]" />
                  {date ? (
                    format(date, "PPP", { locale: es })
                  ) : (
                    <span>Selecciona una fecha</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-auto p-0 bg-[#1A1A1A] border-[#262626]"
                align="start"
              >
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(d) => d && setDate(d)}
                  disabled={(d) => d > new Date()}
                  initialFocus
                  locale={es}
                  className="bg-[#1A1A1A] text-white"
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Estado inicial */}
          <div className="space-y-2">
            <Label className="text-[#A3A3A3]">Estado de la Solicitud</Label>
            <Select
              value={formData.status}
              onValueChange={(value) => handleSelectChange("status", value)}
            >
              <SelectTrigger className="bg-[#1F1F1F] border-[#262626] text-white focus:border-[#A4D900] focus:ring-1 focus:ring-[#A4D900]/50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[#1A1A1A] border-[#262626]">
                {allStatuses.map((status) => (
                  <SelectItem
                    key={status.value}
                    value={status.value}
                    className="text-[#A3A3A3] focus:bg-[#262626] focus:text-white cursor-pointer"
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
        </div>
      </Card>

      {/* Información Opcional */}
      <Card className="bg-[#111111] border-[#262626] p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#3B82F6]/20">
            <DollarSign className="w-5 h-5 text-[#3B82F6]" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">
              Detalles Adicionales
            </h2>
            <p className="text-sm text-[#737373]">
              Información opcional pero útil
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Salario - checkbox "No especificado" */}
          <div className="space-y-2 md:col-span-2">
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
                Salario no especificado en la oferta
              </Label>
            </div>
          </div>

          {/* Rango salarial */}
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
                    placeholder="0"
                    type="number"
                    className="pl-10 bg-[#1F1F1F] border-[#262626] text-white placeholder:text-[#525252] focus:border-[#A4D900] focus:ring-1 focus:ring-[#A4D900]/50"
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
                    placeholder="0"
                    type="number"
                    className="pl-10 bg-[#1F1F1F] border-[#262626] text-white placeholder:text-[#525252] focus:border-[#A4D900] focus:ring-1 focus:ring-[#A4D900]/50"
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
                        className="text-[#A3A3A3] focus:bg-[#262626] focus:text-white cursor-pointer"
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
                        className="text-[#A3A3A3] focus:bg-[#262626] focus:text-white cursor-pointer"
                      >
                        {period.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </>
          )}

          {/* Modalidad */}
          <div className="space-y-2">
            <Label className="text-[#A3A3A3]">Modalidad de Trabajo</Label>
            <Select
              value={formData.locationType}
              onValueChange={(value) => handleSelectChange("locationType", value)}
            >
              <SelectTrigger className="bg-[#1F1F1F] border-[#262626] text-white focus:border-[#A4D900] focus:ring-1 focus:ring-[#A4D900]/50">
                <Home className="w-4 h-4 mr-2 text-[#737373]" />
                <SelectValue placeholder="Selecciona la modalidad" />
              </SelectTrigger>
              <SelectContent className="bg-[#1A1A1A] border-[#262626]">
                {locationTypes.map((type) => (
                  <SelectItem
                    key={type.value}
                    value={type.value}
                    className="text-[#A3A3A3] focus:bg-[#262626] focus:text-white cursor-pointer"
                  >
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Ciudad (si es presencial) */}
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
                  placeholder="Ej: Ciudad de México"
                  className="pl-10 bg-[#1F1F1F] border-[#262626] text-white placeholder:text-[#525252] focus:border-[#A4D900] focus:ring-1 focus:ring-[#A4D900]/50"
                />
              </div>
            </div>
          )}

          {/* URL del trabajo */}
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="jobUrl" className="text-[#A3A3A3]">
              Link a la Oferta
            </Label>
            <div className="relative">
              <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#737373]" />
              <Input
                id="jobUrl"
                name="jobUrl"
                value={formData.jobUrl}
                onChange={handleInputChange}
                placeholder="https://linkedin.com/jobs/..."
                type="url"
                className="pl-10 bg-[#1F1F1F] border-[#262626] text-white placeholder:text-[#525252] focus:border-[#A4D900] focus:ring-1 focus:ring-[#A4D900]/50"
              />
            </div>
          </div>

          {/* Notas personales */}
          <div className="space-y-2 md:col-span-2">
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
                placeholder="Ej: Me contactó el reclutador por LinkedIn, Fecha de entrevista: 15 de marzo"
                rows={3}
                className="pl-10 bg-[#1F1F1F] border-[#262626] text-white placeholder:text-[#525252] focus:border-[#A4D900] focus:ring-1 focus:ring-[#A4D900]/50 resize-none"
              />
            </div>
          </div>

          {/* Marcar como prioritaria */}
          <div className="space-y-2 md:col-span-2">
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
            <p className="text-xs text-[#525252] ml-6">
              Las postulaciones prioritarias se destacan en tu lista
            </p>
          </div>
        </div>
      </Card>

      {/* Botones de acción */}
      <div className="flex flex-col-reverse sm:flex-row justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/dashboard")}
          className="border-[#262626] text-[#A3A3A3] hover:bg-[#1A1A1A] hover:text-white hover:border-[#404040]"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Cancelar
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-[#A4D900] text-black hover:bg-[#B8E816] font-semibold shadow-[0_0_20px_rgba(164,217,0,0.4)] hover:shadow-[0_0_30px_rgba(164,217,0,0.5)] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Guardando...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Guardar Postulación
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
