import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Search, 
  Plus,
  MessageSquare, 
  Clock,
  CheckCircle,
  AlertCircle,
  User,
  Headphones,
  Book,
  Video,
  FileText,
  ExternalLink,
  Send
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

const VendorSupport = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [newTicketOpen, setNewTicketOpen] = useState(false);
  const [newMessage, setNewMessage] = useState("");

  // Mock support tickets
  const tickets = [
    {
      id: "TICK-001",
      subject: "Payment processing issue",
      status: "open",
      priority: "high",
      category: "payments",
      created: "2024-01-15",
      lastUpdate: "2024-01-15",
      assignee: "Sarah Johnson",
      messages: [
        {
          id: "1",
          sender: "You",
          message: "I'm having trouble with payment processing for order #12345. The payment shows as failed but the customer says they were charged.",
          timestamp: "2024-01-15 10:30",
          isSupport: false
        },
        {
          id: "2",
          sender: "Sarah Johnson",
          message: "I've looked into this issue. There was a temporary payment gateway hiccup. I've initiated a refund for the customer and marked the order as pending. Please process it manually.",
          timestamp: "2024-01-15 11:45",
          isSupport: true
        }
      ]
    },
    {
      id: "TICK-002",
      subject: "Product upload error",
      status: "resolved",
      priority: "medium",
      category: "technical",
      created: "2024-01-14",
      lastUpdate: "2024-01-14",
      assignee: "Mike Chen",
      messages: [
        {
          id: "1",
          sender: "You",
          message: "Getting an error when trying to upload product images. Error code: IMG_UPLOAD_FAILED",
          timestamp: "2024-01-14 14:20",
          isSupport: false
        },
        {
          id: "2",
          sender: "Mike Chen",
          message: "This was due to a temporary server issue. It's been resolved. Please try uploading again.",
          timestamp: "2024-01-14 15:30",
          isSupport: true
        }
      ]
    },
    {
      id: "TICK-003",
      subject: "Commission calculation question",
      status: "pending",
      priority: "low",
      category: "billing",
      created: "2024-01-13",
      lastUpdate: "2024-01-13",
      assignee: "Lisa Wang",
      messages: [
        {
          id: "1",
          sender: "You",
          message: "Can you explain how commission is calculated for bundled products?",
          timestamp: "2024-01-13 09:15",
          isSupport: false
        }
      ]
    }
  ];

  // Mock knowledge base articles
  const knowledgeBase = [
    {
      id: "KB-001",
      title: "Getting Started: Setting Up Your Store",
      category: "Getting Started",
      views: 1245,
      helpful: 89,
      icon: <Book className="h-5 w-5" />
    },
    {
      id: "KB-002",
      title: "Product Upload Guidelines",
      category: "Products",
      views: 892,
      helpful: 76,
      icon: <FileText className="h-5 w-5" />
    },
    {
      id: "KB-003",
      title: "Understanding Payment Processing",
      category: "Payments",
      views: 567,
      helpful: 92,
      icon: <FileText className="h-5 w-5" />
    },
    {
      id: "KB-004",
      title: "Inventory Management Best Practices",
      category: "Inventory",
      views: 423,
      helpful: 88,
      icon: <FileText className="h-5 w-5" />
    }
  ];

  // Mock video tutorials
  const videoTutorials = [
    {
      id: "VID-001",
      title: "Store Setup Walkthrough",
      duration: "15:30",
      views: 2134,
      thumbnail: "https://images.unsplash.com/photo-1556075798-4825dfaaf498?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=60"
    },
    {
      id: "VID-002",
      title: "Product Photography Tips",
      duration: "8:45",
      views: 1567,
      thumbnail: "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=60"
    },
    {
      id: "VID-003",
      title: "Order Fulfillment Process",
      duration: "12:20",
      views: 1234,
      thumbnail: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=60"
    }
  ];

  const filteredTickets = tickets.filter(ticket =>
    ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ticket.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open": return "destructive";
      case "pending": return "secondary";
      case "resolved": return "default";
      default: return "outline";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "destructive";
      case "medium": return "secondary";
      case "low": return "outline";
      default: return "outline";
    }
  };

  const openTickets = tickets.filter(t => t.status === 'open').length;
  const pendingTickets = tickets.filter(t => t.status === 'pending').length;
  const resolvedTickets = tickets.filter(t => t.status === 'resolved').length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Support & Communication</h2>
          <p className="text-muted-foreground">
            Get help, access resources, and manage support tickets.
          </p>
        </div>
        <Dialog open={newTicketOpen} onOpenChange={setNewTicketOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Ticket
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create Support Ticket</DialogTitle>
              <DialogDescription>
                Describe your issue and we'll help you resolve it quickly.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Subject</label>
                  <Input placeholder="Brief description of your issue" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Category</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="technical">Technical Issue</SelectItem>
                      <SelectItem value="payments">Payments & Billing</SelectItem>
                      <SelectItem value="products">Product Management</SelectItem>
                      <SelectItem value="orders">Orders & Fulfillment</SelectItem>
                      <SelectItem value="account">Account & Settings</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Priority</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low - General inquiry</SelectItem>
                    <SelectItem value="medium">Medium - Issue affecting business</SelectItem>
                    <SelectItem value="high">High - Urgent business impact</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <Textarea 
                  placeholder="Please provide details about your issue, including any error messages or steps to reproduce..."
                  className="min-h-[120px]"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setNewTicketOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setNewTicketOpen(false)}>
                  Create Ticket
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Support Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Tickets</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{openTickets}</div>
            <p className="text-xs text-muted-foreground">Require attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingTickets}</div>
            <p className="text-xs text-muted-foreground">Awaiting response</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolved</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{resolvedTickets}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Response</CardTitle>
            <Headphones className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.5h</div>
            <p className="text-xs text-muted-foreground">Response time</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="tickets" className="space-y-4">
        <TabsList>
          <TabsTrigger value="tickets">Support Tickets</TabsTrigger>
          <TabsTrigger value="knowledge">Knowledge Base</TabsTrigger>
          <TabsTrigger value="videos">Video Tutorials</TabsTrigger>
        </TabsList>

        <TabsContent value="tickets" className="space-y-4">
          {/* Search */}
          <Card>
            <CardHeader>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search tickets by ID or subject..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </CardHeader>
          </Card>

          {/* Tickets List */}
          <Card>
            <CardHeader>
              <CardTitle>Your Support Tickets ({filteredTickets.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredTickets.map((ticket) => (
                  <div key={ticket.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div>
                          <h3 className="font-medium">{ticket.subject}</h3>
                          <p className="text-sm text-muted-foreground">#{ticket.id}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={getPriorityColor(ticket.priority)}>
                          {ticket.priority}
                        </Badge>
                        <Badge variant={getStatusColor(ticket.status)}>
                          {ticket.status}
                        </Badge>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Created</p>
                        <p className="font-medium">{ticket.created}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Last Update</p>
                        <p className="font-medium">{ticket.lastUpdate}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Assigned to</p>
                        <p className="font-medium">{ticket.assignee}</p>
                      </div>
                    </div>

                    <div className="mt-4 space-y-3">
                      <h4 className="font-medium">Conversation</h4>
                      <div className="space-y-3 max-h-60 overflow-y-auto">
                        {ticket.messages.map((message) => (
                          <div
                            key={message.id}
                            className={`flex gap-3 ${message.isSupport ? '' : 'flex-row-reverse'}`}
                          >
                            <Avatar className="h-8 w-8">
                              <AvatarFallback>
                                {message.isSupport ? <Headphones className="h-4 w-4" /> : <User className="h-4 w-4" />}
                              </AvatarFallback>
                            </Avatar>
                            <div className={`flex-1 space-y-1 ${message.isSupport ? '' : 'text-right'}`}>
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium">{message.sender}</span>
                                <span className="text-xs text-muted-foreground">{message.timestamp}</span>
                              </div>
                              <div className={`p-3 rounded-lg text-sm ${
                                message.isSupport 
                                  ? 'bg-blue-50 border border-blue-200' 
                                  : 'bg-gray-100'
                              }`}>
                                {message.message}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {ticket.status === 'open' && (
                        <div className="flex gap-2">
                          <Textarea
                            placeholder="Type your message..."
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            className="flex-1"
                          />
                          <Button size="sm">
                            <Send className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="knowledge" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Knowledge Base</CardTitle>
              <CardDescription>
                Find answers to common questions and learn best practices.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {knowledgeBase.map((article) => (
                  <div key={article.id} className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
                    <div className="flex items-start gap-3">
                      {article.icon}
                      <div className="flex-1">
                        <h3 className="font-medium mb-1">{article.title}</h3>
                        <Badge variant="outline" className="text-xs mb-2">
                          {article.category}
                        </Badge>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>{article.views} views</span>
                          <span>{article.helpful}% helpful</span>
                        </div>
                      </div>
                      <ExternalLink className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="videos" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Video Tutorials</CardTitle>
              <CardDescription>
                Step-by-step video guides to help you succeed.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                {videoTutorials.map((video) => (
                  <div key={video.id} className="border rounded-lg overflow-hidden hover:shadow-md cursor-pointer">
                    <div className="relative">
                      <img 
                        src={video.thumbnail} 
                        alt={video.title}
                        className="w-full h-40 object-cover"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                        <Video className="h-12 w-12 text-white" />
                      </div>
                      <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                        {video.duration}
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium mb-2">{video.title}</h3>
                      <p className="text-xs text-muted-foreground">{video.views} views</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default VendorSupport;