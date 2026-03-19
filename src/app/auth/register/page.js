"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.post("/auth/register", {
        name: form.name,
        email: form.email,
        password: form.password,
      });
      setSuccess(true);
      setTimeout(() => {
        router.push("/auth/login");
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel — hidden on mobile */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, var(--teal-900), var(--teal-700))" }}>
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)", backgroundSize: "32px 32px" }}/>

        <div className="relative">
          <Link href="/" className="flex items-center gap-3 mb-16">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: "rgba(255,255,255,0.2)" }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
            </div>
            <span className="font-display font-bold text-xl text-white">Lost&Found</span>
          </Link>

          <h2 className="font-display font-bold text-4xl text-white mb-4 leading-tight">
            Join the<br/>community
          </h2>
          <p className="text-sm leading-relaxed"
            style={{ color: "rgba(255,255,255,0.65)" }}>
            Help reunite people with their lost belongings. It only takes a minute to get started.
          </p>
        </div>

        <div className="relative space-y-4">
          {[
            "Post lost & found items instantly",
            "Submit and manage claims easily",
            "Get real-time email notifications",
            "Help your local community",
          ].map((f) => (
            <div key={f} className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: "var(--amber-500)" }}>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
              <span className="text-sm" style={{ color: "rgba(255,255,255,0.8)" }}>{f}</span>
            </div>
          ))}

          <div className="mt-6 p-5 rounded-2xl" style={{ background: "rgba(255,255,255,0.1)" }}>
            <p className="text-sm italic mb-3" style={{ color: "rgba(255,255,255,0.8)" }}>
              "I found my lost laptop bag thanks to this platform. Someone had posted it within an hour!"
            </p>
            <p className="text-xs font-medium" style={{ color: "var(--amber-400)" }}>
              — Community member
            </p>
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12"
        style={{ background: "var(--surface)" }}>
        <div className="w-full max-w-md">

          {/* Mobile logo */}
          <div className="flex lg:hidden items-center justify-center gap-2.5 mb-8">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: "var(--teal-600)" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
            </div>
            <span className="font-display font-bold text-xl" style={{ color: "var(--text-primary)" }}>
              Lost<span style={{ color: "var(--teal-600)" }}>&</span>Found
            </span>
          </div>

          <div className="card p-8">
            <h1 className="font-display font-bold text-2xl mb-1"
              style={{ color: "var(--text-primary)" }}>
              Create account
            </h1>
            <p className="text-sm mb-7" style={{ color: "var(--text-muted)" }}>
              Already have an account?{" "}
              <Link href="/auth/login"
                className="font-medium hover:underline"
                style={{ color: "var(--teal-600)" }}>
                Sign in
              </Link>
            </p>

            {/* Success message */}
            {success && (
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm mb-5"
                style={{ background: "#f0fdf4", color: "#16a34a", border: "1px solid #bbf7d0" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                <div>
                  <p className="font-medium">Account created successfully!</p>
                  <p className="text-xs mt-0.5" style={{ color: "#15803d" }}>
                    Redirecting to login...
                  </p>
                </div>
              </div>
            )}

            {/* Error message */}
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

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label">Full name</label>
                <div className="relative">
                  <svg className="absolute left-3 top-1/2 -translate-y-1/2" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                  <input type="text" name="name" value={form.name}
                    onChange={handleChange} required
                    placeholder="Your full name"
                    className="input pl-9"
                    autoComplete="name"/>
                </div>
              </div>

              <div>
                <label className="label">Email address</label>
                <div className="relative">
                  <svg className="absolute left-3 top-1/2 -translate-y-1/2" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="20" height="16" x="2" y="4" rx="2"/>
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                  </svg>
                  <input type="email" name="email" value={form.email}
                    onChange={handleChange} required
                    placeholder="you@email.com"
                    className="input pl-9"
                    autoComplete="email"/>
                </div>
              </div>

              <div>
                <label className="label">Password</label>
                <div className="relative">
                  <svg className="absolute left-3 top-1/2 -translate-y-1/2" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                  <input type="password" name="password" value={form.password}
                    onChange={handleChange} required minLength={6}
                    placeholder="Min 6 characters"
                    className="input pl-9"
                    autoComplete="new-password"/>
                </div>
                <p className="text-xs mt-1.5" style={{ color: "var(--text-muted)" }}>
                  Must be at least 6 characters
                </p>
              </div>

              <button type="submit" disabled={loading || success}
                className="w-full py-3 rounded-xl font-medium text-sm text-white transition-all duration-200 disabled:opacity-50"
                style={{ background: "var(--teal-600)" }}>
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                    </svg>
                    Creating account...
                  </span>
                ) : success ? "Account created!" : "Create account"}
              </button>
            </form>

            <p className="text-xs text-center mt-6" style={{ color: "var(--text-muted)" }}>
              By registering you agree to our{" "}
              <span className="font-medium" style={{ color: "var(--teal-600)" }}>
                Terms of Service
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}