
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  Search, 
  MoreHorizontal, 
  Package, 
  Truck, 
  CheckCircle,
  Clock
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const VendorOrders = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, [user?.id]);

  const fetchOrders = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      
      // Get vendor data first
      const { data: vendor, error: vendorError } = await supabase
        .from('vendors')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (vendorError) throw vendorError;

      // Get stores for this vendor
      const { data: stores, error: storesError } = await supabase
        .from('stores')
        .select('id')
        .eq('vendor_id', vendor.id);

      if (storesError) throw storesError;

      if (stores.length === 0) {
        setOrders([]);
        return;
      }

      const storeIds = stores.map(store => store.id);

      // Get order items from vendor's stores with order details
      const { data, error } = await supabase
        .from('order_items')
        .select(`
          *,
          orders(*),
          products(name)
        `)
        .in('store_id', storeIds)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Group order items by order
      const groupedOrders = data?.reduce((acc: any, item: any) => {
        const orderId = item.order_id;
        if (!acc[orderId]) {
          acc[orderId] = {
            id: item.orders.id,
            customer: 'Customer', // Would need profile lookup
            email: 'customer@example.com', // Would need profile lookup
            products: [],
            total: 0,
            status: item.vendor_status,
            date: new Date(item.created_at).toLocaleDateString(),
            shippingAddress: item.orders.shipping_address || {},
            trackingNumber: item.orders.tracking_number
          };
        }
        acc[orderId].products.push({
          name: item.products?.name || 'Product',
          quantity: item.quantity,
          price: parseFloat(item.price?.toString() || '0')
        });
        acc[orderId].total += parseFloat(item.price?.toString() || '0') * item.quantity;
        return acc;
      }, {}) || {};

      setOrders(Object.values(groupedOrders));
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch orders",
      });
    } finally {
      setLoading(false);
    }
  };

  const generateTrackingNumber = () => {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `WWE-TRK-${timestamp}-${random}`;
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      // Generate tracking number if shipping
      let trackingNumber = null;
      if (newStatus === 'shipped') {
        trackingNumber = generateTrackingNumber();
        
        // Update the orders table with tracking number
        const { error: orderError } = await supabase
          .from('orders')
          .update({ 
            tracking_number: trackingNumber,
            status: 'shipped'
          })
          .eq('id', orderId);

        if (orderError) throw orderError;
      }

      // Update order items vendor status
      const { error } = await supabase
        .from('order_items')
        .update({ vendor_status: newStatus })
        .eq('order_id', orderId);

      if (error) throw error;

      // Update local state
      setOrders(orders.map(order => 
        order.id === orderId 
          ? { ...order, status: newStatus, trackingNumber: trackingNumber || order.trackingNumber } 
          : order
      ));

      toast({
        title: "Order Updated",
        description: newStatus === 'shipped' 
          ? `Order marked as shipped. Tracking number: ${trackingNumber}`
          : "Order status has been updated successfully.",
      });
    } catch (error) {
      console.error('Error updating order:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update order status",
      });
    }
  };

  const filteredOrders = orders.filter(order =>
    order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.customer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />;
      case "processing":
        return <Package className="h-4 w-4" />;
      case "shipped":
        return <Truck className="h-4 w-4" />;
      case "delivered":
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "outline";
      case "processing":
        return "default";
      case "shipped":
        return "secondary";
      case "delivered":
        return "default";
      default:
        return "outline";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Orders</h2>
        <p className="text-muted-foreground">
          Manage and track your customer orders.
        </p>
      </div>

      {/* Search */}
      <Card>
        <CardHeader>
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search orders by ID or customer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
        </CardHeader>
      </Card>

      {/* Orders List */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Orders ({filteredOrders.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading orders...</div>
          ) : filteredOrders.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No orders found.
            </div>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map((order) => (
              <div key={order.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div>
                      <h3 className="font-medium">{order.id}</h3>
                      <p className="text-sm text-muted-foreground">{order.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={getStatusColor(order.status)}>
                      {getStatusIcon(order.status)}
                      <span className="ml-1 capitalize">{order.status}</span>
                    </Badge>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                       <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {order.status === 'pending' && (
                          <DropdownMenuItem onClick={() => updateOrderStatus(order.id, 'confirmed')}>
                            Mark as Confirmed
                          </DropdownMenuItem>
                        )}
                        {(order.status === 'pending' || order.status === 'confirmed') && (
                          <DropdownMenuItem onClick={() => updateOrderStatus(order.id, 'shipped')}>
                            Mark as Shipped (Generate Tracking)
                          </DropdownMenuItem>
                        )}
                        {order.status === 'shipped' && (
                          <DropdownMenuItem onClick={() => updateOrderStatus(order.id, 'delivered')}>
                            Mark as Delivered
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Contact Customer</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">Customer</h4>
                    <p className="text-sm">{order.customer}</p>
                    <p className="text-sm text-muted-foreground">{order.email}</p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Shipping Address</h4>
                    <p className="text-sm text-muted-foreground">
                      {typeof order.shippingAddress === 'string' 
                        ? order.shippingAddress 
                        : `${order.shippingAddress?.street || ''} ${order.shippingAddress?.city || ''} ${order.shippingAddress?.state || ''} ${order.shippingAddress?.zipCode || ''}`}
                    </p>
                  </div>
                </div>

                <div className="mt-4">
                  <h4 className="font-medium mb-2">Products</h4>
                  <div className="space-y-2">
                    {order.products.map((product, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span>{product.name} × {product.quantity}</span>
                        <span>R{(product.price * product.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between font-medium mt-2 pt-2 border-t">
                    <span>Total</span>
                    <span>R{order.total.toFixed(2)}</span>
                  </div>
                  
                  {order.trackingNumber && (
                    <div className="mt-4 p-3 bg-muted rounded-lg">
                      <h4 className="font-medium text-sm mb-1">Tracking Number</h4>
                      <p className="text-sm font-mono">{order.trackingNumber}</p>
                    </div>
                  )}
                </div>
              </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default VendorOrders;
