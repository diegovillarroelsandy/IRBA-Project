"use client";

import { useCallback, useEffect, useState } from "react";

import { adminApi } from "@/lib/admin-api";

import DataTable from "@/components/common/DataTable";
import { Badge } from "@/components/ui/badge";

import { StockMovement } from "@/types/stock";

export default function AdminStockPage() {
  const [movements, setMovements] = useState<StockMovement[]>([]);

  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");

  const [page, setPage] = useState(1);

  const [pageSize, setPageSize] = useState(10);

  const [total, setTotal] = useState(0);

  const [totalPages, setTotalPages] = useState(1);

  const loadMovements = useCallback(async () => {
    try {
      setLoading(true);

      const { data } = await adminApi.get("/stock", {
        params: {
          page,
          limit: pageSize,
          search,
        },
      });
      console.log(data);
      setMovements(Array.isArray(data?.data) ? data.data : []);

      setTotal(data.total);

      setTotalPages(data.totalPages);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, search]);
  useEffect(() => {
    loadMovements();
  }, [loadMovements]);
  const columns = [
    {
      key: "product",
      header: "Producto",
      render: (movement: StockMovement) => movement.product.name,
    },

    {
      key: "type",
      header: "Tipo",
      render: (movement: StockMovement) => (
        <Badge variant={movement.type === "in" ? "default" : "destructive"}>
          {movement.type === "in" ? "Entrada" : "Salida"}
        </Badge>
      ),
    },

    {
      key: "quantity",
      header: "Cantidad",
    },

    {
      key: "reason",
      header: "Motivo",
    },

    {
      key: "createdAt",
      header: "Fecha",
      render: (movement: StockMovement) =>
        new Date(movement.createdAt).toLocaleString(),
    },
  ];
  return (
    <main className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Movimientos de Inventario</h1>

      <DataTable
        data={movements}
        columns={columns}
        loading={loading}
        toolbar={{
          search,
          onSearchChange: setSearch,
        }}
        pagination={{
          page,
          totalPages,
          total,
          pageSize,
          onPageChange: setPage,
          onPageSizeChange: () => {},
        }}
        emptyState={{
          title: "Sin movimientos",
          description: "Todavía no existen movimientos registrados.",
        }}
      />
    </main>
  );
}
