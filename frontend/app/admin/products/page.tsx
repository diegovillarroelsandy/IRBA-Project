"use client";

import { useCallback, useEffect, useState } from "react";
import { adminApi } from "@/lib/admin-api";

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [categories, setCategories] = useState<any[]>([]);
  const [isFeatured, setIsFeatured] = useState(false);
  const [isOnSale, setIsOnSale] = useState(false);
  const [categoryId, setCategoryId] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);

  const loadProducts = useCallback(async () => {
    try {
      const { data } = await adminApi.get("/products");

      setProducts(data);
    } catch (error) {
      console.error(error);
    }
  }, []);
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
  function openEditModal(product: any) {
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

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, [loadProducts, loadCategories]);

  return (
    <main className="max-w-7xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-8">Administración de Productos</h1>
      <div className="flex justify-between mb-6">
        <button
          onClick={() => {
            setEditingProduct(null);
            setIsModalOpen(true);
          }}
          className="bg-black text-white px-4 py-2 rounded"
        >
          Nuevo Producto
        </button>
      </div>
      <table className="w-full border">
        <thead>
          <tr>
            <th className="border p-2">ID</th>

            <th className="border p-2">Nombre</th>

            <th className="border p-2">Precio</th>

            <th className="border p-2">Stock</th>
            <th className="border p-2">Acciones</th>
          </tr>
        </thead>

        <tbody>
          {products.map((product: any) => (
            <tr key={product.id}>
              <td className="border p-2">{product.id}</td>

              <td className="border p-2">{product.name}</td>

              <td className="border p-2">{product.price}</td>

              <td className="border p-2">{product.stock}</td>
              <td className="border p-2">
                <button
                  onClick={() => openEditModal(product)}
                  className="bg-blue-500 text-white px-2 py-1 rounded"
                >
                  Editar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-[500px]">
            <h2 className="text-2xl font-bold mb-4">Nuevo Producto</h2>

            <div className="space-y-3">
              <input
                placeholder="Nombre"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border p-2 rounded"
              />

              <textarea
                placeholder="Descripción"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full border p-2 rounded"
              />

              <input
                placeholder="Precio"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full border p-2 rounded"
              />

              <input
                placeholder="Stock"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                className="w-full border p-2 rounded"
              />
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full border p-2 rounded"
              >
                <option value="">Seleccione categoría</option>

                {categories.map((category: any) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>

              <div className="flex gap-4">
                <label>
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                  />
                  Destacado
                </label>

                <label>
                  <input
                    type="checkbox"
                    checked={isOnSale}
                    onChange={(e) => setIsOnSale(e.target.checked)}
                  />
                  Oferta
                </label>
              </div>

              <input
                type="file"
                accept="image/*"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="w-full border p-2 rounded"
              />
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="border px-4 py-2 rounded"
              >
                Cancelar
              </button>

              <button
                onClick={() =>
                  editingProduct ? updateProduct() : createProduct()
                }
                disabled={uploading}
                className="bg-black text-white px-4 py-2 rounded"
              >
                {uploading ? "Subiendo..." : "Guardar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
