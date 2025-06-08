
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  DollarSign, 
  Calendar, 
  Download,
  Search,
  CreditCard,
  Clock,
  CheckCircle,
  AlertTriangle
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const VendorPayouts = () => {
  const [searchTerm, setSearchTerm] = useState("");

  // Mock payout data
  const payoutData = {
    availableBalance: 1250.75,
    pendingBalance: 340.50,
    totalEarnings: 8945.25,
    commissionRate: 10, // 10%
    minimumPayout: 50.00,
    nextPayoutDate: "2024-01-20"
  };

  const payoutHistory = [
    {
      id: "PAY-001",
      amount: 890.50,
      commission: 89.05,
      netAmount: 801.45,
      status: "completed",
      requestDate: "2024-01-10",
      paidDate: "2024-01-12",
      method: "Bank Transfer"
    },
    {
      id: "PAY-002",
      amount: 1245.75,
      commission: 124.58,
      netAmount: 1121.17,
      status: "processing",
      requestDate: "2024-01-15",
      paidDate: null,
      method: "Bank Transfer"
    },
    {
      id: "PAY-003",
      amount: 567.30,
      commission: 56.73,
      netAmount: 510.57,
      status: "pending",
      requestDate: "2024-01-18",
      paidDate: null,
      method: "Bank Transfer"
    }
  ];

  const filteredPayouts = payoutHistory.filter(payout =>
    payout.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge variant="default"><CheckCircle className="h-3 w-3 mr-1" />Completed</Badge>;
      case "processing":
        return <Badge variant="outline"><Clock className="h-3 w-3 mr-1" />Processing</Badge>;
      case "pending":
        return <Badge variant="outline"><AlertTriangle className="h-3 w-3 mr-1" />Pending</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const canRequestPayout = payoutData.availableBalance >= payoutData.minimumPayout;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Payments & Payouts</h2>
          <p className="text-muted-foreground">
            Manage your earnings and payout requests.
          </p>
        </div>
        <Button 
          disabled={!canRequestPayout}
          className="bg-green-600 hover:bg-green-700"
        >
          <DollarSign className="h-4 w-4 mr-2" />
          Request Payout
        </Button>
      </div>

      {/* Balance Summary */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Balance</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              ${payoutData.availableBalance.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              Ready for payout
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Balance</CardTitle>
            <Clock className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              ${payoutData.pendingBalance.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              Processing orders
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${payoutData.totalEarnings.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              All time earnings
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Commission Rate</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {payoutData.commissionRate}%
            </div>
            <p className="text-xs text-muted-foreground">
              Platform fee
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Payout Information */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Payout Information</CardTitle>
            <CardDescription>
              Current payout settings and schedule
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span className="text-sm">Minimum Payout Amount:</span>
              <span className="font-medium">${payoutData.minimumPayout.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Next Scheduled Payout:</span>
              <span className="font-medium">{payoutData.nextPayoutDate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Payout Method:</span>
              <span className="font-medium flex items-center gap-1">
                <CreditCard className="h-4 w-4" />
                Bank Transfer
              </span>
            </div>
            <div className="pt-2">
              {!canRequestPayout && (
                <p className="text-sm text-orange-600">
                  Minimum payout amount not reached. Need ${(payoutData.minimumPayout - payoutData.availableBalance).toFixed(2)} more.
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Earnings Breakdown</CardTitle>
            <CardDescription>
              Commission and fee details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Gross Sales</span>
                <span>${(payoutData.availableBalance / (1 - payoutData.commissionRate / 100)).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Platform Commission ({payoutData.commissionRate}%)</span>
                <span className="text-red-600">
                  -${((payoutData.availableBalance / (1 - payoutData.commissionRate / 100)) * payoutData.commissionRate / 100).toFixed(2)}
                </span>
              </div>
              <div className="border-t pt-2">
                <div className="flex justify-between font-medium">
                  <span>Net Earnings</span>
                  <span className="text-green-600">${payoutData.availableBalance.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search payout history..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Payout History */}
      <Card>
        <CardHeader>
          <CardTitle>Payout History</CardTitle>
          <CardDescription>
            Track all your payout requests and payments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Payout ID</TableHead>
                <TableHead>Gross Amount</TableHead>
                <TableHead>Commission</TableHead>
                <TableHead>Net Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Request Date</TableHead>
                <TableHead>Paid Date</TableHead>
                <TableHead>Method</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPayouts.map((payout) => (
                <TableRow key={payout.id}>
                  <TableCell className="font-medium">{payout.id}</TableCell>
                  <TableCell>${payout.amount.toFixed(2)}</TableCell>
                  <TableCell className="text-red-600">-${payout.commission.toFixed(2)}</TableCell>
                  <TableCell className="font-medium text-green-600">
                    ${payout.netAmount.toFixed(2)}
                  </TableCell>
                  <TableCell>{getStatusBadge(payout.status)}</TableCell>
                  <TableCell>{payout.requestDate}</TableCell>
                  <TableCell>{payout.paidDate || "-"}</TableCell>
                  <TableCell>{payout.method}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default VendorPayouts;
