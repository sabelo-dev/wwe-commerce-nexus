
import React, { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
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

const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const { toast } = useToast();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data: ordersData, error } = await supabase
          .from('orders')
          .select(`
            *,
            order_items(quantity)
          `)
          .order('created_at', { ascending: false });

        if (error) throw error;

        // Get user profiles for customer names
        const userIds = ordersData?.map(order => order.user_id) || [];
        const { data: profiles } = await supabase
          .from('profiles')
          .select('id, name')
          .in('id', userIds);

        const profileMap = new Map(profiles?.map(p => [p.id, p.name]) || []);

        const formattedOrders: Order[] = ordersData?.map(order => ({
          id: order.id.slice(0, 8),
          customerName: profileMap.get(order.user_id) || 'Unknown Customer',
          date: new Date(order.created_at).toISOString().split('T')[0],
          status: order.status as any,
          total: parseFloat(order.total?.toString() || '0'),
          items: order.order_items?.reduce((sum: number, item: any) => sum + item.quantity, 0) || 0
        })) || [];

        setOrders(formattedOrders);
      } catch (error) {
        console.error('Error fetching orders:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load orders."
        });
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [toast]);

  const filteredOrders = statusFilter === "all" 
    ? orders 
    : orders.filter(order => order.status === statusFilter);

  const handleUpdateOrderStatus = async (orderId: string, newStatus: Order["status"]) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId);

      if (error) throw error;

      setOrders(
        orders.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );

      toast({
        title: "Order status updated",
        description: `Order ${orderId} has been updated to ${newStatus}.`,
      });
    } catch (error) {
      console.error('Error updating order:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update order status."
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">Loading orders...</div>
      </div>
    );
  }

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
