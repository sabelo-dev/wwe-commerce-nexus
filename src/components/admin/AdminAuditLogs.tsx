
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, Filter, Download, RotateCcw, Shield, User, Package } from "lucide-react";

interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userRole: "admin" | "vendor" | "customer";
  action: string;
  resource: string;
  resourceId: string;
  details: string;
  ipAddress: string;
  userAgent: string;
  severity: "low" | "medium" | "high" | "critical";
}

// Mock data
const mockAuditLogs: AuditLog[] = [
  {
    id: "log1",
    timestamp: "2023-06-20T14:30:25Z",
    userId: "admin1",
    userName: "Admin User",
    userRole: "admin",
    action: "UPDATE",
    resource: "vendor",
    resourceId: "vendor123",
    details: "Updated vendor status from pending to approved",
    ipAddress: "192.168.1.100",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    severity: "medium",
  },
  {
    id: "log2",
    timestamp: "2023-06-20T13:45:12Z",
    userId: "vendor1",
    userName: "Tech Shop",
    userRole: "vendor",
    action: "CREATE",
    resource: "product",
    resourceId: "prod456",
    details: "Created new product: Wireless Headphones Pro",
    ipAddress: "203.0.113.45",
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15",
    severity: "low",
  },
  {
    id: "log3",
    timestamp: "2023-06-20T12:20:08Z",
    userId: "admin1",
    userName: "Admin User",
    userRole: "admin",
    action: "DELETE",
    resource: "product",
    resourceId: "prod789",
    details: "Deleted product for policy violation",
    ipAddress: "192.168.1.100",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    severity: "high",
  },
  {
    id: "log4",
    timestamp: "2023-06-20T11:15:33Z",
    userId: "customer1",
    userName: "John Smith",
    userRole: "customer",
    action: "LOGIN",
    resource: "auth",
    resourceId: "session123",
    details: "User logged in successfully",
    ipAddress: "198.51.100.22",
    userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15",
    severity: "low",
  },
  {
    id: "log5",
    timestamp: "2023-06-20T10:05:45Z",
    userId: "admin2",
    userName: "Security Admin",
    userRole: "admin",
    action: "UPDATE",
    resource: "user",
    resourceId: "user456",
    details: "Suspended user account for suspicious activity",
    ipAddress: "192.168.1.101",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    severity: "critical",
  },
];

const AdminAuditLogs: React.FC = () => {
  const [logs] = useState<AuditLog[]>(mockAuditLogs);
  const [searchTerm, setSearchTerm] = useState("");
  const [severityFilter, setSeverityFilter] = useState<string>("all");
  const [actionFilter, setActionFilter] = useState<string>("all");

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.resource.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.details.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSeverity = severityFilter === "all" || log.severity === severityFilter;
    const matchesAction = actionFilter === "all" || log.action === actionFilter;
    return matchesSearch && matchesSeverity && matchesAction;
  });

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical": return "destructive";
      case "high": return "destructive";
      case "medium": return "outline";
      case "low": return "default";
      default: return "default";
    }
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case "CREATE": return <Package className="h-4 w-4" />;
      case "UPDATE": return <RotateCcw className="h-4 w-4" />;
      case "DELETE": return <Shield className="h-4 w-4" />;
      case "LOGIN": return <User className="h-4 w-4" />;
      default: return <Package className="h-4 w-4" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin": return "destructive";
      case "vendor": return "outline";
      case "customer": return "default";
      default: return "default";
    }
  };

  const criticalLogs = logs.filter(log => log.severity === "critical").length;
  const highSeverityLogs = logs.filter(log => log.severity === "high").length;
  const todayLogs = logs.filter(log => {
    const logDate = new Date(log.timestamp).toDateString();
    const today = new Date().toDateString();
    return logDate === today;
  }).length;

  return (
    <div>
      <div className="flex justify-between mb-6">
        <h2 className="text-2xl font-bold">Audit Logs</h2>
        <div className="flex gap-2">
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Advanced Filter
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Logs
          </Button>
        </div>
      </div>

      {/* Security Overview */}
      <div className="grid gap-4 md:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Activities</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayLogs}</div>
            <p className="text-xs text-muted-foreground">
              System activities today
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical Events</CardTitle>
            <Shield className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">{criticalLogs}</div>
            <p className="text-xs text-muted-foreground">
              Requires immediate attention
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Priority</CardTitle>
            <Shield className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-500">{highSeverityLogs}</div>
            <p className="text-xs text-muted-foreground">
              Should be reviewed
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Health</CardTitle>
            <Shield className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">Secure</div>
            <p className="text-xs text-muted-foreground">
              No security threats detected
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search logs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Button 
            variant={actionFilter === "all" ? "default" : "outline"}
            onClick={() => setActionFilter("all")}
          >
            All Actions
          </Button>
          <Button 
            variant={actionFilter === "CREATE" ? "default" : "outline"}
            onClick={() => setActionFilter("CREATE")}
          >
            Create
          </Button>
          <Button 
            variant={actionFilter === "UPDATE" ? "default" : "outline"}
            onClick={() => setActionFilter("UPDATE")}
          >
            Update
          </Button>
          <Button 
            variant={actionFilter === "DELETE" ? "default" : "outline"}
            onClick={() => setActionFilter("DELETE")}
          >
            Delete
          </Button>
          <Button 
            variant={severityFilter === "critical" ? "default" : "outline"}
            onClick={() => setSeverityFilter("critical")}
          >
            Critical
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>System Activity Log</CardTitle>
          <CardDescription>Complete audit trail of all system activities</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableCaption>Detailed audit log entries</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Resource</TableHead>
                <TableHead>Details</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead className="text-right">IP Address</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell>
                    <div className="text-sm">
                      <div>{new Date(log.timestamp).toLocaleDateString()}</div>
                      <div className="text-muted-foreground">
                        {new Date(log.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{log.userName}</div>
                      <Badge variant={getRoleColor(log.userRole)} className="text-xs">
                        {log.userRole}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getActionIcon(log.action)}
                      <span className="font-medium">{log.action}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{log.resource}</div>
                      <div className="text-sm text-muted-foreground">{log.resourceId}</div>
                    </div>
                  </TableCell>
                  <TableCell className="max-w-md">
                    <div className="text-sm">{log.details}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getSeverityColor(log.severity)}>
                      {log.severity}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="text-sm font-mono">{log.ipAddress}</div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminAuditLogs;
