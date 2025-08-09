import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
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

const mockReviews: Review[] = [
  {
    id: "r1",
    productName: "Wireless Headphones",
    customerName: "John Doe",
    rating: 5,
    comment: "Excellent quality and fast shipping!",
    date: "2024-01-15",
    status: "approved",
    flagged: false
  },
  {
    id: "r2", 
    productName: "Summer Dress",
    customerName: "Jane Smith",
    rating: 1,
    comment: "Poor quality, not as described. Waste of money!",
    date: "2024-01-14",
    status: "pending",
    flagged: true
  }
];

const mockComplaints: Complaint[] = [
  {
    id: "c1",
    type: "vendor",
    subject: "Vendor not responding to messages",
    description: "I've been trying to contact the vendor for 3 days about my order but no response.",
    customerName: "Mike Johnson",
    date: "2024-01-15",
    status: "open",
    priority: "high"
  },
  {
    id: "c2",
    type: "shipping",
    subject: "Package damaged during delivery",
    description: "The package arrived completely damaged and the product is unusable.",
    customerName: "Sarah Wilson",
    date: "2024-01-14", 
    status: "investigating",
    priority: "medium"
  }
];

const AdminReviews: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>(mockReviews);
  const [complaints, setComplaints] = useState<Complaint[]>(mockComplaints);
  const { toast } = useToast();

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