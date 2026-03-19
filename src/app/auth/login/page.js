"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(form.email, form.password);
      router.push("/");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password");
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
            Welcome<br/>back
          </h2>
          <p className="text-sm leading-relaxed"
            style={{ color: "rgba(255,255,255,0.65)" }}>
            Sign in to manage your posts, track claims, and help your community.
          </p>
        </div>

        <div className="relative space-y-3">
          {[
            "Post lost & found items",
            "Submit and manage claims",
            "Get email notifications",
            "Access your dashboard",
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
              Sign in
            </h1>
            <p className="text-sm mb-7" style={{ color: "var(--text-muted)" }}>
              Don't have an account?{" "}
              <Link href="/auth/register"
                className="font-medium hover:underline"
                style={{ color: "var(--teal-600)" }}>
                Register free
              </Link>
            </p>

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
                <div className="flex items-center justify-between mb-1.5">
                  <label className="label" style={{ marginBottom: 0 }}>Password</label>
                </div>
                <div className="relative">
                  <svg className="absolute left-3 top-1/2 -translate-y-1/2" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                  <input type="password" name="password" value={form.password}
                    onChange={handleChange} required
                    placeholder="••••••••"
                    className="input pl-9"
                    autoComplete="current-password"/>
                </div>
              </div>

              <button type="submit" disabled={loading}
                className="w-full py-3 rounded-xl font-medium text-sm text-white transition-all duration-200 disabled:opacity-50"
                style={{ background: "var(--teal-600)" }}>
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                    </svg>
                    Signing in...
                  </span>
                ) : "Sign in"}
              </button>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full" style={{ borderTop: "1px solid var(--border)" }}/>
              </div>
              <div className="relative flex justify-center">
                <span className="px-3 text-xs"
                  style={{ background: "var(--card)", color: "var(--text-muted)" }}>
                  New to Lost & Found?
                </span>
              </div>
            </div>

            <Link href="/auth/register"
              className="w-full py-3 rounded-xl font-medium text-sm transition-all duration-200 flex items-center justify-center gap-2"
              style={{ border: "1.5px solid var(--border)", color: "var(--text-secondary)", background: "white" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <line x1="19" y1="8" x2="19" y2="14"/>
                <line x1="22" y1="11" x2="16" y2="11"/>
              </svg>
              Create a free account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}