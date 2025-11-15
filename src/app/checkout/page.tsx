"use client";

import { useCartStore } from "@/store/cartStore";
import { useState } from "react";

export default function CheckoutPage() {
  const { items, clearCart } = useCartStore();
  const total = items.reduce((s, i) => s + i.price * i.quantity, 0);

  const [form, setForm] = useState({
    name: "",
    email: "",
    address: "",
  });

  const handleChange = (e: any) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.address) {
      alert("Por favor completa todos los campos.");
      return;
    }

    alert("Compra realizada con éxito 🙌");
    clearCart();
    window.location.href = "/";
  };

  return (
    <main style={{ padding: "2rem", maxWidth: "600px", margin: "0 auto" }}>
      <h1 style={{ marginBottom: "1rem" }}>Checkout</h1>

      {items.length === 0 && (
        <p>Tu carrito está vacío. Agrega productos antes de continuar.</p>
      )}

      {items.length > 0 && (
        <>
          <h2>Resumen del pedido</h2>

          <ul style={{ marginBottom: "1rem" }}>
            {items.map((item) => (
              <li key={item.id}>
                {item.quantity} × {item.name} — ${item.price * item.quantity}
              </li>
            ))}
          </ul>

          <h3>Total: ${total}</h3>

          <form onSubmit={handleSubmit} style={{ marginTop: "2rem" }}>
            <label>Nombre completo</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              style={{ width: "100%", padding: 8, marginBottom: 12 }}
            />

            <label>Email</label>
            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              style={{ width: "100%", padding: 8, marginBottom: 12 }}
            />

            <label>Dirección</label>
            <textarea
              name="address"
              value={form.address}
              onChange={handleChange}
              style={{ width: "100%", padding: 8, marginBottom: 12 }}
            />

            <button
              type="submit"
              style={{
                padding: "10px 14px",
                background: "#333",
                color: "white",
                borderRadius: "6px",
                cursor: "pointer",
                border: "none",
              }}
            >
              Realizar compra
            </button>
          </form>
        </>
      )}
    </main>
  );
}
