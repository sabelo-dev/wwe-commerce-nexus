
import React, { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
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
  business_name: string;
  user_id: string;
  status: "pending" | "approved" | "rejected";
  created_at: string;
  description?: string;
  logo_url?: string;
  subscription_tier?: string;
  subscription_status?: string;
  trial_end_date?: string;
  business_email?: string;
  business_phone?: string;
  business_address?: string;
  website?: string;
  tax_id?: string;
  profiles?: {
    email: string;
    name?: string;
  };
}

const AdminVendors: React.FC = () => {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Fetch vendors from database
  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const { data: vendorsData, error } = await supabase
          .from('vendors')
          .select(`
            id,
            business_name,
            user_id,
            status,
            created_at,
            description,
            logo_url,
            subscription_tier,
            subscription_status,
            trial_end_date,
            business_email,
            business_phone,
            business_address,
            website,
            tax_id
          `)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Supabase error fetching vendors:', error);
          throw error;
        }

        // Get all unique user IDs
        const userIds = [...new Set(vendorsData?.map(v => v.user_id) || [])];
        
        // Fetch all profiles in one query
        const { data: profilesData } = await supabase
          .from('profiles')
          .select('id, email, name')
          .in('id', userIds);

        // Create a map for quick lookup
        const profilesMap = new Map(
          (profilesData || []).map(p => [p.id, p])
        );

        const formattedVendors = (vendorsData || []).map((vendor) => ({
          ...vendor,
          status: vendor.status as "pending" | "approved" | "rejected",
          profiles: profilesMap.get(vendor.user_id)
        }));

        setVendors(formattedVendors);
      } catch (error) {
        console.error('Error fetching vendors:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: `Failed to load vendors: ${error instanceof Error ? error.message : 'Unknown error'}`,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchVendors();
  }, [toast]);

  const handleUpdateStatus = async (vendorId: string, newStatus: "approved" | "rejected") => {
    try {
      const { error } = await supabase
        .from('vendors')
        .update({ 
          status: newStatus,
          approval_date: newStatus === 'approved' ? new Date().toISOString() : null
        })
        .eq('id', vendorId);

      if (error) throw error;

      setVendors(
        vendors.map((vendor) =>
          vendor.id === vendorId ? { ...vendor, status: newStatus } : vendor
        )
      );

      toast({
        title: "Vendor status updated",
        description: `Vendor has been ${newStatus}.`,
      });
    } catch (error) {
      console.error('Error updating vendor status:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update vendor status.",
      });
    }
  };

  return (
    <div>
      <div className="flex justify-between mb-4">
        <h2 className="text-2xl font-bold">Vendor Applications</h2>
      </div>

      {loading ? (
        <div className="text-center py-8">Loading vendors...</div>
      ) : (
        <Table>
          <TableCaption>List of vendor applications</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Business Name</TableHead>
              <TableHead>Account Email</TableHead>
              <TableHead>Business Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>Website</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Applied On</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {vendors.map((vendor) => (
              <TableRow key={vendor.id}>
                <TableCell className="font-medium">{vendor.business_name}</TableCell>
                <TableCell>{vendor.profiles?.email || 'N/A'}</TableCell>
                <TableCell>{vendor.business_email || 'N/A'}</TableCell>
                <TableCell>{vendor.business_phone || 'N/A'}</TableCell>
                <TableCell className="max-w-xs truncate" title={vendor.business_address}>
                  {vendor.business_address || 'N/A'}
                </TableCell>
                <TableCell>
                  {vendor.website ? (
                    <a 
                      href={vendor.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      Visit
                    </a>
                  ) : 'N/A'}
                </TableCell>
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
                <TableCell>{new Date(vendor.created_at).toLocaleDateString()}</TableCell>
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
      )}
    </div>
  );
};

export default AdminVendors;
