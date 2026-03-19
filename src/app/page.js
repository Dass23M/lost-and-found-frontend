"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import api from "@/lib/api";
import ItemCard from "@/components/ItemCard";

function useInView(threshold = 0.12) {
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
      transform: inView ? "translateY(0)" : "translateY(28px)",
      transition: `opacity 0.65s ease ${delay}s, transform 0.65s ease ${delay}s`,
    }}>
      {children}
    </div>
  );
}

const SearchIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="7.5"/><path d="m20 20-3.5-3.5"/>
  </svg>
);

const PlusIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 5v14M5 12h14"/>
  </svg>
);

const ArrowRight = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M12 5l7 7-7 7"/>
  </svg>
);

const ChevronDown = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m6 9 6 6 6-6"/>
  </svg>
);

export default function HomePage() {
  const [items, setItems] = useState([]);
  const [itemsLoading, setItemsLoading] = useState(true);
  const [heroVisible, setHeroVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setHeroVisible(true), 80);
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const res = await api.get("/items?status=active");
      setItems(res.data.data.slice(0, 6));
    } catch { setItems([]); }
    finally { setItemsLoading(false); }
  };

  const fadeIn = (delay = 0) => ({
    opacity: heroVisible ? 1 : 0,
    transform: heroVisible ? "translateY(0)" : "translateY(22px)",
    transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s`,
  });

  return (
    <div style={{ overflowX: "hidden" }}>

      {/* ── HERO ── */}
      <section className="relative overflow-hidden"
        style={{
          background: "linear-gradient(150deg, #0a2622 0%, #0d4a3f 45%, #0f766e 100%)",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}>

        {/* Grid pattern */}
        <div className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
            `,
            backgroundSize: "48px 48px",
          }}/>

        {/* Glow orbs */}
        <div className="absolute pointer-events-none"
          style={{ top: "15%", right: "8%", width: "380px", height: "380px", background: "radial-gradient(circle, rgba(20,184,166,0.18) 0%, transparent 70%)", borderRadius: "50%" }}/>
        <div className="absolute pointer-events-none"
          style={{ bottom: "10%", left: "5%", width: "280px", height: "280px", background: "radial-gradient(circle, rgba(245,158,11,0.1) 0%, transparent 70%)", borderRadius: "50%" }}/>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 w-full py-20 sm:py-28">
          <div className="grid lg:grid-cols-2 gap-12 items-center">

            {/* Left — text */}
            <div>
              {/* Badge */}
              <div style={fadeIn(0.1)}>
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium mb-7"
                  style={{ background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.85)", border: "1px solid rgba(255,255,255,0.12)", backdropFilter: "blur(8px)" }}>
                  <span className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                    style={{ background: "#4ade80", boxShadow: "0 0 6px #4ade80", animation: "heroPulse 2.5s ease-in-out infinite" }}/>
                  Community Lost & Found Platform
                </span>
              </div>

              {/* Headline */}
              <div style={fadeIn(0.2)}>
                <h1 className="font-display font-bold text-white leading-tight mb-5"
                  style={{ fontSize: "clamp(2.4rem, 5.5vw, 3.8rem)", lineHeight: 1.12 }}>
                  Lost something?<br/>
                  <span style={{ color: "var(--amber-400)" }}>We'll help you</span><br/>
                  find it.
                </h1>
              </div>

              {/* Subtitle */}
              <div style={fadeIn(0.32)}>
                <p className="mb-8 leading-relaxed"
                  style={{ color: "rgba(255,255,255,0.6)", fontSize: "clamp(0.95rem, 2vw, 1.05rem)", maxWidth: "440px" }}>
                  Post a lost or found item in seconds. Our community helps reunite people with their belongings every day.
                </p>
              </div>

              {/* CTA buttons */}
              <div style={fadeIn(0.42)}>
                <div className="flex flex-col sm:flex-row gap-3 mb-10">
                  <Link href="/items"
                    className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl font-medium transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl"
                    style={{ background: "white", color: "var(--teal-800, #134e4a)", fontSize: "15px", boxShadow: "0 4px 24px rgba(0,0,0,0.18)" }}>
                    <SearchIcon/>
                    Browse Items
                  </Link>
                  <Link href="/post"
                    className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl font-medium transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
                    style={{ background: "var(--amber-500)", color: "white", fontSize: "15px", boxShadow: "0 4px 20px rgba(245,158,11,0.3)" }}>
                    <PlusIcon/>
                    Post an Item
                  </Link>
                </div>
              </div>

              {/* Trust line */}
              <div style={fadeIn(0.52)}>
                <div className="flex items-center gap-6 flex-wrap">
                  {[
                    { value: "100+", label: "Items posted" },
                    { value: "80+", label: "Items returned" },
                    { value: "Free", label: "Always" },
                  ].map((s, i) => (
                    <div key={s.label} className="flex items-center gap-2">
                      {i > 0 && <span style={{ color: "rgba(255,255,255,0.15)", fontSize: "20px" }}>·</span>}
                      <span className="font-display font-bold text-white" style={{ fontSize: "1.1rem" }}>{s.value}</span>
                      <span className="text-xs" style={{ color: "rgba(255,255,255,0.45)" }}>{s.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right — visual card */}
            <div style={fadeIn(0.35)} className="hidden lg:block">
              <div className="relative">
                {/* Main card */}
                <div className="p-6 rounded-3xl"
                  style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", backdropFilter: "blur(16px)" }}>

                  <div className="flex items-center justify-between mb-5">
                    <span className="text-sm font-medium text-white">Recent activity</span>
                    <span className="text-xs px-2.5 py-1 rounded-full"
                      style={{ background: "rgba(74,222,128,0.15)", color: "#4ade80" }}>
                      Live
                    </span>
                  </div>

                  {/* Mock activity items */}
                  {[
                    { type: "lost", title: "Black leather wallet", location: "Colombo Fort", time: "2m ago", color: "#ef4444" },
                    { type: "found", title: "Blue backpack", location: "Pettah Market", time: "15m ago", color: "#3b82f6" },
                    { type: "lost", title: "House keys — Toyota keychain", location: "Maradana", time: "1h ago", color: "#ef4444" },
                    { type: "found", title: "National ID card", location: "Kollupitiya", time: "2h ago", color: "#3b82f6" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 py-3"
                      style={{ borderBottom: i < 3 ? "1px solid rgba(255,255,255,0.06)" : "none" }}>
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ background: `${item.color}20` }}>
                        {item.type === "lost" ? (
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={item.color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="11" cy="11" r="7.5"/><path d="m20 20-3.5-3.5"/>
                          </svg>
                        ) : (
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={item.color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12"/>
                          </svg>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate" style={{ color: "rgba(255,255,255,0.9)" }}>{item.title}</p>
                        <p className="text-xs truncate" style={{ color: "rgba(255,255,255,0.4)" }}>{item.location}</p>
                      </div>
                      <span className="text-xs flex-shrink-0" style={{ color: "rgba(255,255,255,0.3)" }}>{item.time}</span>
                    </div>
                  ))}

                  <Link href="/items"
                    className="flex items-center justify-center gap-2 mt-4 py-2.5 rounded-xl text-sm font-medium transition-all"
                    style={{ background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.7)" }}>
                    View all items <ArrowRight size={14}/>
                  </Link>
                </div>

                {/* Floating badge */}
                <div className="absolute -top-4 -right-4 px-4 py-2.5 rounded-2xl shadow-xl"
                  style={{ background: "var(--amber-500)", animation: "floatBadge 4s ease-in-out infinite" }}>
                  <p className="text-white text-xs font-bold">80+ returned</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 opacity-40"
          style={{ animation: "scrollBounce 2s ease-in-out infinite" }}>
          <ChevronDown/>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section style={{ background: "white" }} className="px-4 sm:px-6 py-20 sm:py-24">
        <div className="max-w-5xl mx-auto">
          <FadeUp className="text-center mb-14">
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "var(--teal-600)" }}>
              Simple process
            </p>
            <h2 className="font-display font-bold mb-3"
              style={{ fontSize: "clamp(1.7rem, 4vw, 2.4rem)", color: "var(--text-primary)" }}>
              How it works
            </h2>
            <p className="text-sm max-w-xs mx-auto" style={{ color: "var(--text-muted)", lineHeight: 1.7 }}>
              Three steps to reunite people with their belongings
            </p>
          </FadeUp>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                step: "01",
                color: "var(--teal-600)",
                bg: "var(--teal-50)",
                title: "Post your item",
                desc: "Describe the lost or found item with a photo, category, and location. Takes under 2 minutes.",
                icon: (
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--teal-600)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                  </svg>
                ),
              },
              {
                step: "02",
                color: "var(--amber-500)",
                bg: "#fffbeb",
                title: "Get notified instantly",
                desc: "Receive an email the moment someone submits a claim on your item or matches your post.",
                icon: (
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--amber-500)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                    <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                    <path d="M2 8c0-2.2.7-4.3 2-6"/>
                    <path d="M22 8a10 10 0 0 0-2-6"/>
                  </svg>
                ),
              },
              {
                step: "03",
                color: "#16a34a",
                bg: "#f0fdf4",
                title: "Reunite safely",
                desc: "Approve the claim and connect with the finder or owner to arrange a safe return.",
                icon: (
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                  </svg>
                ),
              },
            ].map((s, i) => (
              <FadeUp key={s.step} delay={i * 0.12}
                className="relative p-6 sm:p-7 rounded-2xl group transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lg"
                style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
                <div className="flex items-start justify-between mb-5">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
                    style={{ background: s.bg }}>
                    {s.icon}
                  </div>
                  <span className="font-display font-bold text-4xl"
                    style={{ color: "var(--border)", lineHeight: 1 }}>
                    {s.step}
                  </span>
                </div>
                <h3 className="font-display font-bold text-base mb-2" style={{ color: "var(--text-primary)" }}>
                  {s.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
                  {s.desc}
                </p>
                <div className="mt-5 h-0.5 rounded-full transition-all duration-300 group-hover:w-full"
                  style={{ background: s.color, width: "32px" }}/>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── CATEGORIES ── */}
      <section style={{ background: "var(--surface)" }} className="px-4 sm:px-6 py-20 sm:py-24">
        <div className="max-w-5xl mx-auto">
          <FadeUp className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: "var(--teal-600)" }}>
                Browse by category
              </p>
              <h2 className="font-display font-bold"
                style={{ fontSize: "clamp(1.7rem, 4vw, 2.4rem)", color: "var(--text-primary)" }}>
                What are you looking for?
              </h2>
            </div>
            <Link href="/items" className="btn-outline self-start sm:self-auto flex-shrink-0">
              All items <ArrowRight/>
            </Link>
          </FadeUp>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              {
                label: "Electronics", cat: "electronics",
                icon: (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>
                  </svg>
                ),
                color: "#2563eb", bg: "#eff6ff",
              },
              {
                label: "Accessories", cat: "accessories",
                icon: (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#9333ea" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>
                  </svg>
                ),
                color: "#9333ea", bg: "#faf5ff",
              },
              {
                label: "Documents", cat: "documents",
                icon: (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
                  </svg>
                ),
                color: "#dc2626", bg: "#fef2f2",
              },
              {
                label: "Keys", cat: "keys",
                icon: (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ca8a04" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/>
                  </svg>
                ),
                color: "#ca8a04", bg: "#fefce8",
              },
              {
                label: "Pets", cat: "pets",
                icon: (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M10 5.172C10 3.782 8.423 2.679 6.5 3c-2.823.47-4.113 6.006-4 7 .08.703 1.725 1.722 3.656 1 1.261-.472 1.96-1.45 2.344-2.5M14.267 5.172c0-1.39 1.577-2.493 3.5-2.172 2.823.47 4.113 6.006 4 7-.08.703-1.725 1.722-3.656 1-1.261-.472-1.96-1.45-2.344-2.5M8 14v.5M16 14v.5M11.25 16.25h1.5L12 17l-.75-.75z"/>
                    <path d="M4.42 11.247A13.152 13.152 0 0 0 4 14.556C4 18.728 7.582 21 12 21s8-2.272 8-6.444c0-1.061-.162-2.2-.493-3.309m-9.243-6.082A8.801 8.801 0 0 1 12 5c.78 0 1.5.108 2.161.306"/>
                  </svg>
                ),
                color: "#16a34a", bg: "#f0fdf4",
              },
              {
                label: "Bags", cat: "bags",
                icon: (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--teal-600)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/>
                    <path d="M16 10a4 4 0 0 1-8 0"/>
                  </svg>
                ),
                color: "var(--teal-600)", bg: "var(--teal-50)",
              },
              {
                label: "Clothing", cat: "clothing",
                icon: (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#db2777" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.57a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.57a2 2 0 0 0-1.34-2.23z"/>
                  </svg>
                ),
                color: "#db2777", bg: "#fdf2f8",
              },
              {
                label: "Other", cat: "other",
                icon: (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/>
                  </svg>
                ),
                color: "#64748b", bg: "#f8fafc",
              },
            ].map((c, i) => (
              <FadeUp key={c.cat} delay={i * 0.05}>
                <Link href={`/items?category=${c.cat}`}
                  className="flex items-center gap-3 p-4 rounded-2xl transition-all duration-250 hover:-translate-y-1 hover:shadow-md group"
                  style={{ background: "white", border: "1px solid var(--border)" }}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-250 group-hover:scale-105"
                    style={{ background: c.bg }}>
                    {c.icon}
                  </div>
                  <span className="font-medium text-sm" style={{ color: "var(--text-primary)" }}>
                    {c.label}
                  </span>
                  <ArrowRight size={13}/>
                </Link>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── RECENT ITEMS ── */}
      <section style={{ background: "white" }} className="px-4 sm:px-6 py-20 sm:py-24">
        <div className="max-w-6xl mx-auto">
          <FadeUp className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: "var(--teal-600)" }}>
                Latest posts
              </p>
              <h2 className="font-display font-bold"
                style={{ fontSize: "clamp(1.7rem, 4vw, 2.4rem)", color: "var(--text-primary)" }}>
                Recent items
              </h2>
              <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
                Latest lost and found posts from your community
              </p>
            </div>
            <Link href="/items" className="btn-outline self-start sm:self-auto flex-shrink-0">
              View all <ArrowRight/>
            </Link>
          </FadeUp>

          {itemsLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="rounded-2xl overflow-hidden animate-pulse"
                  style={{ border: "1px solid var(--border)" }}>
                  <div className="h-44" style={{ background: "var(--surface)" }}/>
                  <div className="p-4 space-y-3">
                    <div className="flex gap-2">
                      <div className="h-5 w-14 rounded-full" style={{ background: "var(--border)" }}/>
                      <div className="h-5 w-14 rounded-full" style={{ background: "var(--border)" }}/>
                    </div>
                    <div className="h-4 rounded w-3/4" style={{ background: "var(--border)" }}/>
                    <div className="h-3 rounded w-full" style={{ background: "var(--border)" }}/>
                  </div>
                </div>
              ))}
            </div>
          ) : items.length === 0 ? (
            <FadeUp>
              <div className="text-center py-20 rounded-2xl"
                style={{ background: "var(--surface)", border: "2px dashed var(--border)" }}>
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
                  style={{ background: "var(--teal-50)" }}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--teal-600)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="7.5"/><path d="m20 20-3.5-3.5"/>
                  </svg>
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {items.map((item, i) => (
                <FadeUp key={item._id} delay={i * 0.07}>
                  <ItemCard item={item}/>
                </FadeUp>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <FadeUp>
        <section style={{ background: "var(--surface)" }} className="px-4 sm:px-6 py-16">
          <div className="max-w-4xl mx-auto">
            <div className="rounded-3xl overflow-hidden relative"
              style={{ background: "linear-gradient(135deg, #0a2622 0%, #0d4a3f 50%, #0f766e 100%)" }}>
              <div className="absolute inset-0 pointer-events-none"
                style={{
                  backgroundImage: `linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)`,
                  backgroundSize: "40px 40px",
                }}/>
              <div className="absolute top-0 right-0 w-64 h-64 pointer-events-none"
                style={{ background: "radial-gradient(circle, rgba(245,158,11,0.12) 0%, transparent 60%)" }}/>

              <div className="relative px-6 sm:px-10 py-10 sm:py-12 flex flex-col sm:flex-row items-center justify-between gap-8">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest mb-2"
                    style={{ color: "rgba(74,222,128,0.8)" }}>
                    Join the community
                  </p>
                  <h2 className="font-display font-bold text-white mb-3"
                    style={{ fontSize: "clamp(1.4rem, 3vw, 2rem)" }}>
                    Help someone today
                  </h2>
                  <p className="text-sm leading-relaxed"
                    style={{ color: "rgba(255,255,255,0.55)", maxWidth: "380px" }}>
                    Found something? Post it now. Lost something? Someone might have already found it.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
                  <Link href="/post"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium text-sm transition-all hover:-translate-y-0.5 hover:shadow-lg"
                    style={{ background: "var(--amber-500)", color: "white" }}>
                    <PlusIcon size={16}/>
                    Post an item
                  </Link>
                  <Link href="/items"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium text-sm transition-all hover:-translate-y-0.5"
                    style={{ background: "rgba(255,255,255,0.1)", color: "white", border: "1px solid rgba(255,255,255,0.2)" }}>
                    <SearchIcon/>
                    Browse items
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </FadeUp>

      <style>{`
        @keyframes heroPulse {
          0%, 100% { opacity: 1; box-shadow: 0 0 6px #4ade80; }
          50% { opacity: 0.5; box-shadow: 0 0 12px #4ade80; }
        }
        @keyframes floatBadge {
          0%, 100% { transform: translateY(0px) rotate(-2deg); }
          50% { transform: translateY(-8px) rotate(-2deg); }
        }
        @keyframes scrollBounce {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50% { transform: translateX(-50%) translateY(7px); }
        }
      `}</style>
    </div>
  );
}