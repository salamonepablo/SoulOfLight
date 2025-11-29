"use client";

import { useEffect, useState } from "react";
import { Product } from "@/types/product";

interface ProductsState {
  products: Product[];
  loading: boolean;
  error: string | null;
}

export function useProducts(): ProductsState {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const loadProducts = async () => {
      try {
        const response = await fetch("/api/products");
        if (!response.ok) {
          throw new Error("No pudimos cargar los productos");
        }
        const data: Product[] = await response.json();
        if (active) {
          setProducts(data);
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : "Error inesperado";
        if (active) {
          setError(message);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadProducts();

    return () => {
      active = false;
    };
  }, []);

  return { products, loading, error };
}
