import { Button } from "@/components/ui/button";
import { ArrowRight, Tag } from "lucide-react";
import { motion } from "motion/react";

interface HeroBannerProps {
  onShopNow: () => void;
}

export function HeroBanner({ onShopNow }: HeroBannerProps) {
  return (
    <section
      className="relative overflow-hidden rounded-xl mb-8"
      style={{
        background:
          "linear-gradient(135deg, oklch(0.22 0.05 210) 0%, oklch(0.38 0.08 196) 60%, oklch(0.44 0.10 185) 100%)",
        minHeight: "340px",
      }}
    >
      {/* Background image overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{
          backgroundImage:
            "url('/assets/generated/hero-shopease.dim_1200x500.jpg')",
        }}
      />

      {/* Decorative circles */}
      <div
        className="absolute -right-16 -top-16 w-64 h-64 rounded-full opacity-10"
        style={{ background: "oklch(0.8 0.08 196)" }}
      />
      <div
        className="absolute right-32 bottom-0 w-40 h-40 rounded-full opacity-10"
        style={{ background: "oklch(0.7 0.12 185)" }}
      />

      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between px-8 py-12 md:py-16 gap-8">
        {/* Copy */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-lg"
        >
          <div className="inline-flex items-center gap-2 bg-white/10 text-white/80 text-xs font-semibold px-3 py-1 rounded-full mb-4 border border-white/20">
            <Tag className="w-3 h-3" />
            New Season — Up to 40% Off
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-4">
            Style for Every
            <br />
            <span style={{ color: "oklch(0.84 0.16 86)" }}>Moment.</span>
          </h1>
          <p className="text-white/70 text-base mb-6 max-w-sm">
            Shop the latest in fashion, tech, home décor and more — all in one
            place.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button
              onClick={onShopNow}
              className="bg-white font-semibold hover:bg-white/90 gap-2"
              style={{ color: "oklch(0.22 0.05 210)" }}
              data-ocid="hero.primary_button"
            >
              Shop Now <ArrowRight className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              className="border-white/40 text-white hover:bg-white/10 hover:text-white"
              data-ocid="hero.secondary_button"
            >
              New Arrivals
            </Button>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="hidden md:flex flex-col gap-4"
        >
          {[
            { label: "Products", value: "10,000+" },
            { label: "Brands", value: "200+" },
            { label: "Happy Customers", value: "50K+" },
          ].map(({ label, value }) => (
            <div
              key={label}
              className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-6 py-3 text-center"
            >
              <div className="text-2xl font-bold text-white">{value}</div>
              <div className="text-white/60 text-xs">{label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
