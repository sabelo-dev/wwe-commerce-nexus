import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
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

interface Promotion {
  id: string;
  name: string;
  type: string;
  value: number;
  code: string;
  status: string;
  startDate: string;
  endDate: string;
  usageCount: number;
  usageLimit?: number;
  minOrderValue: number;
  products: string[];
  revenue: number;
}

const VendorPromotions = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    type: 'percentage',
    value: 0,
    minOrderValue: 0,
    usageLimit: '',
    description: ''
  });

  useEffect(() => {
    fetchPromotions();
  }, [user?.id]);

  const fetchPromotions = async () => {
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

      // For now, create simulated promotions
      // In a real app, you'd have a promotions table
      const mockPromotions: Promotion[] = [
        {
          id: "PROMO-001",
          name: "Welcome Discount",
          type: "percentage",
          value: 15,
          code: "WELCOME15",
          status: "active",
          startDate: new Date().toISOString().split('T')[0],
          endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          usageCount: 25,
          usageLimit: 100,
          minOrderValue: 25,
          products: ["All Products"],
          revenue: 375.50
        },
        {
          id: "PROMO-002",
          name: "Free Shipping",
          type: "fixed",
          value: 10,
          code: "FREESHIP",
          status: "active",
          startDate: new Date().toISOString().split('T')[0],
          endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          usageCount: 42,
          usageLimit: 200,
          minOrderValue: 50,
          products: ["Electronics"],
          revenue: 420.00
        }
      ];

      setPromotions(mockPromotions);
    } catch (error) {
      console.error('Error fetching promotions:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch promotions",
      });
    } finally {
      setLoading(false);
    }
  };

  const createPromotion = async () => {
    if (!user?.id || !formData.name || !formData.code || !startDate || !endDate) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please fill in all required fields",
      });
      return;
    }

    try {
      const newPromotion: Promotion = {
        id: `PROMO-${Date.now()}`,
        name: formData.name,
        type: formData.type,
        value: formData.value,
        code: formData.code,
        status: 'active',
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0],
        usageCount: 0,
        usageLimit: formData.usageLimit ? parseInt(formData.usageLimit) : undefined,
        minOrderValue: formData.minOrderValue,
        products: ["All Products"],
        revenue: 0
      };

      // In a real app, you'd save to database here
      setPromotions([...promotions, newPromotion]);
      
      toast({
        title: "Promotion Created",
        description: "Your promotion has been created successfully.",
      });

      setIsDialogOpen(false);
      setFormData({
        name: '',
        code: '',
        type: 'percentage',
        value: 0,
        minOrderValue: 0,
        usageLimit: '',
        description: ''
      });
      setStartDate(undefined);
      setEndDate(undefined);
    } catch (error) {
      console.error('Error creating promotion:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create promotion",
      });
    }
  };

  const deletePromotion = async (promotionId: string) => {
    try {
      // In a real app, you'd delete from database here
      setPromotions(promotions.filter(p => p.id !== promotionId));
      
      toast({
        title: "Promotion Deleted",
        description: "Promotion has been deleted successfully.",
      });
    } catch (error) {
      console.error('Error deleting promotion:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete promotion",
      });
    }
  };

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

  if (loading) {
    return <div className="text-center py-8">Loading promotions...</div>;
  }

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
                  <Input 
                    id="promo-name" 
                    placeholder="e.g., Black Friday Sale"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="promo-code">Promo Code</Label>
                  <Input 
                    id="promo-code" 
                    placeholder="e.g., BLACKFRIDAY25"
                    value={formData.code}
                    onChange={(e) => setFormData({...formData, code: e.target.value})}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="discount-type">Discount Type</Label>
                  <Select 
                    value={formData.type}
                    onValueChange={(value) => setFormData({...formData, type: value})}
                  >
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
                  <Input 
                    id="discount-value" 
                    type="number" 
                    placeholder="25"
                    value={formData.value}
                    onChange={(e) => setFormData({...formData, value: parseFloat(e.target.value) || 0})}
                  />
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
                  <Input 
                    id="min-order" 
                    type="number" 
                    placeholder="50"
                    value={formData.minOrderValue}
                    onChange={(e) => setFormData({...formData, minOrderValue: parseFloat(e.target.value) || 0})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="usage-limit">Usage Limit (Optional)</Label>
                  <Input 
                    id="usage-limit" 
                    type="number" 
                    placeholder="1000"
                    value={formData.usageLimit}
                    onChange={(e) => setFormData({...formData, usageLimit: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" 
                  placeholder="Describe your promotion..."
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={createPromotion}>
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
          {filteredPromotions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No promotions found. Create your first promotion to get started.
            </div>
          ) : (
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
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => deletePromotion(promo.id)}
                      >
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
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default VendorPromotions;