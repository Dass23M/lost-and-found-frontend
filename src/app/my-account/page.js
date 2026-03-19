"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import ItemCard from "@/components/ItemCard";

export default function MyAccountPage() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [claims, setClaims] = useState([]);
  const [tab, setTab] = useState("items");
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [itemsRes, claimsRes] = await Promise.all([
        api.get("/users/my-items"),
        api.get("/claims/my-claims"),
      ]);
      setItems(itemsRes.data.data);
      setClaims(claimsRes.data.data);
    } catch {} finally { setLoading(false); }
  };

  const handleDelete = async (itemId) => {
    if (!confirm("Are you sure you want to delete this item?")) return;
    try {
      await api.delete(`/items/${itemId}`);
      setItems((prev) => prev.filter((i) => i._id !== itemId));
    } catch { alert("Failed to delete item"); }
  };

  const claimStatusStyle = (status) => {
    if (status === "approved") return { background: "#f0fdf4", color: "#16a34a", border: "1px solid #bbf7d0" };
    if (status === "rejected") return { background: "#fef2f2", color: "#dc2626", border: "1px solid #fecaca" };
    return { background: "#fefce8", color: "#ca8a04", border: "1px solid #fef08a" };
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      {/* Profile card */}
      <div className="card p-6 mb-8 flex items-center gap-5">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold text-white flex-shrink-0"
          style={{ background: "linear-gradient(135deg, var(--teal-600), var(--teal-400))" }}>
          {user?.name?.charAt(0).toUpperCase()}
        </div>
        <div>
          <h1 className="font-display font-700 text-xl" style={{ color: "var(--text-primary)" }}>
            {user?.name}
          </h1>
          <p className="text-sm mt-0.5" style={{ color: "var(--text-muted)" }}>{user?.email}</p>
          <div className="flex gap-4 mt-2">
            <span className="text-xs font-medium" style={{ color: "var(--teal-600)" }}>
              {items.length} items posted
            </span>
            <span className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>
              {claims.length} claims submitted
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 p-1 rounded-xl w-fit"
        style={{ background: "var(--border)" }}>
        {[
          { key: "items", label: `My Items (${items.length})` },
          { key: "claims", label: `My Claims (${claims.length})` },
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

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="card h-64 animate-pulse" style={{ background: "var(--border)" }}/>
          ))}
        </div>
      ) : tab === "items" ? (
        items.length === 0 ? (
          <div className="text-center py-20 card">
            <div className="text-5xl mb-4">📝</div>
            <p className="font-display font-600 text-lg mb-2">No items yet</p>
            <p className="text-sm mb-6" style={{ color: "var(--text-muted)" }}>
              Post your first lost or found item
            </p>
            <a href="/post" className="btn-primary">Post an Item</a>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <div key={item._id} className="relative group">
                <ItemCard item={item} />
                <button onClick={() => handleDelete(item._id)}
                  className="absolute top-3 right-3 w-8 h-8 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
                  style={{ background: "#ef4444", color: "white" }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )
      ) : claims.length === 0 ? (
        <div className="text-center py-20 card">
          <div className="text-5xl mb-4">🔖</div>
          <p className="font-display font-600 text-lg mb-2">No claims yet</p>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            Browse items and submit a claim when you find yours
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {claims.map((claim) => (
            <div key={claim._id} className="card p-4 flex items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate" style={{ color: "var(--text-primary)" }}>
                  {claim.item?.title}
                </p>
                <p className="text-xs mt-0.5 truncate" style={{ color: "var(--text-muted)" }}>
                  {claim.description}
                </p>
              </div>
              <span className="text-xs font-semibold px-3 py-1 rounded-full flex-shrink-0"
                style={claimStatusStyle(claim.status)}>
                {claim.status.toUpperCase()}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}