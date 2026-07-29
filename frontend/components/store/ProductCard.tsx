import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

type Props = {
  product: any;
};

export default function ProductCard({ product }: Props) {
  return (
    <Link href={`/products/${product.id}`} className="group">
      <article
        className="
          overflow-hidden
          rounded-xl
          border
          bg-white
          shadow-sm
          transition-all
          duration-300
          hover:-translate-y-1
          hover:shadow-xl
        "
      >
        {/* Imagen */}

        <div className="relative h-56 overflow-hidden bg-muted">
          {product.imageUrl ? (
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              className="
                object-cover
                transition-transform
                duration-500
                group-hover:scale-105
              "
            />
          ) : (
            <div
              className="
              flex
              h-full
              items-center
              justify-center
              text-muted-foreground
            "
            >
              Sin imagen
            </div>
          )}

          {/* Badges */}

          <div
            className="
            absolute
            left-3
            top-3
            flex
            gap-2
          "
          >
            {product.isFeatured && (
              <span
                className="
                  rounded-full
                  bg-blue-600
                  px-3
                  py-1
                  text-xs
                  font-medium
                  text-white
                "
              >
                Destacado
              </span>
            )}

            {product.isOnSale && (
              <span
                className="
                  rounded-full
                  bg-red-600
                  px-3
                  py-1
                  text-xs
                  font-medium
                  text-white
                "
              >
                Oferta
              </span>
            )}
          </div>
        </div>

        {/* Información */}

        <div className="space-y-3 p-5">
          <div>
            <h2
              className="
                line-clamp-1
                text-lg
                font-semibold
                transition-colors
                group-hover:text-primary
              "
            >
              {product.name}
            </h2>

            {product.category && (
              <p className="mt-1 text-sm text-muted-foreground">
                {product.category.name}
              </p>
            )}
          </div>

          <div className="flex items-center justify-between">
            <p
              className="
              text-xl
              font-bold
            "
            >
              Bs {product.price}
            </p>

            <span
              className="
                flex
                items-center
                gap-1
                text-sm
                font-medium
                text-primary
              "
            >
              Ver
              <ArrowRight
                className="
                  h-4
                  w-4
                  transition-transform
                  group-hover:translate-x-1
                "
              />
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
