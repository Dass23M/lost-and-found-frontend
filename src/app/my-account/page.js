"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import ItemCard from "@/components/ItemCard";

export default function MyAccountPage() {
  const { user, logout } = useAuth();
  const [items, setItems] = useState([]);
  const [claims, setClaims] = useState([]);
  const [tab, setTab] = useState("items");
  const [loading, setLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

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
    } catch {}
    finally { setLoading(false); }
  };

  const handleDelete = async (itemId) => {
    try {
      await api.delete(`/items/${itemId}`);
      setItems((prev) => prev.filter((i) => i._id !== itemId));
      setDeleteConfirm(null);
    } catch { alert("Failed to delete item"); }
  };

  const claimStatusStyle = (status) => {
    if (status === "approved") return { background: "#f0fdf4", color: "#16a34a", border: "1px solid #bbf7d0" };
    if (status === "rejected") return { background: "#fef2f2", color: "#dc2626", border: "1px solid #fecaca" };
    return { background: "#fefce8", color: "#ca8a04", border: "1px solid #fef08a" };
  };

  const activeItems = items.filter((i) => i.status === "active").length;
  const resolvedItems = items.filter((i) => i.status === "resolved").length;
  const approvedClaims = claims.filter((c) => c.status === "approved").length;

  return (
    <div style={{ background: "var(--surface)", minHeight: "100vh" }}>

      {/* Profile header */}
      <div style={{ background: "linear-gradient(135deg, var(--teal-900), var(--teal-700))" }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
          <div className="flex flex-col sm:flex-row sm:items-center gap-5">

            {/* Avatar */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center font-bold text-white flex-shrink-0"
              style={{
                background: "rgba(255,255,255,0.2)",
                fontSize: "clamp(1.4rem, 4vw, 1.8rem)",
                border: "2px solid rgba(255,255,255,0.3)",
              }}>
              {user?.name?.charAt(0).toUpperCase()}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <h1 className="font-display font-bold text-white mb-1"
                style={{ fontSize: "clamp(1.2rem, 3vw, 1.6rem)" }}>
                {user?.name}
              </h1>
              <p className="text-sm mb-3" style={{ color: "rgba(255,255,255,0.65)" }}>
                {user?.email}
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium"
                  style={{ background: "rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.9)" }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
                  </svg>
                  {items.length} items posted
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium"
                  style={{ background: "rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.9)" }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                  </svg>
                  {claims.length} claims made
                </span>
                {user?.role === "admin" && (
                  <Link href="/admin"
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-colors"
                    style={{ background: "var(--amber-500)", color: "white" }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>
                    </svg>
                    Admin Dashboard
                  </Link>
                )}
              </div>
            </div>

            {/* Post button */}
            <Link href="/post"
              className="self-start sm:self-center inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-all flex-shrink-0"
              style={{ background: "var(--amber-500)", color: "white" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 5v14M5 12h14"/>
              </svg>
              Post Item
            </Link>
          </div>
        </div>
      </div>

      {/* Stats bar */}
      <div style={{ background: "white", borderBottom: "1px solid var(--border)" }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-3 divide-x" style={{ "--tw-divide-opacity": 1 }}>
            {[
              { value: activeItems, label: "Active", icon: "🟡" },
              { value: resolvedItems, label: "Resolved", icon: "✅" },
              { value: approvedClaims, label: "Approved claims", icon: "🤝" },
            ].map((s) => (
              <div key={s.label} className="py-4 px-3 sm:px-6 text-center"
                style={{ borderRight: "1px solid var(--border)" }}>
                <div className="font-display font-bold text-xl sm:text-2xl mb-0.5"
                  style={{ color: "var(--teal-600)" }}>
                  {s.value}
                </div>
                <div className="text-xs" style={{ color: "var(--text-muted)" }}>
                  {s.icon} {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">

        {/* Tabs */}
        <div className="flex gap-2 mb-6 p-1 rounded-xl"
          style={{ background: "var(--border)", width: "fit-content" }}>
          {[
            { key: "items", label: "My Items", count: items.length, icon: "📦" },
            { key: "claims", label: "My Claims", count: claims.length, icon: "🔖" },
          ].map((t) => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className="flex items-center gap-2 px-4 sm:px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200"
              style={{
                background: tab === t.key ? "white" : "transparent",
                color: tab === t.key ? "var(--text-primary)" : "var(--text-muted)",
                boxShadow: tab === t.key ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
              }}>
              <span className="hidden sm:inline">{t.icon}</span>
              {t.label}
              <span className="text-xs px-1.5 py-0.5 rounded-full font-bold"
                style={{
                  background: tab === t.key ? "var(--teal-50)" : "var(--surface)",
                  color: tab === t.key ? "var(--teal-700)" : "var(--text-muted)",
                }}>
                {t.count}
              </span>
            </button>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="card overflow-hidden animate-pulse">
                <div className="h-44" style={{ background: "var(--surface)" }}/>
                <div className="p-4 space-y-3">
                  <div className="h-4 rounded w-2/3" style={{ background: "var(--border)" }}/>
                  <div className="h-3 rounded w-full" style={{ background: "var(--border)" }}/>
                </div>
              </div>
            ))}
          </div>
        ) : tab === "items" ? (
          items.length === 0 ? (
            <div className="text-center py-16 card">
              <div style={{ fontSize: "3.5rem", marginBottom: "16px" }}>📝</div>
              <p className="font-display font-bold text-lg mb-2"
                style={{ color: "var(--text-primary)" }}>
                No items posted yet
              </p>
              <p className="text-sm mb-6" style={{ color: "var(--text-muted)" }}>
                Post your first lost or found item to get started
              </p>
              <Link href="/post" className="btn-primary">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 5v14M5 12h14"/>
                </svg>
                Post an Item
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {items.map((item) => (
                <div key={item._id} className="relative group">
                  <ItemCard item={item} />
                  {/* Delete button — always visible on mobile, hover on desktop */}
                  <button
                    onClick={() => setDeleteConfirm(item._id)}
                    className="absolute top-3 right-3 w-8 h-8 rounded-lg flex items-center justify-center transition-all sm:opacity-0 sm:group-hover:opacity-100"
                    style={{ background: "#ef4444", color: "white", opacity: 1 }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6"/>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )
        ) : claims.length === 0 ? (
          <div className="text-center py-16 card">
            <div style={{ fontSize: "3.5rem", marginBottom: "16px" }}>🔖</div>
            <p className="font-display font-bold text-lg mb-2"
              style={{ color: "var(--text-primary)" }}>
              No claims submitted yet
            </p>
            <p className="text-sm mb-6" style={{ color: "var(--text-muted)" }}>
              Browse items and submit a claim when you find yours
            </p>
            <Link href="/items" className="btn-primary">
              Browse Items
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {claims.map((claim) => (
              <div key={claim._id} className="card p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <p className="font-medium text-sm" style={{ color: "var(--text-primary)" }}>
                        {claim.item?.title || "Item removed"}
                      </p>
                      {claim.item?.type && (
                        <span className={claim.item.type === "lost" ? "badge-lost" : "badge-found"}
                          style={{ fontSize: "10px", padding: "2px 8px" }}>
                          {claim.item.type}
                        </span>
                      )}
                    </div>
                    <p className="text-xs leading-relaxed mb-2"
                      style={{ color: "var(--text-muted)" }}>
                      {claim.description}
                    </p>
                    <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                      Submitted {new Date(claim.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </p>
                  </div>
                  <span className="text-xs font-semibold px-3 py-1.5 rounded-full flex-shrink-0"
                    style={claimStatusStyle(claim.status)}>
                    {claim.status === "approved" ? "✓ " : claim.status === "rejected" ? "✗ " : "⏳ "}
                    {claim.status.charAt(0).toUpperCase() + claim.status.slice(1)}
                  </span>
                </div>

                {/* Approved message */}
                {claim.status === "approved" && (
                  <div className="mt-3 pt-3 flex items-center gap-2 text-xs"
                    style={{ borderTop: "1px solid var(--border)", color: "#16a34a" }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                    Your claim was approved! Contact the owner to arrange the return.
                  </div>
                )}

                {/* Rejected message */}
                {claim.status === "rejected" && (
                  <div className="mt-3 pt-3 flex items-center gap-2 text-xs"
                    style={{ borderTop: "1px solid var(--border)", color: "#dc2626" }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 6 6 18M6 6l12 12"/>
                    </svg>
                    This claim was not approved. You may browse similar items.
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete confirmation modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 flex items-end sm:items-center justify-center z-50 px-4 pb-4 sm:pb-0"
          style={{ background: "rgba(15,36,33,0.6)", backdropFilter: "blur(4px)" }}>
          <div className="card w-full max-w-sm p-6 shadow-2xl">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4"
              style={{ background: "#fef2f2" }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6"/>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
              </svg>
            </div>
            <h3 className="font-display font-bold text-center mb-1"
              style={{ color: "var(--text-primary)" }}>
              Delete Item
            </h3>
            <p className="text-sm text-center mb-6" style={{ color: "var(--text-muted)" }}>
              Are you sure? This action cannot be undone and all claims will be lost.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)}
                className="flex-1 py-2.5 rounded-xl text-sm font-medium transition-colors"
                style={{ border: "1.5px solid var(--border)", color: "var(--text-secondary)", background: "white" }}>
                Cancel
              </button>
              <button onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 py-2.5 rounded-xl text-sm font-medium text-white transition-colors"
                style={{ background: "#dc2626" }}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}