import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Heart, Search, ShoppingCart, Store, User } from "lucide-react";

interface ShopHeaderProps {
  cartCount: number;
  onCartOpen: () => void;
  activeCategory: string;
  onCategoryChange: (cat: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onAdminClick: () => void;
}

const NAV_LINKS = [
  "All",
  "Clothing",
  "Electronics",
  "Home Goods",
  "Footwear",
  "Accessories",
  "Sale",
];

export function ShopHeader({
  cartCount,
  onCartOpen,
  activeCategory,
  onCategoryChange,
  searchQuery,
  onSearchChange,
}: ShopHeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-card border-b border-border shadow-xs">
      <div className="max-w-[1200px] mx-auto px-4">
        <div className="flex items-center h-16 gap-4">
          {/* Logo */}
          <div className="flex items-center gap-2 mr-4 shrink-0">
            <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center">
              <Store className="w-4 h-4 text-primary-foreground" />
            </div>
            <div className="leading-none">
              <div className="text-xs text-muted-foreground font-medium tracking-widest uppercase">
                Urban
              </div>
              <div className="font-bold text-sm tracking-tight text-foreground">
                MARKET
              </div>
            </div>
          </div>

          {/* Nav links */}
          <nav className="hidden md:flex items-center gap-1 flex-1">
            {NAV_LINKS.map((link) => (
              <button
                type="button"
                key={link}
                onClick={() => onCategoryChange(link === "Sale" ? "All" : link)}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  link === "Sale"
                    ? "text-sale hover:bg-red-50"
                    : activeCategory === link
                      ? "text-primary bg-accent"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
                data-ocid="nav.link"
              >
                {link}
              </button>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2 ml-auto">
            <div className="relative hidden sm:block">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-8 h-8 w-44 text-sm"
                data-ocid="header.search_input"
              />
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              data-ocid="header.link"
            >
              <User className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              data-ocid="header.link"
            >
              <Heart className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 relative"
              onClick={onCartOpen}
              data-ocid="cart.open_modal_button"
            >
              <ShoppingCart className="w-4 h-4" />
              {cartCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-[10px] bg-primary text-primary-foreground">
                  {cartCount}
                </Badge>
              )}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
