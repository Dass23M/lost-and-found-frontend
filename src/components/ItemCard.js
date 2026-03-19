import Link from "next/link";

const categoryIcons = {
  electronics: "💻", clothing: "👕", accessories: "👜",
  documents: "📄", pets: "🐾", keys: "🔑", bags: "🎒", other: "📦",
};

export default function ItemCard({ item }) {
  return (
    <Link href={`/items/${item._id}`}>
      <div className="card group cursor-pointer overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5">
        {/* Image */}
        {item.images?.length > 0 ? (
          <div className="relative h-44 overflow-hidden">
            <img src={item.images[0]} alt={item.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"/>
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"/>
          </div>
        ) : (
          <div className="h-44 flex flex-col items-center justify-center gap-2"
            style={{ background: "var(--teal-50)" }}>
            <span className="text-4xl">{categoryIcons[item.category] || "📦"}</span>
            <span className="text-xs" style={{ color: "var(--text-muted)" }}>No image</span>
          </div>
        )}

        {/* Content */}
        <div className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <span className={item.type === "lost" ? "badge-lost" : "badge-found"}>
              {item.type === "lost" ? (
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
              ) : (
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              )}
              {item.type.toUpperCase()}
            </span>
            <span className={item.status === "resolved" ? "badge-resolved" : "badge-active"}>
              {item.status === "resolved" ? "Resolved" : "Active"}
            </span>
          </div>

          <h3 className="font-display font-600 text-base mb-1 truncate"
            style={{ color: "var(--text-primary)" }}>
            {item.title}
          </h3>
          <p className="text-sm truncate mb-3" style={{ color: "var(--text-muted)" }}>
            {item.description}
          </p>

          <div className="flex items-center justify-between pt-3"
            style={{ borderTop: "1px solid var(--border)" }}>
            <span className="flex items-center gap-1 text-xs" style={{ color: "var(--text-muted)" }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>
              </svg>
              {item.location}
            </span>
            <span className="text-xs" style={{ color: "var(--text-muted)" }}>
              {new Date(item.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}