"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";

export default function AdminPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [tab, setTab] = useState("items");
  const [items, setItems] = useState([]);
  const [users, setUsers] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (!loading && (!user || user.role !== "admin")) {
      router.push("/");
    }
  }, [user, loading]);

  useEffect(() => {
    if (user?.role === "admin") fetchData();
  }, [user]);

  const fetchData = async () => {
    setDataLoading(true);
    try {
      const [itemsRes, usersRes] = await Promise.all([
        api.get("/users/admin/items"),
        api.get("/users/admin/users"),
      ]);
      setItems(itemsRes.data.data);
      setUsers(usersRes.data.data);
    } catch {
      console.error("Failed to fetch admin data");
    } finally {
      setDataLoading(false);
    }
  };

  const handleDeleteItem = async (id) => {
    if (!confirm("Delete this item?")) return;
    try {
      await api.delete(`/users/admin/items/${id}`);
      setItems((prev) => prev.filter((i) => i._id !== id));
    } catch { alert("Failed to delete item"); }
  };

  const handleDeleteUser = async (id) => {
    if (!confirm("Delete this user? This cannot be undone.")) return;
    try {
      await api.delete(`/users/admin/users/${id}`);
      setUsers((prev) => prev.filter((u) => u._id !== id));
    } catch { alert("Failed to delete user"); }
  };

  const stats = {
    totalItems: items.length,
    activeItems: items.filter((i) => i.status === "active").length,
    resolvedItems: items.filter((i) => i.status === "resolved").length,
    totalUsers: users.length,
  };

  if (loading || !user) return null;

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold mb-1"
          style={{ color: "var(--text-primary)" }}>
          Admin Dashboard
        </h1>
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
          Manage all items and users
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Items", value: stats.totalItems, icon: "📦", color: "var(--teal-600)" },
          { label: "Active Items", value: stats.activeItems, icon: "🟡", color: "#ca8a04" },
          { label: "Resolved", value: stats.resolvedItems, icon: "✅", color: "#16a34a" },
          { label: "Total Users", value: stats.totalUsers, icon: "👥", color: "#2563eb" },
        ].map((s) => (
          <div key={s.label} className="card p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-2xl">{s.icon}</span>
            </div>
            <div className="font-display font-bold text-2xl mb-1"
              style={{ color: s.color }}>{s.value}</div>
            <div className="text-xs" style={{ color: "var(--text-muted)" }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 p-1 rounded-xl w-fit"
        style={{ background: "var(--border)" }}>
        {[
          { key: "items", label: `Items (${items.length})` },
          { key: "users", label: `Users (${users.length})` },
        ].map((t) => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className="px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200"
            style={{
              background: tab === t.key ? "white" : "transparent",
              color: tab === t.key ? "var(--text-primary)" : "var(--text-muted)",
              boxShadow: tab === t.key ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
            }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {dataLoading ? (
        <div className="text-center py-20" style={{ color: "var(--text-muted)" }}>
          Loading...
        </div>
      ) : tab === "items" ? (
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)", background: "var(--surface)" }}>
                <th className="text-left px-4 py-3 font-medium" style={{ color: "var(--text-muted)" }}>Title</th>
                <th className="text-left px-4 py-3 font-medium" style={{ color: "var(--text-muted)" }}>Type</th>
                <th className="text-left px-4 py-3 font-medium" style={{ color: "var(--text-muted)" }}>Status</th>
                <th className="text-left px-4 py-3 font-medium" style={{ color: "var(--text-muted)" }}>Posted By</th>
                <th className="text-left px-4 py-3 font-medium" style={{ color: "var(--text-muted)" }}>Date</th>
                <th className="text-left px-4 py-3 font-medium" style={{ color: "var(--text-muted)" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, i) => (
                <tr key={item._id}
                  style={{ borderBottom: i < items.length - 1 ? "1px solid var(--border)" : "none" }}>
                  <td className="px-4 py-3 font-medium" style={{ color: "var(--text-primary)" }}>
                    <span className="truncate block max-w-xs">{item.title}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={item.type === "lost" ? "badge-lost" : "badge-found"}>
                      {item.type}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={item.status === "resolved" ? "badge-resolved" : "badge-active"}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-4 py-3" style={{ color: "var(--text-secondary)" }}>
                    {item.postedBy?.name}
                  </td>
                  <td className="px-4 py-3" style={{ color: "var(--text-muted)" }}>
                    {new Date(item.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => handleDeleteItem(item._id)}
                      className="text-xs px-3 py-1.5 rounded-lg font-medium transition-colors"
                      style={{ background: "#fef2f2", color: "#dc2626" }}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)", background: "var(--surface)" }}>
                <th className="text-left px-4 py-3 font-medium" style={{ color: "var(--text-muted)" }}>Name</th>
                <th className="text-left px-4 py-3 font-medium" style={{ color: "var(--text-muted)" }}>Email</th>
                <th className="text-left px-4 py-3 font-medium" style={{ color: "var(--text-muted)" }}>Role</th>
                <th className="text-left px-4 py-3 font-medium" style={{ color: "var(--text-muted)" }}>Joined</th>
                <th className="text-left px-4 py-3 font-medium" style={{ color: "var(--text-muted)" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u, i) => (
                <tr key={u._id}
                  style={{ borderBottom: i < users.length - 1 ? "1px solid var(--border)" : "none" }}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                        style={{ background: "var(--teal-600)" }}>
                        {u.name?.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-medium" style={{ color: "var(--text-primary)" }}>
                        {u.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3" style={{ color: "var(--text-secondary)" }}>{u.email}</td>
                  <td className="px-4 py-3">
                    <span className="text-xs px-2 py-1 rounded-full font-medium"
                      style={{
                        background: u.role === "admin" ? "var(--teal-50)" : "var(--surface)",
                        color: u.role === "admin" ? "var(--teal-700)" : "var(--text-muted)",
                        border: "1px solid var(--border)",
                      }}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-4 py-3" style={{ color: "var(--text-muted)" }}>
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    {u.role !== "admin" && (
                      <button onClick={() => handleDeleteUser(u._id)}
                        className="text-xs px-3 py-1.5 rounded-lg font-medium transition-colors"
                        style={{ background: "#fef2f2", color: "#dc2626" }}>
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}