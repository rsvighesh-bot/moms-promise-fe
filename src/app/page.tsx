import { Hero } from "@/components/home/Hero";
import { CategoryStrip } from "@/components/home/CategoryStrip";
import { NewArrivalsSection } from "@/components/home/NewArrivalsSection";
import { PromoBanner } from "@/components/home/PromoBanner";
import { ShopByAge } from "@/components/home/ShopByAge";
import { TrustStrip } from "@/components/home/TrustStrip";
import { BannerSection } from "@/components/home/BannerSection";
import { ComboOffersSection } from "@/components/home/ComboOffersSection";
import { NewArrivals } from "@/components/home/NewArrivals";
import { QualitySection } from "@/components/home/QualitySection";
import { KpiSection } from "@/components/home/KpiSection";
import { ReviewsSection } from "@/components/home/ReviewsSection";
import { ShopVideosSection } from "@/components/home/ShopVideosSection";
import { SuggestedForYou } from "@/components/home/SuggestedForYou";
import { CTABanner } from "@/components/home/CTABanner";

export const revalidate = 60;

export default function HomePage() {
  return (
    <>
      <ShopByAge />
      <BannerSection />
      <ComboOffersSection />
      <NewArrivals />
      {/* <CategoryStrip /> */}
      <QualitySection />
      <KpiSection />
      <ReviewsSection />
      <ShopVideosSection />
      <SuggestedForYou />
      <CTABanner />
    </>
  );
}
