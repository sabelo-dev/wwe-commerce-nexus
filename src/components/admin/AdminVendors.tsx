
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

interface Vendor {
  id: string;
  businessName: string;
  email: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
}

// Mock data for demonstration
const mockVendors: Vendor[] = [
  {
    id: "v1",
    businessName: "Tech Shop",
    email: "contact@techshop.com",
    status: "approved",
    createdAt: "2023-01-15",
  },
  {
    id: "v2",
    businessName: "Fashion Boutique",
    email: "info@fashionboutique.com",
    status: "pending",
    createdAt: "2023-05-22",
  },
  {
    id: "v3",
    businessName: "Organic Foods",
    email: "hello@organicfoods.com",
    status: "rejected",
    createdAt: "2023-06-10",
  },
];

const AdminVendors: React.FC = () => {
  const [vendors, setVendors] = useState<Vendor[]>(mockVendors);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleUpdateStatus = (vendorId: string, newStatus: "approved" | "rejected") => {
    // In a real app, this would be an API call
    setVendors(
      vendors.map((vendor) =>
        vendor.id === vendorId ? { ...vendor, status: newStatus } : vendor
      )
    );

    toast({
      title: "Vendor status updated",
      description: `Vendor has been ${newStatus}.`,
    });
  };

  return (
    <div>
      <div className="flex justify-between mb-4">
        <h2 className="text-2xl font-bold">Vendor Applications</h2>
      </div>

      <Table>
        <TableCaption>List of vendor applications</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Business Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Applied On</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {vendors.map((vendor) => (
            <TableRow key={vendor.id}>
              <TableCell className="font-medium">{vendor.businessName}</TableCell>
              <TableCell>{vendor.email}</TableCell>
              <TableCell>
                <Badge
                  variant={
                    vendor.status === "approved"
                      ? "default"
                      : vendor.status === "rejected"
                      ? "destructive"
                      : "outline"
                  }
                >
                  {vendor.status}
                </Badge>
              </TableCell>
              <TableCell>{vendor.createdAt}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  {vendor.status === "pending" && (
                    <>
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => handleUpdateStatus(vendor.id, "approved")}
                      >
                        Approve
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleUpdateStatus(vendor.id, "rejected")}
                      >
                        Reject
                      </Button>
                    </>
                  )}
                  {vendor.status !== "pending" && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        handleUpdateStatus(
                          vendor.id,
                          vendor.status === "approved" ? "rejected" : "approved"
                        )
                      }
                    >
                      {vendor.status === "approved" ? "Deactivate" : "Activate"}
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default AdminVendors;
