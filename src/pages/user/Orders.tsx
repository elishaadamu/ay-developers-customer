import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Modal } from "antd";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  TrendingUp,
  ShoppingCart,
  DollarSign,
  Activity,
  CloudDrizzle,
  Settings,
  Plus,
  Minus,
  X,
  CreditCard,
  Check,
  Globe,
  MoreHorizontal,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { setOrdersData } from "@/utils/dashboardData";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  icon: React.ComponentType<any>;
}

interface OrderItem {
  id: string;
  orderId: string;
  customerName: string;
  customerEmail: string;
  products: CartItem[];
  totalAmount: number;
  status: "Pending" | "Processing" | "Completed" | "Cancelled";
  paymentMethod: string;
  orderDate: string;
}

const recentOrders: OrderItem[] = [
  {
    id: "1",
    orderId: "ORD-001",
    customerName: "John Doe",
    customerEmail: "john.doe@example.com",
    products: [
      {
        id: "PROD-002",
        name: "Website Development",
        price: 250000,
        quantity: 1,
        icon: Globe,
      },
    ],
    totalAmount: 250000,
    status: "Processing",
    paymentMethod: "Card",
    orderDate: "2025-01-16",
  },
  {
    id: "2",
    orderId: "ORD-002",
    customerName: "Jane Smith",
    customerEmail: "jane.smith@example.com",
    products: [
      {
        id: "PROD-001",
        name: "Reseller Hosting",
        price: 15000,
        quantity: 2,
        icon: CloudDrizzle,
      },
    ],
    totalAmount: 30000,
    status: "Completed",
    paymentMethod: "Bank Transfer",
    orderDate: "2025-01-15",
  },
  {
    id: "3",
    orderId: "ORD-003",
    customerName: "Mike Johnson",
    customerEmail: "mike.johnson@example.com",
    products: [
      {
        id: "PROD-003",
        name: "Console Management",
        price: 50000,
        quantity: 1,
        icon: Settings,
      },
    ],
    totalAmount: 50000,
    status: "Pending",
    paymentMethod: "Card",
    orderDate: "2025-01-14",
  },
];

export function Orders() {
  const navigate = useNavigate();
  const [isNewOrderOpen, setIsNewOrderOpen] = useState(false);
  const [orders, setOrders] = useState<OrderItem[]>(recentOrders);
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("");

  // Use cart context - this will show products added from Products page
  const {
    cart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalPrice,
    getTotalItems,
    showAlert,
  } = useCart();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(price);
  };

  const handlePlaceOrder = () => {
    if (cart.length === 0) {
      showAlert("Please add products to cart", "error");
      return;
    }

    if (!customerInfo.name || !customerInfo.email || !paymentMethod) {
      showAlert("Please fill in all required information", "error");
      return;
    }

    // Show confirmation modal
    Modal.confirm({
      title: "Confirm Order",
      content: (
        <div>
          <p>Are you sure you want to place this order?</p>
          <div className="mt-2 p-3 bg-gray-50 rounded">
            <p>
              <strong>Total Amount:</strong> {formatPrice(getTotalPrice())}
            </p>
            <p>
              <strong>Payment Method:</strong>{" "}
              {paymentMethod.replace("-", " ").toUpperCase()}
            </p>
            <p>
              <strong>Items:</strong> {getTotalItems()} products
            </p>
          </div>
        </div>
      ),
      okText: "Place Order",
      cancelText: "Cancel",
      onOk: () => {
        // Simulate payment processing
        const paymentSuccessful = Math.random() > 0.3; // 70% success rate for demo

        const newOrder: OrderItem = {
          id: `${Date.now()}`,
          orderId: `ORD-${String(orders.length + 1).padStart(3, "0")}`,
          customerName: customerInfo.name,
          customerEmail: customerInfo.email,
          products: [...cart],
          totalAmount: getTotalPrice(),
          status: paymentSuccessful ? "Completed" : "Pending",
          paymentMethod: paymentMethod,
          orderDate: new Date().toISOString().split("T")[0],
        };

        const updatedOrders = [newOrder, ...orders];
        setOrders(updatedOrders);
        setOrdersData(updatedOrders); // Store in localStorage for dashboard
        clearCart();
        setCustomerInfo({ name: "", email: "", phone: "", address: "" });
        setPaymentMethod("");
        setIsNewOrderOpen(false);

        if (paymentSuccessful) {
          showAlert(
            "Order placed and payment completed successfully!",
            "success"
          );
        } else {
          showAlert(
            "Order placed! Payment is pending. Please complete payment to finalize your order.",
            "info"
          );
        }
      },
    });
  };

  // Handle order completion
  const handleCompleteOrder = (orderId: string) => {
    Modal.confirm({
      title: "Complete Order",
      content: "Are you sure you want to mark this order as completed?",
      okText: "Complete",
      cancelText: "Cancel",
      onOk: () => {
        setOrders(
          orders.map((order) =>
            order.id === orderId
              ? { ...order, status: "Completed" as const }
              : order
          )
        );
        showAlert("Order marked as completed successfully!", "success");
      },
    });
  };

  // Handle order cancellation
  const handleCancelOrder = (orderId: string) => {
    Modal.confirm({
      title: "Cancel Order",
      content:
        "Are you sure you want to cancel this order? This action cannot be undone.",
      okText: "Cancel Order",
      cancelText: "Keep Order",
      okType: "danger",
      onOk: () => {
        setOrders(
          orders.map((order) =>
            order.id === orderId
              ? { ...order, status: "Cancelled" as const }
              : order
          )
        );
        showAlert("Order has been cancelled.", "info");
      },
    });
  };

  // Handle payment completion (simulating successful payment)
  const handleCompletePayment = (orderId: string) => {
    Modal.confirm({
      title: "Complete Payment",
      content: "Are you sure the payment for this order has been completed?",
      okText: "Confirm Payment",
      cancelText: "Cancel",
      onOk: () => {
        setOrders(
          orders.map((order) =>
            order.id === orderId
              ? { ...order, status: "Completed" as const }
              : order
          )
        );
        showAlert("Payment confirmed! Order is now completed.", "success");
      },
    });
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "Completed":
        return "default" as const;
      case "Processing":
        return "secondary" as const;
      case "Pending":
        return "outline" as const;
      case "Cancelled":
        return "destructive" as const;
      default:
        return "outline" as const;
    }
  };

  // Calculate user statistics
  const getUserStats = () => {
    // Get total products bought (from completed orders only)
    const completedOrders = orders.filter(
      (order) => order.status === "Completed"
    );
    const totalProductsBought = completedOrders.reduce((total, order) => {
      return (
        total +
        order.products.reduce(
          (orderTotal, product) => orderTotal + product.quantity,
          0
        )
      );
    }, 0);

    // Get total spent (from completed orders only)
    const totalSpent = completedOrders.reduce(
      (total, order) => total + order.totalAmount,
      0
    );

    // Get products in current cart
    const cartItems = getTotalItems();
    const cartValue = getTotalPrice();

    return {
      totalProductsBought,
      totalSpent,
      cartItems,
      cartValue,
      activeOrders: orders.filter(
        (order) => order.status === "Processing" || order.status === "Pending"
      ).length,
    };
  };

  const userStats = getUserStats();

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl">Orders & Payments</h1>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="gap-2 dark:text-white text-slate-900"
            onClick={() => navigate("/user/products")}
          >
            <ShoppingCart className="h-4 w-4 " />
            Cart ({getTotalItems()})
          </Button>
          <Dialog open={isNewOrderOpen} onOpenChange={setIsNewOrderOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2" disabled={cart.length === 0}>
                <CreditCard className="h-4 w-4" />
                Complete Order
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Complete Your Order</DialogTitle>
                <DialogDescription>
                  Review your cart items and complete payment
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-6 py-4">
                {/* Show Cart Items */}
                {cart.length > 0 ? (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Your Cart</CardTitle>
                      <CardDescription>
                        Products selected from our catalog
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {cart.map((item) => {
                          const IconComponent = item.icon;
                          return (
                            <div
                              key={item.id}
                              className="flex items-center gap-4 p-4 border rounded-lg"
                            >
                              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                                <IconComponent className="h-4 w-4" />
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
                              <div className="text-right w-32">
                                <p className="font-medium">
                                  {formatPrice(item.price * item.quantity)}
                                </p>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeFromCart(item.id)}
                                className="text-red-500 hover:text-red-700"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          );
                        })}
                        <div className="border-t pt-4">
                          <div className="flex justify-between items-center text-lg font-semibold">
                            <span>Total: {formatPrice(getTotalPrice())}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Card>
                    <CardContent className="text-center py-8">
                      <ShoppingCart className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                      <p className="text-muted-foreground">
                        Your cart is empty. Go to Products page to add items.
                      </p>
                    </CardContent>
                  </Card>
                )}

                {/* Customer Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      Customer Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="grid gap-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="customer-name">Full Name *</Label>
                        <Input
                          id="customer-name"
                          value={customerInfo.name}
                          onChange={(e) =>
                            setCustomerInfo({
                              ...customerInfo,
                              name: e.target.value,
                            })
                          }
                          placeholder="Enter your full name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="customer-email">Email Address *</Label>
                        <Input
                          id="customer-email"
                          type="email"
                          value={customerInfo.email}
                          onChange={(e) =>
                            setCustomerInfo({
                              ...customerInfo,
                              email: e.target.value,
                            })
                          }
                          placeholder="Enter your email"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="customer-phone">Phone Number</Label>
                        <Input
                          id="customer-phone"
                          value={customerInfo.phone}
                          onChange={(e) =>
                            setCustomerInfo({
                              ...customerInfo,
                              phone: e.target.value,
                            })
                          }
                          placeholder="Enter your phone number"
                        />
                      </div>
                      <div>
                        <Label htmlFor="customer-address">Address</Label>
                        <Input
                          id="customer-address"
                          value={customerInfo.address}
                          onChange={(e) =>
                            setCustomerInfo({
                              ...customerInfo,
                              address: e.target.value,
                            })
                          }
                          placeholder="Enter your address"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Payment Method */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Payment Method</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Select
                      value={paymentMethod}
                      onValueChange={setPaymentMethod}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select payment method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="card">
                          <div className="flex items-center gap-2">
                            <CreditCard className="h-4 w-4" />
                            <span>Credit/Debit Card</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="bank-transfer">
                          <div className="flex items-center gap-2">
                            <DollarSign className="h-4 w-4" />
                            <span>Bank Transfer</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="cash">
                          <div className="flex items-center gap-2">
                            <DollarSign className="h-4 w-4" />
                            <span>Cash Payment</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    {paymentMethod && (
                      <div className="mt-4 p-4 bg-muted rounded-lg">
                        <div className="flex items-center gap-2 text-sm">
                          <Check className="h-4 w-4 text-green-500" />
                          <span>
                            Payment method selected:{" "}
                            {paymentMethod.replace("-", " ").toUpperCase()}
                          </span>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsNewOrderOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handlePlaceOrder}
                  className="gap-2"
                  disabled={cart.length === 0}
                >
                  <CreditCard className="h-4 w-4" />
                  Pay & Place Order ({formatPrice(getTotalPrice())})
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* User Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Products Bought
            </CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {userStats.totalProductsBought}
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
              <span className="text-green-500">From completed orders</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatPrice(userStats.totalSpent)}
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
              <span className="text-green-500">Completed purchases</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cart Items</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userStats.cartItems}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              {userStats.cartValue > 0 ? (
                <>
                  <Activity className="mr-1 h-3 w-3 text-blue-500" />
                  <span className="text-blue-500">
                    {formatPrice(userStats.cartValue)} pending
                  </span>
                </>
              ) : (
                <span className="text-muted-foreground">Cart is empty</span>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Orders</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userStats.activeOrders}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              {userStats.activeOrders > 0 ? (
                <>
                  <TrendingUp className="mr-1 h-3 w-3 text-orange-500" />
                  <span className="text-orange-500">Processing & Pending</span>
                </>
              ) : (
                <span className="text-muted-foreground">No active orders</span>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader className="flex flex-row items-center">
          <div className="grid gap-2">
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>
              Latest customer orders and their payment status. Use actions to
              manage order status.
            </CardDescription>
          </div>
          <Button size="sm" className="ml-auto gap-1">
            View All
          </Button>
        </CardHeader>
        <CardContent>
          {/* Status Legend */}
          <div className="mb-4 p-3 bg-muted/50 rounded-lg">
            <h4 className="text-sm font-medium mb-2">Order Status Guide:</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
              <div className="flex items-center gap-1">
                <Badge variant="outline">Pending</Badge>
                <span>Payment pending</span>
              </div>
              <div className="flex items-center gap-1">
                <Badge variant="secondary">Processing</Badge>
                <span>Backend processing</span>
              </div>
              <div className="flex items-center gap-1">
                <Badge variant="default">Completed</Badge>
                <span>Order fulfilled</span>
              </div>
              <div className="flex items-center gap-1">
                <Badge variant="destructive">Cancelled</Badge>
                <span>Order cancelled</span>
              </div>
            </div>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Products</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.orderId}</TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{order.customerName}</p>
                      <p className="text-sm text-muted-foreground">
                        {order.customerEmail}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="max-w-[200px]">
                    <div className="space-y-1">
                      {order.products.map((product, index) => (
                        <div key={index} className="text-sm">
                          {product.name} x{product.quantity}
                        </div>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">
                    {formatPrice(order.totalAmount)}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs">
                      {order.paymentMethod}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(order.status)}>
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{order.orderDate}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {order.status === "Pending" && (
                          <>
                            <DropdownMenuItem
                              onClick={() => handleCompletePayment(order.id)}
                              className="text-green-600"
                            >
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Complete Payment
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleCancelOrder(order.id)}
                              className="text-red-600"
                            >
                              <XCircle className="mr-2 h-4 w-4" />
                              Cancel Order
                            </DropdownMenuItem>
                          </>
                        )}
                        {order.status === "Processing" && (
                          <>
                            <DropdownMenuItem
                              onClick={() => handleCompleteOrder(order.id)}
                              className="text-green-600"
                            >
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Mark as Completed
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleCancelOrder(order.id)}
                              className="text-red-600"
                            >
                              <XCircle className="mr-2 h-4 w-4" />
                              Cancel Order
                            </DropdownMenuItem>
                          </>
                        )}
                        {order.status === "Completed" && (
                          <DropdownMenuItem disabled>
                            <Check className="mr-2 h-4 w-4" />
                            Order Completed
                          </DropdownMenuItem>
                        )}
                        {order.status === "Cancelled" && (
                          <DropdownMenuItem disabled>
                            <XCircle className="mr-2 h-4 w-4" />
                            Order Cancelled
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
