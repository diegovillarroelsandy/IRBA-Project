"use client";

import { Badge } from "@/components/ui/badge";
import { MovementType } from "@/types/stock";
interface Movement {
  id: number;
  product: string;
  type: MovementType;
  quantity: number;
  date: string;
}

interface DashboardRecentMovementsProps {
  movements: Movement[];
}

export default function DashboardRecentMovements({
  movements,
}: DashboardRecentMovementsProps) {
  return (
    <div className="rounded-xl border bg-white shadow-sm">
      <div className="border-b px-6 py-4">
        <h2 className="text-lg font-semibold">Últimos movimientos</h2>

        <p className="text-sm text-muted-foreground">
          Actividad reciente del inventario
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/30">
            <tr>
              <th className="px-6 py-3 text-left">Producto</th>

              <th className="px-6 py-3 text-left">Tipo</th>

              <th className="px-6 py-3 text-left">Cantidad</th>

              <th className="px-6 py-3 text-left">Fecha</th>
            </tr>
          </thead>

          <tbody>
            {movements.map((movement) => (
              <tr key={movement.id} className="border-t">
                <td className="px-6 py-4">{movement.product}</td>

                <td className="px-6 py-4">
                  <Badge
                    variant={
                      movement.type === MovementType.IN
                        ? "default"
                        : "destructive"
                    }
                  >
                    {movement.type === MovementType.IN ? "Entrada" : "Salida"}
                  </Badge>
                </td>

                <td
                  className={`px-6 py-4 font-semibold ${
                    movement.type === MovementType.IN
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {movement.type === MovementType.IN
                    ? `+${movement.quantity}`
                    : `-${movement.quantity}`}
                </td>

                <td className="px-6 py-4 text-muted-foreground">
                  {movement.date}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
