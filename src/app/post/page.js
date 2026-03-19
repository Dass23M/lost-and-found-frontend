"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

const CATEGORIES = [
  { value: "electronics", label: "Electronics", icon: "💻" },
  { value: "clothing", label: "Clothing", icon: "👕" },
  { value: "accessories", label: "Accessories", icon: "👜" },
  { value: "documents", label: "Documents", icon: "📄" },
  { value: "pets", label: "Pets", icon: "🐾" },
  { value: "keys", label: "Keys", icon: "🔑" },
  { value: "bags", label: "Bags", icon: "🎒" },
  { value: "other", label: "Other", icon: "📦" },
];

const STEPS = ["Type", "Details", "Location & Photos"];

export default function PostItemPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    title: "", description: "", category: "", type: "", location: "",
  });
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Client-side auth guard
  useEffect(() => {
    if (!loading && !user) {
      router.replace("/auth/login");
    }
  }, [user, loading]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
    const urls = files.map((f) => URL.createObjectURL(f));
    setPreviews(urls);
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const canGoNext = () => {
    if (step === 0) return !!form.type && !!form.category;
    if (step === 1) return !!form.title && !!form.description;
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.location) { setError("Please enter a location"); return; }
    setError("");
    setSubmitting(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([k, v]) => formData.append(k, v));
      images.forEach((img) => formData.append("images", img));
      await api.post("/items", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      router.push("/my-account");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to post item");
      setSubmitting(false);
    }
  };

  // Show loading while auth resolves
  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <svg className="animate-spin" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--teal-600)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
          </svg>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: "var(--surface)", minHeight: "100vh" }}>

      {/* Page header */}
      <div style={{ background: "white", borderBottom: "1px solid var(--border)" }}>
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-5">
          <div className="flex items-center gap-3 mb-4">
            <Link href="/"
              className="p-2 rounded-lg transition-colors"
              style={{ color: "var(--text-muted)", background: "var(--surface)" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="m12 19-7-7 7-7"/><path d="M19 12H5"/>
              </svg>
            </Link>
            <div>
              <h1 className="font-display font-bold"
                style={{ fontSize: "clamp(1.1rem, 3vw, 1.4rem)", color: "var(--text-primary)" }}>
                Post an Item
              </h1>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                Help the community find what's lost
              </p>
            </div>
          </div>

          {/* Step indicator */}
          <div className="flex items-center gap-0">
            {STEPS.map((s, i) => (
              <div key={s} className="flex items-center flex-1">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 transition-all"
                    style={{
                      background: i <= step ? "var(--teal-600)" : "var(--border)",
                      color: i <= step ? "white" : "var(--text-muted)",
                    }}>
                    {i < step ? (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                    ) : i + 1}
                  </div>
                  <span className="text-xs font-medium hidden sm:block"
                    style={{ color: i <= step ? "var(--teal-600)" : "var(--text-muted)" }}>
                    {s}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className="flex-1 h-px mx-2 sm:mx-3 transition-all"
                    style={{ background: i < step ? "var(--teal-600)" : "var(--border)" }}/>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {error && (
          <div className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm mb-5"
            style={{ background: "#fef2f2", color: "#dc2626", border: "1px solid #fecaca" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          {/* Step 0 */}
          {step === 0 && (
            <div className="space-y-6">
              <div className="card p-5 sm:p-6">
                <h2 className="font-display font-bold text-base mb-1" style={{ color: "var(--text-primary)" }}>
                  What happened?
                </h2>
                <p className="text-xs mb-5" style={{ color: "var(--text-muted)" }}>
                  Tell us whether you lost or found an item
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                  {[
                    { value: "lost", title: "I Lost Something", desc: "Help others return it to you", icon: "🔍", color: "#dc2626", bg: "#fef2f2", border: "#fecaca" },
                    { value: "found", title: "I Found Something", desc: "Help return it to the owner", icon: "✅", color: "#2563eb", bg: "#eff6ff", border: "#bfdbfe" },
                  ].map((t) => (
                    <button type="button" key={t.value}
                      onClick={() => setForm({ ...form, type: t.value })}
                      className="flex flex-col items-start p-5 rounded-2xl text-left transition-all duration-200 hover:-translate-y-0.5"
                      style={{
                        border: `2px solid ${form.type === t.value ? t.color : "var(--border)"}`,
                        background: form.type === t.value ? t.bg : "white",
                      }}>
                      <span style={{ fontSize: "2rem", marginBottom: "10px" }}>{t.icon}</span>
                      <span className="font-display font-bold text-sm mb-1"
                        style={{ color: form.type === t.value ? t.color : "var(--text-primary)" }}>
                        {t.title}
                      </span>
                      <span className="text-xs" style={{ color: "var(--text-muted)" }}>{t.desc}</span>
                      {form.type === t.value && (
                        <div className="mt-3 w-5 h-5 rounded-full flex items-center justify-center self-end"
                          style={{ background: t.color }}>
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12"/>
                          </svg>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
                <div>
                  <label className="label">Category</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {CATEGORIES.map((c) => (
                      <button type="button" key={c.value}
                        onClick={() => setForm({ ...form, category: c.value })}
                        className="flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl text-xs font-medium transition-all"
                        style={{
                          border: `1.5px solid ${form.category === c.value ? "var(--teal-600)" : "var(--border)"}`,
                          background: form.category === c.value ? "var(--teal-50)" : "white",
                          color: form.category === c.value ? "var(--teal-700)" : "var(--text-muted)",
                        }}>
                        <span style={{ fontSize: "1.4rem" }}>{c.icon}</span>
                        {c.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 1 */}
          {step === 1 && (
            <div className="card p-5 sm:p-6 space-y-5">
              <div>
                <h2 className="font-display font-bold text-base mb-1" style={{ color: "var(--text-primary)" }}>
                  Describe the item
                </h2>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                  The more detail you provide, the easier it is to identify
                </p>
              </div>
              <div className="flex items-center gap-2 p-3 rounded-xl"
                style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
                <span className="text-base">{CATEGORIES.find((c) => c.value === form.category)?.icon}</span>
                <span className="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>
                  {form.type === "lost" ? "Lost" : "Found"} · {form.category.charAt(0).toUpperCase() + form.category.slice(1)}
                </span>
                <button type="button" onClick={() => setStep(0)}
                  className="ml-auto text-xs font-medium" style={{ color: "var(--teal-600)" }}>
                  Change
                </button>
              </div>
              <div>
                <label className="label">Title</label>
                <input type="text" name="title" value={form.title}
                  onChange={handleChange} required
                  placeholder="e.g. Black leather wallet with ID cards"
                  className="input"/>
                <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>Keep it short and descriptive</p>
              </div>
              <div>
                <label className="label">Description</label>
                <textarea name="description" value={form.description}
                  onChange={handleChange} required rows={5}
                  placeholder="Describe the item in detail — color, brand, size, distinguishing marks..."
                  className="input resize-none"/>
                <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
                  {form.description.length} characters
                </p>
              </div>
            </div>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="card p-5 sm:p-6 space-y-5">
                <div>
                  <h2 className="font-display font-bold text-base mb-1" style={{ color: "var(--text-primary)" }}>
                    Where & Photos
                  </h2>
                  <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                    Location and photos help people find and identify the item
                  </p>
                </div>
                <div>
                  <label className="label">Location</label>
                  <div className="relative">
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                      width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
                      <circle cx="12" cy="10" r="3"/>
                    </svg>
                    <input type="text" name="location" value={form.location}
                      onChange={handleChange} required
                      placeholder="e.g. Colombo Fort bus station, Platform 3"
                      className="input pl-9"/>
                  </div>
                  <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
                    Be as specific as possible
                  </p>
                </div>
                <div>
                  <label className="label">
                    Photos <span className="font-normal" style={{ color: "var(--text-muted)" }}>(optional, up to 5)</span>
                  </label>
                  {previews.length > 0 && (
                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mb-3">
                      {previews.map((url, i) => (
                        <div key={i} className="relative group rounded-xl overflow-hidden"
                          style={{ aspectRatio: "1", border: "1px solid var(--border)" }}>
                          <img src={url} alt="" className="w-full h-full object-cover"/>
                          <button type="button" onClick={() => removeImage(i)}
                            className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
                            style={{ background: "rgba(0,0,0,0.5)" }}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M18 6 6 18M6 6l12 12"/>
                            </svg>
                          </button>
                        </div>
                      ))}
                      {previews.length < 5 && (
                        <label className="rounded-xl flex flex-col items-center justify-center cursor-pointer"
                          style={{ aspectRatio: "1", border: "2px dashed var(--border)", background: "var(--surface)" }}>
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 5v14M5 12h14"/>
                          </svg>
                          <input type="file" accept="image/*" multiple className="hidden" onChange={handleImageChange}/>
                        </label>
                      )}
                    </div>
                  )}
                  {previews.length === 0 && (
                    <label className="flex flex-col items-center justify-center gap-3 py-10 rounded-2xl cursor-pointer"
                      style={{ border: "2px dashed var(--border)", background: "var(--surface)" }}>
                      <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: "var(--teal-50)" }}>
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--teal-600)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/>
                          <circle cx="9" cy="9" r="2"/>
                          <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
                        </svg>
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>Tap to upload photos</p>
                        <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>PNG, JPG — up to 5 images</p>
                      </div>
                      <input type="file" accept="image/*" multiple className="hidden" onChange={handleImageChange}/>
                    </label>
                  )}
                </div>
              </div>

              {/* Summary */}
              <div className="card p-4" style={{ border: "1px solid var(--teal-100)", background: "var(--teal-50)" }}>
                <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: "var(--teal-600)" }}>Summary</p>
                <div className="space-y-2">
                  {[
                    { label: "Type", value: form.type === "lost" ? "🔍 Lost" : "✅ Found" },
                    { label: "Category", value: `${CATEGORIES.find((c) => c.value === form.category)?.icon} ${form.category}` },
                    { label: "Title", value: form.title },
                    { label: "Photos", value: `${images.length} photo${images.length !== 1 ? "s" : ""}` },
                  ].map((s) => (
                    <div key={s.label} className="flex items-start gap-2 text-xs">
                      <span className="font-medium flex-shrink-0 w-16" style={{ color: "var(--teal-700)" }}>{s.label}</span>
                      <span className="capitalize" style={{ color: "var(--text-secondary)" }}>{s.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex gap-3 mt-6">
            {step > 0 && (
              <button type="button" onClick={() => setStep(step - 1)}
                className="flex items-center gap-2 px-5 py-3 rounded-xl font-medium text-sm transition-all"
                style={{ border: "1.5px solid var(--border)", color: "var(--text-secondary)", background: "white" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m12 19-7-7 7-7"/><path d="M19 12H5"/>
                </svg>
                Back
              </button>
            )}
            {step < STEPS.length - 1 ? (
              <button type="button"
                onClick={() => { if (canGoNext()) setStep(step + 1); }}
                disabled={!canGoNext()}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-medium text-sm text-white transition-all disabled:opacity-40"
                style={{ background: "var(--teal-600)" }}>
                Continue
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </button>
            ) : (
              <button type="submit" disabled={submitting}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-medium text-sm text-white transition-all disabled:opacity-50"
                style={{ background: "var(--teal-600)" }}>
                {submitting ? (
                  <>
                    <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                    </svg>
                    Posting...
                  </>
                ) : (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 5v14M5 12h14"/>
                    </svg>
                    Post Item
                  </>
                )}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}