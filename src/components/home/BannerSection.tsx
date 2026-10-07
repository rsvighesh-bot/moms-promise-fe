import { bannersApi } from "@/lib/api/banners";
import { BannerCarousel } from "./BannerCarousel";

export async function BannerSection() {
  const banners = await bannersApi.getAll().catch(() => []);

  // Desktop and mobile banners are uploaded separately in admin (each
  // banner is tagged "desktop", "mobile", or "all"). Both carousels render
  // in the DOM and CSS breakpoints decide which one is visible — this
  // avoids a server/client viewport-detection mismatch on first paint.
  const desktopBanners = banners.filter((b) => b.device !== "mobile");
  const mobileBanners = banners.filter((b) => b.device !== "desktop");

  return (
    <>
      <div className="hidden md:block">
        <BannerCarousel banners={desktopBanners} />
      </div>
      <div className="md:hidden">
        <BannerCarousel banners={mobileBanners} />
      </div>
    </>
  );
}
