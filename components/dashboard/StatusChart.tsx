"use client";

import { useMemo } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useApplicationsContext } from "@/context/ApplicationsContext";
import { statusConfig, ApplicationStatus } from "@/lib/types/database";

const statusColors: Record<ApplicationStatus, string> = {
  pendiente: "#FCD34D",
  en_revision: "#60A5FA",
  te_contestaron: "#A78BFA",
  entrevista_programada: "#34D399",
  aceptada: "#A4D900",
  rechazada: "#F87171",
  descartada_por_mi: "#9CA3AF",
};

export function StatusChart() {
  const { applications, loading } = useApplicationsContext();

  // Calculate status data from real applications
  const { chartData, total } = useMemo(() => {
    const statusCounts: Record<string, number> = {};

    applications.forEach((app) => {
      statusCounts[app.status] = (statusCounts[app.status] || 0) + 1;
    });

    const data = Object.entries(statusCounts)
      .filter(([, value]) => value > 0)
      .map(([status, value]) => ({
        name: statusConfig[status as ApplicationStatus]?.label || status,
        value,
        color: statusColors[status as ApplicationStatus] || "#737373",
      }));

    const totalCount = data.reduce((sum, item) => sum + item.value, 0);

    return { chartData: data, total: totalCount };
  }, [applications]);

  if (loading) {
    return (
      <Card className="bg-[#111111] border-[#262626] p-4 sm:p-6">
        <div className="flex items-center justify-center h-[300px]">
          <Loader2 className="w-6 h-6 text-[#A4D900] animate-spin" />
        </div>
      </Card>
    );
  }

  if (chartData.length === 0) {
    return (
      <Card className="bg-[#111111] border-[#262626] p-4 sm:p-6">
        <h2 className="text-lg font-bold text-white mb-4">
          Estado de Postulaciones
        </h2>
        <div className="flex items-center justify-center h-[250px] text-[#737373]">
          <p>No hay postulaciones aún</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="bg-[#111111] border-[#262626] p-4 sm:p-6">
      <h2 className="text-lg font-bold text-white mb-4">
        Estado de Postulaciones
      </h2>

      <div className="flex flex-col items-center">
        {/* Chart */}
        <div className="h-[180px] w-full relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={75}
                paddingAngle={3}
                dataKey="value"
                stroke="none"
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color}
                    style={{
                      filter: `drop-shadow(0 0 4px ${entry.color}40)`,
                    }}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          {/* Center label */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-3xl font-bold text-white">{total}</span>
            <span className="text-xs text-[#737373]">Total</span>
          </div>
        </div>

        {/* Custom Legend */}
        <div className="w-full mt-4 space-y-2">
          {chartData.map((entry, index) => (
            <div
              key={`legend-${index}`}
              className="flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-full shrink-0"
                  style={{
                    backgroundColor: entry.color,
                    boxShadow: `0 0 6px ${entry.color}40`,
                  }}
                />
                <span className="text-sm text-[#A3A3A3]">{entry.name}</span>
              </div>
              <span className="text-sm font-medium text-white">{entry.value}</span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
