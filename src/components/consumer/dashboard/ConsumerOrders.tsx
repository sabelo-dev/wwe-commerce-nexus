import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Package, Eye, RotateCcw, X } from "lucide-react";

const ConsumerOrders: React.FC = () => {
  // Mock data - replace with actual API calls
  const orders = [
    {
      id: "ORD-001",
      date: "2024-01-15",
      status: "delivered",
      total: 1299.99,
      items: 3,
      vendor: "TechStore",
      trackingNumber: "TN123456789",
      products: [
        { name: "Wireless Headphones", quantity: 1, price: 899.99 },
        { name: "Phone Case", quantity: 2, price: 200.00 }
      ]
    },
    {
      id: "ORD-002",
      date: "2024-01-10",
      status: "processing",
      total: 599.50,
      items: 1,
      vendor: "FashionHub",
      trackingNumber: null,
      products: [
        { name: "Cotton T-Shirt", quantity: 1, price: 599.50 }
      ]
    },
    {
      id: "ORD-003",
      date: "2024-01-05",
      status: "shipped",
      total: 1499.00,
      items: 2,
      vendor: "HomeGoods",
      trackingNumber: "TN987654321",
      products: [
        { name: "Kitchen Blender", quantity: 1, price: 999.00 },
        { name: "Cutting Board", quantity: 1, price: 500.00 }
      ]
    }
  ];

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: "secondary",
      processing: "default",
      shipped: "outline",
      delivered: "default",
      cancelled: "destructive",
      returned: "secondary"
    } as const;

    return (
      <Badge variant={variants[status as keyof typeof variants] || "secondary"}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const canCancel = (status: string) => ['pending', 'processing'].includes(status);
  const canReturn = (status: string) => status === 'delivered';
  const canReorder = (status: string) => ['delivered', 'cancelled'].includes(status);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          <span className="text-lg font-medium">Order Management</span>
        </div>
        <div className="text-sm text-muted-foreground">
          {orders.length} total orders
        </div>
      </div>

      <div className="grid gap-4">
        {orders.map((order) => (
          <Card key={order.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Order {order.id}</CardTitle>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                    <span>{order.date}</span>
                    <span>•</span>
                    <span>{order.vendor}</span>
                    <span>•</span>
                    <span>{order.items} item(s)</span>
                  </div>
                </div>
                <div className="text-right">
                  {getStatusBadge(order.status)}
                  <div className="text-lg font-semibold mt-1">
                    R{order.total.toFixed(2)}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Order Items */}
                <div className="space-y-2">
                  {order.products.map((product, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span>{product.name} × {product.quantity}</span>
                      <span>R{product.price.toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                {/* Tracking Number */}
                {order.trackingNumber && (
                  <div className="p-3 bg-muted rounded-lg">
                    <div className="text-sm font-medium">Tracking Number</div>
                    <div className="text-sm text-muted-foreground">{order.trackingNumber}</div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2 pt-2 border-t">
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-1" />
                    View Details
                  </Button>
                  
                  {canReorder(order.status) && (
                    <Button variant="outline" size="sm">
                      <RotateCcw className="h-4 w-4 mr-1" />
                      Reorder
                    </Button>
                  )}
                  
                  {canReturn(order.status) && (
                    <Button variant="outline" size="sm">
                      <RotateCcw className="h-4 w-4 mr-1" />
                      Return
                    </Button>
                  )}
                  
                  {canCancel(order.status) && (
                    <Button variant="destructive" size="sm">
                      <X className="h-4 w-4 mr-1" />
                      Cancel
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ConsumerOrders;