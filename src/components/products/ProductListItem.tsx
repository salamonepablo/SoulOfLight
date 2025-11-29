"use client";

import Image from "next/image";
import { Product } from "@/types/product";

interface ProductListItemProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

export function ProductListItem({ product, onAddToCart }: ProductListItemProps) {
  const imageSrc = product.imageUrl || "/images/product-placeholder.svg";
  const description = product.description?.trim() || "Pronto tendremos más detalles de este producto.";

  return (
    <article className="flex items-center gap-5 p-4 border border-slate-100 bg-white rounded-xl shadow-sm card-hover">
      <div className="flex-shrink-0 w-24 h-24 overflow-hidden rounded-lg">
        <Image
          src={imageSrc}
          alt={product.name}
          width={120}
          height={120}
          className="h-24 w-24 object-cover"
        />
      </div>

      <div className="flex-1 space-y-3">
        <div className="flex items-center gap-3 flex-wrap">
          <h3 className="text-lg font-semibold text-slate-900 leading-tight">{product.name}</h3>
          <span className="badge-soft text-xs uppercase tracking-wide px-3 py-1">
            Stock: {product.stock}
          </span>
        </div>
        <p className="text-sm text-slate-700 line-clamp-2">{description}</p>
      </div>

      <div className="flex flex-col items-end gap-3">
        <span className="text-emerald-600 font-bold text-lg">${product.price.toFixed(2)}</span>
        <button
          type="button"
          className="button-base button-primary px-4 py-3"
          onClick={() => onAddToCart(product)}
        >
          Agregar
        </button>
      </div>
    </article>
  );
}
