"use client";

import { useEffect, useMemo, useState } from "react";
import { formatMoney } from "@/lib/price";

interface OrderItem {
  id: string;
  productId: number | null;
  productName: string | null;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  total: number;
  status: "PENDING" | "PAID" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  createdAt: string;
  items: OrderItem[];
}

const STATUS_LABEL: Record<Order["status"], string> = {
  PENDING: "Pendiente",
  PAID: "Pagada",
  SHIPPED: "Enviada",
  DELIVERED: "Entregada",
  CANCELLED: "Cancelada",
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;

    const fetchOrders = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/orders", { cache: "no-store" });

        if (!response.ok) {
          throw new Error("No se pudo cargar tu historial de pedidos");
        }

        const data = (await response.json()) as { orders: Order[] };

        if (!ignore) {
          setOrders(data.orders);
        }
      } catch {
        if (!ignore) {
          setError("No se pudo cargar tu historial de pedidos");
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    void fetchOrders();

    return () => {
      ignore = true;
    };
  }, []);

  const totalSpent = useMemo(() => orders.reduce((acc, order) => acc + order.total, 0), [orders]);

  return (
    <main className="orders-page">
      <header className="orders-page__header">
        <h1>Mis pedidos</h1>
        <p>
          {orders.length} pedidos · Total acumulado: {formatMoney(totalSpent)}
        </p>
      </header>

      {loading && <div className="orders-empty">Cargando pedidos...</div>}
      {error && <div className="orders-error">{error}</div>}

      {!loading && !error && orders.length === 0 && (
        <div className="orders-empty">Todavía no realizaste ninguna compra.</div>
      )}

      {!loading && !error && orders.length > 0 && (
        <div className="orders-list">
          {orders.map((order) => (
            <article key={order.id} className="order-card">
              <div className="order-card__header">
                <div>
                  <h2>Pedido #{order.id.slice(0, 8)}</h2>
                  <p>{new Date(order.createdAt).toLocaleString("es-AR")}</p>
                </div>
                <span className={`order-status order-status--${order.status.toLowerCase()}`}>
                  {STATUS_LABEL[order.status]}
                </span>
              </div>

              <ul className="order-items">
                {order.items.map((item) => (
                  <li key={item.id}>
                    {item.productName || `Producto #${item.productId ?? "N/A"}`} · {item.quantity} x {formatMoney(item.price)}
                  </li>
                ))}
              </ul>

              <p className="order-total">Total: {formatMoney(order.total)}</p>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
