"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [touched, setTouched] = useState({});

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  const handleBlur = (e) =>
    setTouched({ ...touched, [e.target.name]: true });

  const passwordStrength = (pwd) => {
    if (!pwd) return { score: 0, label: "", color: "" };
    let score = 0;
    if (pwd.length >= 6) score++;
    if (pwd.length >= 10) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    if (score <= 1) return { score, label: "Weak", color: "#dc2626" };
    if (score <= 2) return { score, label: "Fair", color: "#f59e0b" };
    if (score <= 3) return { score, label: "Good", color: "#3b82f6" };
    return { score, label: "Strong", color: "#16a34a" };
  };

  const strength = passwordStrength(form.password);

  const validate = {
    name: !form.name.trim()
      ? "Full name is required"
      : form.name.trim().length < 2
      ? "Name must be at least 2 characters"
      : "",
    email: !form.email
      ? "Email is required"
      : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)
      ? "Enter a valid email address"
      : "",
    password: !form.password
      ? "Password is required"
      : form.password.length < 6
      ? "Password must be at least 6 characters"
      : "",
    confirmPassword: !form.confirmPassword
      ? "Please confirm your password"
      : form.confirmPassword !== form.password
      ? "Passwords do not match"
      : "",
  };

  const isValid = Object.values(validate).every((v) => !v) &&
    Object.values(form).every((v) => v);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({ name: true, email: true, password: true, confirmPassword: true });
    if (!isValid) return;
    setError("");
    setLoading(true);
    try {
      await api.post("/auth/register", {
        name: form.name.trim(),
        email: form.email.toLowerCase(),
        password: form.password,
      });
      setSuccess(true);
      setTimeout(() => router.push("/auth/login"), 2500);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fieldError = (name) => touched[name] && validate[name];
  const fieldOk = (name) => touched[name] && !validate[name] && form[name];

  const inputStyle = (name) => ({
    borderColor: fieldError(name) ? "#dc2626" : fieldOk(name) ? "#16a34a" : undefined,
    boxShadow: fieldError(name)
      ? "0 0 0 3px rgba(220,38,38,0.1)"
      : fieldOk(name)
      ? "0 0 0 3px rgba(22,163,74,0.1)"
      : undefined,
  });

  return (
    <div className="min-h-screen flex">

      {/* Left panel */}
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
          <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.65)" }}>
            Help reunite people with their lost belongings. It only takes a minute.
          </p>
        </div>

        <div className="relative space-y-4">
          {["Post lost & found items instantly", "Submit and manage claims easily", "Get real-time email notifications", "Help your local community"].map((f) => (
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
            <p className="text-xs font-medium" style={{ color: "var(--amber-400)" }}>— Community member</p>
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-4 sm:px-6 py-10 sm:py-12"
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

          <div className="card p-6 sm:p-8">
            <h1 className="font-display font-bold text-2xl mb-1" style={{ color: "var(--text-primary)" }}>
              Create account
            </h1>
            <p className="text-sm mb-6" style={{ color: "var(--text-muted)" }}>
              Already have an account?{" "}
              <Link href="/auth/login" className="font-medium hover:underline" style={{ color: "var(--teal-600)" }}>
                Sign in
              </Link>
            </p>

            {/* Success */}
            {success && (
              <div className="flex items-center gap-3 px-4 py-4 rounded-xl text-sm mb-5"
                style={{ background: "#f0fdf4", color: "#16a34a", border: "1px solid #bbf7d0" }}>
                <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: "#16a34a" }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </div>
                <div>
                  <p className="font-bold">Account created!</p>
                  <p className="text-xs mt-0.5" style={{ color: "#15803d" }}>
                    Redirecting you to login in a moment...
                  </p>
                </div>
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="flex items-start gap-2.5 px-4 py-3 rounded-xl text-sm mb-5"
                style={{ background: "#fef2f2", color: "#dc2626", border: "1px solid #fecaca" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: "1px" }}>
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="8" x2="12" y2="12"/>
                  <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate className="space-y-4">

              {/* Name */}
              <div>
                <label className="label">Full name</label>
                <div className="relative">
                  <svg className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" width="16" height="16" viewBox="0 0 24 24" fill="none"
                    stroke={fieldError("name") ? "#dc2626" : fieldOk("name") ? "#16a34a" : "var(--text-muted)"}
                    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                  <input type="text" name="name" value={form.name}
                    onChange={handleChange} onBlur={handleBlur}
                    required placeholder="Your full name"
                    className="input pl-9 pr-9"
                    autoComplete="name"
                    style={inputStyle("name")}/>
                  {fieldOk("name") && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                    </div>
                  )}
                </div>
                {fieldError("name") && (
                  <p className="text-xs mt-1.5 flex items-center gap-1" style={{ color: "#dc2626" }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                    </svg>
                    {fieldError("name")}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="label">Email address</label>
                <div className="relative">
                  <svg className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" width="16" height="16" viewBox="0 0 24 24" fill="none"
                    stroke={fieldError("email") ? "#dc2626" : fieldOk("email") ? "#16a34a" : "var(--text-muted)"}
                    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="20" height="16" x="2" y="4" rx="2"/>
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                  </svg>
                  <input type="email" name="email" value={form.email}
                    onChange={handleChange} onBlur={handleBlur}
                    required placeholder="you@email.com"
                    className="input pl-9 pr-9"
                    autoComplete="email"
                    style={inputStyle("email")}/>
                  {fieldOk("email") && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                    </div>
                  )}
                </div>
                {fieldError("email") && (
                  <p className="text-xs mt-1.5 flex items-center gap-1" style={{ color: "#dc2626" }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                    </svg>
                    {fieldError("email")}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="label">Password</label>
                <div className="relative">
                  <svg className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" width="16" height="16" viewBox="0 0 24 24" fill="none"
                    stroke={fieldError("password") ? "#dc2626" : "var(--text-muted)"}
                    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password" value={form.password}
                    onChange={handleChange} onBlur={handleBlur}
                    required placeholder="Min 6 characters"
                    className="input pl-9 pr-10"
                    autoComplete="new-password"
                    style={inputStyle("password")}/>
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                    style={{ color: "var(--text-muted)" }}>
                    {showPassword ? (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                        <line x1="1" y1="1" x2="23" y2="23"/>
                      </svg>
                    ) : (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                        <circle cx="12" cy="12" r="3"/>
                      </svg>
                    )}
                  </button>
                </div>

                {/* Password strength bar */}
                {form.password && (
                  <div className="mt-2">
                    <div className="flex gap-1 mb-1">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="h-1 flex-1 rounded-full transition-all duration-300"
                          style={{ background: i <= strength.score ? strength.color : "var(--border)" }}/>
                      ))}
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-xs" style={{ color: strength.color }}>
                        {strength.label} password
                      </p>
                      <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                        {form.password.length} chars
                      </p>
                    </div>
                  </div>
                )}

                {fieldError("password") && (
                  <p className="text-xs mt-1.5 flex items-center gap-1" style={{ color: "#dc2626" }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                    </svg>
                    {fieldError("password")}
                  </p>
                )}

                {/* Password hints */}
                {form.password && (
                  <div className="mt-2 grid grid-cols-2 gap-1">
                    {[
                      { rule: form.password.length >= 6, label: "6+ characters" },
                      { rule: /[A-Z]/.test(form.password), label: "Uppercase letter" },
                      { rule: /[0-9]/.test(form.password), label: "Number" },
                      { rule: /[^A-Za-z0-9]/.test(form.password), label: "Special character" },
                    ].map((h) => (
                      <div key={h.label} className="flex items-center gap-1.5">
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none"
                          stroke={h.rule ? "#16a34a" : "var(--text-muted)"}
                          strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          {h.rule ? (
                            <polyline points="20 6 9 17 4 12"/>
                          ) : (
                            <circle cx="12" cy="12" r="10"/>
                          )}
                        </svg>
                        <span className="text-xs" style={{ color: h.rule ? "#16a34a" : "var(--text-muted)" }}>
                          {h.label}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Confirm password */}
              <div>
                <label className="label">Confirm password</label>
                <div className="relative">
                  <svg className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" width="16" height="16" viewBox="0 0 24 24" fill="none"
                    stroke={fieldError("confirmPassword") ? "#dc2626" : fieldOk("confirmPassword") ? "#16a34a" : "var(--text-muted)"}
                    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                  <input
                    type={showConfirm ? "text" : "password"}
                    name="confirmPassword" value={form.confirmPassword}
                    onChange={handleChange} onBlur={handleBlur}
                    required placeholder="Re-enter your password"
                    className="input pl-9 pr-10"
                    autoComplete="new-password"
                    style={inputStyle("confirmPassword")}/>
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                    style={{ color: "var(--text-muted)" }}>
                    {showConfirm ? (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                        <line x1="1" y1="1" x2="23" y2="23"/>
                      </svg>
                    ) : (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                        <circle cx="12" cy="12" r="3"/>
                      </svg>
                    )}
                  </button>
                </div>
                {fieldError("confirmPassword") && (
                  <p className="text-xs mt-1.5 flex items-center gap-1" style={{ color: "#dc2626" }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                    </svg>
                    {fieldError("confirmPassword")}
                  </p>
                )}
                {fieldOk("confirmPassword") && (
                  <p className="text-xs mt-1.5 flex items-center gap-1" style={{ color: "#16a34a" }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                    Passwords match
                  </p>
                )}
              </div>

              {/* Submit */}
              <button type="submit" disabled={loading || success}
                className="w-full py-3 rounded-xl font-medium text-sm text-white transition-all duration-200 disabled:opacity-60 mt-2"
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

            <p className="text-xs text-center mt-5" style={{ color: "var(--text-muted)" }}>
              By registering you agree to our{" "}
              <span className="font-medium cursor-pointer hover:underline" style={{ color: "var(--teal-600)" }}>
                Terms of Service
              </span>{" "}
              and{" "}
              <span className="font-medium cursor-pointer hover:underline" style={{ color: "var(--teal-600)" }}>
                Privacy Policy
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}