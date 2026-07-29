"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

import DashboardTooltip from "./DashboardTooltip";

interface DashboardBarChartProps<T> {
  data: T[];
  xKey: keyof T;
  dataKey: keyof T;
}

export default function DashboardBarChart<T extends Record<string, any>>({
  data,
  xKey,
  dataKey,
}: DashboardBarChartProps<T>) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        margin={{
          top: 10,
          right: 20,
          left: 0,
          bottom: 0,
        }}
      >
        <CartesianGrid vertical={false} strokeDasharray="3 3" />

        <XAxis dataKey={String(xKey)} tickLine={false} axisLine={false} />

        <YAxis tickLine={false} axisLine={false} />

        <Tooltip content={<DashboardTooltip />} />

        <Bar
          dataKey={String(dataKey)}
          radius={8}
          fill="#2563eb"
          animationDuration={800}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
