"use client";

import { ReactNode } from "react";

interface DashboardChartCardProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
}

export default function DashboardChartCard({
  title,
  subtitle,
  children,
}: DashboardChartCardProps) {
  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>

        {subtitle && (
          <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
        )}
      </div>

      <div className="h-[320px] w-full">{children}</div>
    </div>
  );
}
