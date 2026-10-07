"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { authApi } from "@/lib/api/auth";

export function useRequireAuth(redirectTo = "/") {
  const router = useRouter();
  const { data: user, isLoading } = useQuery({
    queryKey: ["auth-me"],
    queryFn: authApi.getMe,
  });

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace(redirectTo);
    }
  }, [user, isLoading, redirectTo]);

  return { user, isLoading };
}
