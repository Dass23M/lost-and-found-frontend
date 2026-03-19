"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import ItemCard from "@/components/ItemCard";

const CATEGORIES = ["all","electronics","clothing","accessories","documents","pets","keys","bags","other"];

export default function BrowsePage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ search: "", type: "", category: "all", location: "" });

  useEffect(() => { fetchItems(); }, [filters]);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.search) params.append("search", filters.search);
      if (filters.type) params.append("type", filters.type);
      if (filters.category && filters.category !== "all") params.append("category", filters.category);
      if (filters.location) params.append("location", filters.location);
      const res = await api.get(`/items?${params.toString()}`);
      setItems(res.data.data);
    } catch { setItems([]); }
    finally { setLoading(false); }
  };

  const handleChange = (e) => setFilters({ ...filters, [e.target.name]: e.target.value });

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-3xl font-700 mb-1" style={{ color: "var(--text-primary)" }}>
          Browse Items
        </h1>
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
          {items.length} item{items.length !== 1 ? "s" : ""} found
        </p>
      </div>

      {/* Filters */}
      <div className="card p-4 mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input type="text" name="search" placeholder="Search items..."
              value={filters.search} onChange={handleChange}
              className="input pl-9"/>
          </div>
          <select name="type" value={filters.type} onChange={handleChange} className="input">
            <option value="">All Types</option>
            <option value="lost">Lost</option>
            <option value="found">Found</option>
          </select>
          <select name="category" value={filters.category} onChange={handleChange} className="input">
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
            ))}
          </select>
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>
            </svg>
            <input type="text" name="location" placeholder="Location..."
              value={filters.location} onChange={handleChange}
              className="input pl-9"/>
          </div>
        </div>

        {/* Category pills */}
        <div className="flex gap-2 mt-3 flex-wrap">
          {CATEGORIES.map((c) => (
            <button key={c} onClick={() => setFilters({ ...filters, category: c })}
              className="px-3 py-1 rounded-full text-xs font-medium transition-all"
              style={{
                background: filters.category === c ? "var(--teal-600)" : "var(--surface)",
                color: filters.category === c ? "white" : "var(--text-muted)",
                border: `1px solid ${filters.category === c ? "var(--teal-600)" : "var(--border)"}`,
              }}>
              {c.charAt(0).toUpperCase() + c.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="card h-64 animate-pulse"
              style={{ background: "var(--border)" }}/>
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-20 card">
          <div className="text-5xl mb-4">🔍</div>
          <p className="font-display font-600 text-lg mb-2">No items found</p>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>Try adjusting your filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => <ItemCard key={item._id} item={item} />)}
        </div>
      )}
    </div>
  );
}