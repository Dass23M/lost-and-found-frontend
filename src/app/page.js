import Link from "next/link";
import api from "@/lib/api";
import ItemCard from "@/components/ItemCard";

async function getRecentItems() {
  try {
    const res = await api.get("/items?status=active");
    return res.data.data.slice(0, 6);
  } catch { return []; }
}

export default async function HomePage() {
  const items = await getRecentItems();

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden px-6 py-20"
        style={{ background: "linear-gradient(135deg, var(--teal-900) 0%, var(--teal-700) 60%, var(--teal-600) 100%)" }}>
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)", backgroundSize: "32px 32px" }}/>

        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium mb-6"
            style={{ background: "rgba(255,255,255,0.15)", color: "white", backdropFilter: "blur(8px)" }}>
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"/>
            Community Lost & Found Platform
          </div>

          <h1 className="font-display text-5xl md:text-6xl font-800 text-white mb-6 leading-tight">
            Reuniting People<br/>
            <span style={{ color: "var(--amber-400)" }}>With Their Belongings</span>
          </h1>

          <p className="text-lg mb-10 max-w-xl mx-auto"
            style={{ color: "rgba(255,255,255,0.75)" }}>
            Post a lost item or report something you found.
            Help your community get their things back.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/items"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-medium text-sm transition-all duration-200 hover:-translate-y-0.5"
              style={{ background: "white", color: "var(--teal-700)" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
              Browse All Items
            </Link>
            <Link href="/post"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-medium text-sm transition-all duration-200 hover:-translate-y-0.5"
              style={{ background: "var(--amber-500)", color: "white" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 5v14M5 12h14"/>
              </svg>
              Post an Item
            </Link>
          </div>
        </div>

        {/* Stats bar */}
        <div className="relative max-w-3xl mx-auto mt-16 grid grid-cols-3 gap-4">
          {[
            { icon: "🔍", label: "Items Posted", value: "100+" },
            { icon: "✅", label: "Items Returned", value: "80+" },
            { icon: "👥", label: "Community Members", value: "50+" },
          ].map((stat) => (
            <div key={stat.label} className="text-center p-4 rounded-2xl"
              style={{ background: "rgba(255,255,255,0.1)", backdropFilter: "blur(8px)" }}>
              <div className="text-2xl mb-1">{stat.icon}</div>
              <div className="font-display font-700 text-white text-xl">{stat.value}</div>
              <div className="text-xs" style={{ color: "rgba(255,255,255,0.6)" }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="px-6 py-16" style={{ background: "white" }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl font-700 mb-3" style={{ color: "var(--text-primary)" }}>
              How It Works
            </h2>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              Simple steps to reunite people with their belongings
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { step: "01", icon: "📝", title: "Post Your Item", desc: "Describe the lost or found item with photos and location details." },
              { step: "02", icon: "🔔", title: "Get Notified", desc: "Receive email alerts when someone claims or matches your item." },
              { step: "03", icon: "🤝", title: "Reunite", desc: "Connect with the owner or finder and arrange the return safely." },
            ].map((s) => (
              <div key={s.step} className="relative p-6 rounded-2xl"
                style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
                <span className="font-display font-800 text-5xl absolute top-4 right-4 opacity-10"
                  style={{ color: "var(--teal-600)" }}>{s.step}</span>
                <div className="text-3xl mb-4">{s.icon}</div>
                <h3 className="font-display font-700 text-base mb-2">{s.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Items */}
      <section className="px-6 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="font-display text-3xl font-700" style={{ color: "var(--text-primary)" }}>
                Recent Items
              </h2>
              <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
                Latest lost and found posts from the community
              </p>
            </div>
            <Link href="/items"
              className="btn-outline hidden sm:inline-flex">
              View all
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </Link>
          </div>

          {items.length === 0 ? (
            <div className="text-center py-20 rounded-2xl" style={{ background: "white", border: "1px solid var(--border)" }}>
              <div className="text-5xl mb-4">📭</div>
              <p className="font-display font-600 text-lg mb-2">No items yet</p>
              <p className="text-sm mb-6" style={{ color: "var(--text-muted)" }}>Be the first to post a lost or found item</p>
              <Link href="/post" className="btn-primary">Post First Item</Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((item) => <ItemCard key={item._id} item={item} />)}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}