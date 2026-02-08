export type ApplicationStatus =
  | 'pendiente'
  | 'en_revision'
  | 'te_contestaron'
  | 'entrevista_programada'
  | 'rechazada'
  | 'aceptada'
  | 'descartada_por_mi';

export type Platform =
  | 'linkedin'
  | 'indeed'
  | 'computrabajo'
  | 'occ_mundial'
  | 'glassdoor'
  | 'sitio_empresa'
  | 'email_directo'
  | 'referido'
  | 'otro';

export type SalaryCurrency = 'USD' | 'MXN' | 'EUR';
export type SalaryPeriod = 'mensual' | 'anual';
export type LocationType = 'remoto' | 'presencial' | 'hibrido';
export type FileType = 'cv' | 'carta_presentacion' | 'screenshot' | 'otro';

export interface Application {
  id: string;
  wallet_address: string;
  company_name: string;
  position_title: string;
  platform: string;
  platform_other: string | null;
  application_date: string;
  status: ApplicationStatus;
  salary_min: number | null;
  salary_max: number | null;
  salary_currency: SalaryCurrency | null;
  salary_period: SalaryPeriod | null;
  salary_not_specified: boolean;
  location_type: LocationType | null;
  location_city: string | null;
  job_url: string | null;
  personal_notes: string | null;
  is_priority: boolean;
  created_at: string;
  updated_at: string;
}

export interface ApplicationTimeline {
  id: string;
  application_id: string;
  old_status: ApplicationStatus | null;
  new_status: ApplicationStatus;
  notes: string | null;
  changed_at: string;
}

export interface ApplicationAttachment {
  id: string;
  application_id: string;
  file_type: FileType;
  file_name: string;
  file_url: string;
  created_at: string;
}

export interface ApplicationInsert {
  wallet_address: string;
  company_name: string;
  position_title: string;
  platform: string;
  platform_other?: string | null;
  application_date?: string;
  status?: ApplicationStatus;
  salary_min?: number | null;
  salary_max?: number | null;
  salary_currency?: SalaryCurrency | null;
  salary_period?: SalaryPeriod | null;
  salary_not_specified?: boolean;
  location_type?: LocationType | null;
  location_city?: string | null;
  job_url?: string | null;
  personal_notes?: string | null;
  is_priority?: boolean;
}

export interface ApplicationUpdate {
  company_name?: string;
  position_title?: string;
  platform?: string;
  platform_other?: string | null;
  application_date?: string;
  status?: ApplicationStatus;
  salary_min?: number | null;
  salary_max?: number | null;
  salary_currency?: SalaryCurrency | null;
  salary_period?: SalaryPeriod | null;
  salary_not_specified?: boolean;
  location_type?: LocationType | null;
  location_city?: string | null;
  job_url?: string | null;
  personal_notes?: string | null;
  is_priority?: boolean;
}

// Database types for Supabase
export interface Database {
  public: {
    Tables: {
      applications: {
        Row: Application;
        Insert: ApplicationInsert;
        Update: ApplicationUpdate;
        Relationships: [
          {
            foreignKeyName: "applications_wallet_address_fkey";
            columns: ["wallet_address"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["wallet_address"];
          }
        ];
      };
      application_timeline: {
        Row: ApplicationTimeline;
        Insert: Omit<ApplicationTimeline, 'id' | 'changed_at'>;
        Update: Partial<Omit<ApplicationTimeline, 'id'>>;
        Relationships: [
          {
            foreignKeyName: "application_timeline_application_id_fkey";
            columns: ["application_id"];
            isOneToOne: false;
            referencedRelation: "applications";
            referencedColumns: ["id"];
          }
        ];
      };
      application_attachments: {
        Row: ApplicationAttachment;
        Insert: Omit<ApplicationAttachment, 'id' | 'created_at'>;
        Update: Partial<Omit<ApplicationAttachment, 'id'>>;
        Relationships: [
          {
            foreignKeyName: "application_attachments_application_id_fkey";
            columns: ["application_id"];
            isOneToOne: false;
            referencedRelation: "applications";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: {};
    Functions: {};
    Enums: {
      application_status: ApplicationStatus;
      platform_type: Platform;
      salary_currency: SalaryCurrency;
      salary_period: SalaryPeriod;
      location_type: LocationType;
      file_type: FileType;
    };
    CompositeTypes: {};
  };
}

// Helper para labels de estado en español
export const statusLabels: Record<ApplicationStatus, string> = {
  pendiente: 'Pendiente',
  en_revision: 'En Revisión',
  te_contestaron: 'Te Contestaron',
  entrevista_programada: 'Entrevista Programada',
  rechazada: 'Rechazada',
  aceptada: 'Aceptada',
  descartada_por_mi: 'Descartada por Mí',
};

// Helper para labels de plataforma en español
export const platformLabels: Record<Platform, string> = {
  linkedin: 'LinkedIn',
  indeed: 'Indeed',
  computrabajo: 'Computrabajo',
  occ_mundial: 'OCC Mundial',
  glassdoor: 'Glassdoor',
  sitio_empresa: 'Sitio de la Empresa',
  email_directo: 'Email Directo',
  referido: 'Referido',
  otro: 'Otro',
};

// Configuración visual de estados
export const statusConfig: Record<ApplicationStatus, { label: string; dot: string; className: string }> = {
  pendiente: {
    label: 'Pendiente',
    dot: 'bg-[#FCD34D]',
    className: 'bg-[#FEF3C7]/10 border-[#F59E0B]/30 text-[#FCD34D] hover:bg-[#FEF3C7]/20',
  },
  en_revision: {
    label: 'En Revisión',
    dot: 'bg-[#60A5FA]',
    className: 'bg-[#DBEAFE]/10 border-[#3B82F6]/30 text-[#60A5FA] hover:bg-[#DBEAFE]/20',
  },
  te_contestaron: {
    label: 'Te Contestaron',
    dot: 'bg-[#A78BFA]',
    className: 'bg-[#EDE9FE]/10 border-[#8B5CF6]/30 text-[#A78BFA] hover:bg-[#EDE9FE]/20',
  },
  entrevista_programada: {
    label: 'Entrevista',
    dot: 'bg-[#34D399]',
    className: 'bg-[#D1FAE5]/10 border-[#10B981]/30 text-[#34D399] hover:bg-[#D1FAE5]/20',
  },
  rechazada: {
    label: 'Rechazada',
    dot: 'bg-[#F87171]',
    className: 'bg-[#FEE2E2]/10 border-[#EF4444]/30 text-[#F87171] hover:bg-[#FEE2E2]/20',
  },
  aceptada: {
    label: 'Aceptada',
    dot: 'bg-[#A4D900]',
    className: 'bg-[#A4D900]/10 border-[#A4D900]/30 text-[#A4D900] hover:bg-[#A4D900]/20',
  },
  descartada_por_mi: {
    label: 'Descartada',
    dot: 'bg-[#9CA3AF]',
    className: 'bg-[#F3F4F6]/10 border-[#9CA3AF]/30 text-[#9CA3AF] hover:bg-[#F3F4F6]/20',
  },
};
