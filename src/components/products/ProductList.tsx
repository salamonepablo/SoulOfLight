"use client";

import { Product } from "@/types/product";
import { ProductListItem } from "./ProductListItem";

interface ProductListProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
}

export function ProductList({ products, onAddToCart }: ProductListProps) {
  return (
    <div className="space-y-4 mt-6">
      {products.map((product) => (
        <ProductListItem key={product.id} product={product} onAddToCart={onAddToCart} />
      ))}
    </div>
  );
}
