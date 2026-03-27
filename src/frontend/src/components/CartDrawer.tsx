import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { ArrowRight, Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import type { Cart, Product } from "../backend.d";

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
  cart: Cart | undefined;
  products: Product[];
  onRemove: (productId: bigint) => void;
  onUpdateQty: (productId: bigint, qty: bigint) => void;
  onClear: () => void;
  isLoading: boolean;
}

export function CartDrawer({
  open,
  onClose,
  cart,
  products,
  onRemove,
  onUpdateQty,
  onClear,
  isLoading,
}: CartDrawerProps) {
  const items = cart?.items ?? [];

  const getProduct = (id: bigint) => products.find((p) => p.id === id);

  const subtotal = items.reduce((sum, item) => {
    const p = getProduct(item.productId);
    return sum + (p ? Number(p.price) * Number(item.quantity) : 0);
  }, 0);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full max-w-sm bg-card border-l border-border shadow-2xl z-50 flex flex-col"
            data-ocid="cart.sheet"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-primary" />
                <span className="font-bold text-base">My Cart</span>
                <span className="text-sm text-muted-foreground">
                  ({items.length} items)
                </span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="h-8 w-8"
                data-ocid="cart.close_button"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Items */}
            <ScrollArea className="flex-1 px-5">
              {items.length === 0 ? (
                <div
                  className="flex flex-col items-center justify-center py-16 text-muted-foreground"
                  data-ocid="cart.empty_state"
                >
                  <ShoppingBag className="w-12 h-12 mb-3 opacity-30" />
                  <p className="font-medium">Your cart is empty</p>
                  <p className="text-sm">Add some products to get started</p>
                </div>
              ) : (
                <div className="py-4 space-y-4">
                  {items.map((item, i) => {
                    const product = getProduct(item.productId);
                    if (!product) return null;
                    return (
                      <div
                        key={String(item.productId)}
                        className="flex gap-3"
                        data-ocid={`cart.item.${i + 1}`}
                      >
                        <img
                          src={product.imageUrl}
                          alt={product.title}
                          className="w-16 h-16 object-cover rounded-lg border border-border"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold line-clamp-2 leading-tight">
                            {product.title}
                          </p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {product.brand}
                          </p>
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center gap-1 border border-border rounded-md">
                              <button
                                type="button"
                                className="w-6 h-6 flex items-center justify-center hover:bg-secondary transition-colors"
                                onClick={() =>
                                  Number(item.quantity) > 1
                                    ? onUpdateQty(
                                        item.productId,
                                        item.quantity - 1n,
                                      )
                                    : onRemove(item.productId)
                                }
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="text-xs w-6 text-center font-medium">
                                {String(item.quantity)}
                              </span>
                              <button
                                type="button"
                                className="w-6 h-6 flex items-center justify-center hover:bg-secondary transition-colors"
                                onClick={() =>
                                  onUpdateQty(
                                    item.productId,
                                    item.quantity + 1n,
                                  )
                                }
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                            <span className="text-sm font-bold">
                              ${Number(product.price) * Number(item.quantity)}
                            </span>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => onRemove(item.productId)}
                          className="text-muted-foreground hover:text-destructive transition-colors self-start mt-0.5"
                          data-ocid={`cart.delete_button.${i + 1}`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </ScrollArea>

            {/* Footer */}
            {items.length > 0 && (
              <div className="px-5 py-4 border-t border-border space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Subtotal
                  </span>
                  <span className="font-bold text-lg">${subtotal}</span>
                </div>
                <Separator />
                <Button
                  className="w-full gap-2 bg-primary hover:bg-primary/90 text-primary-foreground"
                  data-ocid="cart.primary_button"
                >
                  Checkout <ArrowRight className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  className="w-full text-sm"
                  onClick={onClear}
                  disabled={isLoading}
                  data-ocid="cart.secondary_button"
                >
                  Clear Cart
                </Button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
