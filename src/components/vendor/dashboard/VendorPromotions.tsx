import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Copy,
  Calendar as CalendarIcon,
  Percent,
  DollarSign,
  Gift,
  TrendingUp,
  Users
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const VendorPromotions = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();

  // Mock promotions data
  const promotions = [
    {
      id: "PROMO-001",
      name: "Black Friday Sale",
      type: "percentage",
      value: 25,
      code: "BLACKFRIDAY25",
      status: "active",
      startDate: "2024-11-01",
      endDate: "2024-11-30",
      usageCount: 156,
      usageLimit: 1000,
      minOrderValue: 50,
      products: ["All Products"],
      revenue: 4587.50
    },
    {
      id: "PROMO-002",
      name: "New Customer Discount",
      type: "fixed",
      value: 10,
      code: "WELCOME10",
      status: "active",
      startDate: "2024-01-01",
      endDate: "2024-12-31",
      usageCount: 89,
      usageLimit: null,
      minOrderValue: 25,
      products: ["Electronics"],
      revenue: 890.00
    },
    {
      id: "PROMO-003",
      name: "Buy 2 Get 1 Free",
      type: "bogo",
      value: 100,
      code: "BOGO2024",
      status: "scheduled",
      startDate: "2024-02-01",
      endDate: "2024-02-14",
      usageCount: 0,
      usageLimit: 500,
      minOrderValue: 0,
      products: ["Clothing"],
      revenue: 0
    }
  ];

  const filteredPromotions = promotions.filter(promo =>
    promo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    promo.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "default";
      case "scheduled": return "secondary";
      case "expired": return "outline";
      case "paused": return "destructive";
      default: return "outline";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "percentage": return <Percent className="h-4 w-4" />;
      case "fixed": return <DollarSign className="h-4 w-4" />;
      case "bogo": return <Gift className="h-4 w-4" />;
      default: return <Gift className="h-4 w-4" />;
    }
  };

  const formatValue = (type: string, value: number) => {
    switch (type) {
      case "percentage": return `${value}%`;
      case "fixed": return `$${value}`;
      case "bogo": return "Buy 2 Get 1";
      default: return value;
    }
  };

  const totalActivePromotions = promotions.filter(p => p.status === 'active').length;
  const totalRevenue = promotions.reduce((sum, p) => sum + p.revenue, 0);
  const totalUsage = promotions.reduce((sum, p) => sum + p.usageCount, 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Promotions & Pricing</h2>
          <p className="text-muted-foreground">
            Create and manage discount codes, sales, and promotional campaigns.
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Promotion
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Promotion</DialogTitle>
              <DialogDescription>
                Set up a new promotional campaign or discount code.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="promo-name">Promotion Name</Label>
                  <Input id="promo-name" placeholder="e.g., Black Friday Sale" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="promo-code">Promo Code</Label>
                  <Input id="promo-code" placeholder="e.g., BLACKFRIDAY25" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="discount-type">Discount Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">Percentage Off</SelectItem>
                      <SelectItem value="fixed">Fixed Amount</SelectItem>
                      <SelectItem value="bogo">Buy One Get One</SelectItem>
                      <SelectItem value="bundle">Bundle Deal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="discount-value">Discount Value</Label>
                  <Input id="discount-value" type="number" placeholder="25" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Start Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {startDate ? format(startDate, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={startDate}
                        onSelect={setStartDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <Label>End Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {endDate ? format(endDate, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={endDate}
                        onSelect={setEndDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="min-order">Minimum Order Value</Label>
                  <Input id="min-order" type="number" placeholder="50" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="usage-limit">Usage Limit (Optional)</Label>
                  <Input id="usage-limit" type="number" placeholder="1000" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" placeholder="Describe your promotion..." />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setIsDialogOpen(false)}>
                  Create Promotion
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Promotion Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Promotions</CardTitle>
            <Gift className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalActivePromotions}</div>
            <p className="text-xs text-muted-foreground">Currently running</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Uses</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsage.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue from Promos</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <TrendingUp className="h-3 w-3 mr-1" />
              +12% vs last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <Percent className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">18.5%</div>
            <p className="text-xs text-muted-foreground">Promo to purchase</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardHeader>
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search promotions by name or code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
        </CardHeader>
      </Card>

      {/* Promotions List */}
      <Card>
        <CardHeader>
          <CardTitle>Your Promotions ({filteredPromotions.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredPromotions.map((promo) => (
              <div key={promo.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {getTypeIcon(promo.type)}
                    <div>
                      <h3 className="font-medium">{promo.name}</h3>
                      <p className="text-sm text-muted-foreground">Code: {promo.code}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={getStatusColor(promo.status)}>
                      {promo.status}
                    </Badge>
                    <Button variant="ghost" size="sm">
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="grid md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Discount</p>
                    <p className="font-medium">{formatValue(promo.type, promo.value)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Duration</p>
                    <p className="font-medium">{promo.startDate} - {promo.endDate}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Usage</p>
                    <p className="font-medium">
                      {promo.usageCount}{promo.usageLimit ? ` / ${promo.usageLimit}` : ''}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Revenue</p>
                    <p className="font-medium">${promo.revenue.toFixed(2)}</p>
                  </div>
                </div>

                {promo.minOrderValue > 0 && (
                  <div className="mt-3 text-sm text-muted-foreground">
                    Minimum order value: ${promo.minOrderValue}
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Dynamic Pricing Suggestions */}
      <Card>
        <CardHeader>
          <CardTitle>Dynamic Pricing Suggestions</CardTitle>
          <CardDescription>
            AI-powered recommendations based on market data and performance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="border rounded-lg p-4 bg-blue-50">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Wireless Earbuds Price Optimization</h4>
                  <p className="text-sm text-muted-foreground">
                    Increase price by 8% based on competitor analysis and demand
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold">$129.99 → $140.39</p>
                  <p className="text-sm text-green-600">+$3.2K projected monthly revenue</p>
                </div>
              </div>
              <div className="flex justify-end mt-3">
                <Button size="sm">Apply Suggestion</Button>
              </div>
            </div>

            <div className="border rounded-lg p-4 bg-orange-50">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Smart Watch Flash Sale</h4>
                  <p className="text-sm text-muted-foreground">
                    15% discount for 48 hours to clear slow-moving inventory
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold">$249.99 → $212.49</p>
                  <p className="text-sm text-blue-600">Clear 30+ units faster</p>
                </div>
              </div>
              <div className="flex justify-end mt-3">
                <Button size="sm" variant="outline">Create Flash Sale</Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VendorPromotions;