
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
import { formatCurrency } from "@/lib/utils";
import { Search, Eye, Ban, CheckCircle } from "lucide-react";

interface Customer {
  id: string;
  name: string;
  email: string;
  status: "active" | "suspended" | "blocked";
  joinDate: string;
  totalOrders: number;
  totalSpent: number;
  averageOrderValue: number;
  lastOrderDate: string;
}

// Mock data for demonstration
const mockCustomers: Customer[] = [
  {
    id: "c1",
    name: "John Smith",
    email: "john.smith@email.com",
    status: "active",
    joinDate: "2023-01-15",
    totalOrders: 12,
    totalSpent: 2499.99,
    averageOrderValue: 208.33,
    lastOrderDate: "2023-06-20",
  },
  {
    id: "c2",
    name: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    status: "active",
    joinDate: "2023-03-22",
    totalOrders: 8,
    totalSpent: 1899.95,
    averageOrderValue: 237.49,
    lastOrderDate: "2023-06-18",
  },
  {
    id: "c3",
    name: "Michael Brown",
    email: "michael.brown@email.com",
    status: "suspended",
    joinDate: "2023-02-10",
    totalOrders: 5,
    totalSpent: 599.50,
    averageOrderValue: 119.90,
    lastOrderDate: "2023-05-15",
  },
];

const AdminCustomers: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>(mockCustomers);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const { toast } = useToast();

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || customer.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleUpdateStatus = (customerId: string, newStatus: Customer["status"]) => {
    setCustomers(customers.map(customer =>
      customer.id === customerId ? { ...customer, status: newStatus } : customer
    ));

    toast({
      title: "Customer status updated",
      description: `Customer has been ${newStatus}.`,
    });
  };

  const totalCustomers = customers.length;
  const activeCustomers = customers.filter(c => c.status === "active").length;
  const totalRevenue = customers.reduce((sum, c) => sum + c.totalSpent, 0);
  const averageLifetimeValue = totalRevenue / totalCustomers;

  return (
    <div>
      <div className="flex justify-between mb-6">
        <h2 className="text-2xl font-bold">Customer Management</h2>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCustomers}</div>
            <p className="text-xs text-muted-foreground">
              {activeCustomers} active
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalRevenue)}</div>
            <p className="text-xs text-muted-foreground">
              From all customers
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Lifetime Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(averageLifetimeValue)}</div>
            <p className="text-xs text-muted-foreground">
              Per customer
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New This Month</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">34</div>
            <p className="text-xs text-muted-foreground">
              +12% vs last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search customers..."
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
            All
          </Button>
          <Button 
            variant={statusFilter === "active" ? "default" : "outline"}
            onClick={() => setStatusFilter("active")}
          >
            Active
          </Button>
          <Button 
            variant={statusFilter === "suspended" ? "default" : "outline"}
            onClick={() => setStatusFilter("suspended")}
          >
            Suspended
          </Button>
          <Button 
            variant={statusFilter === "blocked" ? "default" : "outline"}
            onClick={() => setStatusFilter("blocked")}
          >
            Blocked
          </Button>
        </div>
      </div>

      <Table>
        <TableCaption>List of all customers</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Customer</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Join Date</TableHead>
            <TableHead>Orders</TableHead>
            <TableHead>Total Spent</TableHead>
            <TableHead>Avg Order Value</TableHead>
            <TableHead>Last Order</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredCustomers.map((customer) => (
            <TableRow key={customer.id}>
              <TableCell>
                <div>
                  <div className="font-medium">{customer.name}</div>
                  <div className="text-sm text-muted-foreground">{customer.email}</div>
                </div>
              </TableCell>
              <TableCell>
                <Badge
                  variant={
                    customer.status === "active"
                      ? "default"
                      : customer.status === "suspended"
                      ? "outline"
                      : "destructive"
                  }
                >
                  {customer.status}
                </Badge>
              </TableCell>
              <TableCell>{new Date(customer.joinDate).toLocaleDateString()}</TableCell>
              <TableCell>{customer.totalOrders}</TableCell>
              <TableCell>{formatCurrency(customer.totalSpent)}</TableCell>
              <TableCell>{formatCurrency(customer.averageOrderValue)}</TableCell>
              <TableCell>{new Date(customer.lastOrderDate).toLocaleDateString()}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                  {customer.status === "active" && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleUpdateStatus(customer.id, "suspended")}
                    >
                      <Ban className="h-4 w-4" />
                    </Button>
                  )}
                  {customer.status === "suspended" && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleUpdateStatus(customer.id, "active")}
                    >
                      <CheckCircle className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default AdminCustomers;
