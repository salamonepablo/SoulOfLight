"use client";

import { useCartStore } from "@/store/cartStore";
import { formatMoney } from "@/lib/price";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, clearCart } = useCartStore();
  const total = items.reduce((s, i) => s + i.price * i.quantity, 0);

  const [form, setForm] = useState({
    name: "",
    email: "",
    address: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!form.name || !form.email || !form.address) {
      setError("Por favor completá todos los campos.");
      return;
    }

    if (items.length === 0) {
      setError("Tu carrito está vacío.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((item) => ({
            productId: item.id,
            quantity: item.quantity,
          })),
        }),
      });

      const data = (await response.json().catch(() => null)) as { error?: string } | null;

      if (!response.ok) {
        if (response.status === 401) {
          router.push("/login?callbackUrl=/checkout");
          return;
        }

        setError(data?.error || "No se pudo crear la orden");
        return;
      }

      clearCart();
      setSuccess("Compra realizada con éxito 🙌");

      setTimeout(() => {
        router.push("/");
        router.refresh();
      }, 1200);
    } catch {
      setError("No se pudo crear la orden");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ padding: "2rem", maxWidth: "600px", margin: "0 auto" }}>
      <h1 style={{ marginBottom: "1rem" }}>Checkout</h1>

      {error && (
        <p style={{ marginBottom: "1rem", color: "#b91c1c", fontWeight: 600 }}>{error}</p>
      )}
      {success && (
        <p style={{ marginBottom: "1rem", color: "#166534", fontWeight: 600 }}>{success}</p>
      )}

      {items.length === 0 && <p>Tu carrito está vacío. Agrega productos antes de continuar.</p>}

      {items.length > 0 && (
        <>
          <h2>Resumen del pedido</h2>

          <ul style={{ marginBottom: "1rem" }}>
            {items.map((item) => (
              <li key={item.id}>
                {item.quantity} × {item.name} — {formatMoney(item.price * item.quantity)}
              </li>
            ))}
          </ul>

          <h3>Total: {formatMoney(total)}</h3>

          <form onSubmit={handleSubmit} style={{ marginTop: "2rem" }}>
            <label>Nombre completo</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              disabled={loading}
              style={{ width: "100%", padding: 8, marginBottom: 12 }}
            />

            <label>Email</label>
            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              disabled={loading}
              style={{ width: "100%", padding: 8, marginBottom: 12 }}
            />

            <label>Dirección</label>
            <textarea
              name="address"
              value={form.address}
              onChange={handleChange}
              disabled={loading}
              style={{ width: "100%", padding: 8, marginBottom: 12 }}
            />

            <button
              type="submit"
              style={{
                padding: "10px 14px",
                background: "#333",
                color: "white",
                borderRadius: "6px",
                cursor: loading ? "not-allowed" : "pointer",
                border: "none",
                opacity: loading ? 0.7 : 1,
              }}
              disabled={loading}
            >
              {loading ? "Procesando compra..." : "Realizar compra"}
            </button>
          </form>
        </>
      )}
    </main>
  );
}
