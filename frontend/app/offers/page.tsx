import ProductCard from "@/components/ProductCard";

async function getOffers() {
  const res = await fetch("http://localhost:3000/store/offers", {
    cache: "no-store",
  });

  return res.json();
}

export default async function OffersPage() {
  const products = await getOffers();

  return (
    <main className="max-w-7xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-8">Ofertas</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product: any) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </main>
  );
}
