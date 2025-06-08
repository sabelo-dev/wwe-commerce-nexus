
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Image, 
  FileText, 
  Mail, 
  Upload, 
  Edit, 
  Trash2,
  Eye,
  Calendar
} from "lucide-react";

interface Banner {
  id: string;
  title: string;
  imageUrl: string;
  linkUrl: string;
  position: "hero" | "sidebar" | "footer";
  status: "active" | "inactive";
  startDate: string;
  endDate?: string;
}

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  status: "published" | "draft" | "scheduled";
  publishDate: string;
  author: string;
  views: number;
}

interface EmailTemplate {
  id: string;
  name: string;
  type: "welcome" | "order_confirmation" | "shipping" | "promo";
  status: "active" | "inactive";
  lastModified: string;
}

// Mock data
const mockBanners: Banner[] = [
  {
    id: "b1",
    title: "Summer Sale 2023",
    imageUrl: "/placeholder.svg",
    linkUrl: "/deals",
    position: "hero",
    status: "active",
    startDate: "2023-06-01",
    endDate: "2023-08-31",
  },
  {
    id: "b2",
    title: "Featured Vendors",
    imageUrl: "/placeholder.svg",
    linkUrl: "/vendors",
    position: "sidebar",
    status: "active",
    startDate: "2023-01-01",
  },
];

const mockBlogPosts: BlogPost[] = [
  {
    id: "p1",
    title: "WWE Store Launch Announcement",
    excerpt: "Welcome to the official WWE merchandise store...",
    status: "published",
    publishDate: "2023-06-15",
    author: "Admin",
    views: 1542,
  },
  {
    id: "p2",
    title: "Summer Collection Preview",
    excerpt: "Check out our latest summer collection...",
    status: "draft",
    publishDate: "2023-06-25",
    author: "Content Team",
    views: 0,
  },
];

const mockEmailTemplates: EmailTemplate[] = [
  {
    id: "e1",
    name: "Welcome Email",
    type: "welcome",
    status: "active",
    lastModified: "2023-06-15",
  },
  {
    id: "e2",
    name: "Order Confirmation",
    type: "order_confirmation",
    status: "active",
    lastModified: "2023-06-10",
  },
];

const AdminContent: React.FC = () => {
  const [banners] = useState<Banner[]>(mockBanners);
  const [blogPosts] = useState<BlogPost[]>(mockBlogPosts);
  const [emailTemplates] = useState<EmailTemplate[]>(mockEmailTemplates);

  return (
    <div>
      <div className="flex justify-between mb-6">
        <h2 className="text-2xl font-bold">Content Management</h2>
      </div>

      <Tabs defaultValue="banners" className="space-y-6">
        <TabsList>
          <TabsTrigger value="banners">Banners</TabsTrigger>
          <TabsTrigger value="blog">Blog</TabsTrigger>
          <TabsTrigger value="emails">Email Templates</TabsTrigger>
          <TabsTrigger value="pages">Static Pages</TabsTrigger>
        </TabsList>

        <TabsContent value="banners">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Website Banners</CardTitle>
                    <CardDescription>Manage homepage and promotional banners</CardDescription>
                  </div>
                  <Button>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Banner
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableCaption>Website banners and promotional content</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Position</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {banners.map((banner) => (
                      <TableRow key={banner.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-8 bg-gray-200 rounded flex items-center justify-center">
                              <Image className="h-4 w-4" />
                            </div>
                            <div>
                              <div className="font-medium">{banner.title}</div>
                              <div className="text-sm text-muted-foreground">{banner.linkUrl}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{banner.position}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={banner.status === "active" ? "default" : "outline"}>
                            {banner.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>{new Date(banner.startDate).toLocaleDateString()}</div>
                            {banner.endDate && (
                              <div className="text-muted-foreground">
                                to {new Date(banner.endDate).toLocaleDateString()}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="blog">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Blog Posts</CardTitle>
                    <CardDescription>Manage blog content and news updates</CardDescription>
                  </div>
                  <Button>
                    <FileText className="h-4 w-4 mr-2" />
                    New Post
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableCaption>Blog posts and articles</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Author</TableHead>
                      <TableHead>Publish Date</TableHead>
                      <TableHead>Views</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {blogPosts.map((post) => (
                      <TableRow key={post.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{post.title}</div>
                            <div className="text-sm text-muted-foreground">{post.excerpt}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={
                              post.status === "published" 
                                ? "default" 
                                : post.status === "draft" 
                                ? "outline" 
                                : "outline"
                            }
                          >
                            {post.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{post.author}</TableCell>
                        <TableCell>{new Date(post.publishDate).toLocaleDateString()}</TableCell>
                        <TableCell>{post.views.toLocaleString()}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="emails">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Email Templates</CardTitle>
                    <CardDescription>Manage automated email templates</CardDescription>
                  </div>
                  <Button>
                    <Mail className="h-4 w-4 mr-2" />
                    New Template
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableCaption>Email templates for automated communications</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Last Modified</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {emailTemplates.map((template) => (
                      <TableRow key={template.id}>
                        <TableCell className="font-medium">{template.name}</TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {template.type.replace('_', ' ')}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={template.status === "active" ? "default" : "outline"}>
                            {template.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{new Date(template.lastModified).toLocaleDateString()}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="pages">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Static Pages</CardTitle>
                <CardDescription>Manage terms, FAQ, about us, and other static content</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded">
                      <div>
                        <h4 className="font-medium">Terms of Service</h4>
                        <p className="text-sm text-muted-foreground">Legal terms and conditions</p>
                      </div>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex items-center justify-between p-4 border rounded">
                      <div>
                        <h4 className="font-medium">Privacy Policy</h4>
                        <p className="text-sm text-muted-foreground">Data protection and privacy</p>
                      </div>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex items-center justify-between p-4 border rounded">
                      <div>
                        <h4 className="font-medium">FAQ</h4>
                        <p className="text-sm text-muted-foreground">Frequently asked questions</p>
                      </div>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded">
                      <div>
                        <h4 className="font-medium">About Us</h4>
                        <p className="text-sm text-muted-foreground">Company information</p>
                      </div>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex items-center justify-between p-4 border rounded">
                      <div>
                        <h4 className="font-medium">Contact Information</h4>
                        <p className="text-sm text-muted-foreground">Support and contact details</p>
                      </div>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex items-center justify-between p-4 border rounded">
                      <div>
                        <h4 className="font-medium">Shipping Policy</h4>
                        <p className="text-sm text-muted-foreground">Delivery terms and conditions</p>
                      </div>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminContent;
