"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import api from "@/lib/api";
import ItemCard from "@/components/ItemCard";

function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return [ref, inView];
}

function AnimatedSection({ children, className, style, delay = 0 }) {
  const [ref, inView] = useInView();
  return (
    <div ref={ref} className={className} style={{
      ...style,
      opacity: inView ? 1 : 0,
      transform: inView ? "translateY(0)" : "translateY(32px)",
      transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s`,
    }}>
      {children}
    </div>
  );
}

export default function HomePage() {
  const [items, setItems] = useState([]);
  const [itemsLoading, setItemsLoading] = useState(true);
  const [heroVisible, setHeroVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setHeroVisible(true), 100);
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const res = await api.get("/items?status=active");
      setItems(res.data.data.slice(0, 6));
    } catch { setItems([]); }
    finally { setItemsLoading(false); }
  };

  return (
    <div style={{ overflowX: "hidden" }}>

      {/* ── Hero ── */}
      <section className="relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, var(--teal-900) 0%, var(--teal-700) 60%, var(--teal-600) 100%)", minHeight: "100vh", display: "flex", alignItems: "center" }}>

        {/* Dot grid */}
        <div className="absolute inset-0"
          style={{ backgroundImage: "radial-gradient(circle at 2px 2px, rgba(255,255,255,0.12) 1px, transparent 0)", backgroundSize: "28px 28px" }}/>

        {/* Floating blobs */}
        <div className="absolute top-20 right-10 w-64 h-64 rounded-full"
          style={{ background: "rgba(255,255,255,0.04)", filter: "blur(40px)", animation: "float 8s ease-in-out infinite" }}/>
        <div className="absolute bottom-20 left-10 w-48 h-48 rounded-full"
          style={{ background: "rgba(251,191,36,0.08)", filter: "blur(30px)", animation: "float 6s ease-in-out infinite reverse" }}/>

        <div className="relative w-full max-w-5xl mx-auto px-6 py-24 text-center">

          {/* Badge */}
          <div style={{
            opacity: heroVisible ? 1 : 0,
            transform: heroVisible ? "translateY(0)" : "translateY(-20px)",
            transition: "opacity 0.6s ease 0.1s, transform 0.6s ease 0.1s",
          }}>
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium mb-8"
              style={{ background: "rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.9)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.15)" }}>
              <span className="w-2 h-2 rounded-full" style={{ background: "#4ade80", boxShadow: "0 0 6px #4ade80", animation: "pulse 2s infinite" }}/>
              Community Lost & Found Platform
            </span>
          </div>

          {/* Headline */}
          <div style={{
            opacity: heroVisible ? 1 : 0,
            transform: heroVisible ? "translateY(0)" : "translateY(24px)",
            transition: "opacity 0.7s ease 0.25s, transform 0.7s ease 0.25s",
          }}>
            <h1 className="font-display font-bold text-white mb-6 leading-tight"
              style={{ fontSize: "clamp(2.2rem, 6vw, 4rem)" }}>
              Reuniting People<br/>
              <span style={{ color: "var(--amber-400)", display: "inline-block", animation: "shimmer 3s ease-in-out infinite" }}>
                With Their Belongings
              </span>
            </h1>
          </div>

          {/* Subtitle */}
          <div style={{
            opacity: heroVisible ? 1 : 0,
            transform: heroVisible ? "translateY(0)" : "translateY(24px)",
            transition: "opacity 0.7s ease 0.4s, transform 0.7s ease 0.4s",
          }}>
            <p className="text-base mb-10 max-w-lg mx-auto leading-relaxed"
              style={{ color: "rgba(255,255,255,0.72)" }}>
              Post a lost item or report something you found. Help your community get their things back — quickly and safely.
            </p>
          </div>

          {/* CTA buttons */}
          <div style={{
            opacity: heroVisible ? 1 : 0,
            transform: heroVisible ? "translateY(0)" : "translateY(24px)",
            transition: "opacity 0.7s ease 0.55s, transform 0.7s ease 0.55s",
          }}>
            <div className="flex flex-col sm:flex-row gap-3 justify-center mb-16">
              <Link href="/items"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-medium text-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                style={{ background: "white", color: "var(--teal-700)", boxShadow: "0 4px 20px rgba(0,0,0,0.15)" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                </svg>
                Browse Items
              </Link>
              <Link href="/post"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-medium text-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                style={{ background: "var(--amber-500)", color: "white", boxShadow: "0 4px 20px rgba(245,158,11,0.35)" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 5v14M5 12h14"/>
                </svg>
                Post an Item
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div style={{
            opacity: heroVisible ? 1 : 0,
            transform: heroVisible ? "translateY(0)" : "translateY(24px)",
            transition: "opacity 0.7s ease 0.7s, transform 0.7s ease 0.7s",
          }}>
            <div className="grid grid-cols-3 gap-3 max-w-2xl mx-auto">
              {[
                { icon: "📦", value: "100+", label: "Items Posted" },
                { icon: "✅", value: "80+", label: "Items Returned" },
                { icon: "👥", value: "50+", label: "Members" },
              ].map((s) => (
                <div key={s.label} className="py-4 px-3 rounded-2xl text-center transition-all duration-300 hover:-translate-y-1"
                  style={{ background: "rgba(255,255,255,0.08)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.12)" }}>
                  <div style={{ fontSize: "1.6rem", marginBottom: "4px" }}>{s.icon}</div>
                  <div className="font-display font-bold text-white" style={{ fontSize: "1.3rem" }}>{s.value}</div>
                  <div style={{ color: "rgba(255,255,255,0.55)", fontSize: "11px" }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2"
          style={{ animation: "bounce 2s infinite", opacity: 0.6 }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m6 9 6 6 6-6"/>
          </svg>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="px-6 py-20" style={{ background: "white" }}>
        <div className="max-w-5xl mx-auto">
          <AnimatedSection className="text-center mb-14">
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "var(--teal-600)" }}>
              Simple Process
            </p>
            <h2 className="font-display font-bold mb-3" style={{ fontSize: "clamp(1.6rem, 4vw, 2.2rem)", color: "var(--text-primary)" }}>
              How It Works
            </h2>
            <p className="text-sm max-w-sm mx-auto" style={{ color: "var(--text-muted)" }}>
              Three easy steps to reunite people with their belongings
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            {/* Connector line desktop */}
            <div className="hidden md:block absolute top-10 left-1/4 right-1/4 h-px"
              style={{ background: "linear-gradient(90deg, var(--teal-200), var(--teal-400), var(--teal-200))", zIndex: 0 }}/>

            {[
              { step: "01", icon: "📝", title: "Post Your Item", desc: "Describe your lost or found item with photos, category, and exact location.", color: "var(--teal-600)" },
              { step: "02", icon: "🔔", title: "Get Notified", desc: "Receive instant email alerts when someone submits a claim on your item.", color: "var(--amber-500)" },
              { step: "03", icon: "🤝", title: "Reunite", desc: "Connect with the owner or finder and safely arrange the return.", color: "#16a34a" },
            ].map((s, i) => (
              <AnimatedSection key={s.step} delay={i * 0.15}
                className="relative p-6 rounded-2xl text-center group transition-all duration-300 hover:-translate-y-2 hover:shadow-lg"
                style={{ background: "var(--surface)", border: "1px solid var(--border)", zIndex: 1 }}>
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-5 transition-transform duration-300 group-hover:scale-110"
                  style={{ background: `${s.color}15`, border: `2px solid ${s.color}30` }}>
                  {s.icon}
                </div>
                <div className="inline-block px-2.5 py-0.5 rounded-full text-xs font-bold mb-3"
                  style={{ background: `${s.color}15`, color: s.color }}>
                  Step {s.step}
                </div>
                <h3 className="font-display font-bold text-base mb-2" style={{ color: "var(--text-primary)" }}>
                  {s.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
                  {s.desc}
                </p>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ── Categories ── */}
      <section className="px-6 py-20" style={{ background: "var(--surface)" }}>
        <div className="max-w-5xl mx-auto">
          <AnimatedSection className="text-center mb-12">
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "var(--teal-600)" }}>
              Browse by Category
            </p>
            <h2 className="font-display font-bold mb-3" style={{ fontSize: "clamp(1.6rem, 4vw, 2.2rem)", color: "var(--text-primary)" }}>
              Find What You're Looking For
            </h2>
          </AnimatedSection>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { icon: "💻", label: "Electronics", cat: "electronics", color: "#2563eb" },
              { icon: "👜", label: "Accessories", cat: "accessories", color: "#9333ea" },
              { icon: "📄", label: "Documents", cat: "documents", color: "#dc2626" },
              { icon: "🔑", label: "Keys", cat: "keys", color: "#ca8a04" },
              { icon: "🐾", label: "Pets", cat: "pets", color: "#16a34a" },
              { icon: "🎒", label: "Bags", cat: "bags", color: "var(--teal-600)" },
              { icon: "👕", label: "Clothing", cat: "clothing", color: "#db2777" },
              { icon: "📦", label: "Other", cat: "other", color: "#64748b" },
            ].map((c, i) => (
              <AnimatedSection key={c.cat} delay={i * 0.06}>
                <Link href={`/items?category=${c.cat}`}
                  className="flex items-center gap-3 p-4 rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-md group"
                  style={{ background: "white", border: "1px solid var(--border)" }}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0 transition-transform duration-300 group-hover:scale-110"
                    style={{ background: `${c.color}12` }}>
                    {c.icon}
                  </div>
                  <span className="font-medium text-sm" style={{ color: "var(--text-primary)" }}>
                    {c.label}
                  </span>
                  <svg className="ml-auto transition-transform duration-300 group-hover:translate-x-1" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </Link>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ── Recent Items ── */}
      <section className="px-6 py-20" style={{ background: "white" }}>
        <div className="max-w-6xl mx-auto">
          <AnimatedSection className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: "var(--teal-600)" }}>
                Latest Posts
              </p>
              <h2 className="font-display font-bold" style={{ fontSize: "clamp(1.6rem, 4vw, 2.2rem)", color: "var(--text-primary)" }}>
                Recent Items
              </h2>
              <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
                Latest lost and found posts from the community
              </p>
            </div>
            <Link href="/items" className="btn-outline self-start sm:self-auto">
              View all items
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </Link>
          </AnimatedSection>

          {itemsLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="rounded-2xl overflow-hidden"
                  style={{ border: "1px solid var(--border)" }}>
                  <div className="h-44 animate-pulse" style={{ background: "var(--surface)" }}/>
                  <div className="p-4 space-y-3">
                    <div className="h-3 rounded animate-pulse w-1/3" style={{ background: "var(--border)" }}/>
                    <div className="h-4 rounded animate-pulse w-3/4" style={{ background: "var(--border)" }}/>
                    <div className="h-3 rounded animate-pulse w-full" style={{ background: "var(--border)" }}/>
                  </div>
                </div>
              ))}
            </div>
          ) : items.length === 0 ? (
            <AnimatedSection>
              <div className="text-center py-20 rounded-2xl"
                style={{ background: "var(--surface)", border: "2px dashed var(--border)" }}>
                <div style={{ fontSize: "3.5rem", marginBottom: "16px" }}>📭</div>
                <p className="font-display font-bold text-lg mb-2" style={{ color: "var(--text-primary)" }}>
                  No items yet
                </p>
                <p className="text-sm mb-6" style={{ color: "var(--text-muted)" }}>
                  Be the first to post a lost or found item
                </p>
                <Link href="/post" className="btn-primary">
                  Post First Item
                </Link>
              </div>
            </AnimatedSection>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((item, i) => (
                <AnimatedSection key={item._id} delay={i * 0.08}>
                  <ItemCard item={item} />
                </AnimatedSection>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <AnimatedSection>
        <section className="px-6 py-16" style={{ background: "var(--surface)" }}>
          <div className="max-w-3xl mx-auto text-center p-10 rounded-3xl relative overflow-hidden"
            style={{ background: "linear-gradient(135deg, var(--teal-900), var(--teal-700))" }}>
            <div className="absolute inset-0 opacity-10"
              style={{ backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)", backgroundSize: "24px 24px" }}/>
            <div className="relative">
              <div style={{ fontSize: "2.5rem", marginBottom: "16px" }}>🤝</div>
              <h2 className="font-display font-bold text-white mb-3"
                style={{ fontSize: "clamp(1.4rem, 3.5vw, 2rem)" }}>
                Help Someone Today
              </h2>
              <p className="text-sm mb-8 max-w-sm mx-auto"
                style={{ color: "rgba(255,255,255,0.7)" }}>
                Found something? Post it now and help someone get their belongings back.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/post"
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-medium text-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
                  style={{ background: "var(--amber-500)", color: "white" }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 5v14M5 12h14"/>
                  </svg>
                  Post an Item
                </Link>
                <Link href="/items"
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-medium text-sm transition-all duration-300 hover:-translate-y-0.5"
                  style={{ background: "rgba(255,255,255,0.15)", color: "white", border: "1px solid rgba(255,255,255,0.25)" }}>
                  Browse Items
                </Link>
              </div>
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* Keyframes */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes shimmer {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }
        @keyframes bounce {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50% { transform: translateX(-50%) translateY(8px); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; box-shadow: 0 0 6px #4ade80; }
          50% { opacity: 0.6; box-shadow: 0 0 12px #4ade80; }
        }
      `}</style>
    </div>
  );
}