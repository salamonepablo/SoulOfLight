"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { formatMoney } from "@/lib/price";

type OrderStatus = "PENDING" | "PAID" | "SHIPPED" | "DELIVERED" | "CANCELLED";

interface AdminOrderItem {
  id: string;
  productId: number | null;
  productName: string | null;
  quantity: number;
  price: number;
}

interface AdminOrder {
  id: string;
  total: number;
  status: OrderStatus;
  createdAt: string;
  user: {
    id: string;
    name: string | null;
    email: string;
  };
  items: AdminOrderItem[];
}

const STATUS_OPTIONS: { value: OrderStatus; label: string }[] = [
  { value: "PENDING", label: "Pendiente" },
  { value: "PAID", label: "Pagada" },
  { value: "SHIPPED", label: "Enviada" },
  { value: "DELIVERED", label: "Entregada" },
  { value: "CANCELLED", label: "Cancelada" },
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<"ALL" | OrderStatus>("ALL");
  const [emailFilter, setEmailFilter] = useState("");
  const [fromDateFilter, setFromDateFilter] = useState("");
  const [toDateFilter, setToDateFilter] = useState("");

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/admin/orders", { cache: "no-store" });

      if (!response.ok) {
        throw new Error("No se pudieron cargar las órdenes");
      }

      const data = (await response.json()) as { orders: AdminOrder[] };
      setOrders(data.orders);
    } catch {
      setError("No se pudieron cargar las órdenes");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchOrders();
  }, [fetchOrders]);

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      if (statusFilter !== "ALL" && order.status !== statusFilter) {
        return false;
      }

      if (emailFilter.trim().length > 0) {
        const normalizedEmail = order.user.email.toLowerCase();
        const normalizedQuery = emailFilter.trim().toLowerCase();

        if (!normalizedEmail.includes(normalizedQuery)) {
          return false;
        }
      }

      const orderDate = new Date(order.createdAt);

      if (fromDateFilter) {
        const fromDate = new Date(`${fromDateFilter}T00:00:00`);
        if (orderDate < fromDate) {
          return false;
        }
      }

      if (toDateFilter) {
        const toDate = new Date(`${toDateFilter}T23:59:59`);
        if (orderDate > toDate) {
          return false;
        }
      }

      return true;
    });
  }, [orders, statusFilter, emailFilter, fromDateFilter, toDateFilter]);

  const handleUpdateStatus = async (orderId: string, status: OrderStatus) => {
    setUpdatingOrderId(orderId);
    setError(null);

    try {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      const data = (await response.json().catch(() => null)) as { error?: string } | null;

      if (!response.ok) {
        throw new Error(data?.error || "No se pudo actualizar la orden");
      }

      setOrders((currentOrders) =>
        currentOrders.map((order) => (order.id === orderId ? { ...order, status } : order)),
      );
    } catch (updateError) {
      const message =
        updateError instanceof Error ? updateError.message : "No se pudo actualizar la orden";
      setError(message);
    } finally {
      setUpdatingOrderId(null);
    }
  };

  return (
    <main className="admin-page">
      <div className="admin-page__header">
        <h1>Administración de pedidos</h1>
        <p>
          {filteredOrders.length} de {orders.length} pedidos
        </p>
      </div>

      <div className="admin-orders-filters">
        <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as "ALL" | OrderStatus)}>
          <option value="ALL">Todos los estados</option>
          {STATUS_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Filtrar por email"
          value={emailFilter}
          onChange={(event) => setEmailFilter(event.target.value)}
        />

        <input type="date" value={fromDateFilter} onChange={(event) => setFromDateFilter(event.target.value)} />
        <input type="date" value={toDateFilter} onChange={(event) => setToDateFilter(event.target.value)} />
      </div>

      {error && <div className="admin-error">{error}</div>}

      {loading ? (
        <div className="admin-empty">Cargando pedidos...</div>
      ) : filteredOrders.length === 0 ? (
        <div className="admin-empty">No hay pedidos registrados</div>
      ) : (
        <div className="orders-list">
          {filteredOrders.map((order) => (
            <article key={order.id} className="order-card">
              <div className="order-card__header">
                <div>
                  <h2>Pedido #{order.id.slice(0, 8)}</h2>
                  <p>
                    {new Date(order.createdAt).toLocaleString("es-AR")} · {order.user.name || "Sin nombre"} (
                    {order.user.email})
                  </p>
                </div>

                <div className="admin-order-status-control">
                  <select
                    value={order.status}
                    onChange={(event) => void handleUpdateStatus(order.id, event.target.value as OrderStatus)}
                    disabled={updatingOrderId === order.id}
                  >
                    {STATUS_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
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
