import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Search,
  Filter,
  Eye,
  ShoppingCart,
  Star,
  Globe,
  Smartphone,
  Server,
  Megaphone,
  PenTool,
} from "lucide-react";

interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  status: "Active" | "Coming Soon" | "Maintenance";
  rating: number;
  reviews: number;
  features: string[];
  icon: React.ComponentType<any>;
}

const mockProducts: Product[] = [
  {
    id: "PRD-001",
    name: "Professional Website Package",
    description:
      "Complete website development with modern design, responsive layout, and SEO optimization",
    category: "Website Development",
    price: 299999,
    status: "Active",
    rating: 4.8,
    reviews: 124,
    features: [
      "Responsive Design",
      "SEO Optimized",
      "Content Management",
      "Analytics Integration",
    ],
    icon: Globe,
  },
  {
    id: "PRD-002",
    name: "Mobile App Development",
    description:
      "Cross-platform mobile application development for iOS and Android",
    category: "App Development",
    price: 599999,
    status: "Active",
    rating: 4.9,
    reviews: 87,
    features: [
      "Cross-Platform",
      "Native Performance",
      "Push Notifications",
      "App Store Deployment",
    ],
    icon: Smartphone,
  },
  {
    id: "PRD-003",
    name: "Premium Hosting Services",
    description:
      "High-performance web hosting with 99.9% uptime guarantee and 24/7 support",
    category: "Hosting",
    price: 25000,
    status: "Active",
    rating: 4.7,
    reviews: 256,
    features: [
      "99.9% Uptime",
      "SSL Certificate",
      "Daily Backups",
      "24/7 Support",
    ],
    icon: Server,
  },
  {
    id: "PRD-004",
    name: "Digital Marketing Suite",
    description:
      "Complete digital marketing package including SEO, social media, and PPC campaigns",
    category: "Digital Marketing",
    price: 150000,
    status: "Active",
    rating: 4.6,
    reviews: 93,
    features: [
      "SEO Optimization",
      "Social Media Management",
      "PPC Campaigns",
      "Analytics Reports",
    ],
    icon: Megaphone,
  },
  {
    id: "PRD-005",
    name: "Content Creation Package",
    description:
      "Professional content creation including copywriting, graphics, and video production",
    category: "Content Creation",
    price: 75000,
    status: "Active",
    rating: 4.8,
    reviews: 67,
    features: [
      "Professional Copywriting",
      "Graphic Design",
      "Video Production",
      "Brand Guidelines",
    ],
    icon: PenTool,
  },
  {
    id: "PRD-006",
    name: "AI-Powered Analytics Tool",
    description:
      "Advanced analytics platform with AI insights and predictive modeling",
    category: "AI Tools",
    price: 99999,
    status: "Coming Soon",
    rating: 0,
    reviews: 0,
    features: [
      "AI Insights",
      "Predictive Analytics",
      "Real-time Dashboards",
      "Custom Reports",
    ],
    icon: Star,
  },
];

export function Products() {
  const [products] = useState<Product[]>(mockProducts);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || product.category === categoryFilter;
    const matchesStatus =
      statusFilter === "all" || product.status === statusFilter;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "Active":
        return "default" as const;
      case "Coming Soon":
        return "secondary" as const;
      case "Maintenance":
        return "destructive" as const;
      default:
        return "outline" as const;
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(price);
  };

  const categories = Array.from(new Set(products.map((p) => p.category)));

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl">
          Products & Services
        </h1>
        <Button className="gap-2">
          <ShoppingCart className="h-4 w-4" />
          View Cart
        </Button>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Filter Products</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search products and services..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Coming Soon">Coming Soon</SelectItem>
                  <SelectItem value="Maintenance">Maintenance</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Products Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredProducts.map((product) => {
          const IconComponent = product.icon;
          return (
            <Card key={product.id} className="flex flex-col">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <IconComponent className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-lg">{product.name}</CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant={getStatusVariant(product.status)}>
                        {product.status}
                      </Badge>
                      {product.rating > 0 && (
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Star className="h-3 w-3 fill-current text-yellow-500" />
                          <span>{product.rating}</span>
                          <span>({product.reviews})</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <CardDescription className="mb-4">
                  {product.description}
                </CardDescription>

                <div className="mb-4">
                  <p className="text-sm font-medium mb-2">Key Features:</p>
                  <div className="flex flex-wrap gap-1">
                    {product.features.map((feature, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="mt-auto">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-bold">
                      {formatPrice(product.price)}
                    </span>
                    {product.status === "Active" && (
                      <Badge
                        variant="outline"
                        className="text-green-600 border-green-600"
                      >
                        Available
                      </Badge>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 gap-2"
                    >
                      <Eye className="h-4 w-4" />
                      View Details
                    </Button>
                    <Button
                      size="sm"
                      className="flex-1 gap-2"
                      disabled={product.status !== "Active"}
                    >
                      <ShoppingCart className="h-4 w-4" />
                      {product.status === "Active"
                        ? "Add to Cart"
                        : "Not Available"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredProducts.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <div className="flex flex-col items-center gap-2">
              <Search className="h-8 w-8 text-muted-foreground" />
              <p className="text-muted-foreground">No products found</p>
              <p className="text-sm text-muted-foreground">
                Try adjusting your search or filters
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
