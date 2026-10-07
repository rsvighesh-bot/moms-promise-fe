import Link from "next/link";
import { Logo } from "./Logo";
import Image from "next/image";
import logo from "../../../assets/logo.png";
import { Mail, MapPin, Phone } from "lucide-react";

const footerLinks = [
  { label: "About Us", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Shipping & Returns", href: "/shipping-returns" },
  { label: "Terms of Service", href: "/terms" },
];

export function Footer() {
  return (
    <footer className="bg-cream border-t border-foreground/10 mt-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 sm:py-10 grid gap-8 sm:gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        <div className="relative flex sm:block justify-center sm:justify-start">
          <Image
            src={logo}
            alt="moms-promise Logo"
            className="max-w-28 md:max-w-48"
          />
        </div>

        <div className="flex flex-col items-center sm:items-start gap-2 text-center sm:text-left">
          <p className="text-xs font-semibold uppercase tracking-wide text-foreground/40 mb-1">
            Quick Links
          </p>
          {footerLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-foreground/70 hover:text-primary transition-colors w-fit"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex flex-col items-center sm:items-start gap-2 text-center sm:text-left md:col-span-1 sm:col-span-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-foreground/40 mb-1">
            Get in Touch
          </p>
          <a
            href="mailto:hello@moms-promise.com"
            className="flex items-center gap-2 text-sm text-foreground/70 hover:text-primary transition-colors w-fit"
          >
            <Mail size={15} className="shrink-0" />
            hello@moms-promise.com
          </a>
          <a
            href="tel:+911234567890"
            className="flex items-center gap-2 text-sm text-foreground/70 hover:text-primary transition-colors w-fit"
          >
            <Phone size={15} className="shrink-0" />
            +91 12345 67890
          </a>
          <p className="flex items-start gap-2 text-sm text-foreground/70 w-fit">
            <MapPin size={15} className="shrink-0 mt-0.5" />
            Tirupur, Tamil Nadu, India
          </p>
        </div>
      </div>

      <div className="border-t border-foreground/10 py-4 px-4 text-center text-xs text-foreground/50">
        © {new Date().getFullYear()} moms-promise. All rights reserved.
      </div>
    </footer>
  );
}
