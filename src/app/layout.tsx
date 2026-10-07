import { Lilita_One, Poppins } from "next/font/google";
import { Providers } from "@/lib/query/providers";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { TopScrollSection } from "@/components/layout/TopScrollSection";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { GoogleOneTapConditional } from "@/components/auth/GoogleOneTapConditional";
import "./globals.css";

export const revalidate = 60;

const lilita = Lilita_One({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-display",
});
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-body",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${lilita.variable} ${poppins.variable}`}>
      <body>
        <Providers>
          <div className="sticky top-0 z-40">
            <TopScrollSection />
            <Header />
          </div>
          {children}
          <Footer />
          <CartDrawer />
          <GoogleOneTapConditional />
        </Providers>
      </body>
    </html>
  );
}
