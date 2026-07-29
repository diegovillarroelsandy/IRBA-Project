"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard } from "lucide-react";
import { Button } from "../ui/button";
export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  function logout() {
    localStorage.removeItem("token");
    router.push("/login");
  }

  return (
    <aside className="w-64 min-h-screen bg-gray-900 text-white flex flex-col">
      <div className="p-6 border-b border-gray-700">
        <h1 className="text-2xl font-bold">Furniture</h1>

        <p className="text-sm text-gray-400">Admin Panel</p>
      </div>

      <nav className="flex-1 p-4 flex flex-col gap-2">
        <Link
          href="/admin/products"
          className={`px-4 py-3 rounded transition ${
            pathname === "/admin/products" ? "bg-blue-600" : "hover:bg-gray-800"
          }`}
        >
          📦 Productos
        </Link>

        <Link
          href="/admin/categories"
          className={`px-4 py-3 rounded transition ${
            pathname === "/admin/categories"
              ? "bg-blue-600"
              : "hover:bg-gray-800"
          }`}
        >
          📂 Categorías
        </Link>

        <Link
          href="/admin/stock"
          className={`px-4 py-3 rounded transition ${
            pathname === "/admin/stock" ? "bg-blue-600" : "hover:bg-gray-800"
          }`}
        >
          🛒 Stock
        </Link>

        <Link href="/admin/users">Usuarios</Link>

        <Link href="/admin">
          <Button variant="ghost" className="w-full justify-start">
            <LayoutDashboard className="mr-2 h-4 w-4" />
            Dashboard
          </Button>
        </Link>
      </nav>

      <div className="p-4 border-t border-gray-700">
        <button
          onClick={logout}
          className="w-full bg-red-600 hover:bg-red-700 rounded px-4 py-2"
        >
          🚪 Cerrar sesión
        </button>
      </div>
    </aside>
  );
}
