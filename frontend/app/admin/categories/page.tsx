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
import type { Category } from "@/types/category";
import CategoryDialog from "@/components/category/CategoryDialog";
import { usePagination } from "@/hooks/usePagination";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [name, setName] = useState("");
  const [parentId, setParentId] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const {
    page,
    setPage,

    pageSize,
    setPageSize,

    total,
    setTotal,

    totalPages,
    setTotalPages,

    resetPage,
  } = usePagination();
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null,
  );
  const loadCategories = useCallback(async () => {
    try {
      setLoading(true);

      const { data } = await adminApi.get("/categories", {
        params: {
          page,
          limit: pageSize,
          search,
        },
      });

      setCategories(data.data);
      setTotal(data.total);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, search, setTotal, setTotalPages]);

  function openEditModal(category: Category) {
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
      closeDialog();
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
      closeDialog();
      toast.success("Categoría actualizada correctamente");

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

  function closeDialog() {
    setIsModalOpen(false);

    setEditingCategory(null);
    setName("");
    setParentId("");
  }

  const columns: DataTableColumn<Category>[] = [
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

      <DataTable
        data={categories}
        columns={columns}
        loading={loading}
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
        pagination={{
          page,
          totalPages,
          total,
          pageSize,

          onPageChange: setPage,

          onPageSizeChange: (size) => {
            setPageSize(size);
            resetPage();
          },
        }}
      />
      <CategoryDialog
        open={isModalOpen}
        onOpenChange={(open) => {
          if (!open) {
            closeDialog();
          } else {
            setIsModalOpen(true);
          }
        }}
        editingCategory={editingCategory}
        categories={categories}
        name={name}
        setName={setName}
        parentId={parentId}
        setParentId={setParentId}
        onSave={() => (editingCategory ? updateCategory() : createCategory())}
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
