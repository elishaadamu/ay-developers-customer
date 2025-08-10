import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
  Search,
  Filter,
  Eye,
  ShoppingCart,
  Star,
  Globe,
  CloudDrizzle,
  Settings,
  MoreHorizontal,
  Plus,
  Minus,
  X,
} from "lucide-react";
import { useCart } from "@/contexts/CartContext";

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

const availableProducts: Product[] = [
  {
    id: "PROD-001",
    name: "Reseller Hosting",
    description:
      "Start your own hosting business with our reseller hosting packages",
    category: "Hosting",
    price: 15000,
    status: "Active",
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
  {
    id: "PROD-002",
    name: "Website Development",
    description:
      "Professional website development with modern design and functionality",
    category: "Development",
    price: 250000,
    status: "Active",
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
  {
    id: "PROD-003",
    name: "Console Management",
    description: "Advanced server and application console management services",
    category: "Management",
    price: 50000,
    status: "Active",
    rating: 4.7,
    reviews: 67,
    features: [
      "Server Monitoring",
      "Automated Backups",
      "Security Management",
      "24/7 Monitoring",
    ],
    icon: Settings,
  },
  {
    id: "PROD-004",
    name: "Others",
    description:
      "Custom solutions and specialized services tailored to your needs",
    category: "Custom",
    price: 100000,
    status: "Active",
    rating: 4.6,
    reviews: 45,
    features: [
      "Custom Development",
      "Consultation Services",
      "Technical Support",
      "Project Management",
    ],
    icon: MoreHorizontal,
  },
];

export function Products() {
  const navigate = useNavigate();
  const [products] = useState<Product[]>(availableProducts);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);

  // Use cart context
  const {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    getTotalPrice,
    getTotalItems,
  } = useCart();

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
        <Dialog open={isCartOpen} onOpenChange={setIsCartOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 relative">
              <ShoppingCart className="h-4 w-4" />
              View Cart
              {getTotalItems() > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
                  {getTotalItems()}
                </Badge>
              )}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Shopping Cart</DialogTitle>
              <DialogDescription>
                Review your selected products and quantities
              </DialogDescription>
            </DialogHeader>
            <div className="max-h-[400px] overflow-y-auto">
              {cart.length === 0 ? (
                <div className="text-center py-8">
                  <ShoppingCart className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">Your cart is empty</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.map((item) => {
                    const IconComponent = item.icon;
                    return (
                      <div
                        key={item.id}
                        className="flex items-center gap-4 p-4 border rounded-lg"
                      >
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                          <IconComponent className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium">{item.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {formatPrice(item.price)} each
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center">
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">
                            {formatPrice(item.price * item.quantity)}
                          </p>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFromCart(item.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
            {cart.length > 0 && (
              <DialogFooter className="flex flex-col gap-4">
                <div className="flex justify-between items-center text-lg font-semibold">
                  <span>Total: {formatPrice(getTotalPrice())}</span>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsCartOpen(false)}
                    className="flex-1"
                  >
                    Continue Shopping
                  </Button>
                  <Button
                    className="flex-1"
                    onClick={() => {
                      setIsCartOpen(false);
                      navigate("/user/orders");
                    }}
                  >
                    Proceed to Checkout
                  </Button>
                </div>
              </DialogFooter>
            )}
          </DialogContent>
        </Dialog>
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
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 gap-2"
                        >
                          <Eye className="h-4 w-4" />
                          View Details
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                          <DialogTitle className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                              <IconComponent className="h-5 w-5" />
                            </div>
                            {product.name}
                          </DialogTitle>
                          <DialogDescription>
                            {product.description}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div>
                            <h4 className="font-medium mb-2">Key Features:</h4>
                            <div className="grid gap-2">
                              {product.features.map((feature, index) => (
                                <div
                                  key={index}
                                  className="flex items-center gap-2"
                                >
                                  <Star className="h-4 w-4 text-primary" />
                                  <span className="text-sm">{feature}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div>
                              <label className="text-sm font-medium">
                                Quantity:
                              </label>
                              <div className="flex items-center gap-2 mt-1">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    setQuantity(Math.max(1, quantity - 1))
                                  }
                                >
                                  <Minus className="h-3 w-3" />
                                </Button>
                                <span className="w-8 text-center">
                                  {quantity}
                                </span>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setQuantity(quantity + 1)}
                                >
                                  <Plus className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                            <div className="flex-1 text-right">
                              <div className="text-2xl font-bold">
                                {formatPrice(product.price * quantity)}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {formatPrice(product.price)} each
                              </div>
                            </div>
                          </div>
                        </div>
                        <DialogFooter>
                          <Button
                            className="flex-1 gap-2"
                            onClick={() => {
                              addToCart(product, quantity);
                              setQuantity(1);
                            }}
                            disabled={product.status !== "Active"}
                          >
                            <ShoppingCart className="h-4 w-4" />
                            {product.status === "Active"
                              ? `Add ${quantity} to Cart`
                              : "Not Available"}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                    <Button
                      size="sm"
                      className="flex-1 gap-2"
                      disabled={product.status !== "Active"}
                      onClick={() => addToCart(product, 1)}
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
