"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import ItemCard from "@/components/ItemCard";
import Link from "next/link";

const CATEGORIES = [
  { value: "all", label: "All", icon: "🗂️" },
  { value: "electronics", label: "Electronics", icon: "💻" },
  { value: "clothing", label: "Clothing", icon: "👕" },
  { value: "accessories", label: "Accessories", icon: "👜" },
  { value: "documents", label: "Documents", icon: "📄" },
  { value: "pets", label: "Pets", icon: "🐾" },
  { value: "keys", label: "Keys", icon: "🔑" },
  { value: "bags", label: "Bags", icon: "🎒" },
  { value: "other", label: "Other", icon: "📦" },
];

export default function BrowsePage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    search: "", type: "", category: "all", location: "",
  });
  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    fetchItems();
  }, [filters]);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.search) params.append("search", filters.search);
      if (filters.type) params.append("type", filters.type);
      if (filters.category && filters.category !== "all")
        params.append("category", filters.category);
      if (filters.location) params.append("location", filters.location);
      const res = await api.get(`/items?${params.toString()}`);
      setItems(res.data.data);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setFilters({ ...filters, search: searchInput });
  };

  const handleChange = (e) =>
    setFilters({ ...filters, [e.target.name]: e.target.value });

  const clearFilters = () => {
    setFilters({ search: "", type: "", category: "all", location: "" });
    setSearchInput("");
  };

  const activeFilterCount = [
    filters.search,
    filters.type,
    filters.category !== "all" ? filters.category : "",
    filters.location,
  ].filter(Boolean).length;

  const lostCount = items.filter((i) => i.type === "lost").length;
  const foundCount = items.filter((i) => i.type === "found").length;

  return (
    <div style={{ background: "var(--surface)", minHeight: "100vh" }}>
      {/* Page header */}
      <div style={{ background: "white", borderBottom: "1px solid var(--border)" }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="font-display font-bold mb-1"
                style={{ fontSize: "clamp(1.5rem, 4vw, 2rem)", color: "var(--text-primary)" }}>
                Browse Items
              </h1>
              <div className="flex items-center gap-3 text-xs" style={{ color: "var(--text-muted)" }}>
                {loading ? (
                  <span>Searching...</span>
                ) : (
                  <>
                    <span>{items.length} item{items.length !== 1 ? "s" : ""} found</span>
                    {items.length > 0 && (
                      <>
                        <span>•</span>
                        <span className="badge-lost" style={{ fontSize: "11px", padding: "2px 8px" }}>
                          {lostCount} lost
                        </span>
                        <span className="badge-found" style={{ fontSize: "11px", padding: "2px 8px" }}>
                          {foundCount} found
                        </span>
                      </>
                    )}
                  </>
                )}
              </div>
            </div>
            <Link href="/post" className="btn-primary self-start sm:self-auto">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 5v14M5 12h14"/>
              </svg>
              Post Item
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">

        {/* Search bar */}
        <form onSubmit={handleSearchSubmit} className="mb-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
              <input
                type="text"
                placeholder="Search by title, description..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="input pl-11"
                style={{ height: "48px", fontSize: "15px" }}
              />
              {searchInput && (
                <button type="button"
                  onClick={() => { setSearchInput(""); setFilters({ ...filters, search: "" }); }}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2"
                  style={{ color: "var(--text-muted)" }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 6 6 18M6 6l12 12"/>
                  </svg>
                </button>
              )}
            </div>
            <button type="submit"
              className="px-5 rounded-xl font-medium text-sm text-white transition-all flex-shrink-0"
              style={{ background: "var(--teal-600)", height: "48px" }}>
              Search
            </button>
            {/* Mobile filter toggle */}
            <button type="button"
              onClick={() => setShowFilters(!showFilters)}
              className="sm:hidden px-4 rounded-xl font-medium text-sm transition-all flex items-center gap-1.5 flex-shrink-0 relative"
              style={{
                height: "48px",
                border: "1.5px solid var(--border)",
                background: showFilters ? "var(--teal-50)" : "white",
                color: showFilters ? "var(--teal-600)" : "var(--text-secondary)",
              }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="11" y1="18" x2="13" y2="18"/>
              </svg>
              {activeFilterCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full text-white flex items-center justify-center font-bold"
                  style={{ background: "var(--teal-600)", fontSize: "10px" }}>
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>
        </form>

        {/* Filters panel */}
        <div className={`card p-4 mb-5 ${showFilters ? "block" : "hidden sm:block"}`}>

          {/* Desktop + mobile filter row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
            <div>
              <label className="label">Type</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: "", label: "All" },
                  { value: "lost", label: "Lost" },
                  { value: "found", label: "Found" },
                ].map((t) => (
                  <button key={t.value} type="button"
                    onClick={() => setFilters({ ...filters, type: t.value })}
                    className="py-2 rounded-lg text-xs font-medium transition-all"
                    style={{
                      border: `1.5px solid ${filters.type === t.value ? "var(--teal-600)" : "var(--border)"}`,
                      background: filters.type === t.value ? "var(--teal-50)" : "white",
                      color: filters.type === t.value ? "var(--teal-700)" : "var(--text-muted)",
                    }}>
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="label">Location</label>
              <div className="relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                  width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>
                </svg>
                <input type="text" name="location"
                  placeholder="City or area..."
                  value={filters.location}
                  onChange={handleChange}
                  className="input pl-9"/>
              </div>
            </div>
          </div>

          {/* Category pills */}
          <div>
            <label className="label">Category</label>
            <div className="flex gap-2 flex-wrap">
              {CATEGORIES.map((c) => (
                <button key={c.value} type="button"
                  onClick={() => setFilters({ ...filters, category: c.value })}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all"
                  style={{
                    background: filters.category === c.value ? "var(--teal-600)" : "var(--surface)",
                    color: filters.category === c.value ? "white" : "var(--text-muted)",
                    border: `1px solid ${filters.category === c.value ? "var(--teal-600)" : "var(--border)"}`,
                  }}>
                  <span style={{ fontSize: "12px" }}>{c.icon}</span>
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* Clear filters */}
          {activeFilterCount > 0 && (
            <div className="mt-4 pt-3" style={{ borderTop: "1px solid var(--border)" }}>
              <button onClick={clearFilters}
                className="inline-flex items-center gap-1.5 text-xs font-medium transition-colors"
                style={{ color: "#dc2626" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6 6 18M6 6l12 12"/>
                </svg>
                Clear all filters ({activeFilterCount})
              </button>
            </div>
          )}
        </div>

        {/* Active filter chips — mobile summary */}
        {activeFilterCount > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {filters.search && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium"
                style={{ background: "var(--teal-50)", color: "var(--teal-700)", border: "1px solid var(--teal-100)" }}>
                Search: "{filters.search}"
                <button onClick={() => { setFilters({ ...filters, search: "" }); setSearchInput(""); }}
                  style={{ lineHeight: 1 }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 6 6 18M6 6l12 12"/>
                  </svg>
                </button>
              </span>
            )}
            {filters.type && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium"
                style={{ background: "var(--teal-50)", color: "var(--teal-700)", border: "1px solid var(--teal-100)" }}>
                Type: {filters.type}
                <button onClick={() => setFilters({ ...filters, type: "" })} style={{ lineHeight: 1 }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 6 6 18M6 6l12 12"/>
                  </svg>
                </button>
              </span>
            )}
            {filters.category !== "all" && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium"
                style={{ background: "var(--teal-50)", color: "var(--teal-700)", border: "1px solid var(--teal-100)" }}>
                {CATEGORIES.find((c) => c.value === filters.category)?.icon} {filters.category}
                <button onClick={() => setFilters({ ...filters, category: "all" })} style={{ lineHeight: 1 }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 6 6 18M6 6l12 12"/>
                  </svg>
                </button>
              </span>
            )}
            {filters.location && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium"
                style={{ background: "var(--teal-50)", color: "var(--teal-700)", border: "1px solid var(--teal-100)" }}>
                📍 {filters.location}
                <button onClick={() => setFilters({ ...filters, location: "" })} style={{ lineHeight: 1 }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 6 6 18M6 6l12 12"/>
                  </svg>
                </button>
              </span>
            )}
          </div>
        )}

        {/* Results */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="card overflow-hidden animate-pulse">
                <div className="h-44" style={{ background: "var(--surface)" }}/>
                <div className="p-4 space-y-3">
                  <div className="flex gap-2">
                    <div className="h-5 w-14 rounded-full" style={{ background: "var(--border)" }}/>
                    <div className="h-5 w-14 rounded-full" style={{ background: "var(--border)" }}/>
                  </div>
                  <div className="h-4 rounded w-3/4" style={{ background: "var(--border)" }}/>
                  <div className="h-3 rounded w-full" style={{ background: "var(--border)" }}/>
                  <div className="h-3 rounded w-2/3" style={{ background: "var(--border)" }}/>
                </div>
              </div>
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-20 card">
            <div style={{ fontSize: "3.5rem", marginBottom: "16px" }}>🔍</div>
            <p className="font-display font-bold text-lg mb-2"
              style={{ color: "var(--text-primary)" }}>
              No items found
            </p>
            <p className="text-sm mb-6" style={{ color: "var(--text-muted)" }}>
              Try adjusting your filters or search terms
            </p>
            {activeFilterCount > 0 && (
              <button onClick={clearFilters} className="btn-primary">
                Clear all filters
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {items.map((item) => (
                <ItemCard key={item._id} item={item} />
              ))}
            </div>
            <p className="text-center text-xs mt-8" style={{ color: "var(--text-muted)" }}>
              Showing all {items.length} result{items.length !== 1 ? "s" : ""}
            </p>
          </>
        )}
      </div>
    </div>
  );
}