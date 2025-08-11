import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Star, Edit, Trash2, Eye } from "lucide-react";

const ConsumerReviews: React.FC = () => {
  const [editingReview, setEditingReview] = useState<any>(null);

  // Mock data - replace with actual API calls
  const reviews = [
    {
      id: "1",
      productName: "Wireless Headphones",
      productImage: "/public/lovable-uploads/0173f645-3b83-43a6-8daa-2e2f763357b2.png",
      rating: 5,
      title: "Excellent sound quality!",
      comment: "These headphones exceeded my expectations. The sound quality is crystal clear and the battery life is amazing. Highly recommended!",
      date: "2024-01-15",
      vendor: "TechStore",
      status: "published",
      helpful: 12
    },
    {
      id: "2",
      productName: "Cotton T-Shirt",
      productImage: "/public/lovable-uploads/036486dd-58ef-4820-affc-ada0d6e33abf.png",
      rating: 4,
      title: "Good quality, comfortable fit",
      comment: "Nice material and comfortable to wear. The size runs a bit large, so consider ordering one size smaller.",
      date: "2024-01-12",
      vendor: "FashionHub",
      status: "published",
      helpful: 5
    },
    {
      id: "3",
      productName: "Kitchen Blender",
      productImage: "/public/lovable-uploads/0f583fc2-9bf5-430d-aac3-50000174d44c.png",
      rating: 3,
      title: "Average performance",
      comment: "It does the job but not as powerful as I expected. Good for basic blending tasks.",
      date: "2024-01-08",
      vendor: "HomeGoods",
      status: "pending",
      helpful: 2
    }
  ];

  const renderStars = (rating: number, interactive = false) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            } ${interactive ? "cursor-pointer hover:text-yellow-400" : ""}`}
          />
        ))}
      </div>
    );
  };

  const EditReviewDialog = ({ review }: { review: any }) => (
    <DialogContent className="max-w-2xl">
      <DialogHeader>
        <DialogTitle>Edit Review</DialogTitle>
      </DialogHeader>
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <img
            src={review.productImage}
            alt={review.productName}
            className="w-16 h-16 object-cover rounded"
          />
          <div>
            <h3 className="font-medium">{review.productName}</h3>
            <p className="text-sm text-muted-foreground">{review.vendor}</p>
          </div>
        </div>
        
        <div>
          <label className="text-sm font-medium">Rating</label>
          {renderStars(review.rating, true)}
        </div>
        
        <div>
          <label className="text-sm font-medium">Review Title</label>
          <input
            type="text"
            className="w-full p-2 border rounded mt-1"
            defaultValue={review.title}
          />
        </div>
        
        <div>
          <label className="text-sm font-medium">Review Comment</label>
          <Textarea
            className="mt-1"
            rows={4}
            defaultValue={review.comment}
          />
        </div>
        
        <div className="flex gap-2">
          <Button>Update Review</Button>
          <Button variant="outline">Cancel</Button>
        </div>
      </div>
    </DialogContent>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Star className="h-5 w-5" />
          <span className="text-lg font-medium">My Reviews</span>
        </div>
        <div className="text-sm text-muted-foreground">
          {reviews.length} reviews written
        </div>
      </div>

      <div className="grid gap-4">
        {reviews.map((review) => (
          <Card key={review.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex gap-4">
                  <img
                    src={review.productImage}
                    alt={review.productName}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div>
                    <CardTitle className="text-lg">{review.productName}</CardTitle>
                    <p className="text-sm text-muted-foreground">{review.vendor}</p>
                    <div className="flex items-center gap-2 mt-1">
                      {renderStars(review.rating)}
                      <span className="text-sm text-muted-foreground">
                        • {review.date}
                      </span>
                      <Badge 
                        variant={review.status === 'published' ? 'default' : 'secondary'}
                      >
                        {review.status}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Review Details</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="flex items-center gap-4">
                          <img
                            src={review.productImage}
                            alt={review.productName}
                            className="w-16 h-16 object-cover rounded"
                          />
                          <div>
                            <h3 className="font-medium">{review.productName}</h3>
                            <p className="text-sm text-muted-foreground">{review.vendor}</p>
                            {renderStars(review.rating)}
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium">{review.title}</h4>
                          <p className="text-sm text-muted-foreground mt-1">{review.comment}</p>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {review.helpful} people found this helpful
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                  
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                    </DialogTrigger>
                    <EditReviewDialog review={review} />
                  </Dialog>
                  
                  <Button variant="outline" size="sm">
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <h4 className="font-medium">{review.title}</h4>
                <p className="text-sm text-muted-foreground">{review.comment}</p>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{review.helpful} people found this helpful</span>
                  <span>Status: {review.status}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {reviews.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Star className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No reviews yet</h3>
            <p className="text-muted-foreground text-center mb-4">
              Share your experience by writing reviews for products you've purchased
            </p>
            <Button>Browse Products</Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ConsumerReviews;