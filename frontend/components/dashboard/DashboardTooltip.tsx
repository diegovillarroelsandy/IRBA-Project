"use client";

interface Props {
  active?: boolean;
  payload?: any[];
  label?: string;
}

export default function DashboardTooltip({ active, payload, label }: Props) {
  if (!active || !payload?.length) {
    return null;
  }

  return (
    <div
      className="
      rounded-lg
      border
      bg-white
      px-4
      py-3
      shadow-lg
    "
    >
      <p className="font-semibold">{label}</p>

      <p className="text-sm text-muted-foreground">Total: {payload[0].value}</p>
    </div>
  );
}
