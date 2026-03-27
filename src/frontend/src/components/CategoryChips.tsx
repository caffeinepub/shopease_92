import { Cpu, Footprints, Home, Shirt, Tag, Watch } from "lucide-react";
import { motion } from "motion/react";

const CHIPS = [
  { label: "Clothing", icon: Shirt },
  { label: "Electronics", icon: Cpu },
  { label: "Home Goods", icon: Home },
  { label: "Footwear", icon: Footprints },
  { label: "Accessories", icon: Watch },
  { label: "Sale", icon: Tag, sale: true },
];

interface CategoryChipsProps {
  activeCategory: string;
  onSelect: (cat: string) => void;
}

export function CategoryChips({
  activeCategory,
  onSelect,
}: CategoryChipsProps) {
  return (
    <section className="mb-10">
      <h2 className="text-xl font-bold text-center mb-6 text-foreground">
        Shop by Category
      </h2>
      <div className="flex flex-wrap justify-center gap-4">
        {CHIPS.map(({ label, icon: Icon, sale }, i) => {
          const isActive = activeCategory === label;
          return (
            <motion.button
              type="button"
              key={label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              onClick={() => onSelect(label === "Sale" ? "All" : label)}
              className="flex flex-col items-center gap-2 group"
              data-ocid="category.tab"
            >
              <div
                className={`w-14 h-14 rounded-full flex items-center justify-center border-2 transition-all ${
                  sale
                    ? "border-sale bg-red-50 text-sale group-hover:bg-red-100"
                    : isActive
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-card text-muted-foreground group-hover:border-primary group-hover:text-primary"
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span
                className={`text-xs font-medium ${
                  sale
                    ? "text-sale"
                    : isActive
                      ? "text-primary"
                      : "text-muted-foreground"
                }`}
              >
                {label}
              </span>
            </motion.button>
          );
        })}
      </div>
    </section>
  );
}
