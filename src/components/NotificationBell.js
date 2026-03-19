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

  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)}
        className="relative p-2 rounded-xl transition-colors"
        style={{ background: open ? "var(--teal-50)" : "transparent", color: "var(--text-secondary)" }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
        </svg>
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 rounded-full text-white text-xs flex items-center justify-center font-bold"
            style={{ background: "#ef4444", fontSize: "10px" }}>
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)}/>
          <div className="absolute right-0 mt-2 w-80 card shadow-xl z-50 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3"
              style={{ borderBottom: "1px solid var(--border)" }}>
              <span className="font-display font-600 text-sm">Notifications</span>
              {unreadCount > 0 && (
                <button onClick={handleMarkAllRead}
                  className="text-xs font-medium transition-colors"
                  style={{ color: "var(--teal-600)" }}>
                  Mark all read
                </button>
              )}
            </div>
            <ul className="max-h-72 overflow-y-auto divide-y" style={{ "--tw-divide-opacity": 1 }}>
              {notifications.length === 0 ? (
                <li className="px-4 py-8 text-center">
                  <div className="text-3xl mb-2">🔔</div>
                  <p className="text-sm" style={{ color: "var(--text-muted)" }}>No notifications yet</p>
                </li>
              ) : (
                notifications.map((n) => (
                  <li key={n._id} className="px-4 py-3 transition-colors"
                    style={{ background: !n.read ? "var(--teal-50)" : "transparent" }}>
                    <p className="text-sm" style={{ color: "var(--text-primary)" }}>{n.message}</p>
                    <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
                      {new Date(n.createdAt).toLocaleDateString()}
                    </p>
                  </li>
                ))
              )}
            </ul>
          </div>
        </>
      )}
    </div>
  );
}