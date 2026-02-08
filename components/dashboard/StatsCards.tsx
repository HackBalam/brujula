"use client";

import { ClipboardList, Mail, Target, Star, TrendingUp, TrendingDown, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useApplicationsContext } from "@/context/ApplicationsContext";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  iconColor: string;
  iconBgColor: string;
  change?: {
    value: string;
    trend: "up" | "down" | "neutral";
    label: string;
  };
  secondaryText?: string;
  secondaryIcon?: React.ElementType;
}

function StatCard({
  title,
  value,
  icon: Icon,
  iconColor,
  iconBgColor,
  change,
  secondaryText,
  secondaryIcon: SecondaryIcon,
}: StatCardProps) {
  return (
    <Card className="bg-[#111111] border-[#262626] p-4 sm:p-6 hover:border-[#A4D900] hover:shadow-[0_0_20px_rgba(164,217,0,0.15),0_8px_16px_rgba(0,0,0,0.3)] transition-all duration-300 group">
      <div className="flex items-start justify-between">
        <div
          className={cn(
            "flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full",
            iconBgColor
          )}
        >
          <Icon className={cn("w-4 h-4 sm:w-5 sm:h-5", iconColor)} />
        </div>
      </div>

      <div className="mt-3 sm:mt-4">
        <p className="text-xs sm:text-sm text-[#A3A3A3]">{title}</p>
        <p className="mt-1 sm:mt-2 text-2xl sm:text-4xl font-bold text-white">{value}</p>
      </div>

      <div className="mt-3 sm:mt-4 flex items-center gap-2 text-xs sm:text-sm">
        {change && (
          <>
            <span
              className={cn(
                "flex items-center gap-1",
                change.trend === "up"
                  ? "text-[#10B981]"
                  : change.trend === "down"
                  ? "text-[#EF4444]"
                  : "text-[#737373]"
              )}
            >
              {change.trend === "up" ? (
                <TrendingUp className="w-4 h-4" />
              ) : change.trend === "down" ? (
                <TrendingDown className="w-4 h-4" />
              ) : null}
              {change.value}
            </span>
            <span className="text-[#737373]">{change.label}</span>
          </>
        )}
        {secondaryText && (
          <span className="flex items-center gap-1 text-[#737373]">
            {SecondaryIcon && <SecondaryIcon className="w-4 h-4" />}
            {secondaryText}
          </span>
        )}
      </div>
    </Card>
  );
}

export function StatsCards() {
  const { applications, loading, getStats } = useApplicationsContext();

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="bg-[#111111] border-[#262626] p-6">
            <div className="flex items-center justify-center h-24">
              <Loader2 className="w-6 h-6 text-[#A4D900] animate-spin" />
            </div>
          </Card>
        ))}
      </div>
    );
  }

  const stats = getStats();

  // Calcular diferencia con mes anterior
  const monthDiff = stats.thisMonth - stats.lastMonth;
  const monthTrend: "up" | "down" | "neutral" =
    monthDiff > 0 ? "up" : monthDiff < 0 ? "down" : "neutral";

  // Contar prioritarias
  const priorityCount = applications.filter((a) => a.is_priority).length;

  const statCards: StatCardProps[] = [
    {
      title: "Total Postulaciones",
      value: stats.total,
      icon: ClipboardList,
      iconColor: "text-[#A4D900]",
      iconBgColor: "bg-[#A4D900]/20",
      change:
        monthDiff !== 0
          ? {
              value: `${monthDiff > 0 ? "+" : ""}${monthDiff}`,
              trend: monthTrend,
              label: "este mes",
            }
          : {
              value: `${stats.thisMonth}`,
              trend: "neutral",
              label: "este mes",
            },
    },
    {
      title: "Respuestas Recibidas",
      value: stats.entrevistas + stats.aceptadas + applications.filter(a => a.status === 'te_contestaron' || a.status === 'rechazada').length,
      icon: Mail,
      iconColor: "text-[#3B82F6]",
      iconBgColor: "bg-[#3B82F6]/20",
      secondaryText:
        stats.total > 0
          ? `de ${stats.total} postulaciones`
          : "Sin postulaciones",
    },
    {
      title: "Entrevistas",
      value: stats.entrevistas,
      icon: Target,
      iconColor: "text-[#F59E0B]",
      iconBgColor: "bg-[#F59E0B]/20",
      secondaryText:
        stats.aceptadas > 0
          ? `${stats.aceptadas} aceptada${stats.aceptadas > 1 ? "s" : ""}`
          : `${stats.pendientes} pendiente${stats.pendientes !== 1 ? "s" : ""}`,
    },
    {
      title: "Prioritarias",
      value: priorityCount,
      icon: Star,
      iconColor: "text-[#8B5CF6]",
      iconBgColor: "bg-[#8B5CF6]/20",
      secondaryText:
        priorityCount > 0
          ? "Postulaciones destacadas"
          : "Marca tus favoritas",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      {statCards.map((stat) => (
        <StatCard key={stat.title} {...stat} />
      ))}
    </div>
  );
}
