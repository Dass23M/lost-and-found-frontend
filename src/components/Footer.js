import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer style={{ background: "#0a1f1c" }}>

      {/* Top section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-14 sm:pt-16 pb-10">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 sm:gap-12">

          {/* Brand — 2 cols */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-flex items-center gap-2.5 mb-5">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: "var(--teal-600)" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"/>
                  <path d="m21 21-4.35-4.35"/>
                </svg>
              </div>
              <span className="font-display font-bold text-lg text-white">
                Lost<span style={{ color: "var(--amber-400)" }}>&</span>Found
              </span>
            </Link>

            <p className="text-sm leading-relaxed mb-6"
              style={{ color: "rgba(255,255,255,0.45)", maxWidth: "300px", lineHeight: "1.8" }}>
              A free community platform that helps people recover lost belongings and return found items to their rightful owners.
            </p>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              {[
                { value: "100+", label: "Items posted" },
                { value: "80+", label: "Returned" },
                { value: "50+", label: "Members" },
              ].map((s) => (
                <div key={s.label} className="text-center py-3 px-2 rounded-xl"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.06)" }}>
                  <div className="font-display font-bold text-white text-base">{s.value}</div>
                  <div className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.35)" }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* Status */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full"
              style={{ background: "rgba(74,222,128,0.08)", border: "1px solid rgba(74,222,128,0.15)" }}>
              <span className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                style={{ background: "#4ade80", boxShadow: "0 0 5px #4ade80", animation: "statusPulse 2.5s ease-in-out infinite" }}/>
              <span className="text-xs font-medium" style={{ color: "rgba(74,222,128,0.8)" }}>
                All systems operational
              </span>
            </div>
          </div>

          {/* Links — 3 cols */}
          <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-8">

            {/* Platform */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest mb-4 text-white"
                style={{ letterSpacing: "0.1em" }}>
                Platform
              </h4>
              <ul className="space-y-3">
                {[
                  { label: "Browse Items", href: "/items" },
                  { label: "Post an Item", href: "/post" },
                  { label: "My Account", href: "/my-account" },
                  { label: "Notifications", href: "/my-account" },
                ].map((link) => (
                  <li key={link.label}>
                    <Link href={link.href}
                      className="text-sm transition-all duration-200 hover:text-white hover:translate-x-0.5 inline-block"
                      style={{ color: "rgba(255,255,255,0.45)" }}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Categories */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest mb-4 text-white"
                style={{ letterSpacing: "0.1em" }}>
                Categories
              </h4>
              <ul className="space-y-3">
                {[
                  { label: "Electronics", cat: "electronics" },
                  { label: "Accessories", cat: "accessories" },
                  { label: "Documents", cat: "documents" },
                  { label: "Keys", cat: "keys" },
                  { label: "Pets", cat: "pets" },
                  { label: "Bags", cat: "bags" },
                ].map((c) => (
                  <li key={c.cat}>
                    <Link href={`/items?category=${c.cat}`}
                      className="text-sm transition-all duration-200 hover:text-white hover:translate-x-0.5 inline-block"
                      style={{ color: "rgba(255,255,255,0.45)" }}>
                      {c.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Account */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest mb-4 text-white"
                style={{ letterSpacing: "0.1em" }}>
                Account
              </h4>
              <ul className="space-y-3 mb-8">
                {[
                  { label: "Sign In", href: "/auth/login" },
                  { label: "Create Account", href: "/auth/register" },
                ].map((link) => (
                  <li key={link.label}>
                    <Link href={link.href}
                      className="text-sm transition-all duration-200 hover:text-white hover:translate-x-0.5 inline-block"
                      style={{ color: "rgba(255,255,255,0.45)" }}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <div className="p-4 rounded-2xl"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                <p className="text-xs font-medium text-white mb-1">
                  Found something?
                </p>
                <p className="text-xs mb-3" style={{ color: "rgba(255,255,255,0.4)" }}>
                  Help someone get it back today.
                </p>
                <Link href="/post"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium transition-all hover:-translate-y-0.5 hover:shadow-lg"
                  style={{ background: "var(--amber-500)", color: "white" }}>
                  Post an item
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}/>
      </div>

      {/* Bottom bar */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-5">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">

          <p className="text-xs order-2 sm:order-1 text-center sm:text-left"
            style={{ color: "rgba(255,255,255,0.25)" }}>
            © {currentYear} Lost & Found. All rights reserved.
          </p>

          <div className="flex items-center gap-5 order-1 sm:order-2">
            {["Privacy Policy", "Terms of Service", "Contact"].map((item, i) => (
              <span key={item} className="flex items-center gap-5">
                <Link href="/"
                  className="text-xs transition-colors hover:text-white"
                  style={{ color: "rgba(255,255,255,0.3)" }}>
                  {item}
                </Link>
                {i < 2 && (
                  <span style={{ color: "rgba(255,255,255,0.1)", fontSize: "10px" }}>|</span>
                )}
              </span>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes statusPulse {
          0%, 100% { opacity: 1; box-shadow: 0 0 5px #4ade80; }
          50% { opacity: 0.5; box-shadow: 0 0 10px #4ade80; }
        }
      `}</style>
    </footer>
  );
}