import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
  Smartphone,
  Server,
  Megaphone,
  PenTool,
  Star,
} from "lucide-react";

const stats = [
  {
    title: "Total Revenue",
    value: "₦2,450,000",
    change: "+12.5%",
    trend: "up" as const,
    icon: DollarSign,
  },
  {
    title: "Active Orders",
    value: "24",
    change: "+3",
    trend: "up" as const,
    icon: ShoppingCart,
  },
  {
    title: "Total Customers",
    value: "1,432",
    change: "+8.2%",
    trend: "up" as const,
    icon: Users,
  },
  {
    title: "Support Tickets",
    value: "3",
    change: "-2",
    trend: "down" as const,
    icon: Activity,
  },
];

const recentOrders = [
  {
    id: "ORD-001",
    customer: "John Doe",
    product: "Professional Website Package",
    amount: "₦299,999",
    status: "In Progress",
    date: "2025-01-16",
  },
  {
    id: "ORD-002",
    customer: "Jane Smith",
    product: "Mobile App Development",
    amount: "₦599,999",
    status: "Completed",
    date: "2025-01-15",
  },
  {
    id: "ORD-003",
    customer: "Mike Johnson",
    product: "Digital Marketing Suite",
    amount: "₦150,000",
    status: "Active",
    date: "2025-01-14",
  },
  {
    id: "ORD-004",
    customer: "Sarah Wilson",
    product: "Premium Hosting Services",
    amount: "₦25,000",
    status: "Active",
    date: "2025-01-13",
  },
];

const productPerformance = [
  {
    name: "Professional Website Package",
    sales: 45,
    revenue: "₦13,499,955",
    icon: Globe,
    trend: "+15%",
  },
  {
    name: "Mobile App Development",
    sales: 23,
    revenue: "₦13,799,977",
    icon: Smartphone,
    trend: "+8%",
  },
  {
    name: "Digital Marketing Suite",
    sales: 67,
    revenue: "₦10,050,000",
    icon: Megaphone,
    trend: "+22%",
  },
  {
    name: "Premium Hosting Services",
    sales: 156,
    revenue: "₦3,900,000",
    icon: Server,
    trend: "+5%",
  },
  {
    name: "Content Creation Package",
    sales: 34,
    revenue: "₦2,550,000",
    icon: PenTool,
    trend: "+12%",
  },
];

export function Orders() {
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
    <div className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Dashboard</h1>
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
            <Button size="sm" className="ml-auto gap-1">
              View All
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
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3">
            <Button className="w-full justify-start gap-2">
              <BarChart3 className="h-4 w-4" />
              View Analytics
            </Button>
            <Button variant="outline" className="w-full justify-start gap-2">
              <ShoppingCart className="h-4 w-4" />
              Manage Orders
            </Button>
            <Button variant="outline" className="w-full justify-start gap-2">
              <Users className="h-4 w-4" />
              Customer Support
            </Button>
            <Button variant="outline" className="w-full justify-start gap-2">
              <PieChart className="h-4 w-4" />
              Generate Report
            </Button>
          </CardContent>
        </Card>

        {/* Product Performance */}
        <Card className="xl:col-span-3">
          <CardHeader>
            <CardTitle>Product Performance</CardTitle>
            <CardDescription>
              Sales and revenue by product category
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {productPerformance.map((product) => {
                const IconComponent = product.icon;
                return (
                  <div
                    key={product.name}
                    className="flex items-center space-x-4 rounded-md border p-4"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <IconComponent className="h-5 w-5" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {product.name}
                      </p>
                      <div className="flex items-center gap-2">
                        <p className="text-sm text-muted-foreground">
                          {product.sales} sales
                        </p>
                        <Badge variant="outline" className="text-xs">
                          {product.trend}
                        </Badge>
                      </div>
                      <p className="text-sm font-medium text-green-600">
                        {product.revenue}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
