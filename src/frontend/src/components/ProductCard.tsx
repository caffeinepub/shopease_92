import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, ShoppingCart, Star } from "lucide-react";
import { motion } from "motion/react";
import type { Product } from "../backend.d";

interface ProductCardProps {
  product: Product;
  index: number;
  onAddToCart: (product: Product) => void;
  isLoggedIn: boolean;
}

export function ProductCard({
  product,
  index,
  onAddToCart,
  isLoggedIn,
}: ProductCardProps) {
  const price = Number(product.price);
  const stars = Math.round(product.rating);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-card rounded-xl border border-border overflow-hidden hover:shadow-card transition-shadow group"
      data-ocid={`products.item.${index + 1}`}
    >
      {/* Image */}
      <div className="relative overflow-hidden aspect-square bg-secondary">
        <img
          src={
            product.imageUrl ||
            "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400&h=400&fit=crop"
          }
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <button
          type="button"
          className="absolute top-2 right-2 w-7 h-7 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-xs transition-colors"
        >
          <Heart className="w-3.5 h-3.5 text-muted-foreground" />
        </button>
        {price > 200 && (
          <Badge className="absolute top-2 left-2 text-[10px] bg-primary text-primary-foreground">
            Premium
          </Badge>
        )}
      </div>

      {/* Info */}
      <div className="p-3">
        <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-0.5">
          {product.brand}
        </div>
        <h3 className="text-sm font-semibold text-foreground leading-tight mb-1 line-clamp-2">
          {product.title}
        </h3>

        {/* Stars */}
        <div className="flex items-center gap-1 mb-2">
          {[1, 2, 3, 4, 5].map((s) => (
            <Star
              key={s}
              className={`w-3 h-3 ${s <= stars ? "fill-gold text-gold" : "text-muted-foreground/30"}`}
            />
          ))}
          <span className="text-[10px] text-muted-foreground ml-1">
            {product.rating.toFixed(1)}
          </span>
        </div>

        {/* Price + CTA */}
        <div className="flex items-center justify-between">
          <span className="font-bold text-base text-foreground">${price}</span>
          <Button
            size="sm"
            className="h-7 text-xs gap-1 bg-primary hover:bg-primary/90 text-primary-foreground"
            onClick={() => onAddToCart(product)}
            disabled={!isLoggedIn}
            data-ocid={`products.item.${index + 1}`}
          >
            <ShoppingCart className="w-3 h-3" />
            Add
          </Button>
        </div>
        {!isLoggedIn && (
          <p className="text-[10px] text-muted-foreground mt-1">
            Login to add to cart
          </p>
        )}
      </div>
    </motion.div>
  );
}
