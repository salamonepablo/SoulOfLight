"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useCartStore } from "@/store/cartStore";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then(setProducts)
      .catch((err) => console.error("Error cargando productos:", err));
  }, []);

  return (
    <main style={{ padding: "2rem" }}>
      <h1 style={{ marginBottom: "1rem" }}>Productos</h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: "1rem",
        }}
      >
        {products.map((product: any) => (
  <div
    key={product.id}
    style={{
      border: "1px solid #ccc",
      padding: "1rem",
      borderRadius: "8px",
      background: "#fff",
    }}
  >
    <Image
      src={product.imageUrl}
      alt={product.name}
      width={200}
      height={200}
    />

    <h3>{product.name}</h3>
    <p>{product.description}</p>

    <strong style={{ display: "block", marginBottom: 8 }}>
      ${product.price}
    </strong>

    <button
      style={{
        padding: "8px 12px",
        borderRadius: "6px",
        border: "1px solid #333",
        background: "#f5f5f5",
        cursor: "pointer",
      }}
      onClick={() => {
         useCartStore.getState().addToCart(product);
         alert("Agregado al carrito");
      }}
    >
      Agregar al carrito
    </button>
  </div>
))}
      </div>
    </main>
  );
}
