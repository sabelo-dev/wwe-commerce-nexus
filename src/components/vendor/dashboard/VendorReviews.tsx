import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { StarRating } from "@/components/ui/star-rating";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  Search, 
  MessageSquare, 
  Flag, 
  ThumbsUp,
  Star,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle,
  AlertTriangle,
  Send
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const VendorReviews = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRating, setFilterRating] = useState("all");
  const [responseText, setResponseText] = useState("");
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    averageRating: 0,
    totalReviews: 0,
    responseRate: 0,
    positiveReviews: 0
  });

  useEffect(() => {
    fetchReviews();
  }, [user?.id]);

  const fetchReviews = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      
      // Get vendor data first
      const { data: vendor, error: vendorError } = await supabase
        .from('vendors')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (vendorError) throw vendorError;

      // Get stores for this vendor
      const { data: stores, error: storesError } = await supabase
        .from('stores')
        .select('id')
        .eq('vendor_id', vendor.id);

      if (storesError) throw storesError;

      if (stores.length === 0) {
        setReviews([]);
        return;
      }

      const storeIds = stores.map(store => store.id);

      // Get products with their reviews (simulated for now)
      const { data: products, error: productsError } = await supabase
        .from('products')
        .select('*')
        .in('store_id', storeIds);

      if (productsError) throw productsError;

      // For now, create simulated reviews based on products
      // In a real app, you'd have a reviews table
      const mockReviews = products?.slice(0, 3).map((product, index) => ({
        id: `REV-${product.id.slice(-3)}`,
        customer: `Customer ${index + 1}`,
        customerAvatar: "",
        product: product.name,
        rating: 4 + Math.random(),
        title: "Great product!",
        comment: `Really happy with this ${product.name}. Good quality and fast delivery.`,
        date: new Date(Date.now() - index * 24 * 60 * 60 * 1000).toLocaleDateString(),
        verified: true,
        helpful: Math.floor(Math.random() * 20),
        responded: Math.random() > 0.5,
        response: Math.random() > 0.5 ? "Thank you for your feedback!" : null,
        sentiment: Math.random() > 0.7 ? "positive" : Math.random() > 0.3 ? "neutral" : "negative",
        tags: ["quality", "delivery", "value"]
      })) || [];

      setReviews(mockReviews);

      // Calculate stats
      const avgRating = mockReviews.reduce((sum, r) => sum + r.rating, 0) / mockReviews.length || 0;
      const responded = mockReviews.filter(r => r.responded).length;
      const positive = mockReviews.filter(r => r.sentiment === "positive").length;

      setStats({
        averageRating: avgRating,
        totalReviews: mockReviews.length,
        responseRate: mockReviews.length > 0 ? (responded / mockReviews.length) * 100 : 0,
        positiveReviews: positive
      });

    } catch (error) {
      console.error('Error fetching reviews:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch reviews",
      });
    } finally {
      setLoading(false);
    }
  };

  const respondToReview = async (reviewId: string, response: string) => {
    try {
      // In a real app, you'd update the review in the database
      setReviews(reviews.map(review => 
        review.id === reviewId 
          ? { ...review, responded: true, response }
          : review
      ));

      toast({
        title: "Response Sent",
        description: "Your response has been posted successfully.",
      });
      
      setResponseText("");
    } catch (error) {
      console.error('Error responding to review:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to send response",
      });
    }
  };

  const filteredReviews = reviews.filter(review => {
    const matchesSearch = review.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         review.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         review.comment.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRating = filterRating === "all" || Math.floor(review.rating).toString() === filterRating;
    return matchesSearch && matchesRating;
  });

  const ratingDistribution = [5, 4, 3, 2, 1].map(rating => ({
    stars: rating,
    count: reviews.filter(r => Math.floor(r.rating) === rating).length,
    percentage: (reviews.filter(r => Math.floor(r.rating) === rating).length / reviews.length) * 100 || 0
  }));

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "positive": return "text-green-600";
      case "negative": return "text-red-600";
      case "neutral": return "text-yellow-600";
      default: return "text-gray-600";
    }
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case "positive": return <TrendingUp className="h-4 w-4" />;
      case "negative": return <TrendingDown className="h-4 w-4" />;
      case "neutral": return <Clock className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading reviews...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Reviews & Customer Feedback</h2>
        <p className="text-muted-foreground">
          Monitor customer reviews, respond to feedback, and track sentiment.
        </p>
      </div>

      {/* Review Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className="text-2xl font-bold">{stats.averageRating.toFixed(1)}</div>
              <StarRating rating={stats.averageRating} className="w-4 h-4" />
            </div>
            <p className="text-xs text-muted-foreground">{stats.totalReviews} total reviews</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Response Rate</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.responseRate.toFixed(0)}%</div>
            <p className="text-xs text-muted-foreground">
              {reviews.filter(r => r.responded).length} of {stats.totalReviews} responded
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Positive Reviews</CardTitle>
            <ThumbsUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.positiveReviews}</div>
            <p className="text-xs text-muted-foreground">
              {stats.totalReviews > 0 ? ((stats.positiveReviews / stats.totalReviews) * 100).toFixed(0) : 0}% of all reviews
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Flagged Reviews</CardTitle>
            <Flag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">Require attention</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Rating Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Rating Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {ratingDistribution.map((rating) => (
                <div key={rating.stars} className="flex items-center gap-3">
                  <div className="flex items-center gap-1 w-12">
                    <span className="text-sm">{rating.stars}</span>
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  </div>
                  <Progress value={rating.percentage} className="flex-1" />
                  <span className="text-sm text-muted-foreground w-8">{rating.count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Sentiment Analysis */}
        <Card>
          <CardHeader>
            <CardTitle>Sentiment Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Positive</span>
                </div>
                <span className="font-medium">
                  {stats.totalReviews > 0 ? ((stats.positiveReviews / stats.totalReviews) * 100).toFixed(0) : 0}%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-yellow-600" />
                  <span className="text-sm">Neutral</span>
                </div>
                <span className="font-medium">
                  {stats.totalReviews > 0 ? (((reviews.filter(r => r.sentiment === "neutral").length) / stats.totalReviews) * 100).toFixed(0) : 0}%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingDown className="h-4 w-4 text-red-600" />
                  <span className="text-sm">Negative</span>
                </div>
                <span className="font-medium">
                  {stats.totalReviews > 0 ? (((reviews.filter(r => r.sentiment === "negative").length) / stats.totalReviews) * 100).toFixed(0) : 0}%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <MessageSquare className="h-4 w-4 mr-2" />
                Bulk Response Templates
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Flag className="h-4 w-4 mr-2" />
                Review Flagged Content
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <TrendingUp className="h-4 w-4 mr-2" />
                Sentiment Report
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <AlertTriangle className="h-4 w-4 mr-2" />
                Set Auto-Alerts
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search reviews by product, customer, or content..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select value={filterRating} onValueChange={setFilterRating}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by rating" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Ratings</SelectItem>
                <SelectItem value="5">5 Stars</SelectItem>
                <SelectItem value="4">4 Stars</SelectItem>
                <SelectItem value="3">3 Stars</SelectItem>
                <SelectItem value="2">2 Stars</SelectItem>
                <SelectItem value="1">1 Star</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
      </Card>

      {/* Reviews List */}
      <Card>
        <CardHeader>
          <CardTitle>Customer Reviews ({filteredReviews.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredReviews.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No reviews found. Reviews will appear here once customers start leaving feedback.
            </div>
          ) : (
            <div className="space-y-6">
              {filteredReviews.map((review) => (
                <div key={review.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={review.customerAvatar} />
                        <AvatarFallback>{review.customer.split(' ').map((n: string) => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{review.customer}</h4>
                          {review.verified && (
                            <Badge variant="secondary" className="text-xs">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Verified
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{review.product}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`flex items-center gap-1 ${getSentimentColor(review.sentiment)}`}>
                        {getSentimentIcon(review.sentiment)}
                        <span className="text-xs capitalize">{review.sentiment}</span>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Flag className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <StarRating rating={review.rating} className="w-4 h-4" />
                      <span className="text-sm text-muted-foreground">{review.date}</span>
                    </div>

                    <div>
                      <h5 className="font-medium mb-1">{review.title}</h5>
                      <p className="text-sm text-muted-foreground">{review.comment}</p>
                    </div>

                    {review.tags && (
                      <div className="flex gap-1 flex-wrap">
                        {review.tags.map((tag: string, index: number) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <ThumbsUp className="h-4 w-4" />
                          <span>{review.helpful} found helpful</span>
                        </div>
                      </div>

                      {!review.responded ? (
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button size="sm">
                              <MessageSquare className="h-4 w-4 mr-2" />
                              Respond
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Respond to Review</DialogTitle>
                              <DialogDescription>
                                Write a thoughtful response to {review.customer}'s review.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="p-3 bg-muted rounded-lg">
                                <div className="flex items-center gap-2 mb-2">
                                  <StarRating rating={review.rating} className="w-4 h-4" />
                                  <span className="text-sm font-medium">{review.title}</span>
                                </div>
                                <p className="text-sm">{review.comment}</p>
                              </div>
                              <Textarea
                                placeholder="Write your response..."
                                value={responseText}
                                onChange={(e) => setResponseText(e.target.value)}
                                className="min-h-[100px]"
                              />
                              <div className="flex justify-end gap-2">
                                <Button variant="outline">Cancel</Button>
                                <Button onClick={() => respondToReview(review.id, responseText)}>
                                  <Send className="h-4 w-4 mr-2" />
                                  Send Response
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      ) : (
                        <Badge variant="default" className="text-xs">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Responded
                        </Badge>
                      )}
                    </div>

                    {review.response && (
                      <div className="mt-3 p-3 bg-blue-50 rounded-lg border-l-4 border-blue-200">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium">Your Response:</span>
                        </div>
                        <p className="text-sm text-gray-700">{review.response}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default VendorReviews;