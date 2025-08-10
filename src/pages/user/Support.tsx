import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LoadingButton } from "@/components/ui/loading-button";
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
import { Badge } from "@/components/ui/badge";
import {
  Phone,
  Mail,
  MessageCircle,
  Clock,
  HelpCircle,
  FileText,
  Headphones,
  Globe,
  CheckCircle,
} from "lucide-react";
import { getEncryptedStorage } from "@/utils/encryption";
import { config } from "@/utils/api";
import axios from "axios";

// Contact information constants
const SUPPORT_EMAIL = "support@aydevelopers.com.ng";
const SUPPORT_PHONE = "+2347067206984";

const supportChannels = [
  {
    title: "Live Chat",
    description: "Get instant help from our support team",
    icon: MessageCircle,
    available: true,
    responseTime: "< 5 minutes",
    action: "Start Chat",
  },
  {
    title: "Email Support",
    description: "Send us a detailed message about your issue",
    icon: Mail,
    available: true,
    responseTime: "< 24 hours",
    action: "Send Email",
  },
  {
    title: "Phone Support",
    description: "Talk directly with our technical experts",
    icon: Phone,
    available: true,
    responseTime: "< 2 minutes",
    action: "Call Now",
  },
  {
    title: "Submit Ticket",
    description: "Create a support ticket for tracking",
    icon: FileText,
    available: true,
    responseTime: "< 12 hours",
    action: "Create Ticket",
  },
];

const faqItems = [
  {
    question: "How do I reset my password?",
    answer:
      "Go to the login page and click 'Forgot Password', then follow the instructions sent to your email.",
  },
  {
    question: "How can I upgrade my hosting plan?",
    answer:
      "Visit your dashboard, go to the Products section, and select 'Upgrade Plan' next to your current hosting service.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept major credit cards, debit cards, bank transfers, and digital wallet payments.",
  },
  {
    question: "How long does it take to set up a new website?",
    answer:
      "Basic websites take 3-5 business days, while custom websites can take 1-4 weeks depending on complexity.",
  },
  {
    question: "Do you provide 24/7 support?",
    answer:
      "Yes, we offer 24/7 support through live chat and email. Phone support is available during business hours.",
  },
];

export function Support() {
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    subject: "",
    priority: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState<{
    firstName: string;
    lastName: string;
    email: string;
    role: string;
  } | null>(null);

  // Load user data from encrypted storage
  useEffect(() => {
    try {
      const encryptedUserData = getEncryptedStorage("userData");
      if (encryptedUserData) {
        setUserData(encryptedUserData);
        // Pre-fill form with user data
        setContactForm((prev) => ({
          ...prev,
          name: `${encryptedUserData.firstName} ${encryptedUserData.lastName}`,
          email: encryptedUserData.email,
        }));
      }
    } catch (error) {
      console.error("Failed to decrypt user data:", error);
    }
  }, []);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userData) {
      showMessage("error", "User data not found. Please login again.");
      return;
    }

    if (!contactForm.subject || !contactForm.message || !contactForm.priority) {
      showMessage("error", "Please fill in all required fields");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        subject: contactForm.subject,
        description: contactForm.message,
        priority: contactForm.priority as "low" | "medium" | "high",
        name: contactForm.name,
        email: contactForm.email,
        role: userData.role,
        status: "open",
      };

      console.log("🔄 Creating support ticket with payload:", payload);

      const response = await axios.post(
        `${config.apiBaseUrl}${config.endpoints.ticket}`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data) {
        console.log("✅ Support ticket created successfully:", response.data);
        showMessage(
          "success",
          "Support ticket submitted successfully! We'll get back to you soon."
        );
        setContactForm({
          name: `${userData.firstName} ${userData.lastName}`,
          email: userData.email,
          subject: "",
          priority: "",
          message: "",
        });
      }
    } catch (error: any) {
      console.error("❌ Error creating support ticket:", error);
      showMessage(
        "error",
        error.response?.data?.message || "Failed to submit support ticket"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setContactForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold md:text-2xl">Support Center</h1>
          <p className="text-muted-foreground">
            Get help when you need it, we're here for you 24/7
          </p>
        </div>
        <Badge variant="secondary" className="bg-green-100 text-green-800">
          <CheckCircle className="w-3 h-3 mr-1" />
          All Systems Operational
        </Badge>
      </div>

      {/* Support Channels */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {supportChannels.map((channel) => {
          const IconComponent = channel.icon;
          return (
            <Card key={channel.title} className="relative">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {channel.title}
                </CardTitle>
                <IconComponent className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-xs text-muted-foreground mb-2">
                  {channel.description}
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <Clock className="h-3 w-3" />
                  <span className="text-xs">{channel.responseTime}</span>
                </div>
                <Button
                  size="sm"
                  className="w-full"
                  onClick={() => {
                    if (channel.title === "Submit Ticket") {
                      window.location.href = "/user/tickets";
                    } else if (channel.title === "Email Support") {
                      // Open default email client with pre-filled support email
                      window.location.href = `mailto:${SUPPORT_EMAIL}?subject=Support Request&body=Hello AY Developers Support Team,%0D%0A%0D%0APlease describe your issue here...%0D%0A%0D%0AThank you.`;
                    } else if (channel.title === "Phone Support") {
                      // Open phone dialer (works on mobile devices)
                      window.location.href = `tel:${SUPPORT_PHONE}`;
                    } else {
                      // For Live Chat - still coming soon
                      alert(`${channel.title} feature coming soon!`);
                    }
                  }}
                >
                  {channel.action}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Contact Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Headphones className="h-5 w-5" />
              Quick Contact Form
            </CardTitle>
            <CardDescription>
              Send us a message and we'll respond as soon as possible
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={contactForm.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="Your full name"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={contactForm.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="your.email@example.com"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  value={contactForm.subject}
                  onChange={(e) => handleInputChange("subject", e.target.value)}
                  placeholder="Brief description of your issue"
                  required
                />
              </div>

              <div>
                <Label htmlFor="priority">Priority</Label>
                <Select
                  value={contactForm.priority}
                  onValueChange={(value) =>
                    handleInputChange("priority", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low - General inquiry</SelectItem>
                    <SelectItem value="medium">
                      Medium - Service issue
                    </SelectItem>
                    <SelectItem value="high">High - Urgent problem</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  value={contactForm.message}
                  onChange={(e) => handleInputChange("message", e.target.value)}
                  placeholder="Please provide as much detail as possible about your issue..."
                  rows={4}
                  required
                />
              </div>

              <LoadingButton
                type="submit"
                className="w-full"
                loading={loading}
                loadingText="Submitting..."
              >
                Send Message
              </LoadingButton>
            </form>
          </CardContent>
        </Card>

        {/* FAQ Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HelpCircle className="h-5 w-5" />
              Frequently Asked Questions
            </CardTitle>
            <CardDescription>Quick answers to common questions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {faqItems.map((faq, index) => (
                <div key={index} className="border-b pb-4 last:border-b-0">
                  <h4 className="font-medium text-sm mb-2">{faq.question}</h4>
                  <p className="text-xs text-muted-foreground">{faq.answer}</p>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4">
              View All FAQs
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
          <CardDescription>
            Multiple ways to reach our support team
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div
              className="flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-950/30 transition-colors"
              onClick={() => (window.location.href = `tel:${SUPPORT_PHONE}`)}
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white">
                <Phone className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium">Phone Support</p>
                <p className="text-sm text-muted-foreground">{SUPPORT_PHONE}</p>
                <p className="text-xs text-muted-foreground">24/7 Available</p>
              </div>
            </div>

            <div
              className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-950/20 rounded-lg cursor-pointer hover:bg-green-100 dark:hover:bg-green-950/30 transition-colors"
              onClick={() =>
                (window.location.href = `mailto:${SUPPORT_EMAIL}?subject=Support Request&body=Hello AY Developers Support Team,%0D%0A%0D%0APlease describe your issue here...%0D%0A%0D%0AThank you.`)
              }
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-600 text-white">
                <Mail className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium">Email Support</p>
                <p className="text-sm text-muted-foreground">{SUPPORT_EMAIL}</p>
                <p className="text-xs text-muted-foreground">
                  Response in 24hrs
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-600 text-white">
                <Globe className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium">Knowledge Base</p>
                <p className="text-sm text-muted-foreground">
                  help.aydevelopers.ng
                </p>
                <p className="text-xs text-muted-foreground">
                  Self-service portal
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
