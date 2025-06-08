
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Package, 
  Search, 
  AlertTriangle, 
  Plus,
  Minus,
  RotateCcw,
  Download,
  Upload
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const VendorInventory = () => {
  const [searchTerm, setSearchTerm] = useState("");

  // Mock inventory data
  const inventory = [
    {
      id: "1",
      name: "Wireless Bluetooth Earbuds",
      sku: "WBE-001",
      currentStock: 45,
      lowStockThreshold: 10,
      status: "in_stock",
      lastUpdated: "2024-01-15"
    },
    {
      id: "2", 
      name: "Smart Fitness Watch",
      sku: "SFW-002",
      currentStock: 8,
      lowStockThreshold: 15,
      status: "low_stock",
      lastUpdated: "2024-01-14"
    },
    {
      id: "3",
      name: "Organic Cotton T-Shirt", 
      sku: "OCT-003",
      currentStock: 0,
      lowStockThreshold: 5,
      status: "out_of_stock",
      lastUpdated: "2024-01-13"
    },
    {
      id: "4",
      name: "Laptop Stand",
      sku: "LS-004", 
      currentStock: 23,
      lowStockThreshold: 10,
      status: "in_stock",
      lastUpdated: "2024-01-12"
    }
  ];

  const filteredInventory = inventory.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string, stock: number, threshold: number) => {
    if (stock === 0) {
      return <Badge variant="destructive">Out of Stock</Badge>;
    } else if (stock <= threshold) {
      return <Badge variant="outline" className="border-orange-500 text-orange-600">Low Stock</Badge>;
    } else {
      return <Badge variant="default">In Stock</Badge>;
    }
  };

  const lowStockCount = inventory.filter(item => item.currentStock <= item.lowStockThreshold && item.currentStock > 0).length;
  const outOfStockCount = inventory.filter(item => item.currentStock === 0).length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Inventory Management</h2>
          <p className="text-muted-foreground">
            Monitor and manage your product inventory levels.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Upload className="h-4 w-4 mr-2" />
            Bulk Import
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Inventory Summary */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inventory.length}</div>
            <p className="text-xs text-muted-foreground">
              Products in inventory
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{lowStockCount}</div>
            <p className="text-xs text-muted-foreground">
              Products need restocking
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{outOfStockCount}</div>
            <p className="text-xs text-muted-foreground">
              Products unavailable
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products by name or SKU..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Inventory Table */}
      <Card>
        <CardHeader>
          <CardTitle>Product Inventory</CardTitle>
          <CardDescription>
            Current stock levels and alerts for all products
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Current Stock</TableHead>
                <TableHead>Threshold</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInventory.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>{item.sku}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className={`font-medium ${
                        item.currentStock === 0 ? 'text-red-600' :
                        item.currentStock <= item.lowStockThreshold ? 'text-orange-600' :
                        'text-green-600'
                      }`}>
                        {item.currentStock}
                      </span>
                      <span className="text-muted-foreground">units</span>
                    </div>
                  </TableCell>
                  <TableCell>{item.lowStockThreshold}</TableCell>
                  <TableCell>
                    {getStatusBadge(item.status, item.currentStock, item.lowStockThreshold)}
                  </TableCell>
                  <TableCell className="text-muted-foreground">{item.lastUpdated}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button variant="outline" size="sm">
                        <Minus className="h-3 w-3" />
                      </Button>
                      <Input 
                        type="number" 
                        value={item.currentStock}
                        className="w-16 h-8 text-center"
                        min="0"
                      />
                      <Button variant="outline" size="sm">
                        <Plus className="h-3 w-3" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <RotateCcw className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Bulk Actions</CardTitle>
          <CardDescription>
            Perform actions on multiple products at once
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <h4 className="font-medium">Auto-Restock Settings</h4>
              <p className="text-sm text-muted-foreground">
                Automatically reorder when stock falls below threshold
              </p>
              <Button variant="outline" size="sm">
                Configure Auto-Restock
              </Button>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Stock Alerts</h4>
              <p className="text-sm text-muted-foreground">
                Get notified when products are running low
              </p>
              <Button variant="outline" size="sm">
                Notification Settings
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VendorInventory;
