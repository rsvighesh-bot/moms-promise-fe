"use client";

import { ButtonHTMLAttributes, forwardRef, useRef } from "react";
import gsap from "gsap";
import { cn } from "@/lib/utils/cn";

type ButtonVariant = "primary" | "accent" | "outline" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: "bg-primary text-white hover:bg-primary/90",
  accent: "bg-accent text-white hover:bg-accent/90",
  outline: "border-2 border-primary text-primary hover:bg-primary/10",
  ghost: "text-foreground hover:bg-foreground/5",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-5 py-2.5 text-base",
  lg: "px-7 py-3.5 text-lg",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading,
      disabled,
      children,
      onClick,
      ...props
    },
    ref,
  ) => {
    const localRef = useRef<HTMLButtonElement>(null);

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      const el = localRef.current;
      if (el) {
        gsap
          .timeline()
          .to(el, { scale: 0.93, duration: 0.1, ease: "power3.out" })
          .to(el, { scale: 1, duration: 0.2, ease: "back.out(3)" });
      }
      onClick?.(e);
    };

    return (
      <button
        ref={(node) => {
          localRef.current = node;
          if (typeof ref === "function") ref(node);
          else if (ref) ref.current = node;
        }}
        disabled={disabled || isLoading}
        onClick={handleClick}
        className={cn(
          "rounded-card font-body font-semibold transition-colors duration-150 cursor-pointer",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          variantStyles[variant],
          sizeStyles[size],
          className,
        )}
        {...props}
      >
        {isLoading ? "Loading..." : children}
      </button>
    );
  },
);
Button.displayName = "Button";
