import Link from "next/link";

async function getCategories() {
  const res = await fetch("http://localhost:3000/store/categories", {
    cache: "no-store",
  });

  return res.json();
}

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <main className="max-w-7xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-8">Categorías</h1>

      <div className="grid md:grid-cols-3 gap-6">
        {categories.map((category: any) => (
          <Link key={category.id} href={`/categories/${category.id}`}>
            <div className="border rounded p-6 hover:shadow-lg">
              <h2 className="text-xl font-bold">{category.name}</h2>

              <p className="text-gray-500 mt-2">
                {category.children?.length || 0} subcategorías
              </p>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
