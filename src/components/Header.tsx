"use client";

import Link from "next/link";
import { useCartStore } from "@/store/cartStore";

export default function Header() {
  const items = useCartStore((state) => state.items);
  const totalQty = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "1rem 2rem",
        borderBottom: "1px solid #ddd",
        marginBottom: "2rem",
      }}
    >
      <Link href="/" style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
        SoulOfLight
      </Link>

      <Link
        href="/cart"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          fontSize: "1.2rem",
        }}
      >
        🛒 Carrito
        <span
          style={{
            background: "#333",
            color: "white",
            padding: "2px 8px",
            borderRadius: "12px",
            fontSize: "0.9rem",
          }}
        >
          {totalQty}
        </span>
      </Link>
    </header>
  );
}
