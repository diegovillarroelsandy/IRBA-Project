import Image from "next/image";
import Link from "next/link";

type Props = {
  product: any;
};

export default function ProductCard({ product }: Props) {
  return (
    <Link href={`/products/${product.id}`}>
      <div className="border rounded-lg overflow-hidden hover:shadow-lg transition cursor-pointer">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            width={500}
            height={300}
            className="w-full h-48 object-cover"
          />
        ) : (
          <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
            Sin imagen
          </div>
        )}

        <div className="p-4">
          <div className="flex gap-2 mb-2">
            {product.isFeatured && (
              <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded">
                Destacado
              </span>
            )}

            {product.isOnSale && (
              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded">
                Oferta
              </span>
            )}
          </div>

          <h2 className="font-bold text-lg">{product.name}</h2>

          <p className="text-gray-500 mt-1">${product.price}</p>

          <button className="mt-4 w-full border rounded py-2 hover:bg-gray-100">
            Ver producto
          </button>
        </div>
      </div>
    </Link>
  );
}
