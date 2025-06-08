
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
  DollarSign, 
  TrendingUp, 
  Download, 
  Calendar,
  CreditCard,
  Percent
} from "lucide-react";

interface Payout {
  id: string;
  vendorName: string;
  amount: number;
  status: "pending" | "processing" | "completed" | "failed";
  scheduledDate: string;
  processedDate?: string;
  method: string;
}

interface Commission {
  id: string;
  orderId: string;
  vendorName: string;
  orderValue: number;
  commissionRate: number;
  commissionAmount: number;
  date: string;
  status: "earned" | "paid";
}

// Mock data
const mockPayouts: Payout[] = [
  {
    id: "p1",
    vendorName: "Tech Shop",
    amount: 2500.00,
    status: "pending",
    scheduledDate: "2023-06-25",
    method: "Bank Transfer",
  },
  {
    id: "p2",
    vendorName: "Fashion Boutique",
    amount: 1800.50,
    status: "completed",
    scheduledDate: "2023-06-20",
    processedDate: "2023-06-20",
    method: "PayPal",
  },
];

const mockCommissions: Commission[] = [
  {
    id: "c1",
    orderId: "ORD-001",
    vendorName: "Tech Shop",
    orderValue: 1299.99,
    commissionRate: 10,
    commissionAmount: 129.99,
    date: "2023-06-20",
    status: "earned",
  },
  {
    id: "c2",
    orderId: "ORD-002",
    vendorName: "Fashion Boutique",
    orderValue: 599.99,
    commissionRate: 10,
    commissionAmount: 59.99,
    date: "2023-06-19",
    status: "paid",
  },
];

const AdminFinancials: React.FC = () => {
  const [payouts] = useState<Payout[]>(mockPayouts);
  const [commissions] = useState<Commission[]>(mockCommissions);

  const totalRevenue = 125000.50;
  const totalCommissions = 12500.05;
  const pendingPayouts = payouts.filter(p => p.status === "pending").reduce((sum, p) => sum + p.amount, 0);
  const monthlyGrowth = 12.5;

  const getPayoutStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "default";
      case "processing": return "outline";
      case "pending": return "outline";
      case "failed": return "destructive";
      default: return "default";
    }
  };

  return (
    <div>
      <div className="flex justify-between mb-6">
        <h2 className="text-2xl font-bold">Financial Management</h2>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button>Process Payouts</Button>
        </div>
      </div>

      {/* Financial Overview */}
      <div className="grid gap-4 md:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalRevenue)}</div>
            <p className="text-xs text-muted-foreground">
              All time
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Commission Earned</CardTitle>
            <Percent className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalCommissions)}</div>
            <p className="text-xs text-muted-foreground">
              10% average rate
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Payouts</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(pendingPayouts)}</div>
            <p className="text-xs text-muted-foreground">
              Due this week
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Growth</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{monthlyGrowth}%</div>
            <p className="text-xs text-muted-foreground">
              vs last month
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="payouts" className="space-y-6">
        <TabsList>
          <TabsTrigger value="payouts">Payouts</TabsTrigger>
          <TabsTrigger value="commissions">Commissions</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="payouts">
          <Card>
            <CardHeader>
              <CardTitle>Vendor Payouts</CardTitle>
              <CardDescription>Manage and process vendor payments</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableCaption>Vendor payout schedule</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Vendor</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Scheduled Date</TableHead>
                    <TableHead>Payment Method</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payouts.map((payout) => (
                    <TableRow key={payout.id}>
                      <TableCell className="font-medium">{payout.vendorName}</TableCell>
                      <TableCell>{formatCurrency(payout.amount)}</TableCell>
                      <TableCell>
                        <Badge variant={getPayoutStatusColor(payout.status)}>
                          {payout.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{new Date(payout.scheduledDate).toLocaleDateString()}</TableCell>
                      <TableCell>{payout.method}</TableCell>
                      <TableCell className="text-right">
                        {payout.status === "pending" && (
                          <Button variant="outline" size="sm">
                            Process
                          </Button>
                        )}
                        {payout.status === "completed" && (
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="commissions">
          <Card>
            <CardHeader>
              <CardTitle>Commission Tracking</CardTitle>
              <CardDescription>Track platform commissions from vendor sales</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableCaption>Commission earnings from vendor sales</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Vendor</TableHead>
                    <TableHead>Order Value</TableHead>
                    <TableHead>Rate</TableHead>
                    <TableHead>Commission</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {commissions.map((commission) => (
                    <TableRow key={commission.id}>
                      <TableCell className="font-medium">{commission.orderId}</TableCell>
                      <TableCell>{commission.vendorName}</TableCell>
                      <TableCell>{formatCurrency(commission.orderValue)}</TableCell>
                      <TableCell>{commission.commissionRate}%</TableCell>
                      <TableCell>{formatCurrency(commission.commissionAmount)}</TableCell>
                      <TableCell>{new Date(commission.date).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Badge variant={commission.status === "paid" ? "default" : "outline"}>
                          {commission.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Financial Reports</CardTitle>
                <CardDescription>Generate and download financial statements</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded">
                  <div>
                    <h4 className="font-medium">Monthly Revenue Report</h4>
                    <p className="text-sm text-muted-foreground">Comprehensive revenue breakdown</p>
                  </div>
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
                <div className="flex items-center justify-between p-4 border rounded">
                  <div>
                    <h4 className="font-medium">Commission Statement</h4>
                    <p className="text-sm text-muted-foreground">Platform commission details</p>
                  </div>
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
                <div className="flex items-center justify-between p-4 border rounded">
                  <div>
                    <h4 className="font-medium">Vendor Payout Report</h4>
                    <p className="text-sm text-muted-foreground">All vendor payments</p>
                  </div>
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tax & Compliance</CardTitle>
                <CardDescription>VAT and tax reporting</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded">
                  <div>
                    <h4 className="font-medium">VAT Report</h4>
                    <p className="text-sm text-muted-foreground">15% VAT collection details</p>
                  </div>
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
                <div className="flex items-center justify-between p-4 border rounded">
                  <div>
                    <h4 className="font-medium">Tax Summary</h4>
                    <p className="text-sm text-muted-foreground">Annual tax summary</p>
                  </div>
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Financial Settings</CardTitle>
              <CardDescription>Configure commission rates and payment settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-medium mb-4">Commission Settings</h4>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Default Commission Rate</label>
                    <div className="flex items-center gap-2">
                      <input 
                        type="number" 
                        defaultValue="10" 
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      />
                      <span className="text-sm">%</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Featured Vendor Rate</label>
                    <div className="flex items-center gap-2">
                      <input 
                        type="number" 
                        defaultValue="8" 
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      />
                      <span className="text-sm">%</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-4">Payout Settings</h4>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Payout Frequency</label>
                    <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                      <option>Weekly</option>
                      <option>Bi-weekly</option>
                      <option>Monthly</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Minimum Payout Amount</label>
                    <input 
                      type="number" 
                      defaultValue="100" 
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    />
                  </div>
                </div>
              </div>
              
              <Button>Save Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminFinancials;
