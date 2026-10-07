"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { LogOut, Package, MapPin, User } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { authApi } from "@/lib/api/auth";
import { Skeleton } from "@/components/ui/Skeleton";
import { Button } from "@/components/ui/Button";

const QUICK_LINKS = [
  {
    label: "My Orders",
    href: "/account/orders",
    icon: Package,
    desc: "Track and manage your orders",
  },
  {
    label: "Saved Addresses",
    href: "/account/addresses",
    icon: MapPin,
    desc: "Manage delivery addresses",
  },
];

export default function AccountPage() {
  const router = useRouter();
  const qc = useQueryClient();

  const { data: user, isLoading } = useQuery({
    queryKey: ["auth-me"],
    queryFn: authApi.getMe,
  });

  const handleLogout = async () => {
    await authApi.logout();
    qc.clear(); // clear all cached data on logout
    router.push("/");
  };

  if (isLoading) {
    return (
      <main className="mx-auto max-w-2xl px-4 py-8 space-y-4">
        <Skeleton className="h-24 rounded-card" />
        <Skeleton className="h-32 rounded-card" />
      </main>
    );
  }

  if (!user) {
    return (
      <main className="mx-auto max-w-2xl px-4 py-20 text-center space-y-4">
        <User size={48} className="mx-auto text-foreground/20" />
        <h1 className="text-2xl text-primary">Sign in to your account</h1>
        <p className="text-sm text-foreground/60">
          Login to view your orders, addresses and more.
        </p>
        <a
          href={authApi.googleLoginUrl}
          className="inline-flex items-center gap-2 rounded-chip bg-primary px-6 py-3 text-sm font-semibold text-white hover:bg-primary/90"
        >
          Login with Google
        </a>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-8 space-y-6">
      {/* Profile card */}
      <div className="rounded-card border border-foreground/10 p-6 flex items-center gap-5">
        {user.avatarUrl ? (
          <Image
            src={user.avatarUrl}
            alt={user.name || "Profile"}
            width={64}
            height={64}
            className="rounded-full object-cover shrink-0"
          />
        ) : (
          <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <User size={28} className="text-primary" />
          </div>
        )}
        <div className="min-w-0">
          {user.name && (
            <h1 className="text-xl font-semibold text-foreground truncate">
              {user.name}
            </h1>
          )}
          <p className="text-sm text-foreground/60 truncate">{user.email}</p>
          <p className="text-xs text-foreground/40 mt-0.5">
            Signed in with Google
          </p>
        </div>
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {QUICK_LINKS.map(({ label, href, icon: Icon, desc }) => (
          <Link
            key={href}
            href={href}
            className="group rounded-card border border-foreground/10 p-5 hover:border-primary/30 hover:bg-primary/5 transition-all"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                <Icon size={18} className="text-primary" />
              </div>
              <p className="text-sm font-semibold text-foreground">{label}</p>
            </div>
            <p className="text-xs text-foreground/50">{desc}</p>
          </Link>
        ))}
      </div>

      {/* Logout */}
      <div className="pt-2">
        <Button
          variant="ghost"
          onClick={handleLogout}
          className="flex items-center gap-2 text-foreground/60 hover:text-red-500"
        >
          <LogOut size={16} />
          Sign out
        </Button>
      </div>
    </main>
  );
}
