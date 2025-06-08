
import React, { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Search, MessageSquare, Clock, AlertTriangle } from "lucide-react";

interface Ticket {
  id: string;
  ticketNumber: string;
  customerName: string;
  customerEmail: string;
  subject: string;
  category: "order" | "product" | "refund" | "account" | "other";
  priority: "low" | "medium" | "high" | "urgent";
  status: "open" | "in_progress" | "resolved" | "closed";
  assignedTo?: string;
  createdAt: string;
  lastUpdated: string;
  description: string;
}

// Mock data for demonstration
const mockTickets: Ticket[] = [
  {
    id: "t1",
    ticketNumber: "TKT-001",
    customerName: "John Smith",
    customerEmail: "john.smith@email.com",
    subject: "Order not delivered",
    category: "order",
    priority: "high",
    status: "open",
    assignedTo: "Support Agent 1",
    createdAt: "2023-06-20T10:30:00Z",
    lastUpdated: "2023-06-20T14:30:00Z",
    description: "My order was supposed to be delivered yesterday but I haven't received it yet.",
  },
  {
    id: "t2",
    ticketNumber: "TKT-002",
    customerName: "Sarah Johnson",
    customerEmail: "sarah.johnson@email.com",
    subject: "Defective product received",
    category: "product",
    priority: "medium",
    status: "in_progress",
    assignedTo: "Support Agent 2",
    createdAt: "2023-06-19T15:20:00Z",
    lastUpdated: "2023-06-20T09:15:00Z",
    description: "The wireless headphones I received are not working properly.",
  },
  {
    id: "t3",
    ticketNumber: "TKT-003",
    customerName: "Michael Brown",
    customerEmail: "michael.brown@email.com",
    subject: "Refund request",
    category: "refund",
    priority: "low",
    status: "resolved",
    assignedTo: "Support Agent 1",
    createdAt: "2023-06-18T11:45:00Z",
    lastUpdated: "2023-06-19T16:30:00Z",
    description: "I would like to return this item and get a full refund.",
  },
];

const AdminDisputes: React.FC = () => {
  const [tickets, setTickets] = useState<Ticket[]>(mockTickets);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const { toast } = useToast();

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.ticketNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || ticket.status === statusFilter;
    const matchesPriority = priorityFilter === "all" || ticket.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const handleUpdateStatus = (ticketId: string, newStatus: Ticket["status"]) => {
    setTickets(tickets.map(ticket =>
      ticket.id === ticketId ? { ...ticket, status: newStatus, lastUpdated: new Date().toISOString() } : ticket
    ));

    toast({
      title: "Ticket status updated",
      description: `Ticket has been marked as ${newStatus}.`,
    });
  };

  const handleAssignTicket = (ticketId: string, agent: string) => {
    setTickets(tickets.map(ticket =>
      ticket.id === ticketId ? { ...ticket, assignedTo: agent, lastUpdated: new Date().toISOString() } : ticket
    ));

    toast({
      title: "Ticket assigned",
      description: `Ticket has been assigned to ${agent}.`,
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent": return "destructive";
      case "high": return "destructive";
      case "medium": return "outline";
      case "low": return "default";
      default: return "default";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open": return "destructive";
      case "in_progress": return "outline";
      case "resolved": return "default";
      case "closed": return "default";
      default: return "default";
    }
  };

  const openTickets = tickets.filter(t => t.status === "open").length;
  const highPriorityTickets = tickets.filter(t => t.priority === "high" || t.priority === "urgent").length;
  const avgResponseTime = "2.5 hours"; // Mock data
  const resolutionRate = "94%"; // Mock data

  return (
    <div>
      <div className="flex justify-between mb-6">
        <h2 className="text-2xl font-bold">Support & Dispute Management</h2>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Tickets</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{openTickets}</div>
            <p className="text-xs text-muted-foreground">
              Needs attention
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Priority</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{highPriorityTickets}</div>
            <p className="text-xs text-muted-foreground">
              Urgent resolution needed
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgResponseTime}</div>
            <p className="text-xs text-muted-foreground">
              Within SLA
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolution Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{resolutionRate}</div>
            <p className="text-xs text-muted-foreground">
              This month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tickets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Button 
            variant={statusFilter === "all" ? "default" : "outline"}
            onClick={() => setStatusFilter("all")}
          >
            All Status
          </Button>
          <Button 
            variant={statusFilter === "open" ? "default" : "outline"}
            onClick={() => setStatusFilter("open")}
          >
            Open
          </Button>
          <Button 
            variant={statusFilter === "in_progress" ? "default" : "outline"}
            onClick={() => setStatusFilter("in_progress")}
          >
            In Progress
          </Button>
          <Button 
            variant={priorityFilter === "high" ? "default" : "outline"}
            onClick={() => setPriorityFilter("high")}
          >
            High Priority
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <Table>
            <TableCaption>Support tickets and disputes</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Ticket</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Assigned</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTickets.map((ticket) => (
                <TableRow 
                  key={ticket.id} 
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => setSelectedTicket(ticket)}
                >
                  <TableCell>
                    <div>
                      <div className="font-medium">{ticket.ticketNumber}</div>
                      <div className="text-sm text-muted-foreground">{ticket.subject}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{ticket.customerName}</div>
                      <div className="text-sm text-muted-foreground">{ticket.customerEmail}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getPriorityColor(ticket.priority)}>
                      {ticket.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusColor(ticket.status)}>
                      {ticket.status.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell>{ticket.assignedTo || "Unassigned"}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {ticket.status === "open" && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleUpdateStatus(ticket.id, "in_progress");
                          }}
                        >
                          Start
                        </Button>
                      )}
                      {ticket.status === "in_progress" && (
                        <Button 
                          variant="default" 
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleUpdateStatus(ticket.id, "resolved");
                          }}
                        >
                          Resolve
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Ticket Detail Panel */}
        <div>
          {selectedTicket ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  {selectedTicket.ticketNumber}
                  <Badge variant={getPriorityColor(selectedTicket.priority)}>
                    {selectedTicket.priority}
                  </Badge>
                </CardTitle>
                <CardDescription>{selectedTicket.subject}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Customer Information</h4>
                  <p className="text-sm">{selectedTicket.customerName}</p>
                  <p className="text-sm text-muted-foreground">{selectedTicket.customerEmail}</p>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Description</h4>
                  <p className="text-sm">{selectedTicket.description}</p>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Timeline</h4>
                  <p className="text-sm">Created: {new Date(selectedTicket.createdAt).toLocaleString()}</p>
                  <p className="text-sm">Last Updated: {new Date(selectedTicket.lastUpdated).toLocaleString()}</p>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Add Response</h4>
                  <Textarea placeholder="Type your response..." className="mb-2" />
                  <Button>Send Response</Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center h-64">
                <p className="text-muted-foreground">Select a ticket to view details</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDisputes;
