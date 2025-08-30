import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LoadingButton } from "@/components/ui/loading-button";
import { Loading } from "@/components/ui/loading";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Plus,
  Search,
  CheckCircle,
  AlertCircle,
  MoreHorizontal,
  Eye,
} from "lucide-react";
import { getEncryptedStorage, decryptData } from "@/utils/encryption";
import { config } from "@/utils/api";
import { setTicketsData } from "@/utils/dashboardData";
import axios from "axios";

interface Ticket {
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

export function Tickets() {
  const [activeTab, setActiveTab] = useState<string>("open");
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [isNewTicketOpen, setIsNewTicketOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [userData, setUserData] = useState<{
    firstName: string;
    lastName: string;
    email: string;
    role: string;
  } | null>(null);
  const [newTicket, setNewTicket] = useState<{
    subject: string;
    description: string;
    priority: "low" | "medium" | "high";
  }>({
    subject: "",
    description: "",
    priority: "medium",
  });

  // Simple message function
  const showMessage = (
    type: "success" | "error" | "warning",
    content: string
  ) => {
    if (type === "success") {
      console.log("✅ Success:", content);
      alert(`Success: ${content}`);
    } else if (type === "error") {
      console.error("❌ Error:", content);
      alert(`Error: ${content}`);
    } else if (type === "warning") {
      console.warn("⚠️ Warning:", content);
      alert(`Warning: ${content}`);
    }
  };
  // Load user data from encrypted storage
  useEffect(() => {
    try {
      const encryptedUserData = getEncryptedStorage("userData");
      if (encryptedUserData) {
        console.log("🔓 Decrypted user data:", encryptedUserData);
        setUserData(encryptedUserData);
      }
    } catch (error) {
      console.error("❌ Failed to decrypt user data:", error);
    }
  }, []);

  // Fetch tickets from API
  const fetchTickets = async () => {
    setLoading(true);
    if (initialLoading) {
      setInitialLoading(true);
    }
    try {
      const encryptedUserData = localStorage.getItem("userData");
      if (!encryptedUserData) {
        setLoading(false);
        return;
      }
      const decryptedUserData: { id: string } = decryptData(encryptedUserData);
      const userId = decryptedUserData.id;

      if (!userId) {
        setLoading(false);
        return;
      }
      const response = await axios.get(
        `${config.apiBaseUrl}${config.endpoints.getTickets}/${userId}`
      );

      console.log("✅ Tickets fetched successfully:", response.data);

      // Handle different response structures
      const ticketsData = response.data.tickets || response.data || [];
      console.log("📊 Tickets data:", ticketsData);

      setTickets(ticketsData);
      setTicketsData(ticketsData); // Store in localStorage for dashboard
    } catch (error) {
      console.error("❌ Error fetching tickets:", error);
      showMessage("error", "Failed to fetch tickets");

      setTickets([]);
    } finally {
      setLoading(false);
      if (initialLoading) {
        setInitialLoading(false);
      }
    }
  };

  // Create new ticket
  const handleCreateTicket = async () => {
    if (!userData) {
      showMessage("error", "User data not found. Please login again.");
      return;
    }

    if (!newTicket.subject || !newTicket.description) {
      showMessage("error", "Please fill in all required fields");
      return;
    }

    setLoading(true);
    try {
      const encryptedUserData = localStorage.getItem("userData");
      if (!encryptedUserData) {
        showMessage("error", "User not authenticated");
        setLoading(false);
        return;
      }
      const decryptedUserData: { id: string } = decryptData(encryptedUserData);
      const userId = decryptedUserData.id;

      if (!userId) {
        showMessage("error", "User ID not found");
        setLoading(false);
        return;
      }

      const fullName = `${userData.firstName} ${userData.lastName}`;
      const payload = {
        subject: newTicket.subject,
        description: newTicket.description,
        priority: newTicket.priority,
        name: fullName,
        email: userData.email,
        role: userData.role,
        status: "open",
        userId: userId,
      };

      console.log("🔄 Creating ticket with payload:", payload);

      const response = await axios.post(
        `${config.apiBaseUrl}${config.endpoints.ticket}`,
        payload
      );

      if (response.data) {
        console.log("✅ Ticket created successfully:", response.data);
        showMessage("success", "Ticket submitted successfully");
        setNewTicket({
          subject: "",
          description: "",
          priority: "medium",
        });
        setIsNewTicketOpen(false);
        fetchTickets(); // Refresh tickets list
      }
    } catch (error: any) {
      console.error("❌ Error creating ticket:", error);
      showMessage(
        "error",
        error.response?.data?.message || "Failed to submit ticket"
      );
    } finally {
      setLoading(false);
    }
  };

  // Handle view ticket
  const handleViewTicket = (ticket: Ticket) => {
    console.log("👁️ Viewing ticket:", ticket);
    setSelectedTicket(ticket);
    setIsViewModalOpen(true);
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const filteredTickets = tickets.filter((ticket) => {
    const matchesSearch =
      ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPriority =
      priorityFilter === "all" || ticket.priority === priorityFilter;

    return matchesSearch && matchesPriority;
  });

  // Filter by tab
  const tabFilteredTickets = filteredTickets.filter((ticket) => {
    if (activeTab === "open") return ticket.status === "open";
    if (activeTab === "closed") return ticket.status === "closed";
    return true;
  });

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "open":
        return "destructive" as const;
      case "closed":
        return "secondary" as const;
      default:
        return "outline" as const;
    }
  };

  const getPriorityVariant = (priority: string) => {
    switch (priority) {
      case "high":
        return "destructive" as const;
      case "medium":
        return "default" as const;
      case "low":
        return "secondary" as const;
      default:
        return "secondary" as const;
    }
  };

  // Show loading screen while initial data loads
  if (initialLoading) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
        <Loading size="lg" text="Loading tickets..." />
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 relative">
      {loading && !initialLoading && (
        <Loading overlay text="Loading tickets..." />
      )}

      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl">Support Tickets</h1>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Badge variant="outline">
              Open: {tickets.filter((t) => t.status === "open").length}
            </Badge>
            <Badge variant="secondary">
              Closed: {tickets.filter((t) => t.status === "closed").length}
            </Badge>
          </div>
          <Dialog open={isNewTicketOpen} onOpenChange={setIsNewTicketOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                New Ticket
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Create New Ticket</DialogTitle>
                <DialogDescription>
                  Submit a new support ticket and we'll help you resolve your
                  issue.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    value={newTicket.subject}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setNewTicket({ ...newTicket, subject: e.target.value })
                    }
                    placeholder="Brief description of your issue"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select
                    value={newTicket.priority}
                    onValueChange={(value: string) =>
                      setNewTicket({
                        ...newTicket,
                        priority: value as "low" | "medium" | "high",
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newTicket.description}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                      setNewTicket({
                        ...newTicket,
                        description: e.target.value,
                      })
                    }
                    placeholder="Provide detailed information about your issue"
                    rows={4}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsNewTicketOpen(false)}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <LoadingButton
                  onClick={handleCreateTicket}
                  loading={loading}
                  loadingText="Creating..."
                >
                  Create Ticket
                </LoadingButton>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Filter Tickets</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search tickets..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priority</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tickets Tabs */}
      <Card>
        <CardHeader>
          <CardTitle>Your Tickets</CardTitle>
          <CardDescription>
            Manage and track your support tickets
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="open">Open Tickets</TabsTrigger>
              <TabsTrigger value="closed">Closed Tickets</TabsTrigger>
            </TabsList>
            <TabsContent value="open" className="mt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ticket ID</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Last Update</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tabFilteredTickets.length > 0 ? (
                    tabFilteredTickets.map((ticket) => (
                      <TableRow key={ticket.ticketId}>
                        <TableCell className="font-medium">
                          {ticket.ticketId}
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{ticket.subject}</p>
                            <p className="text-sm text-muted-foreground truncate max-w-[200px]">
                              {ticket.description}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getPriorityVariant(ticket.priority)}>
                            {ticket.priority.charAt(0).toUpperCase() +
                              ticket.priority.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{ticket.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {ticket.email}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          {ticket.createdAt
                            ? new Date(ticket.createdAt).toLocaleDateString(
                                "en-US",
                                {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                }
                              )
                            : "N/A"}
                        </TableCell>
                        <TableCell>
                          {ticket.updatedAt
                            ? new Date(ticket.updatedAt).toLocaleDateString(
                                "en-US",
                                {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                }
                              )
                            : "No updates"}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => handleViewTicket(ticket)}
                              >
                                <Eye className="mr-2 h-4 w-4" />
                                View
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        <div className="flex flex-col items-center gap-2">
                          <AlertCircle className="h-8 w-8 text-muted-foreground" />
                          <p className="text-muted-foreground">
                            No open tickets found
                          </p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TabsContent>
            <TabsContent value="closed" className="mt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ticket ID</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Last Update</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tabFilteredTickets.length > 0 ? (
                    tabFilteredTickets.map((ticket) => (
                      <TableRow key={ticket.ticketId}>
                        <TableCell className="font-medium">
                          {ticket.ticketId}
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{ticket.subject}</p>
                            <p className="text-sm text-muted-foreground truncate max-w-[200px]">
                              {ticket.description}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getPriorityVariant(ticket.priority)}>
                            {ticket.priority.charAt(0).toUpperCase() +
                              ticket.priority.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{ticket.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {ticket.email}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          {ticket.createdAt
                            ? new Date(ticket.createdAt).toLocaleDateString(
                                "en-US",
                                {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                }
                              )
                            : "N/A"}
                        </TableCell>
                        <TableCell>
                          {ticket.updatedAt
                            ? new Date(ticket.updatedAt).toLocaleDateString(
                                "en-US",
                                {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                }
                              )
                            : "No updates"}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => handleViewTicket(ticket)}
                              >
                                <Eye className="mr-2 h-4 w-4" />
                                View
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        <div className="flex flex-col items-center gap-2">
                          <CheckCircle className="h-8 w-8 text-muted-foreground" />
                          <p className="text-muted-foreground">
                            No closed tickets found
                          </p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* View Ticket Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Ticket Details</DialogTitle>
          </DialogHeader>
          {selectedTicket && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Ticket ID</Label>
                  <p className="text-sm">{selectedTicket.ticketId}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Status</Label>
                  <Badge
                    variant={getStatusVariant(selectedTicket.status)}
                    className="mt-1 ml-3"
                  >
                    {selectedTicket.status.charAt(0).toUpperCase() +
                      selectedTicket.status.slice(1)}
                  </Badge>
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium">Subject</Label>
                <p className="text-sm mt-1">{selectedTicket.subject}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Description</Label>
                <p className="text-sm mt-1">{selectedTicket.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Priority</Label>
                  <Badge
                    variant={getPriorityVariant(selectedTicket.priority)}
                    className="mt-1 ml-3"
                  >
                    {selectedTicket.priority.charAt(0).toUpperCase() +
                      selectedTicket.priority.slice(1)}
                  </Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium">Customer</Label>
                  <p className="text-sm mt-1">{selectedTicket.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {selectedTicket.email}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Created</Label>
                  <p className="text-sm mt-1">
                    {selectedTicket.createdAt
                      ? new Date(selectedTicket.createdAt).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )
                      : "Date not available"}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Last Updated</Label>
                  <p className="text-sm mt-1">
                    {selectedTicket.updatedAt
                      ? new Date(selectedTicket.updatedAt).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )
                      : "No updates yet"}
                  </p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
