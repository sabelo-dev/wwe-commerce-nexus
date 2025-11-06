import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Star, Edit, Trash2, Eye } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const ConsumerReviews: React.FC = () => {
  const [editingReview, setEditingReview] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user?.id) {
      fetchReviews();
    }
  }, [user?.id]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          *,
          products (
            name,
            slug,
            stores (
              name
            )
          )
        `)
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Get product images separately
      const productIds = data?.map(r => r.product_id) || [];
      const { data: images } = await supabase
        .from('product_images')
        .select('product_id, image_url')
        .in('product_id', productIds)
        .eq('position', 0);

      const imageMap = new Map(images?.map(img => [img.product_id, img.image_url]));

      const formattedReviews = data?.map(review => ({
        id: review.id,
        productName: review.products?.name || 'Unknown Product',
        productImage: imageMap.get(review.product_id) || '/placeholder.svg',
        rating: review.rating,
        title: review.comment?.split('.')[0] || '',
        comment: review.comment || '',
        date: new Date(review.created_at).toLocaleDateString(),
        vendor: review.products?.stores?.name || 'Unknown Store',
        status: 'published',
        helpful: 0
      })) || [];

      setReviews(formattedReviews);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      toast({
        title: "Error",
        description: "Failed to load reviews",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

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

  if (loading) {
    return <div className="text-center py-8">Loading reviews...</div>;
  }

  if (reviews.length === 0) {
    return null;
  }

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

    </div>
  );
};

export default ConsumerReviews;