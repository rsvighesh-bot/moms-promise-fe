"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { authApi } from "@/lib/api/auth";
import { LoginModal } from "./LoginModal";

interface AuthGuardProps {
  children: React.ReactNode;
  message?: string;
}

export function AuthGuard({ children, message }: AuthGuardProps) {
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();
  const { data: user, isLoading } = useQuery({
    queryKey: ["auth-me"],
    queryFn: authApi.getMe,
  });

  useEffect(() => {
    if (!isLoading && !user) {
      setShowModal(true);
    }
  }, [user, isLoading]);

  const handleClose = () => {
    setShowModal(false);
    router.replace("/");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={32} className="animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <LoginModal
        isOpen={showModal}
        onClose={handleClose}
        message={message}
      />
    );
  }

  return <>{children}</>;
}