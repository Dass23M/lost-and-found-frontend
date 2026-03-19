"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import NotificationBell from "./NotificationBell";

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const handleLogout = () => {
    logout();
    setMobileOpen(false);
    router.push("/");
  };

  const navLinks = [
    {
      href: "/items",
      label: "Browse Items",
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
        </svg>
      ),
    },
  ];

  const isActive = (href) => pathname === href;

  return (
    <>
      <nav
        className="sticky top-0 z-40 transition-all duration-300"
        style={{
          background: "var(--card)",
          borderBottom: `1px solid ${scrolled ? "var(--border)" : "var(--border)"}`,
          boxShadow: scrolled ? "0 1px 12px rgba(0,0,0,0.06)" : "none",
        }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 flex-shrink-0">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center transition-transform hover:scale-105"
                style={{ background: "var(--teal-600)" }}>
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"/>
                  <path d="m21 21-4.35-4.35"/>
                </svg>
              </div>
              <span className="font-display font-bold text-lg" style={{ color: "var(--text-primary)" }}>
                Lost<span style={{ color: "var(--teal-600)" }}>&</span>Found
              </span>
            </Link>

            {/* Desktop nav links */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                  style={{
                    color: isActive(link.href) ? "var(--teal-600)" : "var(--text-secondary)",
                    background: isActive(link.href) ? "var(--teal-50)" : "transparent",
                  }}>
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Desktop right side */}
            <div className="hidden md:flex items-center gap-2">
              {user ? (
                <>
                  <Link href="/post" className="btn-primary">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 5v14M5 12h14"/>
                    </svg>
                    Post Item
                  </Link>

                  <NotificationBell />

                  {user.role === "admin" && (
                    <Link href="/admin"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                      style={{ background: "var(--amber-500)", color: "white" }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>
                      </svg>
                      Admin
                    </Link>
                  )}

                  {/* User menu */}
                  <Link href="/my-account"
                    className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm font-medium transition-all hover:shadow-sm"
                    style={{ background: "var(--teal-50)", color: "var(--teal-700)" }}>
                    <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                      style={{ background: "var(--teal-600)" }}>
                      {user.name?.charAt(0).toUpperCase()}
                    </div>
                    <span className="max-w-20 truncate">{user.name?.split(" ")[0]}</span>
                  </Link>

                  <button onClick={handleLogout}
                    className="p-2 rounded-lg transition-all hover:bg-red-50 group"
                    style={{ color: "var(--text-muted)" }}
                    title="Sign out">
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="2"
                      strokeLinecap="round" strokeLinejoin="round"
                      className="group-hover:stroke-red-500 transition-colors">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                      <polyline points="16 17 21 12 16 7"/>
                      <line x1="21" y1="12" x2="9" y2="12"/>
                    </svg>
                  </button>
                </>
              ) : (
                <>
                  <Link href="/auth/login" className="btn-outline">Login</Link>
                  <Link href="/auth/register" className="btn-primary">Register</Link>
                </>
              )}
            </div>

            {/* Mobile right side */}
            <div className="flex md:hidden items-center gap-2">
              {user && <NotificationBell />}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="w-9 h-9 rounded-xl flex items-center justify-center transition-all"
                style={{
                  background: mobileOpen ? "var(--teal-50)" : "var(--surface)",
                  color: mobileOpen ? "var(--teal-600)" : "var(--text-secondary)",
                  border: "1px solid var(--border)",
                }}
                aria-label="Toggle menu">
                {mobileOpen ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 6 6 18M6 6l12 12"/>
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="4" y1="6" x2="20" y2="6"/>
                    <line x1="4" y1="12" x2="20" y2="12"/>
                    <line x1="4" y1="18" x2="20" y2="18"/>
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <div
          className="md:hidden overflow-hidden transition-all duration-300"
          style={{
            maxHeight: mobileOpen ? "600px" : "0",
            opacity: mobileOpen ? 1 : 0,
          }}>
          <div className="px-4 pb-5 pt-2"
            style={{ borderTop: "1px solid var(--border)", background: "var(--card)" }}>

            {user ? (
              <>
                {/* User profile strip */}
                <div className="flex items-center gap-3 p-3 rounded-xl mb-4"
                  style={{ background: "var(--teal-50)", border: "1px solid var(--teal-100)" }}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white flex-shrink-0"
                    style={{ background: "var(--teal-600)" }}>
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate" style={{ color: "var(--teal-900)" }}>
                      {user.name}
                    </p>
                    <p className="text-xs truncate" style={{ color: "var(--teal-600)" }}>
                      {user.email}
                    </p>
                  </div>
                  {user.role === "admin" && (
                    <span className="text-xs px-2 py-1 rounded-full font-medium flex-shrink-0"
                      style={{ background: "var(--amber-500)", color: "white" }}>
                      Admin
                    </span>
                  )}
                </div>

                {/* Nav links */}
                <div className="space-y-1 mb-4">
                  {[
                    {
                      href: "/items", label: "Browse Items",
                      icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>,
                    },
                    {
                      href: "/my-account", label: "My Account",
                      icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
                    },
                    ...(user.role === "admin" ? [{
                      href: "/admin", label: "Admin Dashboard",
                      icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>,
                    }] : []),
                  ].map((link) => (
                    <Link key={link.href} href={link.href}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all"
                      style={{
                        background: isActive(link.href) ? "var(--teal-50)" : "transparent",
                        color: isActive(link.href) ? "var(--teal-600)" : "var(--text-secondary)",
                      }}>
                      <span style={{ color: isActive(link.href) ? "var(--teal-600)" : "var(--text-muted)" }}>
                        {link.icon}
                      </span>
                      {link.label}
                      {isActive(link.href) && (
                        <svg className="ml-auto" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--teal-600)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                      )}
                    </Link>
                  ))}
                </div>

                {/* Post Item CTA */}
                <Link href="/post" className="btn-primary w-full justify-center mb-3">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 5v14M5 12h14"/>
                  </svg>
                  Post an Item
                </Link>

                {/* Logout */}
                <button onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all"
                  style={{ border: "1.5px solid #fecaca", color: "#dc2626", background: "#fef2f2" }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                    <polyline points="16 17 21 12 16 7"/>
                    <line x1="21" y1="12" x2="9" y2="12"/>
                  </svg>
                  Sign out
                </button>
              </>
            ) : (
              <>
                {/* Nav links for guests */}
                <div className="space-y-1 mb-4">
                  <Link href="/items"
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all"
                    style={{
                      background: isActive("/items") ? "var(--teal-50)" : "transparent",
                      color: isActive("/items") ? "var(--teal-600)" : "var(--text-secondary)",
                    }}>
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                    </svg>
                    Browse Items
                  </Link>
                </div>

                {/* Auth buttons */}
                <div className="grid grid-cols-2 gap-2">
                  <Link href="/auth/login"
                    className="flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium transition-all"
                    style={{ border: "1.5px solid var(--border)", color: "var(--text-secondary)", background: "white" }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
                      <polyline points="10 17 15 12 10 7"/>
                      <line x1="15" y1="12" x2="3" y2="12"/>
                    </svg>
                    Login
                  </Link>
                  <Link href="/auth/register" className="btn-primary justify-center">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                      <circle cx="9" cy="7" r="4"/>
                      <line x1="19" y1="8" x2="19" y2="14"/>
                      <line x1="22" y1="11" x2="16" y2="11"/>
                    </svg>
                    Register
                  </Link>
                </div>

                {/* Guest CTA */}
                <div className="mt-4 p-4 rounded-xl text-center"
                  style={{ background: "var(--teal-50)", border: "1px solid var(--teal-100)" }}>
                  <p className="text-xs font-medium mb-1" style={{ color: "var(--teal-700)" }}>
                    Lost or found something?
                  </p>
                  <p className="text-xs mb-3" style={{ color: "var(--teal-600)" }}>
                    Join the community and help reunite people with their belongings
                  </p>
                  <Link href="/auth/register"
                    className="text-xs font-bold underline"
                    style={{ color: "var(--teal-600)" }}>
                    Get started for free →
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 md:hidden"
          style={{ background: "rgba(0,0,0,0.2)", backdropFilter: "blur(2px)" }}
          onClick={() => setMobileOpen(false)}
        />
      )}
    </>
  );
}