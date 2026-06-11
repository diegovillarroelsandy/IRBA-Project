import ProductCard from "@/components/ProductCard";

async function getHomeData() {
  const res = await fetch("http://localhost:3000/store/home", {
    cache: "no-store",
  });

  return res.json();
}
async function getProducts() {
  const res = await fetch("http://localhost:3000/store/products", {
    cache: "no-store",
  });

  return res.json();
}

export default async function Home() {
  const products = await getProducts();
  const data = await getHomeData();

  return (
    <main className="max-w-7xl mx-auto p-6">
      <h1 className="text-5xl font-bold mb-12">IRBA</h1>

      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-6">Productos Destacados</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {data.featured.map((product: any) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-6">Ofertas</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {data.offers.map((product: any) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </main>
  );
}
