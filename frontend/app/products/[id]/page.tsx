import Image from "next/image";

async function getProduct(id: string) {
  const res = await fetch(`http://localhost:3000/store/products/${id}`, {
    cache: "no-store",
  });

  return res.json();
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const data = await getProduct(id);
  console.log(data);
  if (!data?.product) {
    return <div>Producto no encontrado</div>;
  }

  const product = data.product;

  return (
    <main className="p-10">
      <div className="grid grid-cols-2 gap-10">
        <div>
          {product?.imageUrl && (
            <Image
              src={product.imageUrl}
              alt={product.name}
              width={700}
              height={500}
              className="w-full rounded"
              priority
            />
          )}
        </div>

        <div>
          <h1 className="text-4xl font-bold">{product.name}</h1>

          <p className="mt-4 text-gray-600">{product.description}</p>

          <p className="mt-6 text-2xl font-bold">${product.price}</p>

          <p className="mt-2">Categoría: {product.category?.name}</p>

          <a
            href={`https://wa.me/+59176988810?text=Hola,%20quiero%20información%20sobre%20${product.name}`}
            target="_blank"
            className="inline-block mt-6 bg-green-500 text-white px-6 py-3 rounded"
          >
            WhatsApp
          </a>
        </div>
      </div>

      {/* RELACIONADOS */}
      <section className="mt-20">
        <h2 className="text-2xl font-bold mb-6">Productos relacionados</h2>

        <div className="grid grid-cols-4 gap-4">
          {data.related.map((item: any) => (
            <div key={item.id} className="border p-4 rounded">
              {item.imageUrl && (
                <Image
                  src={item.imageUrl}
                  alt={item.name}
                  width={300}
                  height={200}
                  className="w-full h-40 object-cover"
                />
              )}

              <h3 className="font-bold mt-2">{item.name}</h3>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
