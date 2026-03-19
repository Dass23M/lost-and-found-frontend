"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import NotificationBell from "./NotificationBell";

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <nav
      style={{
        background: "var(--card)",
        borderBottom: "1px solid var(--border)",
      }}
      className="sticky top-0 z-40 px-6 py-0"
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: "var(--teal-600)" }}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
          </div>
          <span
            className="font-display font-700 text-lg"
            style={{ color: "var(--text-primary)" }}
          >
            Lost<span style={{ color: "var(--teal-600)" }}>&</span>Found
          </span>
        </Link>

        {/* Nav links */}
        <div className="hidden md:flex items-center gap-1">
          <Link
            href="/items"
            className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            style={{
              color:
                pathname === "/items"
                  ? "var(--teal-600)"
                  : "var(--text-secondary)",
              background:
                pathname === "/items" ? "var(--teal-50)" : "transparent",
            }}
          >
            Browse Items
          </Link>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Link href="/post" className="btn-primary hidden sm:inline-flex">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 5v14M5 12h14" />
                </svg>
                Post Item
              </Link>
              <NotificationBell />{" "}
              {user.role === "admin" && (
                <Link
                  href="/admin"
                  className="text-xs px-3 py-1.5 rounded-lg font-medium"
                  style={{
                    background: "var(--teal-50)",
                    color: "var(--teal-700)",
                  }}
                >
                  Admin
                </Link>
              )}
              <Link
                href="/my-account"
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm font-medium transition-colors"
                style={{
                  background: "var(--teal-50)",
                  color: "var(--teal-700)",
                }}
              >
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white"
                  style={{ background: "var(--teal-600)" }}
                >
                  {user.name?.charAt(0).toUpperCase()}
                </div>
                <span className="hidden sm:block">
                  {user.name?.split(" ")[0]}
                </span>
              </Link>
              <button
                onClick={handleLogout}
                className="p-2 rounded-lg transition-colors"
                style={{ color: "var(--text-muted)" }}
                title="Logout"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
              </button>
            </>
          ) : (
            <>
              <Link href="/auth/login" className="btn-outline">
                Login
              </Link>
              <Link href="/auth/register" className="btn-primary">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
