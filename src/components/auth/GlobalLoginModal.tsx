"use client";

import { useAuthStore } from "@/store/authStore";
import { LoginModal } from "./LoginModal";

export function GlobalLoginModal() {
    const { loginModalOpen, loginModalMessage, closeLoginModal } = useAuthStore();

    return (
        <LoginModal
            isOpen={loginModalOpen}
            onClose={closeLoginModal}
            message={loginModalMessage}
        />
    );
}