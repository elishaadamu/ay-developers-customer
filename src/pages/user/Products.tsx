import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import config from "@/utils/api";
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
  _id: string;
  name: string;
  description: string;
  price: number;
  images: string;
  userId: string;
  createdDate: string;
  salesCount: number;
  __v: number;
  // Frontend-specific properties
  category?: string;
  status?: "Active" | "Coming Soon" | "Maintenance";
  rating?: number;
  reviews?: number;
  features?: string[];
  icon?: React.ComponentType<any>;
}

// Default fallback data for products with predefined features and icons
const productDefaults = {
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
      "Security Management",
      "24/7 Monitoring",
    ],
    icon: Settings,
  },
  Others: {
    category: "Custom",
    status: "Active" as const,
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
};

export function Products() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);

  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${config.apiBaseUrl}${config.endpoints.GetProducts}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        const apiProducts = await response.json();
        console.log("Fetched products:", apiProducts);
        // Transform API response to match our Product interface
        const transformedProducts: Product[] = apiProducts.map(
          (product: any) => {
            const defaults = productDefaults[
              product.name as keyof typeof productDefaults
            ] || {
              category: "Other",
              status: "Active" as const,
              rating: 4.5,
              reviews: 0,
              features: ["Standard Features"],
              icon: MoreHorizontal,
            };

            return {
              _id: product._id,
              name: product.name,
              description: product.description,
              price: product.price,
              images: product.images,
              createdDate: product.createdDate,
              userId: product.userId,
              salesCount: product.salesCount,
              __v: product.__v,
              ...defaults, // Spread the defaults (category, status, rating, reviews, features, icon)
            };
          }
        );

        setProducts(transformedProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
        // Keep empty array on error, could show error message to user
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

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
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading products...</p>
          </div>
        </div>
      ) : (
        <>
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
                      <p className="text-muted-foreground">
                        Your cart is empty
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {cart.map((item) => {
                        const IconComponent = item.icon || ShoppingCart;
                        return (
                          <div
                            key={item._id}
                            className="flex items-center gap-4 p-4 border rounded-lg"
                          >
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg overflow-hidden bg-slate-100">
                              {item.images ? (
                                <img
                                  src={item.images}
                                  alt={item.name}
                                  className="h-full w-full object-cover"
                                  onError={(e) => {
                                    e.currentTarget.src = "";
                                    e.currentTarget.onerror = null;
                                    e.currentTarget.parentElement?.appendChild(
                                      (() => {
                                        const icon =
                                          document.createElement("div");
                                        icon.className = "h-5 w-5";
                                        icon.innerHTML =
                                          '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="h-5 w-5"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>';
                                        return icon;
                                      })()
                                    );
                                  }}
                                />
                              ) : item.icon ? (
                                <IconComponent className="h-5 w-5" />
                              ) : (
                                <ShoppingCart className="h-5 w-5" />
                              )}
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
                                  updateQuantity(item._id, item.quantity - 1)
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
                                  updateQuantity(item._id, item.quantity + 1)
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
                                onClick={() => removeFromCart(item._id)}
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
                  <Select
                    value={categoryFilter}
                    onValueChange={setCategoryFilter}
                  >
                    <SelectTrigger className="w-[180px]">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map((category) => (
                        <SelectItem
                          key={category ?? "Other"}
                          value={category ?? "Other"}
                        >
                          {category ?? "Other"}
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
              const IconComponent = product.icon || ShoppingCart;
              return (
                <Card
                  key={product._id}
                  className="flex flex-col overflow-hidden hover:shadow-lg transition-shadow"
                >
                  {/* Product Image */}
                  <div className="relative h-48 w-full bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900">
                    {product.images ? (
                      <img
                        src={product.images}
                        alt={product.name}
                        className="h-full w-full object-cover object-center"
                        onError={(e) => {
                          e.currentTarget.src = "";
                          e.currentTarget.onerror = null;
                          e.currentTarget.parentElement?.appendChild(
                            (() => {
                              const icon = document.createElement("div");
                              icon.className = "h-16 w-16 text-slate-400";
                              icon.innerHTML = product.icon
                                ? `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="h-16 w-16"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>`
                                : '<div class="flex h-full w-full items-center justify-center"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="h-16 w-16"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg></div>';
                              return icon;
                            })()
                          );
                        }}
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        {product.icon ? (
                          <IconComponent className="h-16 w-16 text-slate-400" />
                        ) : (
                          <ShoppingCart className="h-16 w-16 text-slate-400" />
                        )}
                      </div>
                    )}
                    {product.status === "Active" && (
                      <Badge
                        variant="outline"
                        className="absolute top-3 right-3 text-green-600 border-green-600 bg-white/90 backdrop-blur-sm"
                      >
                        Available
                      </Badge>
                    )}
                  </div>

                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg line-clamp-1">
                          {product.name}
                        </CardTitle>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge
                            variant={getStatusVariant(
                              product.status ?? "Active"
                            )}
                          >
                            {product.status ?? "Active"}
                          </Badge>
                          {(product.rating ?? 0) > 0 && (
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
                  <CardContent className="flex-1 flex flex-col pt-0">
                    <CardDescription className="mb-4">
                      {product.description}
                    </CardDescription>

                    <div className="mb-4">
                      <p className="text-sm font-medium mb-2">Key Features:</p>
                      <div className="flex flex-wrap gap-1">
                        {(product.features ?? []).map((feature, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="text-xs"
                          >
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="mt-auto">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-2xl font-bold text-primary">
                          {formatPrice(product.price)}
                        </span>
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
                                {product.images ? (
                                  <div className="flex h-12 w-12 items-center justify-center rounded-lg overflow-hidden bg-slate-100">
                                    <img
                                      src={product.images}
                                      alt={product.name}
                                      className="h-full w-full object-cover"
                                    />
                                  </div>
                                ) : (
                                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                                    <IconComponent className="h-6 w-6" />
                                  </div>
                                )}
                                {product.name}
                              </DialogTitle>
                              <DialogDescription>
                                {product.description}
                              </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                              {product.images && (
                                <div className="relative h-40 w-full bg-slate-100 rounded-lg overflow-hidden">
                                  <img
                                    src={product.images}
                                    alt={product.name}
                                    className="h-full w-full object-cover object-center"
                                  />
                                </div>
                              )}
                              <div>
                                <h4 className="font-medium mb-2">
                                  Key Features:
                                </h4>
                                <div className="grid gap-2">
                                  {(product.features ?? []).map(
                                    (feature, index) => (
                                      <div
                                        key={index}
                                        className="flex items-center gap-2"
                                      >
                                        <Star className="h-4 w-4 text-primary" />
                                        <span className="text-sm">
                                          {feature}
                                        </span>
                                      </div>
                                    )
                                  )}
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
                          className="flex-1 gap-2 bg-primary hover:bg-primary/90"
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
        </>
      )}
    </div>
  );
}
