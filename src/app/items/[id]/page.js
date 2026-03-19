"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import ClaimModal from "@/components/ClaimModal";
import ItemCard from "@/components/ItemCard";

export default function ItemDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [item, setItem] = useState(null);
  const [claims, setClaims] = useState([]);
  const [relatedItems, setRelatedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [claimSuccess, setClaimSuccess] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchItem();
  }, [id]);

  const fetchItem = async () => {
    try {
      const res = await api.get(`/items/${id}`);
      const itemData = res.data.data;
      setItem(itemData);

      if (user && itemData.postedBy._id === user._id) {
        const claimsRes = await api.get(`/claims/item/${id}`);
        setClaims(claimsRes.data.data);
      }

      const relatedRes = await api.get(
        `/items?category=${itemData.category}&type=${itemData.type}&status=active`
      );
      const filtered = relatedRes.data.data
        .filter((i) => i._id !== id)
        .slice(0, 3);
      setRelatedItems(filtered);
    } catch {
      setItem(null);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (claimId) => {
    try {
      await api.patch(`/claims/${claimId}/approve`);
      fetchItem();
    } catch {
      alert("Failed to approve claim");
    }
  };

  const handleReject = async (claimId) => {
    try {
      await api.patch(`/claims/${claimId}/reject`);
      fetchItem();
    } catch {
      alert("Failed to reject claim");
    }
  };

  const handleResolve = async () => {
    try {
      await api.patch(`/items/${id}/resolve`);
      fetchItem();
    } catch {
      alert("Failed to resolve item");
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) return (
    <div className="text-center py-20" style={{ color: "var(--text-muted)" }}>
      Loading...
    </div>
  );
  if (!item) return (
    <div className="text-center py-20" style={{ color: "var(--text-muted)" }}>
      Item not found
    </div>
  );

  const isOwner = user && item.postedBy._id === user._id;

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <div className="card overflow-hidden">
        {/* Image */}
        {item.images && item.images.length > 0 ? (
          <img
            src={item.images[0]}
            alt={item.title}
            className="w-full h-72 object-cover"
          />
        ) : (
          <div className="w-full h-48 flex items-center justify-center"
            style={{ background: "var(--teal-50)" }}>
            <span className="text-5xl">📦</span>
          </div>
        )}

        <div className="p-6">
          {/* Badges */}
          <div className="flex flex-wrap gap-2 mb-4">
            <span className={item.type === "lost" ? "badge-lost" : "badge-found"}>
              {item.type.toUpperCase()}
            </span>
            <span className={item.status === "resolved" ? "badge-resolved" : "badge-active"}>
              {item.status.toUpperCase()}
            </span>
            <span className="text-xs px-2.5 py-1 rounded-full font-medium"
              style={{ background: "var(--surface)", color: "var(--text-muted)", border: "1px solid var(--border)" }}>
              {item.category}
            </span>
          </div>

          <h1 className="font-display text-2xl font-bold mb-2"
            style={{ color: "var(--text-primary)" }}>
            {item.title}
          </h1>
          <p className="text-sm leading-relaxed mb-4"
            style={{ color: "var(--text-secondary)" }}>
            {item.description}
          </p>

          <div className="flex flex-wrap items-center gap-4 text-sm mb-6 pb-6"
            style={{ borderBottom: "1px solid var(--border)" }}>
            <span className="flex items-center gap-1.5" style={{ color: "var(--text-muted)" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>
              </svg>
              {item.location}
            </span>
            <span className="flex items-center gap-1.5" style={{ color: "var(--text-muted)" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
              </svg>
              {item.postedBy.name}
            </span>
            <span className="flex items-center gap-1.5" style={{ color: "var(--text-muted)" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/>
              </svg>
              {new Date(item.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
            </span>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-3">
            {!isOwner && user && item.status === "active" && (
              <button onClick={() => setShowModal(true)} className="btn-primary">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
                Submit Claim
              </button>
            )}

            {isOwner && item.status === "active" && (
              <button onClick={handleResolve}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200"
                style={{ border: "1.5px solid #16a34a", color: "#16a34a", background: "white" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                Mark as Resolved
              </button>
            )}

            {/* Share button */}
            <button onClick={handleShare}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200"
              style={{
                border: "1.5px solid var(--border)",
                background: copied ? "var(--teal-50)" : "white",
                color: copied ? "var(--teal-600)" : "var(--text-secondary)",
              }}>
              {copied ? (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  Copied!
                </>
              ) : (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/>
                  </svg>
                  Share
                </>
              )}
            </button>
          </div>

          {claimSuccess && (
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm mt-4"
              style={{ background: "#f0fdf4", color: "#16a34a", border: "1px solid #bbf7d0" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              Claim submitted successfully! The owner will be notified.
            </div>
          )}

          {/* Claims section (owner only) */}
          {isOwner && claims.length > 0 && (
            <div className="mt-8">
              <h2 className="font-display text-lg font-bold mb-4"
                style={{ color: "var(--text-primary)" }}>
                Claims ({claims.length})
              </h2>
              <div className="space-y-3">
                {claims.map((claim) => (
                  <div key={claim._id} className="p-4 rounded-xl"
                    style={{ border: "1px solid var(--border)", background: "var(--surface)" }}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-sm" style={{ color: "var(--text-primary)" }}>
                        {claim.claimant.name}
                      </span>
                      <span className={
                        claim.status === "approved" ? "badge-resolved" :
                        claim.status === "rejected" ? "badge-lost" :
                        "badge-active"
                      }>
                        {claim.status.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-sm mb-3" style={{ color: "var(--text-secondary)" }}>
                      {claim.description}
                    </p>
                    {claim.status === "pending" && (
                      <div className="flex gap-2">
                        <button onClick={() => handleApprove(claim._id)}
                          className="text-xs px-4 py-1.5 rounded-lg font-medium text-white transition-colors"
                          style={{ background: "#16a34a" }}>
                          Approve
                        </button>
                        <button onClick={() => handleReject(claim._id)}
                          className="text-xs px-4 py-1.5 rounded-lg font-medium text-white transition-colors"
                          style={{ background: "#dc2626" }}>
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Related Items */}
      {relatedItems.length > 0 && (
        <div className="mt-10">
          <h2 className="font-display text-xl font-bold mb-5"
            style={{ color: "var(--text-primary)" }}>
            Similar Items
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {relatedItems.map((relItem) => (
              <ItemCard key={relItem._id} item={relItem} />
            ))}
          </div>
        </div>
      )}

      {showModal && (
        <ClaimModal
          itemId={id}
          onClose={() => setShowModal(false)}
          onSuccess={() => setClaimSuccess(true)}
        />
      )}
    </div>
  );
}