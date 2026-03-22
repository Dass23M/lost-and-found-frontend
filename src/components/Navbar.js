"use client";

import { useState, useEffect, useRef } from "react";
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
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setUserMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setMobileOpen(false);
    setUserMenuOpen(false);
    router.push("/");
  };

  const isActive = (href) => pathname === href;

  return (
    <>
      <nav
        className="sticky top-0 z-50 transition-all duration-300"
        style={{
          background: "var(--card)",
          borderBottom: "1px solid var(--border)",
          boxShadow: scrolled ? "0 2px 16px rgba(0,0,0,0.07)" : "none",
        }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center h-16 gap-8">

            {/* ── Logo ── */}
            <Link href="/" className="flex items-center gap-2.5 flex-shrink-0 group">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center transition-transform duration-200 group-hover:scale-105"
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

            {/* ── Desktop center nav ── */}
            <div className="hidden md:flex items-center gap-1 flex-1">
              {[
                { href: "/", label: "Home" },
                { href: "/items", label: "Browse Items" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 relative"
                  style={{
                    color: isActive(link.href) ? "var(--teal-600)" : "var(--text-secondary)",
                    background: isActive(link.href) ? "var(--teal-50)" : "transparent",
                  }}>
                  {link.label}
                  {isActive(link.href) && (
                    <span
                      className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                      style={{ background: "var(--teal-600)" }}
                    />
                  )}
                </Link>
              ))}
            </div>

            {/* ── Desktop right side ── */}
            <div className="hidden md:flex items-center gap-2 ml-auto">
              {user ? (
                <>
                  {/* Post Item */}
                  <Link href="/post"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl font-medium text-sm transition-all duration-200 hover:-translate-y-0.5"
                    style={{ background: "var(--teal-600)", color: "white" }}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 5v14M5 12h14"/>
                    </svg>
                    Post Item
                  </Link>

                  {/* Notification */}
                  <NotificationBell />

                  {/* Admin */}
                  {user.role === "admin" && (
                    <Link href="/admin"
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all hover:-translate-y-0.5"
                      style={{ background: "var(--amber-500)", color: "white" }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                        <path d="M2 17l10 5 10-5"/>
                        <path d="M2 12l10 5 10-5"/>
                      </svg>
                      Admin
                    </Link>
                  )}

                  {/* User dropdown */}
                  <div className="relative" ref={userMenuRef}>
                    <button
                      onClick={() => setUserMenuOpen(!userMenuOpen)}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm font-medium transition-all hover:shadow-sm"
                      style={{
                        background: userMenuOpen ? "var(--teal-100)" : "var(--teal-50)",
                        color: "var(--teal-700)",
                        border: "1px solid var(--teal-100)",
                      }}>
                      <div
                        className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                        style={{ background: "var(--teal-600)" }}>
                        {user.name?.charAt(0).toUpperCase()}
                      </div>
                      <span className="max-w-24 truncate">{user.name?.split(" ")[0]}</span>
                      <svg
                        width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                        style={{ transition: "transform 0.2s", transform: userMenuOpen ? "rotate(180deg)" : "rotate(0)" }}>
                        <path d="m6 9 6 6 6-6"/>
                      </svg>
                    </button>

                    {/* Dropdown menu */}
                    {userMenuOpen && (
                      <div
                        className="absolute right-0 mt-2 w-52 rounded-2xl overflow-hidden"
                        style={{
                          background: "var(--card)",
                          border: "1px solid var(--border)",
                          boxShadow: "0 8px 30px rgba(0,0,0,0.1)",
                          animation: "dropDown 0.15s ease",
                        }}>
                        {/* User info */}
                        <div className="px-4 py-3" style={{ borderBottom: "1px solid var(--border)", background: "var(--surface)" }}>
                          <p className="font-medium text-sm truncate" style={{ color: "var(--text-primary)" }}>
                            {user.name}
                          </p>
                          <p className="text-xs truncate mt-0.5" style={{ color: "var(--text-muted)" }}>
                            {user.email}
                          </p>
                        </div>

                        {/* Menu items */}
                        <div className="py-1.5">
                          {[
                            {
                              href: "/my-account", label: "My Account",
                              icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
                            },
                            {
                              href: "/post", label: "Post an Item",
                              icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg>,
                            },
                          ].map((item) => (
                            <Link
                              key={item.href}
                              href={item.href}
                              className="flex items-center gap-3 px-4 py-2.5 text-sm transition-colors"
                              style={{
                                color: isActive(item.href) ? "var(--teal-600)" : "var(--text-secondary)",
                                background: isActive(item.href) ? "var(--teal-50)" : "transparent",
                              }}>
                              <span style={{ color: isActive(item.href) ? "var(--teal-600)" : "var(--text-muted)" }}>
                                {item.icon}
                              </span>
                              {item.label}
                            </Link>
                          ))}
                        </div>

                        {/* Logout */}
                        <div className="py-1.5" style={{ borderTop: "1px solid var(--border)" }}>
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors hover:bg-red-50 group">
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                              <polyline points="16 17 21 12 16 7"/>
                              <line x1="21" y1="12" x2="9" y2="12"/>
                            </svg>
                            <span style={{ color: "#dc2626" }}>Sign out</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                /* Guest buttons */
                <div className="flex items-center gap-2">
                  <Link
                    href="/auth/login"
                    className="px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200"
                    style={{
                      color: "var(--text-secondary)",
                      border: "1.5px solid var(--border)",
                      background: "white",
                    }}>
                    Sign in
                  </Link>
                  <Link
                    href="/auth/register"
                    className="px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 hover:-translate-y-0.5"
                    style={{
                      background: "var(--teal-600)",
                      color: "white",
                      boxShadow: "0 2px 8px rgba(13,148,136,0.3)",
                    }}>
                    Get started free
                  </Link>
                </div>
              )}
            </div>

            {/* ── Mobile right ── */}
            <div className="flex md:hidden items-center gap-2 ml-auto">
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
                <div style={{ position: "relative", width: "18px", height: "18px" }}>
                  <svg
                    style={{
                      position: "absolute", top: 0, left: 0,
                      transition: "opacity 0.2s, transform 0.2s",
                      opacity: mobileOpen ? 1 : 0,
                      transform: mobileOpen ? "rotate(0deg)" : "rotate(-90deg)",
                    }}
                    width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 6 6 18M6 6l12 12"/>
                  </svg>
                  <svg
                    style={{
                      position: "absolute", top: 0, left: 0,
                      transition: "opacity 0.2s, transform 0.2s",
                      opacity: mobileOpen ? 0 : 1,
                      transform: mobileOpen ? "rotate(90deg)" : "rotate(0deg)",
                    }}
                    width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="4" y1="6" x2="20" y2="6"/>
                    <line x1="4" y1="12" x2="20" y2="12"/>
                    <line x1="4" y1="18" x2="20" y2="18"/>
                  </svg>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* ── Mobile menu panel ── */}
        <div
          className="md:hidden overflow-hidden transition-all duration-300"
          style={{
            maxHeight: mobileOpen ? "700px" : "0",
            opacity: mobileOpen ? 1 : 0,
            borderTop: mobileOpen ? "1px solid var(--border)" : "none",
          }}>
          <div className="px-4 py-4 space-y-2" style={{ background: "var(--card)" }}>

            {user ? (
              <>
                {/* Profile card */}
                <div
                  className="flex items-center gap-3 p-3 rounded-2xl mb-2"
                  style={{ background: "linear-gradient(135deg, var(--teal-900), var(--teal-700))" }}>
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center font-bold text-lg flex-shrink-0"
                    style={{ background: "rgba(255,255,255,0.2)", color: "white" }}>
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm text-white truncate">{user.name}</p>
                    <p className="text-xs truncate" style={{ color: "rgba(255,255,255,0.65)" }}>
                      {user.email}
                    </p>
                  </div>
                  {user.role === "admin" && (
                    <span
                      className="text-xs px-2 py-1 rounded-full font-bold flex-shrink-0"
                      style={{ background: "var(--amber-500)", color: "white" }}>
                      Admin
                    </span>
                  )}
                </div>

                {/* Nav links */}
                {[
                  {
                    href: "/", label: "Home",
                    icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
                  },
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
                  <Link
                    key={link.href}
                    href={link.href}
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
                      <svg className="ml-auto" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--teal-500)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                    )}
                  </Link>
                ))}

                {/* Divider */}
                <div style={{ borderTop: "1px solid var(--border)", margin: "8px 0" }}/>

                {/* Post item button */}
                <Link
                  href="/post"
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-medium text-white transition-all"
                  style={{ background: "var(--teal-600)" }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 5v14M5 12h14"/>
                  </svg>
                  Post an Item
                </Link>

                {/* Sign out */}
                <button
                  onClick={handleLogout}
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-medium transition-all"
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
                {/* Guest nav links */}
                {[
                  {
                    href: "/", label: "Home",
                    icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
                  },
                  {
                    href: "/items", label: "Browse Items",
                    icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>,
                  },
                ].map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all"
                    style={{
                      background: isActive(link.href) ? "var(--teal-50)" : "transparent",
                      color: isActive(link.href) ? "var(--teal-600)" : "var(--text-secondary)",
                    }}>
                    <span style={{ color: isActive(link.href) ? "var(--teal-600)" : "var(--text-muted)" }}>
                      {link.icon}
                    </span>
                    {link.label}
                  </Link>
                ))}

                {/* Divider */}
                <div style={{ borderTop: "1px solid var(--border)", margin: "8px 0" }}/>

                {/* Auth buttons */}
                <Link
                  href="/auth/login"
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-medium transition-all"
                  style={{ border: "1.5px solid var(--border)", color: "var(--text-secondary)", background: "white" }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
                    <polyline points="10 17 15 12 10 7"/>
                    <line x1="15" y1="12" x2="3" y2="12"/>
                  </svg>
                  Sign in
                </Link>

                <Link
                  href="/auth/register"
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-medium text-white transition-all"
                  style={{ background: "var(--teal-600)" }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                    <circle cx="9" cy="7" r="4"/>
                    <line x1="19" y1="8" x2="19" y2="14"/>
                    <line x1="22" y1="11" x2="16" y2="11"/>
                  </svg>
                  Get started free
                </Link>

                {/* Guest CTA */}
                <div
                  className="p-4 rounded-2xl text-center mt-2"
                  style={{ background: "var(--teal-50)", border: "1px solid var(--teal-100)" }}>
                  <p className="text-xs font-bold mb-1" style={{ color: "var(--teal-700)" }}>
                    Lost or found something?
                  </p>
                  <p className="text-xs" style={{ color: "var(--teal-600)" }}>
                    Join the community and help reunite people with their belongings
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 md:hidden"
          style={{ background: "rgba(0,0,0,0.25)", backdropFilter: "blur(3px)" }}
          onClick={() => setMobileOpen(false)}
        />
      )}

      <style>{`
        @keyframes dropDown {
          from { opacity: 0; transform: translateY(-6px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
}