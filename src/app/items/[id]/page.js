"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import ClaimModal from "@/components/ClaimModal";
import ItemCard from "@/components/ItemCard";

export default function ItemDetailPage() {
  const { id } = useParams();
  const router = useRouter();
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
    } catch { alert("Failed to approve claim"); }
  };

  const handleReject = async (claimId) => {
    try {
      await api.patch(`/claims/${claimId}/reject`);
      fetchItem();
    } catch { alert("Failed to reject claim"); }
  };

  const handleResolve = async () => {
    try {
      await api.patch(`/items/${id}/resolve`);
      fetchItem();
    } catch { alert("Failed to resolve item"); }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      {/* Skeleton loader */}
      <div className="card overflow-hidden animate-pulse">
        <div className="w-full h-56 sm:h-72" style={{ background: "var(--border)" }}/>
        <div className="p-5 sm:p-6 space-y-4">
          <div className="flex gap-2">
            <div className="h-6 w-16 rounded-full" style={{ background: "var(--border)" }}/>
            <div className="h-6 w-16 rounded-full" style={{ background: "var(--border)" }}/>
          </div>
          <div className="h-7 rounded-lg w-2/3" style={{ background: "var(--border)" }}/>
          <div className="space-y-2">
            <div className="h-4 rounded w-full" style={{ background: "var(--border)" }}/>
            <div className="h-4 rounded w-5/6" style={{ background: "var(--border)" }}/>
          </div>
          <div className="flex gap-3 pt-2">
            <div className="h-10 w-32 rounded-xl" style={{ background: "var(--border)" }}/>
            <div className="h-10 w-24 rounded-xl" style={{ background: "var(--border)" }}/>
          </div>
        </div>
      </div>
    </div>
  );

  if (!item) return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
      <div style={{ fontSize: "4rem", marginBottom: "16px" }}>🔍</div>
      <h2 className="font-display font-bold text-xl mb-2" style={{ color: "var(--text-primary)" }}>
        Item not found
      </h2>
      <p className="text-sm mb-6" style={{ color: "var(--text-muted)" }}>
        This item may have been removed or doesn't exist.
      </p>
      <button onClick={() => router.push("/items")} className="btn-primary">
        Browse Items
      </button>
    </div>
  );

  const isOwner = user && item.postedBy._id === user._id;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10">

      {/* Back button */}
      <button onClick={() => router.back()}
        className="inline-flex items-center gap-2 text-sm font-medium mb-5 transition-colors"
        style={{ color: "var(--text-muted)" }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="m12 19-7-7 7-7"/><path d="M19 12H5"/>
        </svg>
        Back
      </button>

      <div className="card overflow-hidden">

        {/* Image */}
        {item.images && item.images.length > 0 ? (
          <div className="relative w-full overflow-hidden" style={{ height: "clamp(200px, 40vw, 320px)" }}>
            <img src={item.images[0]} alt={item.title}
              className="w-full h-full object-cover"/>
            {/* Type overlay badge on image */}
            <div className="absolute top-4 left-4">
              <span className={item.type === "lost" ? "badge-lost" : "badge-found"}
                style={{ backdropFilter: "blur(8px)", fontSize: "12px", padding: "6px 12px" }}>
                {item.type === "lost" ? (
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                  </svg>
                ) : (
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                )}
                {item.type.toUpperCase()}
              </span>
            </div>
          </div>
        ) : (
          <div className="w-full flex flex-col items-center justify-center gap-3"
            style={{ height: "clamp(160px, 30vw, 220px)", background: "var(--teal-50)" }}>
            <span style={{ fontSize: "3.5rem" }}>📦</span>
            <span className="text-xs" style={{ color: "var(--text-muted)" }}>No image provided</span>
          </div>
        )}

        <div className="p-5 sm:p-6 lg:p-8">

          {/* Badges row */}
          <div className="flex flex-wrap gap-2 mb-4">
            {item.images?.length > 0 && (
              <span className={item.type === "lost" ? "badge-lost" : "badge-found"}>
                {item.type.toUpperCase()}
              </span>
            )}
            <span className={item.status === "resolved" ? "badge-resolved" : "badge-active"}>
              {item.status === "resolved" ? (
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              ) : (
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                </svg>
              )}
              {item.status.toUpperCase()}
            </span>
            <span className="text-xs px-2.5 py-1 rounded-full font-medium capitalize"
              style={{ background: "var(--surface)", color: "var(--text-muted)", border: "1px solid var(--border)" }}>
              {item.category}
            </span>
          </div>

          {/* Title */}
          <h1 className="font-display font-bold mb-3"
            style={{ color: "var(--text-primary)", fontSize: "clamp(1.3rem, 3vw, 1.75rem)", lineHeight: 1.3 }}>
            {item.title}
          </h1>

          {/* Description */}
          <p className="text-sm leading-relaxed mb-5"
            style={{ color: "var(--text-secondary)" }}>
            {item.description}
          </p>

          {/* Meta info */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-xl mb-6"
            style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: "var(--teal-50)" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--teal-600)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>
                </svg>
              </div>
              <div>
                <p style={{ fontSize: "10px", color: "var(--text-muted)", marginBottom: "1px" }}>Location</p>
                <p className="text-xs font-medium" style={{ color: "var(--text-primary)" }}>{item.location}</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: "var(--teal-50)" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--teal-600)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                </svg>
              </div>
              <div>
                <p style={{ fontSize: "10px", color: "var(--text-muted)", marginBottom: "1px" }}>Posted by</p>
                <p className="text-xs font-medium" style={{ color: "var(--text-primary)" }}>{item.postedBy.name}</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: "var(--teal-50)" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--teal-600)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/>
                </svg>
              </div>
              <div>
                <p style={{ fontSize: "10px", color: "var(--text-muted)", marginBottom: "1px" }}>Date posted</p>
                <p className="text-xs font-medium" style={{ color: "var(--text-primary)" }}>
                  {new Date(item.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </p>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap gap-3 mb-4">
            {!isOwner && user && item.status === "active" && (
              <button onClick={() => setShowModal(true)}
                className="btn-primary flex-1 sm:flex-none justify-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
                Submit Claim
              </button>
            )}

            {!isOwner && !user && item.status === "active" && (
              <button onClick={() => router.push("/auth/login")}
                className="btn-primary flex-1 sm:flex-none justify-center">
                Login to Claim
              </button>
            )}

            {isOwner && item.status === "active" && (
              <button onClick={handleResolve}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 flex-1 sm:flex-none"
                style={{ border: "1.5px solid #16a34a", color: "#16a34a", background: "white" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                Mark as Resolved
              </button>
            )}

            {item.status === "resolved" && (
              <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium"
                style={{ background: "#f0fdf4", color: "#16a34a", border: "1px solid #bbf7d0" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                Resolved
              </div>
            )}

            {/* Share button */}
            <button onClick={handleShare}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200"
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

          {/* Claim success */}
          {claimSuccess && (
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm mb-4"
              style={{ background: "#f0fdf4", color: "#16a34a", border: "1px solid #bbf7d0" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              Claim submitted! The owner will be notified by email.
            </div>
          )}

          {/* Claims section — owner only */}
          {isOwner && claims.length > 0 && (
            <div className="mt-8 pt-6" style={{ borderTop: "1px solid var(--border)" }}>
              <div className="flex items-center gap-2 mb-5">
                <h2 className="font-display font-bold text-lg" style={{ color: "var(--text-primary)" }}>
                  Claims
                </h2>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full"
                  style={{ background: "var(--teal-50)", color: "var(--teal-700)" }}>
                  {claims.length}
                </span>
              </div>
              <div className="space-y-3">
                {claims.map((claim) => (
                  <div key={claim._id} className="p-4 rounded-xl"
                    style={{ border: "1px solid var(--border)", background: "var(--surface)" }}>
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                          style={{ background: "var(--teal-600)" }}>
                          {claim.claimant.name?.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-medium text-sm truncate" style={{ color: "var(--text-primary)" }}>
                          {claim.claimant.name}
                        </span>
                      </div>
                      <span className={`flex-shrink-0 ${
                        claim.status === "approved" ? "badge-resolved" :
                        claim.status === "rejected" ? "badge-lost" :
                        "badge-active"
                      }`}>
                        {claim.status.toUpperCase()}
                      </span>
                    </div>

                    <p className="text-sm mb-3 pl-9" style={{ color: "var(--text-secondary)" }}>
                      {claim.description}
                    </p>

                    {claim.status === "pending" && (
                      <div className="flex gap-2 pl-9">
                        <button onClick={() => handleApprove(claim._id)}
                          className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 text-xs px-4 py-2 rounded-lg font-medium text-white transition-all"
                          style={{ background: "#16a34a" }}>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12"/>
                          </svg>
                          Approve
                        </button>
                        <button onClick={() => handleReject(claim._id)}
                          className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 text-xs px-4 py-2 rounded-lg font-medium text-white transition-all"
                          style={{ background: "#dc2626" }}>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M18 6 6 18M6 6l12 12"/>
                          </svg>
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Empty claims state for owner */}
          {isOwner && claims.length === 0 && item.status === "active" && (
            <div className="mt-6 pt-6 text-center py-8 rounded-xl"
              style={{ borderTop: "1px solid var(--border)", background: "var(--surface)" }}>
              <div style={{ fontSize: "2rem", marginBottom: "8px" }}>📭</div>
              <p className="text-sm font-medium mb-1" style={{ color: "var(--text-primary)" }}>No claims yet</p>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                You'll be notified by email when someone submits a claim
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Related Items */}
      {relatedItems.length > 0 && (
        <div className="mt-10">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display font-bold text-lg sm:text-xl"
              style={{ color: "var(--text-primary)" }}>
              Similar Items
            </h2>
            <Link href={`/items?category=${item.category}`}
              className="text-xs font-medium transition-colors"
              style={{ color: "var(--teal-600)" }}>
              View all
            </Link>
          </div>
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