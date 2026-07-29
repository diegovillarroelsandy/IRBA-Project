"use client";

import { Boxes, FolderTree, Package, Users } from "lucide-react";
import DashboardCard from "@/components/dashboard/DashboardCard";
import DashboardChartCard from "@/components/dashboard/DashboardChartCard";
import DashboardBarChart from "@/components/dashboard/DashboardBarChart";
import DashboardPieChart from "@/components/dashboard/DashboardPieChart";
import DashboardRecentMovements from "@/components/dashboard/DashboardRecentMovements";
import { MovementType } from "@/types/stock";
import DashboardLowStock from "@/components/dashboard/DashboardLowStock";

export default function DashboardPage() {
  interface RecentMovement {
    id: number;
    product: string;
    type: MovementType;
    quantity: number;
    date: string;
  }
  const dashboardData = {
    kpis: {
      products: 128,
      categories: 12,
      users: 5,
      stock: 840,
    },

    productsByCategory: [
      {
        category: "Escritorios",
        total: 38,
      },
      {
        category: "Sillas",
        total: 27,
      },
      {
        category: "Archivadores",
        total: 19,
      },
      {
        category: "Mesas",
        total: 15,
      },
      {
        category: "Estanterías",
        total: 29,
      },
    ],

    featuredProducts: [
      {
        name: "Destacados",
        value: 36,
      },
      {
        name: "Normales",
        value: 92,
      },
    ],
    recentMovements: [
      {
        id: 1,
        product: "Escritorio Ejecutivo",
        type: MovementType.IN,
        quantity: 12,
        date: "Hace 5 min",
      },
      {
        id: 2,
        product: "Archivador Metálico",
        type: MovementType.OUT,
        quantity: 3,
        date: "Hace 18 min",
      },
      {
        id: 3,
        product: "Mesa Industrial",
        type: MovementType.IN,
        quantity: 8,
        date: "Hace 1 hora",
      },
      {
        id: 4,
        product: "Silla Operativa",
        type: MovementType.OUT,
        quantity: 2,
        date: "Hace 3 horas",
      },
    ] satisfies RecentMovement[],
    lowStock: [
      {
        id: 1,
        name: "Silla Operativa",
        stock: 2,
      },
      {
        id: 2,
        name: "Archivador Metálico",
        stock: 3,
      },
      {
        id: 3,
        name: "Mesa Ejecutiva",
        stock: 1,
      },
    ],
  };

  return (
    <main className="space-y-8 p-6">
      <div>
        <h1 className="text-4xl font-bold">Dashboard</h1>

        <p className="text-muted-foreground mt-2">
          Resumen general del sistema ERP.
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <DashboardCard
          title="Productos"
          value={dashboardData.kpis.products}
          description="Productos registrados"
          icon={<Package size={28} />}
          color="blue"
        />
        <DashboardCard
          title="Categorías"
          value={dashboardData.kpis.categories}
          description="Categorías activas"
          icon={<FolderTree size={28} />}
          color="orange"
        />
        <DashboardCard
          title="Usuarios"
          value={dashboardData.kpis.users}
          description="Usuarios registrados"
          icon={<Users size={28} />}
          color="violet"
        />
        <DashboardCard
          title="Stock Total"
          value={dashboardData.kpis.stock}
          description="Unidades disponibles"
          icon={<Boxes size={28} />}
          color="green"
        />
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <DashboardChartCard
          title="Productos por categoría"
          subtitle="Distribución del catálogo"
        >
          <DashboardBarChart
            data={dashboardData.productsByCategory}
            xKey="category"
            dataKey="total"
          />
        </DashboardChartCard>
        <DashboardChartCard
          title="Productos destacados"
          subtitle="Productos destacados vs normales"
        >
          <DashboardPieChart
            data={dashboardData.featuredProducts}
            nameKey="name"
            dataKey="value"
          />
        </DashboardChartCard>
      </div>
      <DashboardRecentMovements movements={dashboardData.recentMovements} />
      <DashboardLowStock products={dashboardData.lowStock} />
    </main>
  );
}
