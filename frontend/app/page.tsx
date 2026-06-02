import ProductCard from "@/components/ProductCard";

async function getProducts() {
  const res = await fetch("http://localhost:3000/store/products", {
    cache: "no-store",
  });

  return res.json();
}

export default async function Home() {
  const products = await getProducts();

  return (
    <main className="p-10">
      <h1 className="text-3xl font-bold mb-6">Productos</h1>

      {products.data.map((product: any) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </main>
  );
}
