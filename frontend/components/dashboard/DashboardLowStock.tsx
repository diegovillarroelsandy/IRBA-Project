"use client";

import { Badge } from "@/components/ui/badge";

interface LowStockProduct {
  id: string | number;
  name: string;
  stock: number;
}

interface DashboardLowStockProps {
  products: LowStockProduct[];
}

export default function DashboardLowStock({
  products,
}: DashboardLowStockProps) {
  return (
    <div className="rounded-xl border bg-white shadow-sm">
      <div className="border-b px-6 py-4">
        <h2 className="text-lg font-semibold">Stock bajo</h2>

        <p className="text-sm text-muted-foreground">
          Productos que necesitan reposición
        </p>
      </div>

      <div className="divide-y">
        {products.length === 0 ? (
          <div className="px-6 py-8 text-center text-sm text-muted-foreground">
            No hay productos con stock bajo.
          </div>
        ) : (
          products.map((product) => (
            <div
              key={product.id}
              className="flex items-center justify-between px-6 py-4"
            >
              <div>
                <p className="font-medium">{product.name}</p>

                <p className="text-sm text-muted-foreground">
                  Stock actual: {product.stock}
                </p>
              </div>

              <Badge variant="destructive">Bajo</Badge>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
