"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

interface DataTableToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;

  buttonText?: string;
  onCreate?: () => void;
}

export default function DataTableToolbar({
  search,
  onSearchChange,
  buttonText,
  onCreate,
}: DataTableToolbarProps) {
  return (
    <div className="flex items-center justify-between gap-4 mb-4">
      <div className="relative w-full max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />

        <Input
          placeholder="Buscar..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9"
        />
      </div>

      {onCreate && <Button onClick={onCreate}>{buttonText ?? "Nuevo"}</Button>}
    </div>
  );
}
