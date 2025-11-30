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

export default function Header() {
  const items = useCartStore((state) => state.items);
  const totalQty = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="bg-white border-b shadow-sm">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between gap-4 flex-wrap">
        <Link href="/" className="inline-flex items-center gap-3 text-slate-900">
          <Image src="/images/almadeluz.jpg" alt="Alma de Luz" width={48} height={48} className="rounded-full object-cover" />
          <span className="flex flex-col">
            <span className="text-[26px] font-extrabold tracking-tight">Alma de Luz</span>
            <span className="text-base font-semibold text-emerald-700">Sahumerios / Servicios de Tarot / Numerología / Aromaterapia</span>
          </span>
        </Link>

        <nav className="flex items-center gap-4">
          <Link href="/products" className="text-slate-800 hover:text-slate-900">Productos</Link>
          <Link href="/cart" className="relative inline-flex items-center gap-2 text-slate-800 hover:text-slate-900">
            <span className="relative inline-flex">
              <CartIcon />
              {totalQty > 0 && (
                <span className="absolute -top-2 -right-2 inline-flex items-center justify-center h-5 min-w-5 px-2 rounded-full bg-emerald-600 text-white text-xs shadow-sm">
                  {totalQty}
                </span>
              )}
            </span>
            <span>Carrito</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
