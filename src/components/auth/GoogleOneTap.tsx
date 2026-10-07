"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { authApi } from "@/lib/api/auth";
import Script from "next/script";

declare global {
  interface Window {
    google: any;
    handleOneTapCredential: (response: { credential: string }) => void;
    triggerGoogleOneTap: () => void;
  }
}

export function GoogleOneTap() {
  const qc = useQueryClient();

  useEffect(() => {
    window.handleOneTapCredential = async (response: {
      credential: string;
    }) => {
      try {
        const user = await authApi.oneTap(response.credential);
        qc.setQueryData(["auth-me"], user);
        qc.invalidateQueries({ queryKey: ["cart"] });
      } catch (err) {
        console.error("One Tap login failed:", err);
      }
    };

    window.triggerGoogleOneTap = () => {
      const isProduction = process.env.NODE_ENV === "production";

      // on localhost always use redirect — One Tap is unreliable without HTTPS
      if (!isProduction) {
        window.location.href = authApi.googleLoginUrl;
        return;
      }

      if (!window.google?.accounts?.id) {
        window.location.href = authApi.googleLoginUrl;
        return;
      }

      window.google.accounts.id.initialize({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
        callback: window.handleOneTapCredential,
        auto_select: false,
        cancel_on_tap_outside: false,
        use_fedcm_for_prompt: false,
      });

      window.google.accounts.id.prompt((notification: any) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          // One Tap suppressed — fall back to redirect
          window.location.href = authApi.googleLoginUrl;
        }
      });
    };
  }, []);

  const handleScriptLoad = () => {
    if (!window.google?.accounts?.id) return;
    window.google.accounts.id.initialize({
      client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
      callback: window.handleOneTapCredential,
      auto_select: false,
      cancel_on_tap_outside: false,
      use_fedcm_for_prompt: false,
    });
    // auto-prompt only in production
    if (process.env.NODE_ENV === "production") {
      window.google.accounts.id.prompt();
    }
  };

  return (
    <Script
      src="https://accounts.google.com/gsi/client"
      onLoad={handleScriptLoad}
      strategy="afterInteractive"
    />
  );
}
