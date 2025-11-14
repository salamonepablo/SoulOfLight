"use client";
import { useCartStore } from "@/store/cartStore";


export default function CartPage() {
  const items = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);
  const clearCart = useCartStore((state) => state.clearCart);
  const total = useCartStore((state) => state.total());

  return (
    <main style={{ padding: "2rem" }}>
      <h1 style={{ marginBottom: "1rem" }}>Carrito de compras</h1>

      {items.length === 0 ? (
        <p>El carrito está vacío.</p>
      ) : (
        <>
          <ul style={{ padding: 0 }}>
            {items.map((item) => (
              <li
                key={item.id}
                style={{
                  listStyle: "none",
                  border: "1px solid #ccc",
                  padding: "1rem",
                  marginBottom: "1rem",
                  borderRadius: "8px",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <h3>{item.name}</h3>
                  <p>Cantidad: {item.quantity}</p>
                  <p>Precio unitario: ${item.price}</p>
                  <p>Subtotal: ${item.price * item.quantity}</p>
                </div>

                <button
                  onClick={() => removeItem(item.id)}
                  style={{
                    background: "red",
                    color: "white",
                    padding: "0.5rem 1rem",
                    borderRadius: "6px",
                    cursor: "pointer",
                    border: "none",
                    height: "40px",
                    alignSelf: "center",
                  }}
                >
                  Quitar
                </button>
              </li>
            ))}
          </ul>

          <h2>Total: ${total}</h2>

          <button
            onClick={clearCart}
            style={{
              padding: "0.8rem 1.2rem",
              borderRadius: "6px",
              background: "gray",
              color: "white",
              border: "none",
              cursor: "pointer",
              marginRight: "1rem",
            }}
          >
            Vaciar carrito
          </button>

          <button
            style={{
              padding: "0.8rem 1.2rem",
              borderRadius: "6px",
              background: "green",
              color: "white",
              border: "none",
              cursor: "pointer",
            }}
            onClick={() => alert("Después va a crear el pedido 🙂")}
          >
            Finalizar compra
          </button>
        </>
      )}
    </main>
  );
}
