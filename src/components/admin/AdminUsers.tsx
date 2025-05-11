
import React, { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { mockUsers } from "@/data/mockData";
import { AdminUser } from "@/types/admin";

const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Convert mockUsers to AdminUser type with status
    const adminUsers = mockUsers.map(user => ({
      ...user,
      status: 'active', // Set default status since it doesn't exist in User type
      createdAt: new Date().toISOString(),
    })) as AdminUser[];
    
    setUsers(adminUsers);
    setLoading(false);
  }, []);

  const handleToggleStatus = (userId: string) => {
    // In a real app, you'd update via API
    setUsers(users.map(u => 
      u.id === userId 
        ? { ...u, status: u.status === 'active' ? 'suspended' : 'active' } 
        : u
    ));

    toast({
      title: "Status updated",
      description: "User status has been updated."
    });
  };

  if (loading) {
    return <div>Loading users...</div>;
  }

  return (
    <div>
      <div className="flex justify-between mb-4">
        <h2 className="text-2xl font-bold">User Management</h2>
      </div>
      
      <Table>
        <TableCaption>List of all registered users</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map(user => (
            <TableRow key={user.id}>
              <TableCell>{user.name || 'N/A'}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <Badge variant={user.role === 'admin' ? 'destructive' : user.role === 'vendor' ? 'outline' : 'default'}>
                  {user.role}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant={user.status === 'active' ? 'default' : 'destructive'}>
                  {user.status || 'active'}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleToggleStatus(user.id)}
                >
                  {user.status === 'suspended' ? 'Activate' : 'Suspend'}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default AdminUsers;
