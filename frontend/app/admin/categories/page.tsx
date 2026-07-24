"use client";

import { useCallback, useEffect, useState } from "react";
import { adminApi } from "@/lib/admin-api";
import { toast } from "sonner";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import DataTable from "@/components/common/DataTable";
import type { DataTableColumn } from "@/components/common/DataTable/types";
import { Pencil, Trash2 } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any | null>(null);
  const [name, setName] = useState("");
  const [parentId, setParentId] = useState("");
  const [search, setSearch] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);

  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null,
  );
  const loadCategories = useCallback(async () => {
    try {
      const { data } = await adminApi.get("/categories");
      setCategories(data);
    } catch (error) {
      console.error(error);
    }
  }, []);

  function openEditModal(category: any) {
    setEditingCategory(category);

    setName(category.name);

    setParentId(category.parent?.id ? String(category.parent.id) : "");

    setIsModalOpen(true);
  }
  async function createCategory() {
    try {
      await adminApi.post("/categories", {
        name,
        parentId: parentId ? Number(parentId) : undefined,
      });

      setIsModalOpen(false);
      toast.success("Categoría creada correctamente");

      await loadCategories();
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ?? "No se pudo crear la categoría",
      );
    }
  }

  async function updateCategory() {
    if (!editingCategory) return;

    try {
      await adminApi.patch(`/categories/${editingCategory.id}`, {
        name,
        parentId: parentId ? Number(parentId) : undefined,
      });
      toast.success("Categoría actualizada correctamente");

      setIsModalOpen(false);

      await loadCategories();
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ?? "No se pudo actualizar la categoría",
      );
    }
  }
  async function handleDelete() {
    if (!selectedCategoryId) return;

    try {
      await adminApi.delete(`/categories/${selectedCategoryId}`);

      loadCategories();

      setConfirmOpen(false);

      toast.success("Categoría eliminada correctamente.");
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ?? "No se pudo eliminar la categoría.",
      );
    }
  }

  const columns: DataTableColumn<any>[] = [
    {
      key: "id",
      header: "ID",
      width: "80px",
    },

    {
      key: "name",
      header: "Nombre",
    },

    {
      key: "parent",
      header: "Categoría Padre",
      render: (category) => category.parent?.name ?? "-",
    },

    {
      key: "actions",
      header: "Acciones",
      render: (category) => (
        <div className="flex gap-2">
          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => openEditModal(category)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              }
            />

            <TooltipContent>Editar categoría</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    setSelectedCategoryId(category.id);
                    setConfirmOpen(true);
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              }
            />

            <TooltipContent>Eliminar categoría</TooltipContent>
          </Tooltip>
        </div>
      ),
    },
  ];

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  return (
    <main className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between mb-6">
        <h1 className="text-3xl font-bold">Categorías</h1>
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-bold mb-4">
              {editingCategory ? "Editar Categoría" : "Nueva Categoría"}
            </h2>

            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nombre"
              className="w-full border p-2 rounded mb-4"
            />

            <select
              value={parentId}
              onChange={(e) => setParentId(e.target.value)}
              className="w-full border p-2 rounded mb-4"
            >
              <option value="">Sin categoría padre</option>

              {categories
                .filter((c) => c.id !== editingCategory?.id)
                .map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
            </select>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 border rounded"
              >
                Cancelar
              </button>

              <button
                onClick={() =>
                  editingCategory ? updateCategory() : createCategory()
                }
                className="bg-black text-white px-4 py-2 rounded"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
      <DataTable
        data={
          search
            ? categories.filter((category) =>
                category.name.toLowerCase().includes(search.toLowerCase()),
              )
            : categories
        }
        columns={columns}
        loading={false}
        emptyState={{
          title: "No hay categorías",
          description: "Crea una nueva categoría para comenzar.",
        }}
        toolbar={{
          search,
          onSearchChange: setSearch,
          buttonText: "Nueva Categoría",
          onCreate: () => {
            setEditingCategory(null);
            setName("");
            setParentId("");
            setIsModalOpen(true);
          },
        }}
      />
      <ConfirmDialog
        open={confirmOpen}
        title="Eliminar categoría"
        description="Esta acción no se puede deshacer."
        onConfirm={handleDelete}
        onCancel={() => {
          setConfirmOpen(false);
          setSelectedCategoryId(null);
        }}
      />
    </main>
  );
}
