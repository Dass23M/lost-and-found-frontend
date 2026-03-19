"use client";

import { useState } from "react";
import api from "@/lib/api";

export default function ClaimModal({ itemId, onClose, onSuccess }) {
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.post("/claims", { itemId, description });
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit claim");
    } finally { setLoading(false); }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 px-4"
      style={{ background: "rgba(15,36,33,0.6)", backdropFilter: "blur(4px)" }}>
      <div className="card w-full max-w-md shadow-2xl p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="font-display font-700 text-lg" style={{ color: "var(--text-primary)" }}>
              Submit a Claim
            </h2>
            <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
              Describe why this item belongs to you
            </p>
          </div>
          <button onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
            style={{ background: "var(--surface)", color: "var(--text-muted)" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6 6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>

        {error && (
          <div className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm mb-4"
            style={{ background: "#fef2f2", color: "#dc2626", border: "1px solid #fecaca" }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Your description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)}
              required rows={4}
              placeholder="e.g. It's my black wallet with my NIC card and a Sampath bank card inside. There's also a small photo of my family..."
              className="input resize-none"/>
          </div>
          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose} className="btn-outline flex-1 justify-center">
              Cancel
            </button>
            <button type="submit" disabled={loading}
              className="flex-1 py-2.5 rounded-xl font-medium text-sm text-white transition-all duration-200 disabled:opacity-50"
              style={{ background: "var(--teal-600)" }}>
              {loading ? "Submitting..." : "Submit Claim"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}