import Link from "next/link";

const categoryIcons = {
  electronics: "💻", clothing: "👕", accessories: "👜",
  documents: "📄", pets: "🐾", keys: "🔑", bags: "🎒", other: "📦",
};

export default function ItemCard({ item }) {
  return (
    <Link href={`/items/${item._id}`} className="block h-full">
      <div className="card group cursor-pointer overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 h-full flex flex-col">

        {/* Image */}
        {item.images?.length > 0 ? (
          <div className="relative overflow-hidden flex-shrink-0"
            style={{ height: "clamp(160px, 30vw, 192px)" }}>
            <img
              src={item.images[0]}
              alt={item.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0"
              style={{ background: "linear-gradient(to top, rgba(0,0,0,0.25), transparent)" }}/>
            {/* Type badge overlaid on image */}
            <div className="absolute bottom-3 left-3">
              <span className={item.type === "lost" ? "badge-lost" : "badge-found"}
                style={{ backdropFilter: "blur(8px)", fontSize: "11px" }}>
                {item.type === "lost" ? (
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                  </svg>
                ) : (
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                )}
                {item.type.toUpperCase()}
              </span>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-2 flex-shrink-0"
            style={{ height: "clamp(140px, 28vw, 176px)", background: "var(--teal-50)" }}>
            <span style={{ fontSize: "clamp(2rem, 5vw, 2.5rem)" }}>
              {categoryIcons[item.category] || "📦"}
            </span>
            <span className="text-xs" style={{ color: "var(--text-muted)" }}>No image</span>
          </div>
        )}

        {/* Content */}
        <div className="p-3 sm:p-4 flex flex-col flex-1">

          {/* Badges */}
          <div className="flex items-center gap-2 mb-2.5">
            {/* Only show type badge if no image (already shown on image) */}
            {(!item.images || item.images.length === 0) && (
              <span className={item.type === "lost" ? "badge-lost" : "badge-found"}
                style={{ fontSize: "11px" }}>
                {item.type === "lost" ? (
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                  </svg>
                ) : (
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                )}
                {item.type.toUpperCase()}
              </span>
            )}
            <span className={item.status === "resolved" ? "badge-resolved" : "badge-active"}
              style={{ fontSize: "11px" }}>
              {item.status === "resolved" ? (
                <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              ) : (
                <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "currentColor", display: "inline-block" }}/>
              )}
              {item.status === "resolved" ? "Resolved" : "Active"}
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full capitalize ml-auto"
              style={{ background: "var(--surface)", color: "var(--text-muted)", border: "1px solid var(--border)", fontSize: "10px" }}>
              {item.category}
            </span>
          </div>

          {/* Title */}
          <h3 className="font-display font-bold mb-1 truncate flex-shrink-0"
            style={{ color: "var(--text-primary)", fontSize: "clamp(0.85rem, 2.5vw, 0.95rem)" }}>
            {item.title}
          </h3>

          {/* Description */}
          <p className="text-xs mb-3 flex-1"
            style={{
              color: "var(--text-muted)",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              lineHeight: "1.5",
            }}>
            {item.description}
          </p>

          {/* Footer */}
          <div className="flex items-center justify-between pt-3 flex-shrink-0"
            style={{ borderTop: "1px solid var(--border)" }}>
            <span className="flex items-center gap-1 text-xs truncate mr-2"
              style={{ color: "var(--text-muted)", maxWidth: "65%" }}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
              <span className="truncate">{item.location}</span>
            </span>
            <span className="text-xs flex-shrink-0" style={{ color: "var(--text-muted)" }}>
              {new Date(item.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}