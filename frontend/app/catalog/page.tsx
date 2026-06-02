import ProductCard from "@/components/ProductCard";

async function getProducts() {
  const res = await fetch(
    "http://localhost:3000/store/products?page=1&limit=50",
    { cache: "no-store" },
  );

  return res.json();
}

export default async function CatalogPage() {
  const products = await getProducts();

  return (
    <main className="max-w-7xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-8">Catálogo</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.data.map((product: any) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </main>
  );
}
