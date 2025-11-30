"use client";

import Image from "next/image";
import { useState } from "react";
import { Product } from "@/types/product";

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

function CartPlusIcon() {
  return (
    <svg
      aria-hidden
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 6h15l-1.5 9h-11z" />
      <path d="M6 6 4 3" />
      <path d="M10 13h5" />
      <path d="M12.5 10.5v5" />
      <circle cx="9" cy="19" r="1.5" />
      <circle cx="17" cy="19" r="1.5" />
    </svg>
  );
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const [imgSrc, setImgSrc] = useState<string>(product.imageUrl || "/images/almadeluz.jpg");
  const [justAdded, setJustAdded] = useState(false);
  const description = product.description?.trim() || "Pronto tendremos más detalles de este producto.";

  return (
    <article className="bg-white rounded-xl border border-slate-100 shadow-md card-hover overflow-hidden p-4 space-y-3">
      <div className="h-44 w-full overflow-hidden rounded-lg">
        <Image
          src={imgSrc}
          alt={product.name}
          width={480}
          height={300}
          className="h-44 w-full object-cover"
          onError={() => setImgSrc("/images/almadeluz.jpg")}
        />
      </div>

      <div className="flex items-center justify-between gap-3">
        <h3 className="text-lg font-semibold text-slate-900 leading-tight">{product.name}</h3>
        <span className="text-emerald-600 font-bold text-lg">${product.price.toFixed(2)}</span>
      </div>

      <p className="text-sm text-slate-700 line-clamp-2">{description}</p>

      <button
        type="button"
        className={`button-base justify-center w-full ${justAdded ? "button-success" : "button-primary"}`}
        onClick={() => {
          onAddToCart(product);
          setJustAdded(true);
          setTimeout(() => setJustAdded(false), 1500);
        }}
        aria-live="polite"
      >
        {justAdded ? (
          <>✓ Agregado</>
        ) : (
          <>
            <CartPlusIcon />
            Agregar al carrito
          </>
        )}
      </button>
    </article>
  );
}
