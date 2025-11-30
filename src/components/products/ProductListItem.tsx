"use client";

import Image from "next/image";
import { useState } from "react";
import { Product } from "@/types/product";
import { formatMoney } from "@/lib/price";

interface ProductListItemProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

export function ProductListItem({ product, onAddToCart }: ProductListItemProps) {
  const [imgSrc, setImgSrc] = useState<string>(product.imageUrl || "/images/almadeluz.jpg");
  const [justAdded, setJustAdded] = useState(false);
  const description = product.description?.trim() || "Pronto tendremos más detalles de este producto.";

  return (
    <article className="flex items-center gap-5 p-4 border border-slate-100 bg-white rounded-xl shadow-sm card-hover">
      <div className="flex-shrink-0 w-24 h-24 overflow-hidden rounded-lg">
        <Image
          src={imgSrc}
          alt={product.name}
          width={120}
          height={120}
          className="h-24 w-24 object-cover"
          onError={() => setImgSrc("/images/almadeluz.jpg")}
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
        <span className="text-emerald-600 font-bold text-lg">{formatMoney(product.price)}</span>
        <button
          type="button"
          className={`button-base px-4 py-3 ${justAdded ? "button-success" : "button-primary"}`}
          onClick={() => {
            onAddToCart(product);
            setJustAdded(true);
            setTimeout(() => setJustAdded(false), 1500);
          }}
          aria-live="polite"
        >
          {justAdded ? "Agregado ✓" : "Agregar"}
        </button>
      </div>
    </article>
  );
}
