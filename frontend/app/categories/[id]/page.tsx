import ProductCard from "@/components/ProductCard";

async function getProductsByCategory(id: string) {
  const res = await fetch(
    `http://localhost:3000/store/products?category=${id}`,
    {
      cache: "no-store",
    },
  );

  return res.json();
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const products = await getProductsByCategory(id);

  return (
    <main className="max-w-7xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-8">Categoría</h1>

      <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.data.map((product: any) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </main>
  );
}
