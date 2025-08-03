import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { StarRating } from "@/components/ui/star-rating";
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
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRating, setFilterRating] = useState("all");
  const [responseText, setResponseText] = useState("");

  // Mock reviews data
  const reviews = [
    {
      id: "REV-001",
      customer: "John Doe",
      customerAvatar: "",
      product: "Wireless Bluetooth Earbuds",
      rating: 5,
      title: "Excellent quality and sound!",
      comment: "These earbuds exceeded my expectations. The sound quality is amazing and they're very comfortable to wear for long periods.",
      date: "2024-01-15",
      verified: true,
      helpful: 12,
      responded: false,
      sentiment: "positive",
      tags: ["quality", "comfort", "sound"]
    },
    {
      id: "REV-002",
      customer: "Jane Smith",
      customerAvatar: "",
      product: "Smart Fitness Watch",
      rating: 4,
      title: "Good watch but battery could be better",
      comment: "Love the features and the display is crystal clear. However, the battery life is shorter than advertised. Still a solid purchase overall.",
      date: "2024-01-14",
      verified: true,
      helpful: 8,
      responded: true,
      response: "Thank you for the feedback! We're working on battery optimization in our next update.",
      sentiment: "neutral",
      tags: ["battery", "features", "display"]
    },
    {
      id: "REV-003",
      customer: "Mike Johnson",
      customerAvatar: "",
      product: "Laptop Stand",
      rating: 2,
      title: "Not as sturdy as expected",
      comment: "The stand wobbles quite a bit and doesn't feel very stable with my laptop. Disappointed with the build quality.",
      date: "2024-01-13",
      verified: true,
      helpful: 3,
      responded: false,
      sentiment: "negative",
      tags: ["stability", "quality", "build"]
    },
    {
      id: "REV-004",
      customer: "Sarah Wilson",
      customerAvatar: "",
      product: "Organic Cotton T-Shirt",
      rating: 5,
      title: "Perfect fit and super soft!",
      comment: "This t-shirt is amazing! The fabric is so soft and the fit is exactly what I was looking for. Will definitely order more colors.",
      date: "2024-01-12",
      verified: true,
      helpful: 15,
      responded: true,
      response: "So happy you love it! We just added 3 new colors to the collection.",
      sentiment: "positive",
      tags: ["fit", "fabric", "comfort"]
    }
  ];

  const filteredReviews = reviews.filter(review => {
    const matchesSearch = review.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         review.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         review.comment.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRating = filterRating === "all" || review.rating.toString() === filterRating;
    return matchesSearch && matchesRating;
  });

  const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
  const totalReviews = reviews.length;
  const responseRate = (reviews.filter(r => r.responded).length / totalReviews) * 100;
  const positiveReviews = reviews.filter(r => r.sentiment === "positive").length;

  const ratingDistribution = [5, 4, 3, 2, 1].map(rating => ({
    stars: rating,
    count: reviews.filter(r => r.rating === rating).length,
    percentage: (reviews.filter(r => r.rating === rating).length / totalReviews) * 100
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
              <div className="text-2xl font-bold">{averageRating.toFixed(1)}</div>
              <StarRating rating={averageRating} className="w-4 h-4" />
            </div>
            <p className="text-xs text-muted-foreground">{totalReviews} total reviews</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Response Rate</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{responseRate.toFixed(0)}%</div>
            <p className="text-xs text-muted-foreground">
              {reviews.filter(r => r.responded).length} of {totalReviews} responded
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Positive Reviews</CardTitle>
            <ThumbsUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{positiveReviews}</div>
            <p className="text-xs text-muted-foreground">
              {((positiveReviews / totalReviews) * 100).toFixed(0)}% of all reviews
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Flagged Reviews</CardTitle>
            <Flag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
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
                <span className="font-medium">{((positiveReviews / totalReviews) * 100).toFixed(0)}%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-yellow-600" />
                  <span className="text-sm">Neutral</span>
                </div>
                <span className="font-medium">
                  {(((reviews.filter(r => r.sentiment === "neutral").length) / totalReviews) * 100).toFixed(0)}%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingDown className="h-4 w-4 text-red-600" />
                  <span className="text-sm">Negative</span>
                </div>
                <span className="font-medium">
                  {(((reviews.filter(r => r.sentiment === "negative").length) / totalReviews) * 100).toFixed(0)}%
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
          <div className="space-y-6">
            {filteredReviews.map((review) => (
              <div key={review.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={review.customerAvatar} />
                      <AvatarFallback>{review.customer.split(' ').map(n => n[0]).join('')}</AvatarFallback>
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
                      {review.tags.map((tag, index) => (
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
                              <Button>
                                <Send className="h-4 w-4 mr-2" />
                                Send Response
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    ) : (
                      <Badge variant="default" className="text-xs">
                        Responded
                      </Badge>
                    )}
                  </div>

                  {review.responded && review.response && (
                    <div className="mt-3 p-3 bg-blue-50 rounded-lg border-l-4 border-blue-200">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium">Your Response:</span>
                        <Badge variant="outline" className="text-xs">Store Owner</Badge>
                      </div>
                      <p className="text-sm">{review.response}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VendorReviews;