"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import api from "@/lib/api";
import ItemCard from "@/components/ItemCard";

function useInView(threshold = 0.1) {
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

function FadeUp({ children, className, style, delay = 0 }) {
  const [ref, inView] = useInView();
  return (
    <div ref={ref} className={className} style={{
      ...style,
      opacity: inView ? 1 : 0,
      transform: inView ? "translateY(0) scale(1)" : "translateY(24px) scale(0.99)",
      transition: `opacity 0.75s cubic-bezier(0.16,1,0.3,1) ${delay}s, transform 0.75s cubic-bezier(0.16,1,0.3,1) ${delay}s`,
    }}>
      {children}
    </div>
  );
}

const SearchIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="7.5"/><path d="m20 20-3.5-3.5"/>
  </svg>
);

const PlusIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 5v14M5 12h14"/>
  </svg>
);

const ArrowRight = ({ size = 15 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M12 5l7 7-7 7"/>
  </svg>
);

const CATEGORIES = [
  {
    label: "Electronics", cat: "electronics", color: "#2563eb", bg: "#eff6ff",
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>,
  },
  {
    label: "Accessories", cat: "accessories", color: "#9333ea", bg: "#faf5ff",
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#9333ea" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>,
  },
  {
    label: "Documents", cat: "documents", color: "#dc2626", bg: "#fef2f2",
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
  },
  {
    label: "Keys", cat: "keys", color: "#ca8a04", bg: "#fefce8",
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ca8a04" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/></svg>,
  },
  {
    label: "Pets", cat: "pets", color: "#16a34a", bg: "#f0fdf4",
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M10 5.172C10 3.782 8.423 2.679 6.5 3c-2.823.47-4.113 6.006-4 7 .08.703 1.725 1.722 3.656 1 1.261-.472 1.96-1.45 2.344-2.5M14.267 5.172c0-1.39 1.577-2.493 3.5-2.172 2.823.47 4.113 6.006 4 7-.08.703-1.725 1.722-3.656 1-1.261-.472-1.96-1.45-2.344-2.5M8 14v.5M16 14v.5"/><path d="M4.42 11.247A13.152 13.152 0 0 0 4 14.556C4 18.728 7.582 21 12 21s8-2.272 8-6.444c0-1.061-.162-2.2-.493-3.309"/></svg>,
  },
  {
    label: "Bags", cat: "bags", color: "#0d9488", bg: "#f0fdfa",
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0d9488" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>,
  },
  {
    label: "Clothing", cat: "clothing", color: "#db2777", bg: "#fdf2f8",
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#db2777" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.57a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.57a2 2 0 0 0-1.34-2.23z"/></svg>,
  },
  {
    label: "Other", cat: "other", color: "#64748b", bg: "#f8fafc",
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
  },
];

export default function HomePage() {
  const [items, setItems] = useState([]);
  const [itemsLoading, setItemsLoading] = useState(true);
  const [heroVisible, setHeroVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setHeroVisible(true), 60);
    fetchItems();
    return () => clearTimeout(t);
  }, []);

  const fetchItems = async () => {
    try {
      const res = await api.get("/items?status=active");
      setItems(res.data.data.slice(0, 6));
    } catch { setItems([]); }
    finally { setItemsLoading(false); }
  };

  const heroAnim = (delay = 0) => ({
    opacity: heroVisible ? 1 : 0,
    transform: heroVisible ? "translateY(0)" : "translateY(20px)",
    transition: `opacity 0.8s cubic-bezier(0.16,1,0.3,1) ${delay}s, transform 0.8s cubic-bezier(0.16,1,0.3,1) ${delay}s`,
  });

  return (
    <div>

      {/* ── HERO ── */}
      <section
        className="relative overflow-hidden"
        style={{
          background: "linear-gradient(150deg, #081e1b 0%, #0b3d34 40%, #0d6b5e 75%, #0f766e 100%)",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}>

        {/* Subtle grid */}
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)",
          backgroundSize: "52px 52px",
        }}/>

        {/* Glow orbs */}
        <div className="absolute pointer-events-none" style={{ top: "10%", right: "-5%", width: "500px", height: "500px", background: "radial-gradient(circle, rgba(20,184,166,0.15) 0%, transparent 65%)", borderRadius: "50%" }}/>
        <div className="absolute pointer-events-none" style={{ bottom: "5%", left: "-5%", width: "350px", height: "350px", background: "radial-gradient(circle, rgba(245,158,11,0.09) 0%, transparent 65%)", borderRadius: "50%" }}/>
        <div className="absolute pointer-events-none" style={{ top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: "600px", height: "600px", background: "radial-gradient(circle, rgba(255,255,255,0.02) 0%, transparent 60%)", borderRadius: "50%" }}/>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 xl:px-8 w-full pt-16 pb-20 sm:pt-20 sm:pb-24">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">

            {/* ── Left ── */}
            <div className="text-center lg:text-left">

              {/* Badge */}
              <div style={heroAnim(0.08)} className="flex justify-center lg:justify-start mb-6">
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium"
                  style={{ background: "rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.8)", border: "1px solid rgba(255,255,255,0.12)", backdropFilter: "blur(12px)", letterSpacing: "0.02em" }}>
                  <span className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                    style={{ background: "#4ade80", boxShadow: "0 0 6px #4ade80", animation: "heroPulse 2.5s ease-in-out infinite" }}/>
                  Community Lost & Found Platform
                </span>
              </div>

              {/* Headline */}
              <div style={heroAnim(0.18)}>
                <h1 className="font-display font-bold text-white leading-none mb-5"
                  style={{ fontSize: "clamp(2.6rem, 7vw, 4.2rem)", lineHeight: 1.08, letterSpacing: "-0.02em" }}>
                  Lost something?<br/>
                  <span style={{ color: "var(--amber-400)" }}>We'll help</span><br/>
                  <span style={{ color: "rgba(255,255,255,0.9)" }}>you find it.</span>
                </h1>
              </div>

              {/* Subtitle */}
              <div style={heroAnim(0.28)}>
                <p className="mb-8 leading-relaxed mx-auto lg:mx-0"
                  style={{ color: "rgba(255,255,255,0.55)", fontSize: "clamp(0.95rem, 2.2vw, 1.05rem)", maxWidth: "420px", lineHeight: 1.75 }}>
                  Post a lost or found item in seconds. Our community helps reunite people with their belongings every day — for free.
                </p>
              </div>

              {/* CTA buttons */}
              <div style={heroAnim(0.38)}>
                <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start mb-10">
                  <Link href="/items"
                    className="inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-xl font-medium transition-all duration-300 hover:-translate-y-0.5 active:scale-95"
                    style={{ background: "white", color: "#0d4a3f", fontSize: "15px", fontWeight: 600, boxShadow: "0 4px 28px rgba(0,0,0,0.22)", letterSpacing: "-0.01em" }}>
                    <SearchIcon size={18}/>
                    Browse Items
                  </Link>
                  <Link href="/post"
                    className="inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-xl font-medium transition-all duration-300 hover:-translate-y-0.5 active:scale-95"
                    style={{ background: "var(--amber-500)", color: "white", fontSize: "15px", fontWeight: 600, boxShadow: "0 4px 24px rgba(245,158,11,0.32)", letterSpacing: "-0.01em" }}>
                    <PlusIcon size={18}/>
                    Post an Item
                  </Link>
                </div>
              </div>

              {/* Trust stats */}
              <div style={heroAnim(0.48)}>
                <div className="flex items-center gap-0 justify-center lg:justify-start">
                  {[
                    { value: "100+", label: "Items posted" },
                    { value: "80+", label: "Returned" },
                    { value: "Free", label: "Always" },
                  ].map((s, i) => (
                    <div key={s.label} className="flex items-center">
                      {i > 0 && <span className="mx-4" style={{ color: "rgba(255,255,255,0.12)", fontSize: "22px" }}>|</span>}
                      <div className="text-center lg:text-left">
                        <div className="font-display font-bold text-white" style={{ fontSize: "1.15rem", lineHeight: 1.2, letterSpacing: "-0.01em" }}>{s.value}</div>
                        <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "11px", marginTop: "1px" }}>{s.label}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ── Right — Activity card ── */}
            <div style={heroAnim(0.3)} className="hidden lg:block">
              <div className="relative">
                <div className="rounded-3xl overflow-hidden"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.09)", backdropFilter: "blur(20px)" }}>

                  {/* Card header */}
                  <div className="flex items-center justify-between px-5 py-4"
                    style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center"
                        style={{ background: "rgba(255,255,255,0.1)" }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><polyline points="13 2 13 9 20 9"/>
                        </svg>
                      </div>
                      <span className="text-sm font-medium text-white">Recent activity</span>
                    </div>
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full"
                      style={{ background: "rgba(74,222,128,0.12)", border: "1px solid rgba(74,222,128,0.2)" }}>
                      <span className="w-1.5 h-1.5 rounded-full" style={{ background: "#4ade80", animation: "heroPulse 2s ease-in-out infinite" }}/>
                      <span className="text-xs font-medium" style={{ color: "#4ade80" }}>Live</span>
                    </div>
                  </div>

                  {/* Activity list */}
                  <div className="divide-y" style={{ "--tw-divide-opacity": 0 }}>
                    {[
                      { type: "lost", title: "Black leather wallet", location: "Colombo Fort", time: "2m ago", color: "#ef4444" },
                      { type: "found", title: "Blue backpack with laptop", location: "Pettah Market", time: "18m ago", color: "#3b82f6" },
                      { type: "lost", title: "House keys — Toyota keychain", location: "Maradana", time: "1h ago", color: "#ef4444" },
                      { type: "found", title: "National ID card", location: "Kollupitiya", time: "2h ago", color: "#3b82f6" },
                      { type: "lost", title: "Samsung Galaxy phone", location: "Bambalapitiya", time: "3h ago", color: "#ef4444" },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-3 px-5 py-3.5 transition-colors hover:bg-white/5"
                        style={{ borderBottom: i < 4 ? "1px solid rgba(255,255,255,0.05)" : "none" }}>
                        <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                          style={{ background: `${item.color}18` }}>
                          {item.type === "lost" ? (
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={item.color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                              <circle cx="11" cy="11" r="7.5"/><path d="m20 20-3.5-3.5"/>
                            </svg>
                          ) : (
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={item.color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="20 6 9 17 4 12"/>
                            </svg>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate" style={{ color: "rgba(255,255,255,0.88)", letterSpacing: "-0.01em" }}>{item.title}</p>
                          <p className="text-xs truncate mt-0.5" style={{ color: "rgba(255,255,255,0.35)" }}>{item.location}</p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <span className="text-xs px-2 py-0.5 rounded-full"
                            style={{ background: item.type === "lost" ? "rgba(239,68,68,0.12)" : "rgba(59,130,246,0.12)", color: item.type === "lost" ? "#fca5a5" : "#93c5fd", fontSize: "10px", fontWeight: 600 }}>
                            {item.type.toUpperCase()}
                          </span>
                          <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.25)" }}>{item.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Card footer */}
                  <div className="px-5 py-4" style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}>
                    <Link href="/items"
                      className="flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all hover:bg-white/10"
                      style={{ color: "rgba(255,255,255,0.6)" }}>
                      View all items <ArrowRight size={14}/>
                    </Link>
                  </div>
                </div>

                {/* Floating badge */}
                <div className="absolute -top-3 -right-3 px-3.5 py-2 rounded-xl shadow-2xl"
                  style={{ background: "var(--amber-500)", animation: "floatBadge 4s ease-in-out infinite", zIndex: 10 }}>
                  <p className="text-white text-xs font-bold" style={{ letterSpacing: "0.01em" }}>80+ returned ✓</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile hero stats */}
        <div className="lg:hidden relative px-4 pb-8" style={heroAnim(0.5)}>
          <div className="grid grid-cols-3 gap-2 max-w-sm mx-auto">
            {[
              { value: "100+", label: "Posted" },
              { value: "80+", label: "Returned" },
              { value: "Free", label: "Always" },
            ].map((s) => (
              <div key={s.label} className="text-center py-3 px-2 rounded-2xl"
                style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.09)" }}>
                <div className="font-display font-bold text-white text-lg" style={{ letterSpacing: "-0.02em" }}>{s.value}</div>
                <div className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

      </section>

      {/* ── HOW IT WORKS ── */}
      <section style={{ background: "white" }} className="px-4 sm:px-6 py-16 sm:py-20 lg:py-24">
        <div className="max-w-5xl mx-auto">
          <FadeUp className="text-center mb-12 sm:mb-16">
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "var(--teal-600)", letterSpacing: "0.12em" }}>
              Simple process
            </p>
            <h2 className="font-display font-bold mb-3"
              style={{ fontSize: "clamp(1.75rem, 4.5vw, 2.5rem)", color: "var(--text-primary)", letterSpacing: "-0.02em" }}>
              How it works
            </h2>
            <p className="text-sm mx-auto" style={{ color: "var(--text-muted)", lineHeight: 1.75, maxWidth: "280px" }}>
              Three simple steps to reunite people with their belongings
            </p>
          </FadeUp>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
            {[
              {
                step: "01", color: "var(--teal-600)", bg: "var(--teal-50)",
                title: "Post your item",
                desc: "Describe the lost or found item with a photo, category, and exact location. Takes under 2 minutes.",
                icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--teal-600)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
              },
              {
                step: "02", color: "var(--amber-500)", bg: "#fffbeb",
                title: "Get notified",
                desc: "Receive an instant email the moment someone submits a claim or matches your item post.",
                icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--amber-500)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/><path d="M2 8c0-2.2.7-4.3 2-6"/><path d="M22 8a10 10 0 0 0-2-6"/></svg>,
              },
              {
                step: "03", color: "#16a34a", bg: "#f0fdf4",
                title: "Reunite safely",
                desc: "Approve the claim and connect with the finder or owner to arrange a safe, easy return.",
                icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>,
              },
            ].map((s, i) => (
              <FadeUp key={s.step} delay={i * 0.1}
                className="relative p-6 sm:p-7 rounded-2xl group transition-all duration-400 hover:-translate-y-2 hover:shadow-xl cursor-default"
                style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>

                <div className="absolute top-4 right-5 font-display font-bold select-none pointer-events-none"
                  style={{ fontSize: "3.5rem", color: "var(--border)", lineHeight: 1, letterSpacing: "-0.03em" }}>
                  {s.step}
                </div>

                <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-5"
                  style={{ background: s.bg }}>
                  {s.icon}
                </div>

                <h3 className="font-display font-bold text-base mb-2" style={{ color: "var(--text-primary)", letterSpacing: "-0.01em" }}>
                  {s.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)", lineHeight: 1.7 }}>
                  {s.desc}
                </p>

                <div className="mt-5 h-px rounded-full transition-all duration-500 group-hover:w-full"
                  style={{ background: `linear-gradient(90deg, ${s.color}, transparent)`, width: "36px" }}/>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── CATEGORIES ── */}
      <section style={{ background: "var(--surface)" }} className="px-4 sm:px-6 py-16 sm:py-20 lg:py-24">
        <div className="max-w-5xl mx-auto">
          <FadeUp className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-10">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: "var(--teal-600)", letterSpacing: "0.12em" }}>
                Browse by category
              </p>
              <h2 className="font-display font-bold"
                style={{ fontSize: "clamp(1.75rem, 4.5vw, 2.5rem)", color: "var(--text-primary)", letterSpacing: "-0.02em" }}>
                What are you looking for?
              </h2>
            </div>
            <Link href="/items" className="btn-outline self-start sm:self-auto flex-shrink-0 text-sm">
              All items <ArrowRight/>
            </Link>
          </FadeUp>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
            {CATEGORIES.map((c, i) => (
              <FadeUp key={c.cat} delay={i * 0.04}>
                <Link href={`/items?category=${c.cat}`}
                  className="flex items-center gap-3 p-3.5 sm:p-4 rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-md group active:scale-95"
                  style={{ background: "white", border: "1px solid var(--border)" }}>
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110"
                    style={{ background: c.bg }}>
                    {c.icon}
                  </div>
                  <span className="font-medium text-sm leading-tight" style={{ color: "var(--text-primary)" }}>
                    {c.label}
                  </span>
                  <div className="ml-auto opacity-0 group-hover:opacity-100 transition-all duration-200 translate-x-1 group-hover:translate-x-0">
                    <ArrowRight size={13}/>
                  </div>
                </Link>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── RECENT ITEMS ── */}
      <section style={{ background: "white" }} className="px-4 sm:px-6 py-16 sm:py-20 lg:py-24">
        <div className="max-w-6xl mx-auto">
          <FadeUp className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-10">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: "var(--teal-600)", letterSpacing: "0.12em" }}>
                Latest posts
              </p>
              <h2 className="font-display font-bold"
                style={{ fontSize: "clamp(1.75rem, 4.5vw, 2.5rem)", color: "var(--text-primary)", letterSpacing: "-0.02em" }}>
                Recent items
              </h2>
              <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
                Latest lost and found posts from your community
              </p>
            </div>
            <Link href="/items" className="btn-outline self-start sm:self-auto flex-shrink-0 text-sm">
              View all <ArrowRight/>
            </Link>
          </FadeUp>

          {itemsLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="rounded-2xl overflow-hidden animate-pulse"
                  style={{ border: "1px solid var(--border)" }}>
                  <div className="h-44" style={{ background: "var(--surface)" }}/>
                  <div className="p-4 space-y-3">
                    <div className="flex gap-2">
                      <div className="h-5 w-14 rounded-full" style={{ background: "var(--border)" }}/>
                      <div className="h-5 w-14 rounded-full" style={{ background: "var(--border)" }}/>
                    </div>
                    <div className="h-4 rounded-lg w-3/4" style={{ background: "var(--border)" }}/>
                    <div className="h-3 rounded-lg w-full" style={{ background: "var(--border)" }}/>
                    <div className="h-3 rounded-lg w-2/3" style={{ background: "var(--border)" }}/>
                  </div>
                </div>
              ))}
            </div>
          ) : items.length === 0 ? (
            <FadeUp>
              <div className="text-center py-16 sm:py-20 rounded-2xl"
                style={{ background: "var(--surface)", border: "2px dashed var(--border)" }}>
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
                  style={{ background: "var(--teal-50)" }}>
                  <SearchIcon size={24}/>
                </div>
                <p className="font-display font-bold text-lg mb-2" style={{ color: "var(--text-primary)" }}>
                  No items yet
                </p>
                <p className="text-sm mb-6" style={{ color: "var(--text-muted)" }}>
                  Be the first to post a lost or found item
                </p>
                <Link href="/post" className="btn-primary">
                  <PlusIcon size={16}/> Post First Item
                </Link>
              </div>
            </FadeUp>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {items.map((item, i) => (
                <FadeUp key={item._id} delay={i * 0.06}>
                  <ItemCard item={item}/>
                </FadeUp>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <FadeUp>
        <section style={{ background: "var(--surface)" }} className="px-4 sm:px-6 py-12 sm:py-16">
          <div className="max-w-4xl mx-auto">
            <div className="rounded-3xl overflow-hidden relative"
              style={{ background: "linear-gradient(135deg, #081e1b 0%, #0b3d34 45%, #0d6b5e 80%, #0f766e 100%)" }}>

              <div className="absolute inset-0 pointer-events-none"
                style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)", backgroundSize: "40px 40px" }}/>

              <div className="absolute top-0 right-0 w-72 h-72 pointer-events-none"
                style={{ background: "radial-gradient(circle, rgba(245,158,11,0.1) 0%, transparent 65%)" }}/>

              <div className="relative px-6 sm:px-10 lg:px-14 py-10 sm:py-12 lg:py-14">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8">
                  <div className="flex-1">
                    <p className="text-xs font-bold uppercase tracking-widest mb-3"
                      style={{ color: "rgba(74,222,128,0.75)", letterSpacing: "0.12em" }}>
                      Join the community
                    </p>
                    <h2 className="font-display font-bold text-white mb-3"
                      style={{ fontSize: "clamp(1.5rem, 3.5vw, 2.1rem)", letterSpacing: "-0.02em", lineHeight: 1.2 }}>
                      Help someone today
                    </h2>
                    <p className="text-sm leading-relaxed"
                      style={{ color: "rgba(255,255,255,0.5)", maxWidth: "360px", lineHeight: 1.75 }}>
                      Found something? Post it now. Lost something? Someone might have already found it.
                    </p>
                  </div>

                  <div className="flex flex-col xs:flex-row sm:flex-col lg:flex-row gap-3 flex-shrink-0 w-full sm:w-auto">
                    <Link href="/post"
                      className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-medium text-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl active:scale-95 w-full sm:w-auto"
                      style={{ background: "var(--amber-500)", color: "white", fontWeight: 600, boxShadow: "0 4px 20px rgba(245,158,11,0.25)" }}>
                      <PlusIcon size={16}/>
                      Post an item
                    </Link>
                    <Link href="/items"
                      className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-medium text-sm transition-all duration-300 hover:-translate-y-0.5 active:scale-95 w-full sm:w-auto"
                      style={{ background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.85)", border: "1px solid rgba(255,255,255,0.15)" }}>
                      <SearchIcon size={16}/>
                      Browse items
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </FadeUp>

      <style>{`
        @keyframes heroPulse {
          0%, 100% { opacity: 1; box-shadow: 0 0 6px #4ade80; }
          50% { opacity: 0.45; box-shadow: 0 0 14px #4ade80; }
        }
        @keyframes floatBadge {
          0%, 100% { transform: translateY(0px) rotate(-1.5deg); }
          50% { transform: translateY(-10px) rotate(-1.5deg); }
        }
      `}</style>
    </div>
  );
}