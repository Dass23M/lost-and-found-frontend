"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

const CATEGORIES = ["electronics","clothing","accessories","documents","pets","keys","bags","other"];

export default function PostItemPage() {
  const router = useRouter();
  const [form, setForm] = useState({ title: "", description: "", category: "", type: "", location: "" });
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([k, v]) => formData.append(k, v));
      images.forEach((img) => formData.append("images", img));
      await api.post("/items", formData, { headers: { "Content-Type": "multipart/form-data" } });
      router.push("/my-account");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to post item");
    } finally { setLoading(false); }
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-700 mb-1" style={{ color: "var(--text-primary)" }}>
          Post an Item
        </h1>
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
          Fill in the details to help the community identify your item
        </p>
      </div>

      {error && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm mb-6"
          style={{ background: "#fef2f2", color: "#dc2626", border: "1px solid #fecaca" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          {error}
        </div>
      )}

      <div className="card p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Type */}
          <div>
            <label className="label">Item type</label>
            <div className="grid grid-cols-2 gap-3">
              {["lost", "found"].map((t) => (
                <button type="button" key={t}
                  onClick={() => setForm({ ...form, type: t })}
                  className="flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium transition-all border-2"
                  style={{
                    borderColor: form.type === t ? (t === "lost" ? "#dc2626" : "#2563eb") : "var(--border)",
                    background: form.type === t ? (t === "lost" ? "#fef2f2" : "#eff6ff") : "white",
                    color: form.type === t ? (t === "lost" ? "#dc2626" : "#2563eb") : "var(--text-muted)",
                  }}>
                  {t === "lost" ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  )}
                  {t === "lost" ? "I Lost Something" : "I Found Something"}
                </button>
              ))}
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="label">Category</label>
            <select name="category" value={form.category} onChange={handleChange} required className="input">
              <option value="">Select a category</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
              ))}
            </select>
          </div>

          {/* Title */}
          <div>
            <label className="label">Title</label>
            <input type="text" name="title" value={form.title} onChange={handleChange}
              required placeholder="e.g. Black leather wallet" className="input"/>
          </div>

          {/* Description */}
          <div>
            <label className="label">Description</label>
            <textarea name="description" value={form.description} onChange={handleChange}
              required rows={4} placeholder="Describe the item in detail — color, brand, distinguishing features..."
              className="input resize-none"/>
          </div>

          {/* Location */}
          <div>
            <label className="label">Location</label>
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>
              </svg>
              <input type="text" name="location" value={form.location} onChange={handleChange}
                required placeholder="e.g. Colombo Fort bus station" className="input pl-9"/>
            </div>
          </div>

          {/* Images */}
          <div>
            <label className="label">Photos (optional)</label>
            <label className="flex flex-col items-center justify-center gap-2 py-8 rounded-xl cursor-pointer transition-colors"
              style={{ border: "2px dashed var(--border)", background: images.length > 0 ? "var(--teal-50)" : "white" }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/>
                <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
              </svg>
              <span className="text-sm" style={{ color: "var(--text-muted)" }}>
                {images.length > 0 ? `${images.length} file(s) selected` : "Click to upload photos"}
              </span>
              <span className="text-xs" style={{ color: "var(--text-muted)" }}>PNG, JPG up to 5 images</span>
              <input type="file" accept="image/*" multiple className="hidden"
                onChange={(e) => setImages(Array.from(e.target.files))}/>
            </label>
          </div>

          <button type="submit" disabled={loading || !form.type}
            className="w-full py-3 rounded-xl font-medium text-sm text-white transition-all duration-200 disabled:opacity-50 hover:-translate-y-0.5"
            style={{ background: "var(--teal-600)" }}>
            {loading ? "Posting..." : "Post Item"}
          </button>
        </form>
      </div>
    </div>
  );
}