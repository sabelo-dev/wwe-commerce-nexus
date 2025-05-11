
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
import { formatCurrency } from "@/lib/utils";

interface Order {
  id: string;
  customerName: string;
  date: string;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  total: number;
  items: number;
}

// Mock data for demonstration
const mockOrders: Order[] = [
  {
    id: "ORD-001",
    customerName: "John Smith",
    date: "2023-06-15",
    status: "delivered",
    total: 2499.99,
    items: 3,
  },
  {
    id: "ORD-002",
    customerName: "Sarah Johnson",
    date: "2023-06-18",
    status: "shipped",
    total: 899.95,
    items: 2,
  },
  {
    id: "ORD-003",
    customerName: "Michael Brown",
    date: "2023-06-20",
    status: "processing",
    total: 1299.50,
    items: 1,
  },
  {
    id: "ORD-004",
    customerName: "Emily Davis",
    date: "2023-06-21",
    status: "pending",
    total: 599.99,
    items: 4,
  },
];

const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const { toast } = useToast();

  const filteredOrders = statusFilter === "all" 
    ? orders 
    : orders.filter(order => order.status === statusFilter);

  const handleUpdateOrderStatus = (orderId: string, newStatus: Order["status"]) => {
    // In a real app, this would be an API call
    setOrders(
      orders.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );

    toast({
      title: "Order status updated",
      description: `Order ${orderId} has been updated to ${newStatus}.`,
    });
  };

  return (
    <div>
      <div className="flex justify-between mb-4">
        <h2 className="text-2xl font-bold">Order Management</h2>
      </div>

      <div className="mb-4 flex gap-2">
        <Button 
          variant={statusFilter === "all" ? "default" : "outline"}
          onClick={() => setStatusFilter("all")}
        >
          All
        </Button>
        <Button 
          variant={statusFilter === "pending" ? "default" : "outline"}
          onClick={() => setStatusFilter("pending")}
        >
          Pending
        </Button>
        <Button 
          variant={statusFilter === "processing" ? "default" : "outline"}
          onClick={() => setStatusFilter("processing")}
        >
          Processing
        </Button>
        <Button 
          variant={statusFilter === "shipped" ? "default" : "outline"}
          onClick={() => setStatusFilter("shipped")}
        >
          Shipped
        </Button>
        <Button 
          variant={statusFilter === "delivered" ? "default" : "outline"}
          onClick={() => setStatusFilter("delivered")}
        >
          Delivered
        </Button>
        <Button 
          variant={statusFilter === "cancelled" ? "default" : "outline"}
          onClick={() => setStatusFilter("cancelled")}
        >
          Cancelled
        </Button>
      </div>

      <Table>
        <TableCaption>List of all orders</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Order ID</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Items</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredOrders.map((order) => (
            <TableRow key={order.id}>
              <TableCell className="font-medium">{order.id}</TableCell>
              <TableCell>{order.customerName}</TableCell>
              <TableCell>{order.date}</TableCell>
              <TableCell>
                <Badge
                  variant={
                    order.status === "delivered"
                      ? "default"
                      : order.status === "cancelled"
                      ? "destructive"
                      : "outline"
                  }
                >
                  {order.status}
                </Badge>
              </TableCell>
              <TableCell>{formatCurrency(order.total)}</TableCell>
              <TableCell>{order.items}</TableCell>
              <TableCell className="text-right">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    // Open a dialog in a real application
                    toast({
                      title: "View Order Details",
                      description: `Viewing details for order ${order.id}`,
                    });
                  }}
                >
                  Details
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default AdminOrders;
