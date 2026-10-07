"use client";

import { useQuery } from "@tanstack/react-query";
import { authApi } from "@/lib/api/auth";
import { GoogleOneTap } from "./GoogleOneTap";

export function GoogleOneTapConditional() {
  const { data: user, isLoading } = useQuery({
    queryKey: ["auth-me"],
    queryFn: authApi.getMe,
  });

  // don't show One Tap if already logged in or still checking
  if (isLoading || user) return null;

  return <GoogleOneTap />;
}
