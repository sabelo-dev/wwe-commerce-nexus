import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Edit, Save, Eye, Upload, Image, FileText } from "lucide-react";

interface Page {
  id: string;
  title: string;
  slug: string;
  content: string;
  status: "published" | "draft";
  lastModified: string;
}

interface Banner {
  id: string;
  title: string;
  imageUrl: string;
  linkUrl: string;
  active: boolean;
  position: "hero" | "promo" | "sidebar";
}

const mockPages: Page[] = [
  {
    id: "1",
    title: "About Us",
    slug: "about",
    content: "Learn more about our marketplace...",
    status: "published",
    lastModified: "2024-01-15"
  },
  {
    id: "2",
    title: "Contact Us", 
    slug: "contact",
    content: "Get in touch with our team...",
    status: "published",
    lastModified: "2024-01-14"
  },
  {
    id: "3",
    title: "Privacy Policy",
    slug: "privacy",
    content: "Your privacy is important to us...",
    status: "draft",
    lastModified: "2024-01-13"
  }
];

const mockBanners: Banner[] = [
  {
    id: "1",
    title: "Summer Sale",
    imageUrl: "/placeholder-banner.jpg",
    linkUrl: "/deals",
    active: true,
    position: "hero"
  },
  {
    id: "2",
    title: "New Arrivals",
    imageUrl: "/placeholder-banner-2.jpg", 
    linkUrl: "/new-arrivals",
    active: true,
    position: "promo"
  }
];

const AdminCMS: React.FC = () => {
  const [pages, setPages] = useState<Page[]>(mockPages);
  const [banners, setBanners] = useState<Banner[]>(mockBanners);
  const [editingPage, setEditingPage] = useState<Page | null>(null);
  const { toast } = useToast();

  const handleSavePage = () => {
    if (!editingPage) return;

    setPages(pages.map(page => 
      page.id === editingPage.id 
        ? { ...editingPage, lastModified: new Date().toISOString().split('T')[0] }
        : page
    ));
    
    setEditingPage(null);
    toast({
      title: "Page saved",
      description: "Page content has been updated successfully."
    });
  };

  const handleTogglePageStatus = (pageId: string) => {
    setPages(pages.map(page =>
      page.id === pageId
        ? { ...page, status: page.status === "published" ? "draft" : "published" }
        : page
    ));

    toast({
      title: "Page status updated",
      description: "Page status has been changed."
    });
  };

  const handleToggleBanner = (bannerId: string) => {
    setBanners(banners.map(banner =>
      banner.id === bannerId
        ? { ...banner, active: !banner.active }
        : banner
    ));

    toast({
      title: "Banner updated",
      description: "Banner status has been changed."
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">CMS / Pages Management</h2>
      </div>

      <Tabs defaultValue="pages" className="w-full">
        <TabsList>
          <TabsTrigger value="pages">Static Pages</TabsTrigger>
          <TabsTrigger value="banners">Banners & Promotions</TabsTrigger>
        </TabsList>

        <TabsContent value="pages" className="space-y-4">
          {editingPage ? (
            <Card>
              <CardHeader>
                <CardTitle>Edit Page: {editingPage.title}</CardTitle>
                <CardDescription>Update page content and settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Page Title</label>
                    <Input
                      value={editingPage.title}
                      onChange={(e) => setEditingPage({...editingPage, title: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">URL Slug</label>
                    <Input
                      value={editingPage.slug}
                      onChange={(e) => setEditingPage({...editingPage, slug: e.target.value})}
                    />
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium">Content</label>
                  <Textarea
                    className="min-h-[200px]"
                    value={editingPage.content}
                    onChange={(e) => setEditingPage({...editingPage, content: e.target.value})}
                  />
                </div>

                <div className="flex gap-2">
                  <Button onClick={handleSavePage}>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </Button>
                  <Button variant="outline" onClick={() => setEditingPage(null)}>
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {pages.map((page) => (
                <Card key={page.id}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">{page.title}</h3>
                          <Badge 
                            variant={page.status === "published" ? "default" : "secondary"}
                          >
                            {page.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">/{page.slug}</p>
                        <p className="text-xs text-muted-foreground">
                          Last modified: {page.lastModified}
                        </p>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setEditingPage(page)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleTogglePageStatus(page.id)}
                        >
                          {page.status === "published" ? "Unpublish" : "Publish"}
                        </Button>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="banners" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Homepage Banners</CardTitle>
              <CardDescription>Manage promotional banners and hero images</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {banners.map((banner) => (
                <div key={banner.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{banner.title}</h4>
                        <Badge variant="outline" className="text-xs">
                          {banner.position}
                        </Badge>
                        <Badge 
                          variant={banner.active ? "default" : "secondary"}
                          className="text-xs"
                        >
                          {banner.active ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Links to: {banner.linkUrl}
                      </p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Image className="h-4 w-4" />
                        <span>{banner.imageUrl}</span>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleToggleBanner(banner.id)}
                      >
                        {banner.active ? "Deactivate" : "Activate"}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              
              <Button className="w-full" variant="outline">
                <Upload className="h-4 w-4 mr-2" />
                Add New Banner
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminCMS;