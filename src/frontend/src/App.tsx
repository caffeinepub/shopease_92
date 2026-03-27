import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import type { Product } from "./backend.d";
import { AdminPanel } from "./components/AdminPanel";
import { CartDrawer } from "./components/CartDrawer";
import { CategoryChips } from "./components/CategoryChips";
import { HeroBanner } from "./components/HeroBanner";
import { ProductGrid } from "./components/ProductGrid";
import { ShopFooter } from "./components/ShopFooter";
import { ShopHeader } from "./components/ShopHeader";
import { SAMPLE_PRODUCTS } from "./data/sampleProducts";
import { useInternetIdentity } from "./hooks/useInternetIdentity";
import {
  useAddToCart,
  useClearCart,
  useGetAllProducts,
  useGetCart,
  useRemoveFromCart,
  useUpdateCartItem,
} from "./hooks/useQueries";

const queryClient = new QueryClient();

function ShopApp() {
  const [cartOpen, setCartOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const { identity } = useInternetIdentity();
  const isLoggedIn = !!identity;

  const { data: backendProducts, isLoading } = useGetAllProducts();
  const { data: cart } = useGetCart();

  const addToCart = useAddToCart();
  const removeFromCart = useRemoveFromCart();
  const updateCartItem = useUpdateCartItem();
  const clearCart = useClearCart();

  const products: Product[] = useMemo(() => {
    if (backendProducts && backendProducts.length > 0) return backendProducts;
    return SAMPLE_PRODUCTS;
  }, [backendProducts]);

  const cartCount = (cart?.items ?? []).reduce(
    (sum, item) => sum + Number(item.quantity),
    0,
  );

  const handleAddToCart = async (product: Product) => {
    if (!isLoggedIn) {
      toast.error("Please login to add items to cart");
      return;
    }
    try {
      await addToCart.mutateAsync({ productId: product.id, quantity: 1n });
      toast.success(`${product.title} added to cart`);
    } catch {
      toast.error("Failed to add to cart");
    }
  };

  const handleRemoveFromCart = async (productId: bigint) => {
    try {
      await removeFromCart.mutateAsync(productId);
    } catch {
      toast.error("Failed to remove item");
    }
  };

  const handleUpdateQty = async (productId: bigint, quantity: bigint) => {
    try {
      await updateCartItem.mutateAsync({ productId, quantity });
    } catch {
      toast.error("Failed to update quantity");
    }
  };

  const handleClearCart = async () => {
    try {
      await clearCart.mutateAsync();
      toast.success("Cart cleared");
    } catch {
      toast.error("Failed to clear cart");
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "oklch(0.97 0.005 240)" }}
    >
      <ShopHeader
        cartCount={cartCount}
        onCartOpen={() => setCartOpen(true)}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onAdminClick={() => setAdminOpen(true)}
      />

      <main className="flex-1">
        <div className="max-w-[1200px] mx-auto px-4 py-8">
          <HeroBanner
            onShopNow={() =>
              document
                .getElementById("products")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          />

          <CategoryChips
            activeCategory={activeCategory}
            onSelect={setActiveCategory}
          />

          <div id="products">
            <ProductGrid
              products={products}
              isLoading={isLoading && !backendProducts}
              searchQuery={searchQuery}
              activeCategory={activeCategory}
              onAddToCart={handleAddToCart}
              isLoggedIn={isLoggedIn}
            />
          </div>
        </div>
      </main>

      <ShopFooter onAdminClick={() => setAdminOpen(true)} />

      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        cart={cart}
        products={products}
        onRemove={handleRemoveFromCart}
        onUpdateQty={handleUpdateQty}
        onClear={handleClearCart}
        isLoading={clearCart.isPending}
      />

      <AdminPanel
        open={adminOpen}
        onClose={() => setAdminOpen(false)}
        products={products}
      />

      <Toaster position="bottom-right" />
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ShopApp />
    </QueryClientProvider>
  );
}
