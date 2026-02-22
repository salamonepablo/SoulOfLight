"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

interface AdminUser {
  id: string;
  name: string | null;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/admin/users", { cache: "no-store" });

      if (!response.ok) {
        throw new Error("No se pudieron cargar los usuarios");
      }

      const data = (await response.json()) as { users: AdminUser[] };
      setUsers(data.users);
    } catch {
      setError("No se pudieron cargar los usuarios");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchUsers();
  }, [fetchUsers]);

  const activeUsers = useMemo(() => users.filter((user) => user.isActive).length, [users]);

  const handleToggleStatus = async (user: AdminUser) => {
    setUpdatingUserId(user.id);
    setError(null);

    try {
      const response = await fetch(`/api/admin/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !user.isActive }),
      });

      if (!response.ok) {
        const body = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(body?.error || "No se pudo actualizar el usuario");
      }

      setUsers((currentUsers) =>
        currentUsers.map((currentUser) =>
          currentUser.id === user.id
            ? { ...currentUser, isActive: !currentUser.isActive }
            : currentUser,
        ),
      );
    } catch (fetchError) {
      const message =
        fetchError instanceof Error ? fetchError.message : "No se pudo actualizar el usuario";
      setError(message);
    } finally {
      setUpdatingUserId(null);
    }
  };

  return (
    <main className="admin-page">
      <div className="admin-page__header">
        <h1>Administración de usuarios</h1>
        <p>
          {activeUsers} activos de {users.length} totales
        </p>
      </div>

      {error && <div className="admin-error">{error}</div>}

      {loading ? (
        <div className="admin-empty">Cargando usuarios...</div>
      ) : users.length === 0 ? (
        <div className="admin-empty">No hay usuarios registrados</div>
      ) : (
        <div className="admin-users-grid">
          {users.map((user) => (
            <article key={user.id} className="admin-user-card">
              <div className="admin-user-card__title">
                <h2>{user.name || "Sin nombre"}</h2>
                <span className={`status-chip ${user.isActive ? "status-active" : "status-inactive"}`}>
                  {user.isActive ? "Activo" : "Inactivo"}
                </span>
              </div>

              <p>{user.email}</p>
              <p>Rol: {user.role}</p>

              <button
                type="button"
                className="admin-toggle-button"
                onClick={() => void handleToggleStatus(user)}
                disabled={updatingUserId === user.id}
              >
                {updatingUserId === user.id
                  ? "Actualizando..."
                  : user.isActive
                    ? "Dar de baja"
                    : "Reactivar"}
              </button>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
