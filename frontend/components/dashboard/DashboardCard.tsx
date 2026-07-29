"use client";

import { ReactNode } from "react";

interface DashboardCardProps {
  title: string;
  value: number;
  description: string;
  icon: ReactNode;
  color: "blue" | "green" | "violet" | "orange";
}

const colorStyles = {
  blue: {
    bg: "bg-blue-100",
    text: "text-blue-600",
  },

  green: {
    bg: "bg-green-100",
    text: "text-green-600",
  },

  violet: {
    bg: "bg-violet-100",
    text: "text-violet-600",
  },

  orange: {
    bg: "bg-orange-100",
    text: "text-orange-600",
  },
};

export default function DashboardCard({
  title,
  value,
  description,
  icon,
  color,
}: DashboardCardProps) {
  const styles = colorStyles[color];

  return (
    <div
      className="
        rounded-xl
        border
        bg-white
        p-6
        shadow-sm
        transition
        hover:-translate-y-1
        hover:shadow-md
      "
    >
      <div className="flex items-center justify-between">
        <div
          className={`
            flex
            h-12
            w-12
            items-center
            justify-center
            rounded-xl
            ${styles.bg}
            ${styles.text}
          `}
        >
          {icon}
        </div>
      </div>

      <div className="mt-5">
        <p className="text-sm text-muted-foreground">{title}</p>

        <h2 className="mt-2 text-4xl font-bold tracking-tight">{value}</h2>

        <p className="mt-2 text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}
