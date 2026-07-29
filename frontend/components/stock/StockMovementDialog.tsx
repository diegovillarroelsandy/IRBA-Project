"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { adminApi } from "@/lib/admin-api";
import { toast } from "sonner";

import { Product } from "@/types/product";

interface StockMovementDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product | null;
  onSuccess?: () => void;
}

export default function StockMovementDialog({
  open,
  onOpenChange,
  product,
  onSuccess,
}: StockMovementDialogProps) {
  const [type, setType] = useState("in");
  const [quantity, setQuantity] = useState("");
  const [reason, setReason] = useState("");

  async function createMovement() {
    if (!product) return;

    try {
      await adminApi.post("/stock", {
        productId: product.id,
        type,
        quantity: Number(quantity),
        reason,
      });

      toast.success("Movimiento registrado correctamente");

      setQuantity("");
      setReason("");

      onOpenChange(false);

      onSuccess?.();
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ?? "No se pudo registrar el movimiento",
      );
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Registrar movimiento</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground">Producto</p>

            <p className="font-medium">{product?.name}</p>
          </div>

          <Select
            value={type}
            onValueChange={(value) => setType(value ?? "IN")}
          >
            <SelectTrigger className="w-full">
              <SelectValue>{type === "in" ? "Entrada" : "Salida"}</SelectValue>
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="in">Entrada</SelectItem>

              <SelectItem value="out">Salida</SelectItem>
            </SelectContent>
          </Select>

          <Input
            type="number"
            placeholder="Cantidad"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />

          <Textarea
            placeholder="Motivo del movimiento"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>

            <Button onClick={createMovement}>Guardar</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
