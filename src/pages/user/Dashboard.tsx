import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loading } from "@/components/ui/loading";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  TrendingUp,
  TrendingDown,
  Users,
  ShoppingCart,
  DollarSign,
  Activity,
  BarChart3,
  PieChart,
  Globe,
  Calendar,
  Clock,
} from "lucide-react";
import { getEncryptedStorage } from "@/utils/encryption";
import {
  getOrdersData,
  getTicketsData,
  getDashboardStats,
  formatPrice,
  type OrderItem,
  type TicketItem,
} from "@/utils/dashboardData";

export function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState<any>(null);
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [tickets, setTickets] = useState<TicketItem[]>([]);
  const [dashboardStats, setDashboardStats] = useState({
    totalSpent: 0,
    activeOrders: 0,
    completedOrders: 0,
    openTickets: 0,
    totalOrders: 0,
    totalTickets: 0,
  });

  // Load user data and dashboard data on component mount
  useEffect(() => {
    const loadDashboardData = async () => {
      setIsLoading(true);
      try {
        // Load user data
        const loadedUserData = getEncryptedStorage("userData");
        if (loadedUserData) {
          setUserData(loadedUserData);
        }

        // Load orders and tickets data
        const ordersData = getOrdersData();
        const ticketsData = getTicketsData();
        const stats = getDashboardStats();

        setOrders(ordersData);
        setTickets(ticketsData);
        setDashboardStats(stats);
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  // Dynamic stats based on actual data
  const stats = [
    {
      title: "Total Spent",
      value: formatPrice(dashboardStats.totalSpent),
      change: dashboardStats.completedOrders > 0 ? "+12.5%" : "0%",
      trend: "up" as const,
      icon: DollarSign,
    },
    {
      title: "Active Orders",
      value: dashboardStats.activeOrders.toString(),
      change: `+${dashboardStats.activeOrders}`,
      trend: "up" as const,
      icon: ShoppingCart,
    },
    {
      title: "Completed Orders",
      value: dashboardStats.completedOrders.toString(),
      change: dashboardStats.completedOrders > 0 ? "+100%" : "0%",
      trend: "up" as const,
      icon: Activity,
    },
    {
      title: "Support Tickets",
      value: dashboardStats.openTickets.toString(),
      change:
        dashboardStats.openTickets > 0 ? `+${dashboardStats.openTickets}` : "0",
      trend: dashboardStats.openTickets > 0 ? "up" : ("down" as const),
      icon: Users,
    },
  ];

  // Get recent orders (last 4)
  const recentOrders = orders.slice(0, 4).map((order) => ({
    id: order.orderId,
    customer: order.customerName,
    product: order.products.map((p) => p.name).join(", "),
    amount: formatPrice(order.totalAmount),
    status: order.status,
    date: order.orderDate,
  }));

  // Get user name for display
  const getUserName = () => {
    if (userData?.firstName && userData?.lastName) {
      return `${userData.firstName} ${userData.lastName}`;
    } else if (userData?.name) {
      return userData.name;
    }
    return "User";
  };

  // Get user initials for avatar fallback
  const getUserInitials = () => {
    if (userData?.firstName && userData?.lastName) {
      return `${userData.firstName[0]}${userData.lastName[0]}`.toUpperCase();
    } else if (userData?.name) {
      return userData.name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase();
    }
    return "U";
  };

  // Get current time greeting
  const getTimeGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  // Get current date
  const getCurrentDate = () => {
    return new Date().toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "Completed":
        return "default" as const;
      case "Active":
        return "secondary" as const;
      case "In Progress":
        return "outline" as const;
      default:
        return "destructive" as const;
    }
  };

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 relative">
      {isLoading && <Loading overlay text="Loading dashboard data..." />}

      {/* Welcome Section */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Welcome Card */}
        <Card className="md:col-span-2 lg:col-span-2">
          <CardHeader>
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage
                  src={
                    userData?.avatar ||
                    userData?.profile_picture ||
                    "https://github.com/shadcn.png"
                  }
                  alt={getUserName()}
                />
                <AvatarFallback className="bg-blue-600 text-white font-semibold text-lg">
                  {getUserInitials()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <CardTitle className="text-xl md:text-2xl">
                  {getTimeGreeting()}, {getUserName()}! 👋
                </CardTitle>
                <CardDescription className="text-base mt-1">
                  Welcome to AY Developers - Your Technology Partner
                </CardDescription>
                <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>{getCurrentDate()}</span>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="text-center p-3 bg-primary/5 rounded-lg">
                <ShoppingCart className="h-6 w-6 mx-auto mb-1 text-primary" />
                <p className="text-sm font-medium">Orders Completed</p>
                <p className="text-lg font-bold">
                  {dashboardStats.completedOrders}
                </p>
              </div>
              <div className="text-center p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                <Activity className="h-6 w-6 mx-auto mb-1 text-green-600" />
                <p className="text-sm font-medium">Tickets Opened</p>
                <p className="text-lg font-bold">
                  {dashboardStats.totalTickets}
                </p>
              </div>
              <div className="text-center p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                <Globe className="h-6 w-6 mx-auto mb-1 text-blue-600" />
                <p className="text-sm font-medium">Total Spent</p>
                <p className="text-lg font-bold">
                  {formatPrice(dashboardStats.totalSpent)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Info Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Account Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">Status</span>
              <Badge variant="default" className="bg-green-600">
                Active
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Role</span>
              <Badge variant="outline">{userData?.role || "Customer"}</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Company Info Banner */}
      <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">
                AY Creative Technology
              </h2>
              <p className="text-blue-100 mb-4">
                Pioneering innovative solutions that set industry standards. We
                don't follow trends — we create them.
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge
                  variant="secondary"
                  className="bg-white/20 text-white border-white/30"
                >
                  🚀 Innovation First
                </Badge>
                <Badge
                  variant="secondary"
                  className="bg-white/20 text-white border-white/30"
                >
                  💡 Cutting-edge Solutions
                </Badge>
                <Badge
                  variant="secondary"
                  className="bg-white/20 text-white border-white/30"
                >
                  🎯 Results Driven
                </Badge>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="text-right">
                <div className="text-3xl mb-2">🎯</div>
                <p className="text-sm text-blue-100">Your Success</p>
                <p className="text-sm text-blue-100">Our Mission</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">
          Dashboard Overview
        </h1>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        {stats.map((stat) => {
          const IconComponent = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <IconComponent className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="flex items-center text-xs text-muted-foreground">
                  {stat.trend === "up" ? (
                    <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
                  ) : (
                    <TrendingDown className="mr-1 h-3 w-3 text-red-500" />
                  )}
                  <span
                    className={
                      stat.trend === "up" ? "text-green-500" : "text-red-500"
                    }
                  >
                    {stat.change}
                  </span>
                  <span className="ml-1">from last month</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
        {/* Recent Orders */}
        <Card className="xl:col-span-2">
          <CardHeader className="flex flex-row items-center">
            <div className="grid gap-2">
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>
                Latest customer orders and their status
              </CardDescription>
            </div>
            <Button
              size="sm"
              className="ml-auto gap-1"
              onClick={() => (window.location.href = "/user/orders")}
            >
              View All Orders
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.id}</TableCell>
                    <TableCell>{order.customer}</TableCell>
                    <TableCell className="max-w-[200px] truncate">
                      {order.product}
                    </TableCell>
                    <TableCell>{order.amount}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(order.status)}>
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{order.date}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Navigate to common tasks quickly</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3">
            <Button
              className="w-full justify-start gap-2"
              onClick={() => (window.location.href = "/user/products")}
            >
              <ShoppingCart className="h-4 w-4" />
              Browse Products
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start gap-2"
              onClick={() => (window.location.href = "/user/orders")}
            >
              <BarChart3 className="h-4 w-4" />
              View Orders
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start gap-2"
              onClick={() => (window.location.href = "/user/support")}
            >
              <Users className="h-4 w-4" />
              Get Support
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start gap-2"
              onClick={() => (window.location.href = "/user/profile")}
            >
              <PieChart className="h-4 w-4" />
              Update Profile
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Help & Resources Section */}
      <Card>
        <CardHeader>
          <CardTitle>Need Help?</CardTitle>
          <CardDescription>
            Get support from our team whenever you need assistance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center">
            <div className="flex items-center gap-4 p-6 bg-blue-50 dark:bg-blue-950/20 rounded-lg w-full max-w-md">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-600 text-white">
                <Users className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-lg">24/7 Support</p>
                <p className="text-sm text-muted-foreground mb-3">
                  Get help anytime from our expert team
                </p>
                <Button
                  className="w-full"
                  onClick={() => (window.location.href = "/user/support")}
                >
                  Contact Support
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
