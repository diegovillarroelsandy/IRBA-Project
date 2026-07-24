"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "../ui/textarea";
import { Checkbox } from "../ui/checkbox";

interface ProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;

  name: string;
  setName: (value: string) => void;

  description: string;
  setDescription: (value: string) => void;

  price: string;
  setPrice: (value: string) => void;

  stock: string;
  setStock: (value: string) => void;

  categoryId: string;
  setCategoryId: (value: string) => void;

  categories: any[];

  isFeatured: boolean;
  setIsFeatured: (value: boolean) => void;

  isOnSale: boolean;
  setIsOnSale: (value: boolean) => void;

  setFile: (file: File | null) => void;

  uploading: boolean;

  editingProduct: any;

  createProduct: () => void;
  updateProduct: () => void;
}

export default function ProductDialog({
  open,
  onOpenChange,

  name,
  setName,

  description,
  setDescription,

  price,
  setPrice,

  stock,
  setStock,

  categoryId,
  setCategoryId,

  categories,

  isFeatured,
  setIsFeatured,

  isOnSale,
  setIsOnSale,

  setFile,

  uploading,

  editingProduct,

  createProduct,
  updateProduct,
}: ProductDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {editingProduct ? "Editar Producto" : "Nuevo Producto"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Input
            placeholder="Nombre"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <Textarea
            placeholder="Descripción"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded-md border p-2 min-h-24"
          />

          <Input
            placeholder="Precio"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />

          <Input
            placeholder="Stock"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
          />

          <Select
            value={categoryId}
            onValueChange={(value) => {
              setCategoryId(value ?? "");
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue>
                {categoryId
                  ? categories.find(
                      (category) => String(category.id) === categoryId,
                    )?.name
                  : "Seleccione categoría"}
              </SelectValue>
            </SelectTrigger>

            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.id} value={String(category.id)}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex gap-6">
            <Checkbox
              checked={isFeatured}
              onCheckedChange={(value) => setIsFeatured(Boolean(value))}
            />
            <label>Destacado</label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={isOnSale}
                onChange={(e) => setIsOnSale(e.target.checked)}
              />
              Oferta
            </label>
          </div>

          <Input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          />
        </div>

        <div className="flex justify-end gap-3 mt-5">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>

          <Button
            disabled={uploading}
            onClick={() => (editingProduct ? updateProduct() : createProduct())}
          >
            {uploading ? "Subiendo..." : "Guardar"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
