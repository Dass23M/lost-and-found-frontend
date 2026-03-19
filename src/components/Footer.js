import Link from "next/link";

export default function Footer() {
  return (
    <footer style={{ background: "var(--teal-900)" }}>

      {/* Main footer content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-12 sm:pt-16 pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 mb-10 sm:mb-12">

          {/* Brand — full width on mobile, 2 cols on lg */}
          <div className="sm:col-span-2 lg:col-span-2">
            <Link href="/" className="inline-flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: "var(--teal-600)" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"/>
                  <path d="m21 21-4.35-4.35"/>
                </svg>
              </div>
              <span className="font-display font-bold text-xl text-white">
                Lost<span style={{ color: "var(--amber-400)" }}>&</span>Found
              </span>
            </Link>

            <p className="text-sm leading-relaxed mb-6 max-w-sm"
              style={{ color: "rgba(255,255,255,0.5)" }}>
              A free community platform helping people recover lost belongings and return found items to their rightful owners — one post at a time.
            </p>

            {/* Stats pills */}
            <div className="flex flex-wrap gap-2">
              {[
                { icon: "📦", label: "100+ items posted" },
                { icon: "✅", label: "80+ returned" },
                { icon: "👥", label: "50+ members" },
              ].map((s) => (
                <span key={s.label}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs"
                  style={{ background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.65)", border: "1px solid rgba(255,255,255,0.1)" }}>
                  {s.icon} {s.label}
                </span>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-bold text-xs text-white mb-4 uppercase tracking-widest">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {[
                { label: "Browse Items", href: "/items", icon: "🔍" },
                { label: "Post an Item", href: "/post", icon: "📝" },
                { label: "My Account", href: "/my-account", icon: "👤" },
                { label: "Login", href: "/auth/login", icon: "🔑" },
                { label: "Register", href: "/auth/register", icon: "✨" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href}
                    className="flex items-center gap-2 text-sm group transition-all"
                    style={{ color: "rgba(255,255,255,0.5)" }}>
                    <span style={{ fontSize: "13px" }}>{link.icon}</span>
                    <span className="group-hover:text-white transition-colors">
                      {link.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-display font-bold text-xs text-white mb-4 uppercase tracking-widest">
              Categories
            </h4>
            <ul className="space-y-3">
              {[
                { label: "Electronics", icon: "💻" },
                { label: "Accessories", icon: "👜" },
                { label: "Documents", icon: "📄" },
                { label: "Keys", icon: "🔑" },
                { label: "Pets", icon: "🐾" },
                { label: "Bags", icon: "🎒" },
              ].map((cat) => (
                <li key={cat.label}>
                  <Link href={`/items?category=${cat.label.toLowerCase()}`}
                    className="flex items-center gap-2 text-sm group transition-all"
                    style={{ color: "rgba(255,255,255,0.5)" }}>
                    <span style={{ fontSize: "13px" }}>{cat.icon}</span>
                    <span className="group-hover:text-white transition-colors">
                      {cat.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}/>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between pt-6 gap-4">

          {/* Left — copyright */}
          <p className="text-xs text-center sm:text-left order-2 sm:order-1"
            style={{ color: "rgba(255,255,255,0.35)" }}>
            © {new Date().getFullYear()} Lost & Found. All rights reserved. Built for the community.
          </p>

          {/* Right — status + CTA */}
          <div className="flex items-center gap-4 order-1 sm:order-2">
            {/* Status */}
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full"
                style={{ background: "#4ade80", boxShadow: "0 0 6px #4ade80", animation: "pulse 2s infinite" }}/>
              <span className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>
                All systems live
              </span>
            </div>

            {/* CTA button */}
            <Link href="/post"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium transition-all hover:-translate-y-0.5"
              style={{ background: "var(--amber-500)", color: "white" }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 5v14M5 12h14"/>
              </svg>
              Post Item
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </footer>
  );
}