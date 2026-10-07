"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import gsap from "gsap";
import { authApi } from "@/lib/api/auth";

interface LoginModalProps {
    isOpen: boolean;
    onClose: () => void;
    message?: string;
}

export function LoginModal({ isOpen, onClose, message }: LoginModalProps) {
    const panelRef = useRef<HTMLDivElement>(null);
    const overlayRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!isOpen) return;
        gsap.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.2 });
        gsap.fromTo(
            panelRef.current,
            { opacity: 0, scale: 0.9, y: 20 },
            { opacity: 1, scale: 1, y: 0, duration: 0.35, ease: "back.out(1.7)" }
        );
        document.body.style.overflow = "hidden";
        return () => { document.body.style.overflow = ""; };
    }, [isOpen]);

    useEffect(() => {
        if (!isOpen) return;
        const handler = (e: KeyboardEvent) => e.key === "Escape" && onClose();
        document.addEventListener("keydown", handler);
        return () => document.removeEventListener("keydown", handler);
    }, [isOpen, onClose]);

    const handleGoogleLogin = () => {
        if (window.triggerGoogleOneTap) {
            window.triggerGoogleOneTap();
        } else {
            window.location.href = authApi.googleLoginUrl;
        }
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
                ref={overlayRef}
                className="absolute inset-0 bg-charcoal/50"
                onClick={onClose}
            />
            <div
                ref={panelRef}
                className="relative w-full max-w-sm rounded-card bg-white p-8 shadow-xl text-center"
                role="dialog"
                aria-modal="true"
            >
                <button
                    onClick={onClose}
                    aria-label="Close"
                    className="absolute top-4 right-4 p-1 text-foreground/40 hover:text-foreground rounded-full hover:bg-foreground/5"
                >
                    <X size={18} />
                </button>

                <Image
                    src="/boy.svg"
                    alt="moms-promise eagle"
                    width={80}
                    height={130}
                    className="mx-auto mb-4"
                />

                <h2 className="text-xl text-primary mb-1">Sign in to continue</h2>
                <p className="text-sm text-foreground/60 mb-6">
                    {message || "Please sign in to access this page."}
                </p>

                <button
                    onClick={handleGoogleLogin}
                    className="flex w-full items-center justify-center gap-3 rounded-chip border border-foreground/15 bg-white px-5 py-3 text-sm font-semibold text-foreground hover:bg-foreground/5 transition-colors shadow-sm"
                >
                    <svg width="18" height="18" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M23.52 12.27c0-.85-.08-1.67-.22-2.45H12v4.64h6.47c-.28 1.5-1.13 2.78-2.4 3.63v3.02h3.88c2.27-2.09 3.57-5.17 3.57-8.84z" />
                        <path fill="#34A853" d="M12 24c3.24 0 5.95-1.07 7.93-2.9l-3.88-3.02c-1.08.72-2.45 1.15-4.05 1.15-3.11 0-5.75-2.1-6.69-4.92H1.3v3.11C3.27 21.3 7.31 24 12 24z" />
                        <path fill="#FBBC05" d="M5.31 14.31c-.24-.72-.38-1.49-.38-2.31s.14-1.59.38-2.31V6.58H1.3A11.98 11.98 0 000 12c0 1.94.47 3.77 1.3 5.42l4.01-3.11z" />
                        <path fill="#EA4335" d="M12 4.77c1.76 0 3.34.6 4.59 1.79l3.44-3.44C17.94 1.19 15.24 0 12 0 7.31 0 3.27 2.7 1.3 6.58l4.01 3.11C6.25 6.87 8.89 4.77 12 4.77z" />
                    </svg>
                    Continue with Google
                </button>

                <p className="mt-4 text-xs text-foreground/40">
                    By signing in you agree to our{" "}
                    <a href="/terms" className="underline hover:text-foreground">Terms</a>
                </p>
            </div>
        </div>
    );
}