import Image from "next/image";
import Link from "next/link";

type Props = {
  product: any;
};

export default function ProductCard({ product }: Props) {
  return (
    <Link href={`/products/${product.id}`}>
      <div className="border p-4 rounded">
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

        <h2 className="font-bold mt-2">{product.name}</h2>

        <p>${product.price}</p>

        {product.isOnSale && <p className="text-red-500">Oferta</p>}
      </div>
    </Link>
  );
}
