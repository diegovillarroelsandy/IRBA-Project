"use client";

import { Database } from "lucide-react";

interface DataTableEmptyProps {
  title?: string;
  description?: string;
}

export default function DataTableEmpty({
  title = "No hay registros",
  description = "No se encontraron datos para mostrar.",
}: DataTableEmptyProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <Database className="h-12 w-12 text-muted-foreground mb-4" />

      <h3 className="text-lg font-semibold">{title}</h3>

      <p className="mt-2 text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
