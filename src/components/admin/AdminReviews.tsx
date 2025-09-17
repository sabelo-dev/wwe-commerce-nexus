import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StarIcon, Flag, MessageCircle, User } from "lucide-react";

interface Review {
  id: string;
  productName: string;
  customerName: string;
  rating: number;
  comment: string;
  date: string;
  status: "pending" | "approved" | "rejected";
  flagged: boolean;
}

interface Complaint {
  id: string;
  type: "product" | "vendor" | "shipping" | "other";
  subject: string;
  description: string;
  customerName: string;
  date: string;
  status: "open" | "investigating" | "resolved" | "closed";
  priority: "low" | "medium" | "high";
}


const AdminReviews: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch orders data
        const { data: orders } = await supabase
          .from('orders')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(10);

        // Get user profiles for customer names
        const userIds = orders?.map(order => order.user_id) || [];
        const { data: profiles } = await supabase
          .from('profiles')
          .select('id, name')
          .in('id', userIds);

        const profileMap = new Map(profiles?.map(p => [p.id, p.name]) || []);

        // Generate sample reviews from orders (in real app, you'd have a reviews table)
        const reviewsData: Review[] = orders?.slice(0, 5).map((order, index) => ({
          id: `r-${order.id}`,
          productName: `Order ${order.id.slice(0, 8)}`,
          customerName: profileMap.get(order.user_id) || 'Unknown Customer',
          rating: Math.floor(Math.random() * 5) + 1,
          comment: 'This is a sample review generated from order data.',
          date: new Date(order.created_at).toISOString().split('T')[0],
          status: index % 3 === 0 ? 'pending' : 'approved',
          flagged: index % 4 === 0
        })) || [];

        // Generate sample complaints from orders
        const complaintsData: Complaint[] = orders?.slice(0, 3).map((order, index) => ({
          id: `c-${order.id}`,
          type: ['product', 'vendor', 'shipping', 'other'][index % 4] as any,
          subject: `Issue with order ${order.id.slice(0, 8)}`,
          description: 'This is a sample complaint generated from order data.',
          customerName: profileMap.get(order.user_id) || 'Unknown Customer',
          date: new Date(order.created_at).toISOString().split('T')[0],
          status: ['open', 'investigating', 'resolved'][index % 3] as any,
          priority: ['low', 'medium', 'high'][index % 3] as any
        })) || [];

        setReviews(reviewsData);
        setComplaints(complaintsData);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load reviews and complaints."
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  const handleReviewAction = (reviewId: string, action: "approve" | "reject") => {
    setReviews(reviews.map(review => 
      review.id === reviewId ? { ...review, status: action === "approve" ? "approved" : "rejected" } : review
    ));
    
    toast({
      title: `Review ${action}d`,
      description: `Review has been ${action}d successfully.`
    });
  };

  const handleComplaintStatusUpdate = (complaintId: string, newStatus: Complaint["status"]) => {
    setComplaints(complaints.map(complaint =>
      complaint.id === complaintId ? { ...complaint, status: newStatus } : complaint
    ));

    toast({
      title: "Complaint updated",
      description: `Complaint status updated to ${newStatus}.`
    });
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <StarIcon
        key={i}
        className={`h-4 w-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">Loading reviews and complaints...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Reviews & Complaints</h2>
      </div>

      <Tabs defaultValue="reviews" className="w-full">
        <TabsList>
          <TabsTrigger value="reviews">Product Reviews</TabsTrigger>
          <TabsTrigger value="complaints">Customer Complaints</TabsTrigger>
        </TabsList>

        <TabsContent value="reviews" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Product Reviews Moderation</CardTitle>
              <CardDescription>Manage and moderate customer product reviews</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {reviews.map((review) => (
                <div key={review.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{review.productName}</h4>
                        {review.flagged && <Flag className="h-4 w-4 text-red-500" />}
                      </div>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">{review.customerName}</span>
                        <span className="text-sm text-muted-foreground">•</span>
                        <span className="text-sm text-muted-foreground">{review.date}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        {renderStars(review.rating)}
                      </div>
                    </div>
                    <Badge 
                      variant={
                        review.status === "approved" ? "default" : 
                        review.status === "rejected" ? "destructive" : "outline"
                      }
                    >
                      {review.status}
                    </Badge>
                  </div>
                  
                  <p className="text-sm">{review.comment}</p>
                  
                  {review.status === "pending" && (
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        onClick={() => handleReviewAction(review.id, "approve")}
                      >
                        Approve
                      </Button>
                      <Button 
                        size="sm" 
                        variant="destructive"
                        onClick={() => handleReviewAction(review.id, "reject")}
                      >
                        Reject
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="complaints" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Customer Complaints</CardTitle>
              <CardDescription>Handle customer complaints and support issues</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {complaints.map((complaint) => (
                <div key={complaint.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{complaint.subject}</h4>
                        <Badge variant="outline" className="text-xs">
                          {complaint.type}
                        </Badge>
                        <Badge 
                          variant={
                            complaint.priority === "high" ? "destructive" :
                            complaint.priority === "medium" ? "default" : "secondary"
                          }
                          className="text-xs"
                        >
                          {complaint.priority} priority
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">{complaint.customerName}</span>
                        <span className="text-sm text-muted-foreground">•</span>
                        <span className="text-sm text-muted-foreground">{complaint.date}</span>
                      </div>
                    </div>
                    <Badge 
                      variant={
                        complaint.status === "resolved" ? "default" :
                        complaint.status === "closed" ? "secondary" :
                        complaint.status === "investigating" ? "outline" : "destructive"
                      }
                    >
                      {complaint.status}
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-muted-foreground">{complaint.description}</p>
                  
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleComplaintStatusUpdate(complaint.id, "investigating")}
                    >
                      Investigate
                    </Button>
                    <Button 
                      size="sm"
                      onClick={() => handleComplaintStatusUpdate(complaint.id, "resolved")}
                    >
                      Resolve
                    </Button>
                    <Button 
                      size="sm" 
                      variant="secondary"
                      onClick={() => handleComplaintStatusUpdate(complaint.id, "closed")}
                    >
                      Close
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminReviews;