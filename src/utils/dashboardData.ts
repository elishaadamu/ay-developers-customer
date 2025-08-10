// Shared data utilities for dashboard
export interface OrderItem {
  id: string;
  orderId: string;
  customerName: string;
  customerEmail: string;
  products: {
    id: string;
    name: string;
    price: number;
    quantity: number;
  }[];
  totalAmount: number;
  status: "Pending" | "Processing" | "Completed" | "Cancelled";
  paymentMethod: string;
  orderDate: string;
}

export interface TicketItem {
  id?: string;
  ticketId: string;
  _id?: string;
  subject: string;
  description: string;
  status: "open" | "closed";
  priority: "low" | "medium" | "high";
  createdAt?: string;
  updatedAt?: string;
  name: string;
  email: string;
  role: string;
  reply?: string;
}

// Get orders data from localStorage or return mock data
export const getOrdersData = (): OrderItem[] => {
  try {
    const storedOrders = localStorage.getItem("ordersData");
    if (storedOrders) {
      return JSON.parse(storedOrders);
    }
  } catch (error) {
    console.error("Error getting orders data:", error);
  }

  // Return mock data if no stored data
  return [
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
        },
      ],
      totalAmount: 50000,
      status: "Pending",
      paymentMethod: "Card",
      orderDate: "2025-01-14",
    },
    {
      id: "4",
      orderId: "ORD-004",
      customerName: "Sarah Wilson",
      customerEmail: "sarah.wilson@example.com",
      products: [
        {
          id: "PROD-004",
          name: "Premium Hosting Services",
          price: 25000,
          quantity: 1,
        },
      ],
      totalAmount: 25000,
      status: "Completed",
      paymentMethod: "Card",
      orderDate: "2025-01-13",
    },
  ];
};

// Get tickets data from localStorage or return mock data
export const getTicketsData = (): TicketItem[] => {
  try {
    const storedTickets = localStorage.getItem("ticketsData");
    if (storedTickets) {
      return JSON.parse(storedTickets);
    }
  } catch (error) {
    console.error("Error getting tickets data:", error);
  }

  // Return mock data if no stored data
  return [
    {
      ticketId: "TKT-001",
      subject: "Website hosting issue",
      description: "My website is showing 502 error",
      status: "open",
      priority: "high",
      createdAt: "2025-01-15T10:30:00.000Z",
      updatedAt: "2025-01-16T14:20:00.000Z",
      name: "John Doe",
      email: "john.doe@example.com",
      role: "customer",
    },
    {
      ticketId: "TKT-002",
      subject: "Mobile app login problem",
      description: "Cannot login to mobile app",
      status: "open",
      priority: "medium",
      createdAt: "2025-01-14T09:15:00.000Z",
      updatedAt: "2025-01-14T09:15:00.000Z",
      name: "Jane Smith",
      email: "jane.smith@example.com",
      role: "customer",
    },
    {
      ticketId: "TKT-003",
      subject: "Payment processing delay",
      description: "Payment was made but order is still pending",
      status: "closed",
      priority: "low",
      createdAt: "2025-01-13T16:45:00.000Z",
      updatedAt: "2025-01-14T11:30:00.000Z",
      name: "Mike Johnson",
      email: "mike.johnson@example.com",
      role: "customer",
    },
  ];
};

// Store orders data in localStorage
export const setOrdersData = (orders: OrderItem[]) => {
  try {
    localStorage.setItem("ordersData", JSON.stringify(orders));
  } catch (error) {
    console.error("Error storing orders data:", error);
  }
};

// Store tickets data in localStorage
export const setTicketsData = (tickets: TicketItem[]) => {
  try {
    localStorage.setItem("ticketsData", JSON.stringify(tickets));
  } catch (error) {
    console.error("Error storing tickets data:", error);
  }
};

// Calculate dashboard statistics
export const getDashboardStats = () => {
  const orders = getOrdersData();
  const tickets = getTicketsData();

  // Calculate total money spent (completed orders only)
  const totalSpent = orders
    .filter((order) => order.status === "Completed")
    .reduce((total, order) => total + order.totalAmount, 0);

  // Count active orders (Processing + Pending)
  const activeOrders = orders.filter(
    (order) => order.status === "Processing" || order.status === "Pending"
  ).length;

  // Count completed orders
  const completedOrders = orders.filter(
    (order) => order.status === "Completed"
  ).length;

  // Count open tickets
  const openTickets = tickets.filter(
    (ticket) => ticket.status === "open"
  ).length;

  return {
    totalSpent,
    activeOrders,
    completedOrders,
    openTickets,
    totalOrders: orders.length,
    totalTickets: tickets.length,
  };
};

// Format price to Nigerian Naira
export const formatPrice = (price: number) => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
  }).format(price);
};
