import type { Product } from "../backend.d";

export const CATEGORY_IMAGES: Record<string, string[]> = {
  Clothing: [
    "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=400&h=400&fit=crop",
  ],
  Electronics: [
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop",
  ],
  "Home Goods": [
    "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1565814636199-ae8133055c1c?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=400&h=400&fit=crop",
  ],
  Footwear: [
    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=400&h=400&fit=crop",
  ],
  Accessories: [
    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=400&h=400&fit=crop",
  ],
};

export const SAMPLE_PRODUCTS: Product[] = [
  {
    id: 1n,
    title: "Classic Crew-Neck Sweatshirt",
    description:
      "Premium cotton blend sweatshirt in a relaxed fit, perfect for everyday wear.",
    price: 59n,
    category: "Clothing",
    brand: "UrbanBasics",
    rating: 4.5,
    stockCount: 120n,
    imageUrl:
      "https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=400&h=400&fit=crop",
  },
  {
    id: 2n,
    title: "Wireless Noise-Cancelling Headphones",
    description:
      "Studio-quality audio with active noise cancellation and 30-hour battery life.",
    price: 249n,
    category: "Electronics",
    brand: "SoundFlow",
    rating: 4.8,
    stockCount: 45n,
    imageUrl:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
  },
  {
    id: 3n,
    title: "Minimalist Linen Sofa",
    description:
      "Scandinavian-inspired 3-seater sofa in natural linen with solid oak legs.",
    price: 899n,
    category: "Home Goods",
    brand: "NordHome",
    rating: 4.7,
    stockCount: 12n,
    imageUrl:
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=400&fit=crop",
  },
  {
    id: 4n,
    title: "Air Max Runner Sneakers",
    description:
      "Lightweight performance sneakers with cushioned sole and breathable mesh upper.",
    price: 119n,
    category: "Footwear",
    brand: "StepUp",
    rating: 4.6,
    stockCount: 78n,
    imageUrl:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop",
  },
  {
    id: 5n,
    title: "Sapphire Chronograph Watch",
    description:
      "Swiss-movement timepiece with sapphire glass crystal and genuine leather strap.",
    price: 349n,
    category: "Accessories",
    brand: "TimeCraft",
    rating: 4.9,
    stockCount: 20n,
    imageUrl:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop",
  },
  {
    id: 6n,
    title: "Slim-Fit Chino Trousers",
    description:
      "Tapered chinos in stretch cotton for all-day comfort and sharp styling.",
    price: 79n,
    category: "Clothing",
    brand: "UrbanBasics",
    rating: 4.3,
    stockCount: 95n,
    imageUrl:
      "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400&h=400&fit=crop",
  },
  {
    id: 7n,
    title: "Smart 4K OLED Television",
    description:
      "55-inch OLED display with Dolby Vision, 120Hz refresh rate and smart OS.",
    price: 1299n,
    category: "Electronics",
    brand: "VisionTech",
    rating: 4.7,
    stockCount: 18n,
    imageUrl:
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400&h=400&fit=crop",
  },
  {
    id: 8n,
    title: "Ceramic Pour-Over Coffee Set",
    description:
      "Hand-thrown ceramic dripper, carafe and mugs for the perfect morning ritual.",
    price: 89n,
    category: "Home Goods",
    brand: "BrewHouse",
    rating: 4.6,
    stockCount: 60n,
    imageUrl:
      "https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=400&h=400&fit=crop",
  },
  {
    id: 9n,
    title: "Leather Tote Bag",
    description:
      "Full-grain leather tote with interior pockets and a zipped pouch.",
    price: 179n,
    category: "Accessories",
    brand: "CarryOn",
    rating: 4.4,
    stockCount: 35n,
    imageUrl:
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&h=400&fit=crop",
  },
];

export const CATEGORIES = [
  "All",
  "Clothing",
  "Electronics",
  "Home Goods",
  "Footwear",
  "Accessories",
];
export const BRANDS = [
  "UrbanBasics",
  "SoundFlow",
  "NordHome",
  "StepUp",
  "TimeCraft",
  "VisionTech",
  "BrewHouse",
  "CarryOn",
];
