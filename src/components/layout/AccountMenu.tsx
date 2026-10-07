"use client";

import { useState, useRef, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { User, ChevronDown, Package, MapPin, LogOut } from "lucide-react";
import gsap from "gsap";
import { authApi } from "@/lib/api/auth";

function Avatar({
  src,
  fallback,
  size,
}: {
  src?: string;
  fallback: string;
  size: number;
}) {
  const [failed, setFailed] = useState(false);

  if (src && !failed) {
    return (
      <img
        src={src}
        alt=""
        referrerPolicy="no-referrer"
        onError={() => setFailed(true)}
        className="shrink-0 rounded-full object-cover"
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <span
      className="flex shrink-0 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary"
      style={{
        width: size,
        height: size,
        fontSize: size * 0.4,
      }}
    >
      {fallback}
    </span>
  );
}

export function AccountMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  const { data: user } = useQuery({
    queryKey: ["auth-me"],
    queryFn: authApi.getMe,
  });

  useEffect(() => {
    if (isOpen && panelRef.current) {
      gsap.fromTo(
        panelRef.current,
        { opacity: 0, y: -6, scale: 0.98 },
        { opacity: 1, y: 0, scale: 1, duration: 0.18, ease: "power2.out" },
      );
    }
  }, [isOpen]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = async () => {
    await authApi.logout();
    queryClient.setQueryData(["auth-me"], null);
    setIsOpen(false);
  };

  const initial = (user?.name || user?.email || "?").charAt(0).toUpperCase();

  return (
    <div ref={containerRef} className="relative">
      <button
        onClick={() => setIsOpen((v) => !v)}
        className="flex items-center gap-1.5 rounded-full  text-foreground transition-colors"
        aria-label="Account"
        aria-expanded={isOpen}
      >
        {user ? (
          <Avatar src={user.avatarUrl} fallback={initial} size={28} />
        ) : (
          <User size={20} />
        )}
        <ChevronDown
          size={14}
          className={`text-foreground/50 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div
          ref={panelRef}
          className="absolute -right-12 md:-right-22 top-8 z-50 mt-2 w-56 origin-top-right rounded-card border border-foreground/10 bg-white py-2 shadow-xl shadow-foreground/5"
        >
          {user ? (
            <>
              <Link href="/account" onClick={() => setIsOpen(false)}>
                <div className="flex items-center gap-3 px-4 py-2.5  text-foreground transition-colors hover:bg-foreground/5">
                  <Avatar src={user.avatarUrl} fallback={initial} size={36} />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-foreground">
                      {user.name || "Account"}
                    </p>
                    <p className="truncate text-xs text-foreground/50">
                      {user.email}
                    </p>
                  </div>
                </div>
              </Link>

              <div className="my-1 h-px bg-foreground/10" />

              <Link
                href="/account/orders"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-2 text-sm text-foreground transition-colors hover:bg-foreground/5"
              >
                <Package size={16} className="text-foreground/40" />
                My Orders
              </Link>
              <Link
                href="/account/addresses"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-2 text-sm text-foreground transition-colors hover:bg-foreground/5"
              >
                <MapPin size={16} className="text-foreground/40" />
                Addresses
              </Link>

              <div className="my-1 h-px bg-foreground/10" />

              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-3 px-4 py-2 text-left text-sm text-red-600 transition-colors hover:bg-red-50"
              >
                <LogOut size={16} />
                Logout
              </button>
            </>
          ) : (
            <button
              onClick={() => {
                setIsOpen(false);
                if (window.triggerGoogleOneTap) {
                  window.triggerGoogleOneTap();
                } else {
                  window.location.href = authApi.googleLoginUrl;
                }
              }}
              className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-foreground transition-colors hover:bg-foreground/5"
            >
              <svg width="16" height="16" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.52 12.27c0-.85-.08-1.67-.22-2.45H12v4.64h6.47c-.28 1.5-1.13 2.78-2.4 3.63v3.02h3.88c2.27-2.09 3.57-5.17 3.57-8.84z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.07 7.93-2.9l-3.88-3.02c-1.08.72-2.45 1.15-4.05 1.15-3.11 0-5.75-2.1-6.69-4.92H1.3v3.11C3.27 21.3 7.31 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.31 14.31c-.24-.72-.38-2.31V6.58H1.3A11.98 11.98 0 000 12c0 1.94.47 3.77 1.3 5.42l4.01-3.11z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.77c1.76 0 3.34.6 4.59 1.79l3.44-3.44C17.94 1.19 15.24 0 12 0 7.31 0 3.27 2.7 1.3 6.58l4.01 3.11C6.25 6.87 8.89 4.77 12 4.77z"
                />
              </svg>
              Login with Google
            </button>
          )}
        </div>
      )}
    </div>
  );
}
