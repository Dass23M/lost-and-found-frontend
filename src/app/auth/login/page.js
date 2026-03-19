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
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, var(--teal-900), var(--teal-700))" }}>
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)", backgroundSize: "32px 32px" }}/>
        <div className="relative">
          <div className="flex items-center gap-3 mb-16">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: "rgba(255,255,255,0.2)" }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
            </div>
            <span className="font-display font-700 text-xl text-white">Lost&Found</span>
          </div>
          <h2 className="font-display font-800 text-4xl text-white mb-4 leading-tight">
            Welcome<br/>back
          </h2>
          <p style={{ color: "rgba(255,255,255,0.65)" }} className="text-sm leading-relaxed">
            Sign in to manage your posts, track claims, and help your community.
          </p>
        </div>
        <div className="relative space-y-3">
          {["Post lost & found items", "Submit and manage claims", "Get email notifications"].map((f) => (
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
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8"
        style={{ background: "var(--surface)" }}>
        <div className="w-full max-w-md">
          <div className="card p-8">
            <h1 className="font-display font-700 text-2xl mb-1" style={{ color: "var(--text-primary)" }}>
              Sign in
            </h1>
            <p className="text-sm mb-7" style={{ color: "var(--text-muted)" }}>
              Don't have an account?{" "}
              <Link href="/auth/register" style={{ color: "var(--teal-600)" }} className="font-medium hover:underline">
                Register free
              </Link>
            </p>

            {error && (
              <div className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm mb-5"
                style={{ background: "#fef2f2", color: "#dc2626", border: "1px solid #fecaca" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label">Email address</label>
                <input type="email" name="email" value={form.email}
                  onChange={handleChange} required placeholder="you@email.com" className="input"/>
              </div>
              <div>
                <label className="label">Password</label>
                <input type="password" name="password" value={form.password}
                  onChange={handleChange} required placeholder="••••••••" className="input"/>
              </div>
              <button type="submit" disabled={loading}
                className="w-full py-3 rounded-xl font-medium text-sm text-white transition-all duration-200 disabled:opacity-50 hover:-translate-y-0.5"
                style={{ background: "var(--teal-600)" }}>
                {loading ? "Signing in..." : "Sign in"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}