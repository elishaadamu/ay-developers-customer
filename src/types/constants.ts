import { CloudDrizzle, Globe, Settings } from "lucide-react";
import type { Product } from "./product";

export const productDefaults: Record<string, Partial<Product>> = {
  "Reseller Hosting": {
    category: "Hosting",
    status: "Active" as const,
    rating: 4.8,
    reviews: 142,
    features: [
      "WHM Control Panel",
      "Unlimited Domains",
      "24/7 Support",
      "Free SSL Certificates",
    ],
    icon: CloudDrizzle,
  },
  "Website Development": {
    category: "Development",
    status: "Active" as const,
    rating: 4.9,
    reviews: 89,
    features: [
      "Responsive Design",
      "SEO Optimized",
      "Content Management",
      "Performance Optimization",
    ],
    icon: Globe,
  },
  "Console Management": {
    category: "Management",
    status: "Active" as const,
    rating: 4.7,
    reviews: 67,
    features: [
      "Server Monitoring",
      "Automated Backups",
      "Performance Metrics",
      "Security Updates",
    ],
    icon: Settings,
  },
};
