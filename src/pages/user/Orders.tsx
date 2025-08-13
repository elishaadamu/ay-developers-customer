import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Modal } from "antd";
import { useEffect } from "react";
import { toast } from "sonner";
import axios from "axios";
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
  Plus,
  Minus,
  X,
  CreditCard,
  Check,
  MoreHorizontal,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { setOrdersData } from "@/utils/dashboardData";
import { config } from "@/utils/api";

interface CartItem {
  _id: string;
  name: string;
  price: number;
  quantity: number;
  images: string;
  icon?: React.ComponentType<any>;
}

interface OrderItem {
  _id: string;
  orderId: string;
  customerName: string;
  customerEmail: string;
  products: CartItem[];
  totalAmount: number;
  status: "Pending" | "Processing" | "Completed" | "Cancelled";
  paymentMethod: string;
  orderDate: string;
  paymentReference?: string;
}

export function Orders() {
  const navigate = useNavigate();
  const [isNewOrderOpen, setIsNewOrderOpen] = useState(false);
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [userData] = useState<any>(null);
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("card");

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

  const handlePaystackPayment = (amount: number) => {
    // Check if Paystack is loaded and properly typed
    const PaystackPop = (window as any).PaystackPop;
    if (!PaystackPop) {
      toast.error("Paystack is not loaded. Please refresh the page.");
      return;
    }

    // Log payment details before initialization
    console.log("Initializing Paystack Payment:", {
      publicKey: import.meta.env.VITE_PAYSTACK_PUBLIC_URL,
      amount: {
        original: amount,
        inKobo: Number(amount) * 100,
        formatted: formatPrice(amount),
      },
      customer: {
        email: customerInfo.email,
        name: customerInfo.name,
        phone: customerInfo.phone,
        address: customerInfo.address,
      },
      user: {
        id: userData?._id || userData?.id,
        fullName: `${userData?.firstName} ${userData?.lastName}`,
      },
      cart: {
        items: cart.map((item) => ({
          _id: item._id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          total: item.price * item.quantity,
        })),
        totalItems: getTotalItems(),
        totalAmount: getTotalPrice(),
      },
      reference: `AY-${Date.now()}`,
    });

    const handler = PaystackPop.setup({
      key: import.meta.env.VITE_PAYSTACK_PUBLIC_URL,
      email: customerInfo.email,
      amount: Number(amount) * 100, // Convert to kobo
      currency: "NGN",
      ref: `AY-${Date.now()}`,
      metadata: {
        userId: userData?._id || userData?.id,
        name: `${userData?.firstName} ${userData?.lastName}`,
        customer_name: customerInfo.name,
        customer_email: customerInfo.email,
        customer_phone: customerInfo.phone,
        customer_address: customerInfo.address,
        cart_items: JSON.stringify(
          cart.map((item) => ({
            _id: item._id,
            name: item.name,
            quantity: item.quantity,
            price: item.price,
          }))
        ),
        total_amount: amount,
        items_count: getTotalItems(),
      },
      callback: function (response: { reference: string }) {
        // Log the successful payment response
        console.log("Paystack Payment Successful:", {
          reference: response.reference,
          orderDetails: {
            customer: customerInfo,
            amount: getTotalPrice(),
            itemCount: getTotalItems(),
            cart: cart.map((item) => ({
              _id: item._id,
              name: item.name,
              quantity: item.quantity,
              price: item.price,
              total: item.price * item.quantity,
            })),
          },
          timestamp: new Date().toISOString(),
        });

        toast.success("Payment successful. Processing...");
        // Create and save the order after successful payment
        const newOrder: OrderItem = {
          _id: `${Date.now()}`,
          orderId: `ORD-${String(orders.length + 1).padStart(3, "0")}`,
          customerName: customerInfo.name,
          customerEmail: customerInfo.email,
          products: [...cart],
          totalAmount: getTotalPrice(),
          status: "Completed", // Mark as completed since payment is successful
          paymentMethod: "card",
          orderDate: new Date().toISOString().split("T")[0],
          paymentReference: response.reference,
        };
        const updatedOrders = [newOrder, ...orders];
        setOrders(updatedOrders);
        setOrdersData(updatedOrders);
        clearCart();
        setCustomerInfo({ name: "", email: "", phone: "", address: "" });
        setPaymentMethod("");
        setIsNewOrderOpen(false);
        toast.success("Order placed and payment completed successfully!");
      },
      onClose: function () {
        console.log("Paystack Payment Closed:", {
          timestamp: new Date().toISOString(),
          cart: {
            totalAmount: getTotalPrice(),
            itemCount: getTotalItems(),
          },
          customer: customerInfo,
        });
        toast.error("Payment closed by user.");
      },
    });

    handler.openIframe();
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

    if (paymentMethod === "card") {
      // Handle Paystack payment
      handlePaystackPayment(getTotalPrice());
      return;
    }

    // Log the order data for other payment methods
    console.log("Order Data:", {
      customerInfo,
      cart: cart.map((item) => ({
        _id: item._id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
      })),
      totalAmount: getTotalPrice(),
      paymentMethod,
      userId: userData?._id || userData?.id,
      userName: `${userData?.firstName} ${userData?.lastName}`,
    });

    // Show confirmation modal for other payment methods
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

        // Log the order data before creation
        console.log("Creating Order:", {
          customerInfo,
          products: cart.map((item) => ({
            _id: item._id,
            name: item.name,
            quantity: item.quantity,
            price: item.price,
          })),
          totalAmount: getTotalPrice(),
          paymentMethod,
          userData: {
            userId: userData?._id || userData?.id,
            userName: `${userData?.firstName} ${userData?.lastName}`,
          },
        });

        const newOrder: OrderItem = {
          _id: `${Date.now()}`,
          orderId: `ORD-${String(orders.length + 1).padStart(3, "0")}`,
          customerName: customerInfo.name,
          customerEmail: customerInfo.email,
          products: [...cart],
          totalAmount: getTotalPrice(),
          status: paymentSuccessful ? "Completed" : "Pending",
          paymentMethod: paymentMethod,
          orderDate: new Date().toISOString().split("T")[0],
        };

        // Log the complete order before saving
        console.log("Saving Order:", {
          order: newOrder,
          currentOrdersCount: orders.length,
          timestamp: new Date().toISOString(),
        });

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
  // Fetch tickets from API
  const fetchOrders = async () => {
    try {
      const userId = userData?._id || userData?.id;
      if (!userId) {
        console.error("❌ No user ID found");
        return;
      }

      const response = await axios.get(
        `${config.apiBaseUrl}${config.endpoints.getPayments}${userId}`
      );

      console.log("✅ Payments fetched successfully:", response.data);

      // Map the payment data to our OrderItem format
      const ordersData = (response.data.data || response.data || []).map(
        (payment: any) => ({
          _id: payment._id || String(Date.now()),
          orderId: payment.transactionRef || `ORD-${Date.now()}`,
          customerEmail: userData?.email || "",
          products: [
            {
              _id: payment.productId._id,
              name: payment.productId.name,
              price: payment.productId.price,
              quantity: 1,
              images: "", // Add default image path if available
            },
          ],
          totalAmount: payment.amount,
          status:
            payment.status === "success"
              ? "Completed"
              : payment.status === "pending"
              ? "Pending"
              : payment.status === "failed"
              ? "Cancelled"
              : "Processing",
          paymentMethod: payment.paymentGateway,
          orderDate: new Date(payment.createdAt).toISOString().split("T")[0],
          paymentReference: payment.transactionRef,
        })
      );

      console.log("📊 Mapped orders data:", ordersData);
      setOrders(ordersData);
      setOrdersData(ordersData); // Store in localStorage for dashboard
    } catch (error) {
      console.error("❌ Error fetching payments:", error);
      showAlert("Failed to fetch payment history", "error");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);
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
            order._id === orderId
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
            order._id === orderId
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
            order._id === orderId
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
                          const IconComponent = item.icon || ShoppingCart;
                          return (
                            <div
                              key={item._id}
                              className="flex items-center gap-4 p-4 border rounded-lg"
                            >
                              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                                {item.icon ? (
                                  <IconComponent className="h-4 w-4" />
                                ) : (
                                  <img
                                    src={item.images}
                                    alt={item.name}
                                    className="h-4 w-4 object-cover"
                                    onError={(e) => {
                                      e.currentTarget.src = "";
                                      e.currentTarget.onerror = null;

                                      e.currentTarget.parentElement?.appendChild(
                                        (() => {
                                          const icon =
                                            document.createElement("div");
                                          icon.className = "h-4 w-4";
                                          icon.innerHTML =
                                            '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="h-4 w-4"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>';
                                          return icon;
                                        })()
                                      );
                                    }}
                                  />
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
                              <div className="text-right w-32">
                                <p className="font-medium">
                                  {formatPrice(item.price * item.quantity)}
                                </p>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeFromCart(item._id)}
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
                      defaultValue="card"
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pay with Paystack" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="card">
                          <div className="flex items-center gap-2">
                            <CreditCard className="h-4 w-4" />
                            <span>Pay with Paystack</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    {paymentMethod && (
                      <div className="mt-4 p-4 bg-muted rounded-lg">
                        <div className="flex items-center gap-2 text-sm">
                          <Check className="h-4 w-4 text-green-500" />
                          <span>Ready to pay with Paystack</span>
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
                <TableRow key={order._id}>
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
                              onClick={() => handleCompletePayment(order._id)}
                              className="text-green-600"
                            >
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Complete Payment
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleCancelOrder(order._id)}
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
                              onClick={() => handleCompleteOrder(order._id)}
                              className="text-green-600"
                            >
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Mark as Completed
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleCancelOrder(order._id)}
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
