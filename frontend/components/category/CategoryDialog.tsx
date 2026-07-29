"use client";

import { Category } from "@/types/category";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;

  editingCategory: Category | null;

  categories: Category[];

  name: string;
  setName: (value: string) => void;

  parentId: string;
  setParentId: (value: string) => void;

  onSave: () => void;
}

export default function CategoryDialog({
  open,
  onOpenChange,

  editingCategory,

  categories,

  name,
  setName,

  parentId,
  setParentId,

  onSave,
}: CategoryDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {editingCategory ? "Editar Categoría" : "Nueva Categoría"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <Input
            placeholder="Nombre"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <Select
            value={parentId || "none"}
            onValueChange={(value) =>
              setParentId(value === "none" ? "" : (value ?? ""))
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue>
                {parentId
                  ? categories.find(
                      (category) => String(category.id) === parentId,
                    )?.name
                  : "Sin categoría padre"}
              </SelectValue>
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="none">Sin categoría padre</SelectItem>

              {categories
                .filter((category) => category.id !== editingCategory?.id)
                .map((category) => (
                  <SelectItem key={category.id} value={String(category.id)}>
                    {category.name}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex justify-end gap-3 mt-5">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>

          <Button onClick={onSave}>Guardar</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
