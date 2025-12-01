"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/store/cartStore";
import { formatMoney } from "@/lib/price";

function CartItemImage({ src, alt }: { src: string; alt: string }) {
  const original = src || "/images/almadeluz.jpg";
  const file = original.split("/").pop() || "almadeluz.jpg";
  const dotIndex = file.lastIndexOf(".");
  const nameNoExt = dotIndex !== -1 ? file.substring(0, dotIndex) : file;
  const origExt = dotIndex !== -1 ? file.substring(dotIndex + 1) : "jpg";
  const webpThumb = `/images/thumbs/thumb-${nameNoExt}.webp`;
  const fallbackThumb = `/images/thumbs/thumb-${nameNoExt}.${origExt}`;
  const [current, setCurrent] = React.useState<string>(webpThumb);
  return (
    <Image
      key={current}
      src={current}
      alt={alt}
      width={120}
      height={120}
      className="h-24 w-24 object-contain object-center rounded-lg p-0.5"
      onError={() => {
        if (current === webpThumb) {
          setCurrent(fallbackThumb);
        } else if (current === fallbackThumb) {
          setCurrent(original);
        } else if (current === original) {
          setCurrent("/images/almadeluz.jpg");
        }
      }}
    />
  );
}

export default function CartPage() {
  const { items, removeFromCart, clearCart } = useCartStore();

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <main className="min-h-screen">
      <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col gap-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="space-y-2">
            <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">
              🛒 Carrito
            </p>
            <h1 className="text-2xl font-bold tracking-tight leading-tight text-slate-900">
              Tu selección consciente
            </h1>
            <p className="text-slate-700">Revisa tus productos antes de finalizar la compra.</p>
          </div>

          {items.length > 0 && (
            <button
              type="button"
              onClick={clearCart}
              className="button-base button-ghost text-sm"
            >
              Vaciar carrito
            </button>
          )}
        </div>

        {items.length === 0 ? (
          <div className="bg-white border border-slate-100 rounded-xl p-6 shadow-sm text-center">
            <p className="text-base text-slate-700">Tu carrito está vacío.</p>
            <div className="mt-4">
              <Link href="/products" className="button-base button-primary">
                Ver productos
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {items.map((item) => {
                const subtotal = item.price * item.quantity;
                return (
                  <div
                    key={item.id}
                    className="flex items-center gap-5 p-4 border border-slate-100 bg-white rounded-xl shadow-sm"
                  >
                    <div className="flex-shrink-0 w-24 h-24 overflow-hidden rounded-lg bg-white">
                      <CartItemImage
                        src={item.imageUrl || "/images/almadeluz.jpg"}
                        alt={item.name}
                      />
                    </div>

                    <div className="flex-1 space-y-2">
                      <h3 className="text-lg font-semibold text-slate-900 leading-tight">{item.name}</h3>
                      <p className="text-sm text-slate-700">Precio: {formatMoney(item.price)}</p>
                      <p className="text-sm text-slate-700">Cantidad: {item.quantity}</p>
                      <p className="text-sm font-semibold text-emerald-700">
                        Subtotal: {formatMoney(subtotal)}
                      </p>
                    </div>

                    <div className="flex flex-col items-end gap-3">
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.id)}
                        className="button-base button-ghost text-sm"
                      >
                        Quitar
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="bg-white border border-slate-100 rounded-xl p-5 shadow-md flex items-center justify-between gap-4 flex-wrap">
              <div>
                <p className="text-sm text-slate-700">Total</p>
                <p className="text-2xl font-bold text-emerald-700">{formatMoney(total)}</p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={clearCart}
                  className="button-base button-ghost text-sm"
                >
                  Vaciar
                </button>
                <Link href="/checkout" className="button-base button-primary text-sm">
                  Finalizar compra
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
