"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";

export default function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await api.get("/users/notifications");
      setNotifications(res.data.data);
    } catch { setNotifications([]); }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkAllRead = async () => {
    try {
      await api.patch("/users/notifications/read-all");
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch {}
  };

  const timeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    if (seconds < 60) return "just now";
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  return (
    <>
      <div className="relative">
        {/* Bell button */}
        <button
          onClick={() => setOpen(!open)}
          className="relative p-2 rounded-xl transition-all"
          style={{
            background: open ? "var(--teal-50)" : "transparent",
            color: open ? "var(--teal-600)" : "var(--text-secondary)",
          }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
          </svg>
          {unreadCount > 0 && (
            <span className="absolute top-0.5 right-0.5 min-w-4 h-4 rounded-full text-white flex items-center justify-center font-bold px-1"
              style={{ background: "#ef4444", fontSize: "9px" }}>
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </button>

        {/* Desktop dropdown */}
        {open && (
          <>
            <div className="fixed inset-0 z-40 hidden sm:block"
              onClick={() => setOpen(false)}/>
            <div className="absolute right-0 mt-2 z-50 hidden sm:block"
              style={{
                width: "340px",
                animation: "dropDown 0.2s ease",
              }}>
              <div className="card shadow-2xl overflow-hidden">
                <NotificationContent
                  notifications={notifications}
                  unreadCount={unreadCount}
                  onMarkAllRead={handleMarkAllRead}
                  onClose={() => setOpen(false)}
                  timeAgo={timeAgo}
                />
              </div>
            </div>
          </>
        )}
      </div>

      {/* Mobile bottom sheet */}
      {open && (
        <div className="sm:hidden fixed inset-0 z-50 flex items-end"
          style={{ background: "rgba(15,36,33,0.6)", backdropFilter: "blur(4px)" }}
          onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}>
          <div className="w-full card overflow-hidden"
            style={{
              borderRadius: "20px 20px 0 0",
              maxHeight: "80vh",
              animation: "slideUp 0.3s ease",
            }}>
            {/* Drag handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full" style={{ background: "var(--border)" }}/>
            </div>
            <NotificationContent
              notifications={notifications}
              unreadCount={unreadCount}
              onMarkAllRead={handleMarkAllRead}
              onClose={() => setOpen(false)}
              timeAgo={timeAgo}
              isMobile
            />
          </div>
        </div>
      )}

      <style>{`
        @keyframes dropDown {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
      `}</style>
    </>
  );
}

function NotificationContent({ notifications, unreadCount, onMarkAllRead, onClose, timeAgo, isMobile }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", maxHeight: isMobile ? "75vh" : "420px" }}>

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 flex-shrink-0"
        style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="flex items-center gap-2">
          <span className="font-display font-bold text-sm"
            style={{ color: "var(--text-primary)" }}>
            Notifications
          </span>
          {unreadCount > 0 && (
            <span className="text-xs font-bold px-2 py-0.5 rounded-full"
              style={{ background: "var(--teal-50)", color: "var(--teal-700)" }}>
              {unreadCount} new
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          {unreadCount > 0 && (
            <button onClick={onMarkAllRead}
              className="text-xs font-medium transition-colors"
              style={{ color: "var(--teal-600)" }}>
              Mark all read
            </button>
          )}
          {isMobile && (
            <button onClick={onClose}
              className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: "var(--surface)", color: "var(--text-muted)" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6 6 18M6 6l12 12"/>
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* List */}
      <ul className="overflow-y-auto flex-1"
        style={{ overscrollBehavior: "contain" }}>
        {notifications.length === 0 ? (
          <li className="flex flex-col items-center justify-center py-12 px-4">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-3"
              style={{ background: "var(--teal-50)" }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--teal-600)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
              </svg>
            </div>
            <p className="font-medium text-sm mb-1" style={{ color: "var(--text-primary)" }}>
              All caught up!
            </p>
            <p className="text-xs text-center" style={{ color: "var(--text-muted)" }}>
              You'll see notifications here when someone claims your item
            </p>
          </li>
        ) : (
          notifications.map((n, i) => (
            <li key={n._id}
              className="px-4 py-3 transition-colors"
              style={{
                background: !n.read ? "var(--teal-50)" : "transparent",
                borderBottom: i < notifications.length - 1 ? "1px solid var(--border)" : "none",
              }}>
              <div className="flex items-start gap-3">
                {/* Icon */}
                <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{ background: !n.read ? "var(--teal-100)" : "var(--surface)" }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                    stroke={!n.read ? "var(--teal-600)" : "var(--text-muted)"}
                    strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                  </svg>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm leading-relaxed"
                    style={{ color: "var(--text-primary)", fontWeight: !n.read ? "500" : "400" }}>
                    {n.message}
                  </p>
                  <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
                    {timeAgo(n.createdAt)}
                  </p>
                </div>

                {/* Unread dot */}
                {!n.read && (
                  <div className="w-2 h-2 rounded-full flex-shrink-0 mt-1.5"
                    style={{ background: "var(--teal-500)" }}/>
                )}
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}