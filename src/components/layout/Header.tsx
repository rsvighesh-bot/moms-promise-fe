import { categoriesApi } from "@/lib/api/categories";
import { Logo } from "./Logo";
import { DesktopSearchTrigger } from "./DesktopSearchTrigger";
import { MobileSearchTrigger } from "./MobileSearchTrigger";
import { CartIcon } from "./CartIcon";
import { AccountMenu } from "./AccountMenu";
import { MobileNav } from "./MobileNav";
import { CategoryDropdown } from "./CategoryDropdown";
import { PopNavLink } from "./PopNavLink";

// subtle tilt sequence — smaller angles than before
const TILTS = [-1.5, 1.5, -1, 1.5, -1.5, 1];

export async function Header() {
  const categories = await categoriesApi.getAll().catch(() => []);

  return (
    <header className="bg-white border-b border-foreground/10">
      <div className="mx-auto max-w-7xl px-4 py-3">
        <div className="flex md:hidden items-center justify-between relative">
          <div className="flex items-center gap-2">
            <MobileNav categories={categories} />
            <Logo />
          </div>
          <div className="flex items-center gap-1">
            <MobileSearchTrigger />
            <AccountMenu />
            <CartIcon />
          </div>
        </div>

        <div className="hidden md:grid grid-cols-3 items-center relative">
          <div className="flex items-center">
            <Logo />
          </div>

          <nav className="flex items-center justify-center gap-7">
            <PopNavLink href="/products" rotate={TILTS[0]}>
              New Arrivals
            </PopNavLink>
            {categories.map((cat, i) => (
              <CategoryDropdown
                key={cat._id}
                category={cat}
                rotate={TILTS[(i + 1) % TILTS.length]}
              />
            ))}
          </nav>

          <div className="flex items-center justify-end gap-1">
            <DesktopSearchTrigger />
            <AccountMenu />
            <CartIcon />
          </div>
        </div>
      </div>
    </header>
  );
}
