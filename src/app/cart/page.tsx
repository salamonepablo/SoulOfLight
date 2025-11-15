"use client";

import { useCartStore } from "@/store/cartStore";
import Image from "next/image";

export default function CartPage() {
  const { items, removeFromCart, clearCart } = useCartStore();

  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <main style={{ padding: "2rem" }}>
      <h1 style={{ marginBottom: "1rem" }}>🛒 Carrito</h1>

      {items.length === 0 && <p>Tu carrito está vacío.</p>}

      {items.map((item) => (
        <div
          key={item.id}
          style={{
            display: "flex",
            gap: "1rem",
            marginBottom: "1rem",
            border: "1px solid #ccc",
            borderRadius: "8px",
            padding: "1rem",
          }}
        >
          <Image
            src={item.imageUrl}
            alt={item.name}
            width={100}
            height={100}
          />

          <div>
            <h3>{item.name}</h3>
            <p>Precio: ${item.price}</p>
            <p>Cantidad: {item.quantity}</p>
            <p>
              <strong>Subtotal: ${item.price * item.quantity}</strong>
            </p>

            <button
              onClick={() => removeFromCart(item.id)}
              style={{
                padding: "6px 10px",
                background: "#fdd",
                border: "1px solid #d55",
                borderRadius: "6px",
                cursor: "pointer",
                marginTop: "8px",
              }}
            >
              Quitar
            </button>
          </div>
        </div>
      ))}

      {items.length > 0 && (
        <>
          <h2>Total: ${total}</h2>

          <button
            onClick={clearCart}
            style={{
              padding: "10px 14px",
              background: "#eee",
              border: "1px solid #333",
              borderRadius: "6px",
              cursor: "pointer",
              marginTop: "1rem",
            }}
          >
            Vaciar carrito
          </button>
        </>
      )}
    </main>
  );
          <a
            href="/checkout"
            style={{
              padding: "10px 14px",
              background: "#4CAF50",
              color: "white",
              borderRadius: "6px",
              marginLeft: "1rem",
              textDecoration: "none",
            }}
          >
            Finalizar compra
          </a>
}
