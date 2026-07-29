"use client";

import { ResponsiveContainer, PieChart, Pie, Tooltip, Legend } from "recharts";

interface DashboardPieChartProps<T> {
  data: (T & { fill?: string })[];
  dataKey: keyof T;
  nameKey: keyof T;
}

const COLORS = [
  "#2563eb",
  "#22c55e",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#06b6d4",
];

export default function DashboardPieChart<T extends Record<string, any>>({
  data,
  dataKey,
  nameKey,
}: DashboardPieChartProps<T>) {
  const chartData = data.map((item, index) => ({
    ...item,
    fill: COLORS[index % COLORS.length],
  }));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={chartData}
          dataKey={String(dataKey)}
          nameKey={String(nameKey)}
          outerRadius={110}
          label
          animationDuration={900}
        />

        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}
