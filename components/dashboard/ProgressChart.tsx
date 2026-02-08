"use client";

import { useMemo } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useApplicationsContext } from "@/context/ApplicationsContext";

const monthNames = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#1A1A1A] border border-[#A4D900] rounded-lg p-3 shadow-[0_0_10px_rgba(164,217,0,0.2)]">
        <p className="text-white font-medium">{label}</p>
        <p className="text-[#A4D900]">{payload[0].value} postulaciones</p>
      </div>
    );
  }
  return null;
}

export function ProgressChart() {
  const { applications, loading } = useApplicationsContext();

  // Calculate monthly data from real applications
  const chartData = useMemo(() => {
    const currentYear = new Date().getFullYear();

    // Initialize all months with 0
    const monthlyData = monthNames.map((month, index) => ({
      month,
      monthIndex: index,
      postulaciones: 0,
    }));

    // Count applications per month
    applications.forEach((app) => {
      const appDate = new Date(app.application_date);
      if (appDate.getFullYear() === currentYear) {
        const monthIndex = appDate.getMonth();
        monthlyData[monthIndex].postulaciones += 1;
      }
    });

    return monthlyData;
  }, [applications]);

  if (loading) {
    return (
      <Card className="bg-[#111111] border-[#262626] p-4 sm:p-6 lg:col-span-2">
        <div className="flex items-center justify-center h-[300px]">
          <Loader2 className="w-6 h-6 text-[#A4D900] animate-spin" />
        </div>
      </Card>
    );
  }

  return (
    <Card className="bg-[#111111] border-[#262626] p-4 sm:p-6 lg:col-span-2">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h2 className="text-lg font-bold text-white">Postulaciones por Mes</h2>
        <div className="flex items-center gap-3">
          <span className="text-sm text-[#737373]">{new Date().getFullYear()}</span>
        </div>
      </div>

      <div className="h-[250px] sm:h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorPostulaciones" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#A4D900" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#A4D900" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#262626" vertical={false} />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#737373", fontSize: 12 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#737373", fontSize: 12 }}
              allowDecimals={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="postulaciones"
              stroke="#A4D900"
              strokeWidth={3}
              fill="url(#colorPostulaciones)"
              dot={{ fill: "#A4D900", stroke: "#FFFFFF", strokeWidth: 2, r: 4 }}
              activeDot={{
                fill: "#A4D900",
                stroke: "#FFFFFF",
                strokeWidth: 2,
                r: 6,
                style: { filter: "drop-shadow(0 0 6px rgba(164, 217, 0, 0.5))" },
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
