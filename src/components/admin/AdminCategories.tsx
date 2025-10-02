import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { Plus, Edit, Trash2, Image as ImageIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image_url?: string;
  productCount: number;
  subcategories: Array<{
    id: string;
    name: string;
    slug: string;
  }>;
}

const AdminCategories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [subcategoryDialogOpen, setSubcategoryDialogOpen] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  const [categoryForm, setCategoryForm] = useState({
    name: "",
    description: ""
  });
  
  const [subcategoryForm, setSubcategoryForm] = useState({
    name: "",
    description: ""
  });
  
  const { toast } = useToast();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      
      // Fetch categories
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('categories')
        .select('*')
        .order('sort_order', { ascending: true });

      if (categoriesError) throw categoriesError;

      // Fetch subcategories
      const { data: subcategoriesData, error: subcategoriesError } = await supabase
        .from('subcategories')
        .select('*')
        .order('sort_order', { ascending: true });

      if (subcategoriesError) throw subcategoriesError;

      // Fetch product counts
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('id, category');

      if (productsError) throw productsError;

      // Map categories with subcategories and product counts
      const mappedCategories: Category[] = (categoriesData || []).map(cat => {
        const categorySubcategories = (subcategoriesData || [])
          .filter(sub => sub.category_id === cat.id)
          .map(sub => ({
            id: sub.id,
            name: sub.name,
            slug: sub.slug
          }));

        const productCount = (productsData || []).filter(
          p => p.category === cat.name
        ).length;

        return {
          id: cat.id,
          name: cat.name,
          slug: cat.slug,
          description: cat.description,
          image_url: cat.image_url,
          productCount,
          subcategories: categorySubcategories
        };
      });

      setCategories(mappedCategories);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast({
        title: "Error",
        description: "Failed to load categories",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadCategoryImage = async (categoryId: string): Promise<string | null> => {
    if (!imageFile) return null;

    try {
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${categoryId}-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('category-images')
        .upload(filePath, imageFile);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('category-images')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "Error",
        description: "Failed to upload image",
        variant: "destructive"
      });
      return null;
    }
  };

  const handleAddCategory = async () => {
    if (!categoryForm.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Category name is required",
        variant: "destructive"
      });
      return;
    }

    try {
      const slug = categoryForm.name.toLowerCase().replace(/\s+/g, '-');
      
      const { data: newCategory, error } = await supabase
        .from('categories')
        .insert({
          name: categoryForm.name,
          slug,
          description: categoryForm.description || null,
          image_url: null
        })
        .select()
        .single();

      if (error) throw error;

      // Upload image if provided
      if (imageFile && newCategory) {
        const imageUrl = await uploadCategoryImage(newCategory.id);
        if (imageUrl) {
          await supabase
            .from('categories')
            .update({ image_url: imageUrl })
            .eq('id', newCategory.id);
        }
      }

      toast({
        title: "Success",
        description: `Category "${categoryForm.name}" has been added successfully.`
      });

      setCategoryForm({ name: "", description: "" });
      setImageFile(null);
      setImagePreview(null);
      setCategoryDialogOpen(false);
      fetchCategories();
    } catch (error) {
      console.error('Error adding category:', error);
      toast({
        title: "Error",
        description: "Failed to add category",
        variant: "destructive"
      });
    }
  };

  const handleAddSubcategory = async () => {
    if (!subcategoryForm.name.trim() || !selectedCategoryId) {
      toast({
        title: "Validation Error",
        description: "Subcategory name is required",
        variant: "destructive"
      });
      return;
    }

    try {
      const slug = subcategoryForm.name.toLowerCase().replace(/\s+/g, '-');
      
      const { error } = await supabase
        .from('subcategories')
        .insert({
          category_id: selectedCategoryId,
          name: subcategoryForm.name,
          slug,
          description: subcategoryForm.description || null
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: `Subcategory "${subcategoryForm.name}" has been added successfully.`
      });

      setSubcategoryForm({ name: "", description: "" });
      setSelectedCategoryId(null);
      setSubcategoryDialogOpen(false);
      fetchCategories();
    } catch (error) {
      console.error('Error adding subcategory:', error);
      toast({
        title: "Error",
        description: "Failed to add subcategory",
        variant: "destructive"
      });
    }
  };

  const handleDeleteCategory = async (id: string) => {
    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Category has been deleted successfully."
      });

      fetchCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
      toast({
        title: "Error",
        description: "Failed to delete category",
        variant: "destructive"
      });
    }
  };

  const handleDeleteSubcategory = async (subcategoryId: string) => {
    try {
      const { error } = await supabase
        .from('subcategories')
        .delete()
        .eq('id', subcategoryId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Subcategory has been deleted successfully."
      });

      fetchCategories();
    } catch (error) {
      console.error('Error deleting subcategory:', error);
      toast({
        title: "Error",
        description: "Failed to delete subcategory",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return <div className="flex justify-center p-8">Loading categories...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Category Management</h2>
      </div>

      <div className="flex gap-4">
        <Dialog open={categoryDialogOpen} onOpenChange={setCategoryDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add New Category</DialogTitle>
              <DialogDescription>
                Create a new product category with a custom image
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="category-name">Category Name *</Label>
                <Input
                  id="category-name"
                  placeholder="e.g., Electronics"
                  value={categoryForm.name}
                  onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category-description">Description</Label>
                <Textarea
                  id="category-description"
                  placeholder="Brief description of the category"
                  value={categoryForm.description}
                  onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category-image">Category Image</Label>
                <div className="flex items-center gap-4">
                  <Input
                    id="category-image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="flex-1"
                  />
                  {imagePreview && (
                    <div className="w-16 h-16 rounded border overflow-hidden">
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => {
                setCategoryDialogOpen(false);
                setCategoryForm({ name: "", description: "" });
                setImageFile(null);
                setImagePreview(null);
              }}>
                Cancel
              </Button>
              <Button onClick={handleAddCategory}>Create Category</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <Card key={category.id}>
            <CardHeader>
              <div className="flex justify-between items-start gap-2">
                <div className="flex-1">
                  {category.image_url && (
                    <div className="w-full h-32 mb-3 rounded overflow-hidden bg-muted">
                      <img 
                        src={category.image_url} 
                        alt={category.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <CardTitle className="text-lg">{category.name}</CardTitle>
                  <CardDescription>/{category.slug}</CardDescription>
                  {category.description && (
                    <p className="text-xs text-muted-foreground mt-1">{category.description}</p>
                  )}
                </div>
                <div className="flex gap-1">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleDeleteCategory(category.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Products</span>
                  <Badge variant="outline">{category.productCount}</Badge>
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium">Subcategories:</p>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => {
                        setSelectedCategoryId(category.id);
                        setSubcategoryDialogOpen(true);
                      }}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {category.subcategories.map((sub) => (
                      <Badge 
                        key={sub.id} 
                        variant="secondary" 
                        className="text-xs cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
                        onClick={() => handleDeleteSubcategory(sub.id)}
                      >
                        {sub.name}
                        <Trash2 className="h-3 w-3 ml-1" />
                      </Badge>
                    ))}
                    {category.subcategories.length === 0 && (
                      <span className="text-xs text-muted-foreground">No subcategories yet</span>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={subcategoryDialogOpen} onOpenChange={setSubcategoryDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add Subcategory</DialogTitle>
            <DialogDescription>
              Add a new subcategory to {categories.find(c => c.id === selectedCategoryId)?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="subcategory-name">Subcategory Name *</Label>
              <Input
                id="subcategory-name"
                placeholder="e.g., Smartphones"
                value={subcategoryForm.name}
                onChange={(e) => setSubcategoryForm({ ...subcategoryForm, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="subcategory-description">Description</Label>
              <Textarea
                id="subcategory-description"
                placeholder="Brief description of the subcategory"
                value={subcategoryForm.description}
                onChange={(e) => setSubcategoryForm({ ...subcategoryForm, description: e.target.value })}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => {
              setSubcategoryDialogOpen(false);
              setSubcategoryForm({ name: "", description: "" });
              setSelectedCategoryId(null);
            }}>
              Cancel
            </Button>
            <Button onClick={handleAddSubcategory}>Create Subcategory</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminCategories;