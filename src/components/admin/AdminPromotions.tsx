
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency } from "@/lib/utils";
import { 
  Percent, 
  Tag, 
  Mail, 
  TrendingUp, 
  Calendar,
  Users,
  Plus,
  Edit,
  Trash2
} from "lucide-react";

interface Discount {
  id: string;
  code: string;
  type: "percentage" | "fixed";
  value: number;
  description: string;
  usageLimit?: number;
  usageCount: number;
  startDate: string;
  endDate: string;
  status: "active" | "inactive" | "expired";
  scope: "global" | "vendor_specific";
  vendorId?: string;
}

interface Campaign {
  id: string;
  name: string;
  type: "flash_sale" | "promotion" | "boost";
  status: "active" | "scheduled" | "ended";
  startDate: string;
  endDate: string;
  participants: number;
  views: number;
  conversions: number;
}

interface EmailCampaign {
  id: string;
  name: string;
  subject: string;
  recipients: number;
  sent: number;
  opened: number;
  clicked: number;
  status: "draft" | "sending" | "sent";
  scheduledDate?: string;
}

// Mock data
const mockDiscounts: Discount[] = [
  {
    id: "d1",
    code: "SUMMER20",
    type: "percentage",
    value: 20,
    description: "Summer sale discount",
    usageLimit: 1000,
    usageCount: 156,
    startDate: "2023-06-01",
    endDate: "2023-08-31",
    status: "active",
    scope: "global",
  },
  {
    id: "d2",
    code: "WELCOME10",
    type: "fixed",
    value: 10,
    description: "Welcome discount for new customers",
    usageCount: 89,
    startDate: "2023-01-01",
    endDate: "2023-12-31",
    status: "active",
    scope: "global",
  },
];

const mockCampaigns: Campaign[] = [
  {
    id: "c1",
    name: "Summer Flash Sale",
    type: "flash_sale",
    status: "active",
    startDate: "2023-06-20",
    endDate: "2023-06-25",
    participants: 25,
    views: 5420,
    conversions: 234,
  },
  {
    id: "c2",
    name: "Featured Vendor Boost",
    type: "boost",
    status: "scheduled",
    startDate: "2023-06-25",
    endDate: "2023-07-01",
    participants: 5,
    views: 0,
    conversions: 0,
  },
];

const mockEmailCampaigns: EmailCampaign[] = [
  {
    id: "e1",
    name: "Summer Sale Announcement",
    subject: "🔥 Summer Sale: Up to 50% Off!",
    recipients: 15000,
    sent: 15000,
    opened: 4500,
    clicked: 890,
    status: "sent",
  },
  {
    id: "e2",
    name: "New Arrivals Newsletter",
    subject: "Check out our latest products",
    recipients: 12000,
    sent: 0,
    opened: 0,
    clicked: 0,
    status: "draft",
    scheduledDate: "2023-06-25",
  },
];

const AdminPromotions: React.FC = () => {
  const [discounts] = useState<Discount[]>(mockDiscounts);
  const [campaigns] = useState<Campaign[]>(mockCampaigns);
  const [emailCampaigns] = useState<EmailCampaign[]>(mockEmailCampaigns);

  const getDiscountStatusColor = (status: string) => {
    switch (status) {
      case "active": return "default";
      case "inactive": return "outline";
      case "expired": return "destructive";
      default: return "default";
    }
  };

  const getCampaignStatusColor = (status: string) => {
    switch (status) {
      case "active": return "default";
      case "scheduled": return "outline";
      case "ended": return "destructive";
      default: return "default";
    }
  };

  return (
    <div>
      <div className="flex justify-between mb-6">
        <h2 className="text-2xl font-bold">Promotions & Marketing</h2>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Campaign
        </Button>
      </div>

      {/* Marketing Overview */}
      <div className="grid gap-4 md:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Discounts</CardTitle>
            <Tag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{discounts.filter(d => d.status === "active").length}</div>
            <p className="text-xs text-muted-foreground">
              {discounts.reduce((sum, d) => sum + d.usageCount, 0)} total uses
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Campaigns</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{campaigns.filter(c => c.status === "active").length}</div>
            <p className="text-xs text-muted-foreground">
              {campaigns.reduce((sum, c) => sum + c.views, 0).toLocaleString()} total views
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Email Campaigns</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{emailCampaigns.filter(e => e.status === "sent").length}</div>
            <p className="text-xs text-muted-foreground">
              {emailCampaigns.reduce((sum, e) => sum + e.sent, 0).toLocaleString()} emails sent
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <Percent className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.3%</div>
            <p className="text-xs text-muted-foreground">
              +0.5% vs last month
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="discounts" className="space-y-6">
        <TabsList>
          <TabsTrigger value="discounts">Discount Codes</TabsTrigger>
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="emails">Email Marketing</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="discounts">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Discount Codes</CardTitle>
                  <CardDescription>Create and manage discount codes</CardDescription>
                </div>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  New Discount
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableCaption>Discount codes and promotional offers</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Code</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead>Usage</TableHead>
                    <TableHead>Valid Period</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {discounts.map((discount) => (
                    <TableRow key={discount.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{discount.code}</div>
                          <div className="text-sm text-muted-foreground">{discount.description}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {discount.type === "percentage" ? "%" : "R"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {discount.type === "percentage" 
                          ? `${discount.value}%` 
                          : formatCurrency(discount.value)
                        }
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {discount.usageCount}
                          {discount.usageLimit && ` / ${discount.usageLimit}`}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{new Date(discount.startDate).toLocaleDateString()}</div>
                          <div className="text-muted-foreground">
                            to {new Date(discount.endDate).toLocaleDateString()}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getDiscountStatusColor(discount.status)}>
                          {discount.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="campaigns">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Marketing Campaigns</CardTitle>
                  <CardDescription>Manage flash sales and promotional campaigns</CardDescription>
                </div>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  New Campaign
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableCaption>Marketing campaigns and promotions</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Campaign</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Participants</TableHead>
                    <TableHead>Performance</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {campaigns.map((campaign) => (
                    <TableRow key={campaign.id}>
                      <TableCell className="font-medium">{campaign.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {campaign.type.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{new Date(campaign.startDate).toLocaleDateString()}</div>
                          <div className="text-muted-foreground">
                            to {new Date(campaign.endDate).toLocaleDateString()}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{campaign.participants}</TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{campaign.views.toLocaleString()} views</div>
                          <div className="text-muted-foreground">
                            {campaign.conversions} conversions
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getCampaignStatusColor(campaign.status)}>
                          {campaign.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="emails">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Email Campaigns</CardTitle>
                  <CardDescription>Send promotional emails to customer segments</CardDescription>
                </div>
                <Button>
                  <Mail className="h-4 w-4 mr-2" />
                  New Email Campaign
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableCaption>Email marketing campaigns</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Campaign</TableHead>
                    <TableHead>Recipients</TableHead>
                    <TableHead>Delivery</TableHead>
                    <TableHead>Open Rate</TableHead>
                    <TableHead>Click Rate</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {emailCampaigns.map((campaign) => (
                    <TableRow key={campaign.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{campaign.name}</div>
                          <div className="text-sm text-muted-foreground">{campaign.subject}</div>
                        </div>
                      </TableCell>
                      <TableCell>{campaign.recipients.toLocaleString()}</TableCell>
                      <TableCell>
                        {campaign.sent > 0 
                          ? `${campaign.sent.toLocaleString()} sent` 
                          : campaign.scheduledDate 
                          ? `Scheduled: ${new Date(campaign.scheduledDate).toLocaleDateString()}`
                          : "Not scheduled"
                        }
                      </TableCell>
                      <TableCell>
                        {campaign.sent > 0 
                          ? `${((campaign.opened / campaign.sent) * 100).toFixed(1)}%`
                          : "-"
                        }
                      </TableCell>
                      <TableCell>
                        {campaign.sent > 0 
                          ? `${((campaign.clicked / campaign.sent) * 100).toFixed(1)}%`
                          : "-"
                        }
                      </TableCell>
                      <TableCell>
                        <Badge variant={campaign.status === "sent" ? "default" : "outline"}>
                          {campaign.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          {campaign.status === "draft" && (
                            <Button size="sm">Send</Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Campaign Performance</CardTitle>
                <CardDescription>Overall marketing effectiveness</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Total Campaign Views</span>
                  <span className="font-medium">
                    {campaigns.reduce((sum, c) => sum + c.views, 0).toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Total Conversions</span>
                  <span className="font-medium">
                    {campaigns.reduce((sum, c) => sum + c.conversions, 0).toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Average Conversion Rate</span>
                  <span className="font-medium">4.3%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">ROI</span>
                  <span className="font-medium">+245%</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Email Performance</CardTitle>
                <CardDescription>Email marketing metrics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Total Emails Sent</span>
                  <span className="font-medium">
                    {emailCampaigns.reduce((sum, e) => sum + e.sent, 0).toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Average Open Rate</span>
                  <span className="font-medium">30%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Average Click Rate</span>
                  <span className="font-medium">5.9%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Unsubscribe Rate</span>
                  <span className="font-medium">0.5%</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminPromotions;
