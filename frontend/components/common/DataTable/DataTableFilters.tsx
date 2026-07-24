"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Category } from "./types";

interface DataTableFiltersProps {
  categories: Category[];

  selectedCategory: string;
  onCategoryChange: (value: string) => void;

  featuredFilter: string;
  onFeaturedChange: (value: string) => void;

  onSaleFilter: string;
  onSaleChange: (value: string) => void;
}

export default function DataTableFilters({
  categories,

  selectedCategory,
  onCategoryChange,

  featuredFilter,
  onFeaturedChange,

  onSaleFilter,
  onSaleChange,
}: DataTableFiltersProps) {
  return (
    <div className="flex flex-wrap gap-3">
      {/* Categorías */}
      <Select
        value={selectedCategory}
        onValueChange={(value) => onCategoryChange(value ?? "all")}
      >
        <SelectTrigger className="w-56">
          <SelectValue>
            {selectedCategory === "all"
              ? "Todas las categorías"
              : categories.find(
                  (category) => String(category.id) === selectedCategory,
                )?.name}
          </SelectValue>
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="all">Todas las categorías</SelectItem>

          {categories.map((category) => (
            <SelectItem key={category.id} value={String(category.id)}>
              {category.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Destacado */}
      <Select
        value={featuredFilter}
        onValueChange={(value) => onFeaturedChange(value ?? "all")}
      >
        <SelectTrigger className="w-40">
          <SelectValue>
            {featuredFilter === "all"
              ? "Destacado"
              : featuredFilter === "true"
                ? "Sí"
                : "No"}
          </SelectValue>
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="all">Destacado: Todos</SelectItem>

          <SelectItem value="true">Sí</SelectItem>

          <SelectItem value="false">No</SelectItem>
        </SelectContent>
      </Select>

      {/* Oferta */}
      <Select
        value={onSaleFilter}
        onValueChange={(value) => onSaleChange(value ?? "all")}
      >
        <SelectTrigger className="w-40">
          <SelectValue>
            {onSaleFilter === "all"
              ? "Oferta"
              : onSaleFilter === "true"
                ? "Sí"
                : "No"}
          </SelectValue>
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="all">Oferta: Todos</SelectItem>

          <SelectItem value="true">Sí</SelectItem>

          <SelectItem value="false">No</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
