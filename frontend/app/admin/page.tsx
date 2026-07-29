"use client";

import { Boxes, FolderTree, Package, Users } from "lucide-react";
import DashboardCard from "@/components/dashboard/DashboardCard";
import DashboardChartCard from "@/components/dashboard/DashboardChartCard";
import DashboardBarChart from "@/components/dashboard/DashboardBarChart";
import DashboardPieChart from "@/components/dashboard/DashboardPieChart";
import DashboardRecentMovements from "@/components/dashboard/DashboardRecentMovements";
import { MovementType } from "@/types/stock";
import DashboardLowStock from "@/components/dashboard/DashboardLowStock";
import { useCallback, useEffect, useState } from "react";
import { adminApi } from "@/lib/admin-api";
export default function DashboardPage() {
  interface RecentMovement {
    id: number;
    product: string;
    type: MovementType;
    quantity: number;
    date: string;
  }
  interface DashboardData {
    kpis: {
      products: number;
      categories: number;
      users: number;
      stock: number;
    };

    productsByCategory: any[];
    featuredProducts: any[];
    recentMovements: any[];
    lowStock: any[];
  }
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null,
  );
  const loadDashboard = useCallback(async () => {
    const { data } = await adminApi.get("/dashboard");
    setDashboardData(data);
  }, []);
  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  if (!dashboardData) {
    return <main className="max-w-7xl mx-auto p-6">Cargando dashboard...</main>;
  }

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
