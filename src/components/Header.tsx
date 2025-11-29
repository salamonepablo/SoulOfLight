"use client";

import Link from "next/link";
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
            href="/products"
            className="button-base button-ghost text-sm"
            aria-label="Explorar productos"
          >
            Productos
          </Link>
          <Link
            href="/cart"
            className="button-base button-primary text-sm"
            aria-label="Ir al carrito"
          >
            <CartIcon />
            Carrito
            <span className="badge-count" aria-hidden>
              {totalQty}
            </span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
