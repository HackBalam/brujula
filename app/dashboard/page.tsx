"use client";

import {
  DashboardLayout,
  DashboardHeader,
  StatsCards,
  ApplicationsTable,
  ProgressChart,
  StatusChart,
  PremiumBanner,
} from "@/components/dashboard";

export default function DashboardPage() {
  return (
    <DashboardLayout>
      {/* Header */}
      <DashboardHeader userName="Daniel" />

      {/* Stats Cards */}
      <section className="mb-8">
        <StatsCards />
      </section>

      {/* Applications Table */}
      <section className="mb-8">
        <ApplicationsTable />
      </section>

      {/* Charts */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <ProgressChart />
        <StatusChart />
      </section>

      {/* Premium Banner */}
      <section className="mb-8">
        <PremiumBanner />
      </section>
    </DashboardLayout>
  );
}
