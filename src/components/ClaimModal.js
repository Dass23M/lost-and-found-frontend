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
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      style={{ background: "rgba(15,36,33,0.65)", backdropFilter: "blur(6px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="w-full sm:max-w-md"
        style={{
          animation: "slideUp 0.3s ease",
        }}
      >
        <div className="card shadow-2xl overflow-hidden"
          style={{
            borderRadius: "20px 20px 0 0",
            borderBottomLeftRadius: "0",
            borderBottomRightRadius: "0",
          }}>

          {/* Mobile drag handle */}
          <div className="flex justify-center pt-3 pb-1 sm:hidden">
            <div className="w-10 h-1 rounded-full"
              style={{ background: "var(--border)" }}/>
          </div>

          {/* Header */}
          <div className="flex items-start justify-between px-5 sm:px-6 pt-4 sm:pt-6 pb-4"
            style={{ borderBottom: "1px solid var(--border)" }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: "var(--teal-50)" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--teal-600)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
              </div>
              <div>
                <h2 className="font-display font-bold text-base"
                  style={{ color: "var(--text-primary)" }}>
                  Submit a Claim
                </h2>
                <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                  Describe why this item belongs to you
                </p>
              </div>
            </div>
            <button onClick={onClose}
              className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors flex-shrink-0 ml-2"
              style={{ background: "var(--surface)", color: "var(--text-muted)" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6 6 18M6 6l12 12"/>
              </svg>
            </button>
          </div>

          {/* Body */}
          <div className="px-5 sm:px-6 py-5">

            {/* Tips */}
            <div className="p-3 rounded-xl mb-4"
              style={{ background: "var(--teal-50)", border: "1px solid var(--teal-100)" }}>
              <p className="text-xs font-medium mb-1.5" style={{ color: "var(--teal-700)" }}>
                💡 Tips for a strong claim
              </p>
              <ul className="space-y-1">
                {[
                  "Mention specific details only the owner would know",
                  "Include what was inside or unique markings",
                  "State when and where you lost it",
                ].map((tip) => (
                  <li key={tip} className="flex items-start gap-1.5 text-xs"
                    style={{ color: "var(--teal-700)" }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
                      style={{ marginTop: "2px", flexShrink: 0 }}>
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm mb-4"
                style={{ background: "#fef2f2", color: "#dc2626", border: "1px solid #fecaca" }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="8" x2="12" y2="12"/>
                  <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="label" style={{ marginBottom: 0 }}>
                    Your description
                  </label>
                  <span className="text-xs" style={{ color: description.length > 20 ? "var(--teal-600)" : "var(--text-muted)" }}>
                    {description.length} chars
                  </span>
                </div>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  minLength={20}
                  rows={5}
                  placeholder="e.g. It's my black wallet. It has my NIC card, a Sampath bank card, and a small family photo inside. I lost it near the Colombo Fort bus stand on Tuesday..."
                  className="input resize-none"
                  style={{ lineHeight: "1.6" }}
                />
                <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
                  Minimum 20 characters required
                </p>
              </div>

              {/* Action buttons */}
              <div className="flex gap-3 pt-1 pb-1 sm:pb-0">
                <button type="button" onClick={onClose}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-medium text-sm transition-all"
                  style={{ border: "1.5px solid var(--border)", color: "var(--text-secondary)", background: "white" }}>
                  Cancel
                </button>
                <button type="submit" disabled={loading || description.length < 20}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-medium text-sm text-white transition-all disabled:opacity-50"
                  style={{ background: "var(--teal-600)" }}>
                  {loading ? (
                    <>
                      <svg className="animate-spin" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                      </svg>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                      </svg>
                      Submit Claim
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Desktop bottom radius fix */}
        <div className="hidden sm:block card"
          style={{ height: "20px", marginTop: "-20px", borderRadius: "0 0 16px 16px", borderTop: "none" }}/>
      </div>

      <style>{`
        @keyframes slideUp {
          from { transform: translateY(30px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}