import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Slider } from "@/components/ui/slider";
import { PackageOpen, SlidersHorizontal } from "lucide-react";
import { useMemo, useState } from "react";
import type { Product } from "../backend.d";
import { BRANDS, CATEGORIES } from "../data/sampleProducts";
import { ProductCard } from "./ProductCard";

interface ProductGridProps {
  products: Product[];
  isLoading: boolean;
  searchQuery: string;
  activeCategory: string;
  onAddToCart: (product: Product) => void;
  isLoggedIn: boolean;
}

export function ProductGrid({
  products,
  isLoading,
  searchQuery,
  activeCategory,
  onAddToCart,
  isLoggedIn,
}: ProductGridProps) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<number[]>([0, 1500]);
  const [minRating, setMinRating] = useState(0);

  const toggleCategory = (cat: string) =>
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat],
    );

  const toggleBrand = (brand: string) =>
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand],
    );

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const price = Number(p.price);
      if (activeCategory !== "All" && p.category !== activeCategory)
        return false;
      if (
        selectedCategories.length > 0 &&
        !selectedCategories.includes(p.category)
      )
        return false;
      if (selectedBrands.length > 0 && !selectedBrands.includes(p.brand))
        return false;
      if (price < priceRange[0] || price > priceRange[1]) return false;
      if (p.rating < minRating) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        if (
          !p.title.toLowerCase().includes(q) &&
          !p.brand.toLowerCase().includes(q) &&
          !p.category.toLowerCase().includes(q)
        )
          return false;
      }
      return true;
    });
  }, [
    products,
    activeCategory,
    selectedCategories,
    selectedBrands,
    priceRange,
    minRating,
    searchQuery,
  ]);

  const skeletonKeys = ["sk1", "sk2", "sk3", "sk4", "sk5", "sk6"];

  return (
    <section className="flex gap-6 items-start">
      {/* Sidebar */}
      <aside className="hidden lg:block w-56 shrink-0 bg-card rounded-xl border border-border p-4 sticky top-24">
        <div className="flex items-center gap-2 mb-4">
          <SlidersHorizontal className="w-4 h-4 text-primary" />
          <span className="font-semibold text-sm">Filters</span>
        </div>

        {/* Category */}
        <div className="mb-5">
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
            Category
          </div>
          <div className="space-y-2">
            {CATEGORIES.filter((c) => c !== "All").map((cat) => (
              <div key={cat} className="flex items-center gap-2">
                <Checkbox
                  id={`cat-${cat}`}
                  checked={selectedCategories.includes(cat)}
                  onCheckedChange={() => toggleCategory(cat)}
                  data-ocid="filters.checkbox"
                />
                <Label
                  htmlFor={`cat-${cat}`}
                  className="text-xs cursor-pointer"
                >
                  {cat}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Price */}
        <div className="mb-5">
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
            Price Range
          </div>
          <Slider
            min={0}
            max={1500}
            step={10}
            value={priceRange}
            onValueChange={setPriceRange}
            className="mb-2"
            data-ocid="filters.toggle"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>${priceRange[0]}</span>
            <span>${priceRange[1]}</span>
          </div>
        </div>

        {/* Brand */}
        <div className="mb-5">
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
            Brand
          </div>
          <div className="space-y-2">
            {BRANDS.map((brand) => (
              <div key={brand} className="flex items-center gap-2">
                <Checkbox
                  id={`brand-${brand}`}
                  checked={selectedBrands.includes(brand)}
                  onCheckedChange={() => toggleBrand(brand)}
                  data-ocid="filters.checkbox"
                />
                <Label
                  htmlFor={`brand-${brand}`}
                  className="text-xs cursor-pointer"
                >
                  {brand}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Rating */}
        <div>
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
            Min Rating
          </div>
          <div className="space-y-1">
            {[4, 3, 2, 0].map((r) => (
              <button
                type="button"
                key={r}
                onClick={() => setMinRating(r)}
                className={`flex items-center gap-1 text-xs w-full px-1 py-0.5 rounded transition-colors ${
                  minRating === r
                    ? "text-primary font-medium"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {r === 0 ? "All ratings" : `${r}+ ★`}
              </button>
            ))}
          </div>
        </div>
      </aside>

      {/* Grid */}
      <div className="flex-1">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-muted-foreground">
            {isLoading ? "Loading..." : `${filtered.length} products`}
          </p>
        </div>

        {isLoading ? (
          <div
            className="grid grid-cols-2 md:grid-cols-3 gap-4"
            data-ocid="products.loading_state"
          >
            {skeletonKeys.map((key) => (
              <div
                key={key}
                className="bg-card rounded-xl border border-border overflow-hidden"
              >
                <Skeleton className="aspect-square w-full" />
                <div className="p-3 space-y-2">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center py-20 text-muted-foreground"
            data-ocid="products.empty_state"
          >
            <PackageOpen className="w-12 h-12 mb-3 opacity-40" />
            <p className="font-medium">No products found</p>
            <p className="text-sm">Try adjusting your filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {filtered.map((p, i) => (
              <ProductCard
                key={String(p.id)}
                product={p}
                index={i}
                onAddToCart={onAddToCart}
                isLoggedIn={isLoggedIn}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
