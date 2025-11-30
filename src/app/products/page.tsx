"use client";

import { useState } from "react";
import { ProductGrid } from "@/components/products/ProductGrid";
import { ProductList } from "@/components/products/ProductList";
import { ViewMode, ViewToggle } from "@/components/products/ViewToggle";
import { useProducts } from "@/hooks/useProducts";
import { useCartStore } from "@/store/cartStore";
import { Product } from "@/types/product";

export default function ProductsPage() {
  const { products, loading, error } = useProducts();
  const [view, setView] = useState<ViewMode>("grid");
  const addToCart = useCartStore((state) => state.addToCart);

  const handleAddToCart = (product: Product) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl || "/images/almadeluz.jpg",
    });
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {Array.from({ length: 6 }).map((_, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl border border-slate-100 shadow-sm p-4 space-y-3"
            >
              <div className="h-44 w-full rounded-lg skeleton" />
              <div className="h-5 rounded-full skeleton" style={{ width: "70%" }} />
              <div className="h-4 rounded-full skeleton" style={{ width: "90%" }} />
              <div className="h-4 rounded-full skeleton" style={{ width: "60%" }} />
              <div className="h-10 rounded-full skeleton" />
            </div>
          ))}
        </div>
      );
    }

    if (error) {
      return <div className="alert mt-6">{error}</div>;
    }

    if (!products.length) {
      return (
        <div className="mt-6 bg-white border border-slate-100 rounded-xl p-6 shadow-sm text-center">
          <p className="text-base text-slate-700">Aún no hay productos disponibles.</p>
        </div>
      );
    }

    return view === "grid" ? (
      <ProductGrid products={products} onAddToCart={handleAddToCart} />
    ) : (
      <ProductList products={products} onAddToCart={handleAddToCart} />
    );
  };

  return (
    <main className="min-h-screen">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="space-y-3">
            <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">
              Catálogo completo
            </p>
            <h1 className="text-base md:text-lg font-medium tracking-tight leading-snug text-slate-700">
              Todos nuestros productos disponibles
            </h1>
            <p className="text-slate-700 max-w-3xl">
              Visualiza cada artículo en cuadrícula o lista para encontrar rápidamente lo que necesitas.
              Añade al carrito sin perder el flujo de exploración.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <ViewToggle view={view} onChange={setView} />
          </div>
        </div>

        {renderContent()}
      </div>
    </main>
  );
}
