"use client";

import Link from "next/link";
import Image from "next/image";
import { useCartStore } from "@/store/cartStore";

function CartIcon() {
  return (
    <svg
      aria-hidden
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 6h15l-1.5 9h-11z" />
      <path d="M6 6 4 3" />
      <circle cx="9" cy="19" r="1.5" />
      <circle cx="17" cy="19" r="1.5" />
    </svg>
  );
}

function SparkleIcon() {
  return (
    <svg
      aria-hidden
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 3 13.5 8.5 19 10 13.5 11.5 12 17 10.5 11.5 5 10 10.5 8.5 12 3z" />
      <path d="M5 19l1-2 2-1-2-1-1-2-1 2-2 1 2 1 1 2z" />
      <path d="M19 6.5l.5-1 .5 1 1 .5-1 .5-.5 1-.5-1-1-.5z" />
    </svg>
  );
}

export default function Header() {
  const items = useCartStore((state) => state.items);
  const totalQty = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="bg-white border-b shadow-sm">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between gap-4 flex-wrap">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xl font-bold tracking-tight text-slate-900"
        >
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 text-emerald-700 shadow-sm">
            <SparkleIcon />
          </span>
          SoulOfLight
        </Link>

        <nav className="flex items-center gap-3">
          <Link
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
                <Link href="/" style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <Image src="/images/almadeluz.jpg" alt="SoulOfLight" width={40} height={40} style={{ borderRadius: 8 }} />
                  <span style={{ fontSize: "1.25rem", fontWeight: 600 }}>SoulOfLight</span>
                </Link>

                <nav style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                  <Link href="/products" style={{ fontSize: "1rem" }}>Productos</Link>
                  <Link
                    href="/cart"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      fontSize: "1rem",
                    }}
                  >
                    🛒 Carrito
                    <span
                      style={{
                        background: "#333",
                        color: "white",
                        padding: "2px 8px",
                        borderRadius: "12px",
                        fontSize: "0.85rem",
                      }}
                    >
                      {totalQty}
                    </span>
                  </Link>
                </nav>
              </header>
            );
