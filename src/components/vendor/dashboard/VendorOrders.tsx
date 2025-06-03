
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  const [searchTerm, setSearchTerm] = useState("");

  // Mock orders data
  const orders = [
    {
      id: "ORD-001",
      customer: "John Doe",
      email: "john@example.com",
      products: [
        { name: "Wireless Earbuds", quantity: 1, price: 129.99 }
      ],
      total: 129.99,
      status: "pending",
      date: "2024-01-15",
      shippingAddress: "123 Main St, City, State 12345"
    },
    {
      id: "ORD-002",
      customer: "Jane Smith",
      email: "jane@example.com",
      products: [
        { name: "Smart Watch", quantity: 1, price: 249.99 }
      ],
      total: 249.99,
      status: "processing",
      date: "2024-01-14",
      shippingAddress: "456 Oak Ave, City, State 67890"
    },
    {
      id: "ORD-003",
      customer: "Mike Johnson",
      email: "mike@example.com",
      products: [
        { name: "Laptop Stand", quantity: 2, price: 79.99 }
      ],
      total: 159.98,
      status: "shipped",
      date: "2024-01-13",
      shippingAddress: "789 Pine St, City, State 11111"
    },
    {
      id: "ORD-004",
      customer: "Sarah Wilson",
      email: "sarah@example.com",
      products: [
        { name: "Organic T-Shirt", quantity: 3, price: 24.99 }
      ],
      total: 74.97,
      status: "delivered",
      date: "2024-01-12",
      shippingAddress: "321 Elm Dr, City, State 22222"
    }
  ];

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
                        <DropdownMenuItem>Update Status</DropdownMenuItem>
                        <DropdownMenuItem>Print Label</DropdownMenuItem>
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
                    <p className="text-sm text-muted-foreground">{order.shippingAddress}</p>
                  </div>
                </div>

                <div className="mt-4">
                  <h4 className="font-medium mb-2">Products</h4>
                  <div className="space-y-2">
                    {order.products.map((product, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span>{product.name} × {product.quantity}</span>
                        <span>${(product.price * product.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between font-medium mt-2 pt-2 border-t">
                    <span>Total</span>
                    <span>${order.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VendorOrders;
