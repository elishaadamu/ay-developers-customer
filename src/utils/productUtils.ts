import { type Product } from "@/types/product";
import { productDefaults } from "@/types/constants";

export function enrichProductWithDefaults(
  product: Product
): Required<Omit<Product, "icon">> & { icon?: React.ComponentType<any> } {
  const defaults = productDefaults[product.name] || {
    category: "Other",
    status: "Active" as const,
    rating: 0,
    reviews: 0,
    features: [],
  };

  return {
    ...product,
    category: product.category || defaults.category,
    status: product.status || defaults.status,
    rating: product.rating || defaults.rating,
    reviews: product.reviews || defaults.reviews,
    features: product.features || defaults.features,
    icon: product.icon || defaults.icon,
  };
}
