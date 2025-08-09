import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { Plus, Edit, Trash2 } from "lucide-react";

interface Category {
  id: string;
  name: string;
  slug: string;
  productCount: number;
  subcategories: string[];
}

const mockCategories: Category[] = [
  {
    id: "1",
    name: "Electronics",
    slug: "electronics",
    productCount: 245,
    subcategories: ["Smartphones", "Laptops", "Accessories"]
  },
  {
    id: "2", 
    name: "Clothing",
    slug: "clothing",
    productCount: 189,
    subcategories: ["Men", "Women", "Kids"]
  },
  {
    id: "3",
    name: "Home & Garden",
    slug: "home-garden", 
    productCount: 156,
    subcategories: ["Furniture", "Kitchen", "Appliances"]
  }
];

const AdminCategories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>(mockCategories);
  const [newCategory, setNewCategory] = useState("");
  const { toast } = useToast();

  const handleAddCategory = () => {
    if (!newCategory.trim()) return;

    const category: Category = {
      id: Date.now().toString(),
      name: newCategory,
      slug: newCategory.toLowerCase().replace(/\s+/g, '-'),
      productCount: 0,
      subcategories: []
    };

    setCategories([...categories, category]);
    setNewCategory("");
    
    toast({
      title: "Category added",
      description: `${newCategory} has been added successfully.`
    });
  };

  const handleDeleteCategory = (id: string) => {
    setCategories(categories.filter(cat => cat.id !== id));
    toast({
      title: "Category deleted",
      description: "Category has been deleted successfully."
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Category Management</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Add New Category</CardTitle>
          <CardDescription>Create new product categories for the platform</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              placeholder="Category name"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddCategory()}
            />
            <Button onClick={handleAddCategory}>
              <Plus className="h-4 w-4 mr-2" />
              Add Category
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <Card key={category.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{category.name}</CardTitle>
                  <CardDescription>/{category.slug}</CardDescription>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
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
                  <p className="text-sm font-medium mb-2">Subcategories:</p>
                  <div className="flex flex-wrap gap-1">
                    {category.subcategories.map((sub, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {sub}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminCategories;