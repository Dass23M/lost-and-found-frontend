import Link from "next/link";

export default function Footer() {
  return (
    <footer style={{ background: "var(--teal-900)", color: "rgba(255,255,255,0.7)" }}>
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">

          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: "var(--teal-600)" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                </svg>
              </div>
              <span className="font-display font-bold text-lg text-white">
                Lost<span style={{ color: "var(--amber-400)" }}>&</span>Found
              </span>
            </div>
            <p className="text-sm leading-relaxed max-w-xs"
              style={{ color: "rgba(255,255,255,0.55)" }}>
              A community platform to help people recover lost belongings and return found items to their rightful owners.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-bold text-sm text-white mb-4 uppercase tracking-wider">
              Quick Links
            </h4>
            <ul className="space-y-2.5">
              {[
                { label: "Browse Items", href: "/items" },
                { label: "Post an Item", href: "/post" },
                { label: "My Account", href: "/my-account" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href}
                    className="text-sm transition-colors hover:text-white"
                    style={{ color: "rgba(255,255,255,0.55)" }}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-display font-bold text-sm text-white mb-4 uppercase tracking-wider">
              Categories
            </h4>
            <ul className="space-y-2.5">
              {["Electronics", "Accessories", "Documents", "Keys", "Pets", "Bags"].map((cat) => (
                <li key={cat}>
                  <Link href={`/items?category=${cat.toLowerCase()}`}
                    className="text-sm transition-colors hover:text-white"
                    style={{ color: "rgba(255,255,255,0.55)" }}>
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between pt-8 gap-4"
          style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}>
          <p className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
            © {new Date().getFullYear()} Lost & Found. All rights reserved.
          </p>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"/>
            <span className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
              All systems operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}