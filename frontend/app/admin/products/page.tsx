"use client";
import { useCallback, useEffect, useState } from "react";
import { adminApi } from "@/lib/admin-api";
import { toast } from "sonner";
import ProductDialog from "@/components/product/ProductDialog";
import { Button } from "@/components/ui/button";
import { Product } from "@/types/product";
import { PaginatedResponse } from "@/types/api";
import { Category } from "@/types/category";
import { useDebounce } from "@/hooks/useDebounce";
import DataTable, { DataTableColumn } from "@/components/common/DataTable";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import { Pencil, Trash2 } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import {
  SelectItem,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
} from "@/components/ui/select";
import { DataTableFilters } from "@/components/common/DataTable";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [isFeatured, setIsFeatured] = useState(false);
  const [isOnSale, setIsOnSale] = useState(false);
  const [categoryId, setCategoryId] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(
    null,
  );
  const [loading, setLoading] = useState(false);
  const [featuredFilter, setFeaturedFilter] = useState("all");
  const [onSaleFilter, setOnSaleFilter] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const debouncedSearch = useDebounce(search, 400);
  const columns: DataTableColumn<Product>[] = [
    {
      key: "id",
      header: "ID",
    },

    {
      key: "name",
      header: "Nombre",
    },
    {
      key: "imageUrl",
      header: "Imagen",
      render: (product) =>
        product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            width={60}
            height={60}
            className="h-14 w-14 rounded-md object-cover"
          />
        ) : (
          <div className="h-14 w-14 rounded-md bg-muted flex items-center justify-center">
            N/A
          </div>
        ),
    },

    {
      key: "category",
      header: "Categoría",
      render: (product) => (
        <span>{product.category?.name ?? "Sin categoría"}</span>
      ),
    },

    {
      key: "price",
      header: "Precio",
      render: (product) => <span>Bs {product.price}</span>,
    },

    {
      key: "stock",
      header: "Stock",
    },

    {
      key: "isFeatured",
      header: "Destacado",
      render: (product) =>
        product.isFeatured ? (
          <Badge>Destacado</Badge>
        ) : (
          <Badge variant="secondary">No</Badge>
        ),
    },

    {
      key: "isOnSale",
      header: "Oferta",
      render: (product) =>
        product.isOnSale ? (
          <Badge variant="destructive">Oferta</Badge>
        ) : (
          <Badge variant="secondary">No</Badge>
        ),
    },

    {
      key: "actions",
      header: "Acciones",
      render: (product) => (
        <div className="flex gap-2">
          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => openEditModal(product)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              }
            />

            <TooltipContent>Editar producto</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    setSelectedProductId(product.id);
                    setConfirmOpen(true);
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              }
            />

            <TooltipContent>Eliminar producto</TooltipContent>
          </Tooltip>
        </div>
      ),
    },
  ];
  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await adminApi.get<PaginatedResponse<Product>>(
        "/products",
        {
          params: {
            page,
            limit: pageSize,
            search,
            featured: featuredFilter === "all" ? undefined : featuredFilter,
            onSale: onSaleFilter === "all" ? undefined : onSaleFilter,
            category: selectedCategory === "all" ? undefined : selectedCategory,
          },
        },
      );

      setProducts(data.data);
      setTotal(data.total);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, search, selectedCategory, featuredFilter, onSaleFilter]);
  const loadCategories = useCallback(async () => {
    try {
      const { data } = await adminApi.get("/categories");

      setCategories(data);
    } catch (error) {
      console.error(error);
    }
  }, []);

  async function uploadImage() {
    if (!file) return "";

    const formData = new FormData();

    formData.append("file", file);

    const { data } = await adminApi.post("/uploads", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return data.secure_url;
  }
  function openEditModal(product: Product) {
    setEditingProduct(product);

    setName(product.name);

    setDescription(product.description || "");

    setPrice(String(product.price));

    setStock(String(product.stock));

    setImageUrl(product.imageUrl || "");

    setCategoryId(String(product.category?.id || ""));

    setIsFeatured(product.isFeatured);

    setIsOnSale(product.isOnSale);

    setIsModalOpen(true);
  }

  async function createProduct() {
    try {
      setUploading(true);

      const imageUrl = await uploadImage();
      await adminApi.post("/products", {
        name,
        description,
        price: Number(price),
        stock: Number(stock),
        imageUrl,
        isFeatured,
        isOnSale,
        categoryId: Number(categoryId),
      });

      setIsModalOpen(false);

      setName("");
      setDescription("");
      setPrice("");
      setStock("");
      setImageUrl("");
      setCategoryId("");
      setIsFeatured(false);
      setIsOnSale(false);
      setUploading(false);
      await loadProducts();
    } catch (error) {
      console.error(error);
    }
  }

  async function updateProduct() {
    if (!editingProduct) return;

    try {
      await adminApi.patch(`/products/${editingProduct.id}`, {
        name,
        description,
        price: Number(price),
        stock: Number(stock),
        imageUrl,
        categoryId: Number(categoryId),
        isFeatured,
        isOnSale,
      });

      setIsModalOpen(false);

      await loadProducts();
    } catch (error) {
      console.error(error);
    }
  }

  async function deleteProduct(id: number) {
    try {
      await adminApi.delete(`/products/${id}`);

      toast.success("Producto eliminado correctamente.");

      await loadProducts();
    } catch (error: unknown) {
      console.error(error);

      if (typeof error === "object" && error !== null && "response" in error) {
        const response = error.response as {
          data?: { message?: string };
        };

        toast.error(response.data?.message ?? "Error al eliminar producto");
      }
    }
  }
  const openCreateModal = () => {
    setEditingProduct(null);

    setName("");
    setDescription("");
    setPrice("");
    setStock("");

    setCategoryId("");

    setIsFeatured(false);
    setIsOnSale(false);

    setFile(null);

    setIsModalOpen(true);
  };
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, selectedCategory, featuredFilter, onSaleFilter]);
  useEffect(() => {
    loadProducts();
    loadCategories();
  }, [loadProducts, loadCategories]);

  return (
    <main className="max-w-7xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-8">Administración de Productos</h1>
      <DataTable<Product>
        data={products}
        columns={columns}
        loading={loading}
        toolbar={{
          search,
          onSearchChange: setSearch,
          buttonText: "Nuevo Producto",
          onCreate: () => setIsModalOpen(true),
        }}
        filters={
          <DataTableFilters
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            featuredFilter={featuredFilter}
            onFeaturedChange={setFeaturedFilter}
            onSaleFilter={onSaleFilter}
            onSaleChange={setOnSaleFilter}
          />
        }
        pagination={{
          page,
          totalPages,
          total,
          pageSize,
          onPageChange: setPage,
          onPageSizeChange: (size) => {
            setPageSize(size);
            setPage(1);
          },
        }}
        emptyState={{
          title: "No hay productos",
          description: "Intenta cambiar los filtros o crear un nuevo producto.",
        }}
      />

      <div className="border-t px-6 py-4"></div>

      <ProductDialog
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        name={name}
        setName={setName}
        description={description}
        setDescription={setDescription}
        price={price}
        setPrice={setPrice}
        stock={stock}
        setStock={setStock}
        categoryId={categoryId}
        setCategoryId={setCategoryId}
        categories={categories}
        isFeatured={isFeatured}
        setIsFeatured={setIsFeatured}
        isOnSale={isOnSale}
        setIsOnSale={setIsOnSale}
        setFile={setFile}
        uploading={uploading}
        editingProduct={editingProduct}
        createProduct={createProduct}
        updateProduct={updateProduct}
      />
      <ConfirmDialog
        open={confirmOpen}
        title="Eliminar producto"
        description="Esta acción no se puede deshacer."
        onConfirm={async () => {
          if (selectedProductId !== null) {
            await deleteProduct(selectedProductId);
          }

          setConfirmOpen(false);
          setSelectedProductId(null);
        }}
        onCancel={() => {
          setConfirmOpen(false);
          setSelectedProductId(null);
        }}
      />
    </main>
  );
}
