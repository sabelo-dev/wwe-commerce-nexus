import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Upload, X } from "lucide-react";
import { z } from "zod";

const productSchema = z.object({
  name: z.string().min(1, "Product name is required").max(200),
  description: z.string().optional(),
  price: z.number().min(0.01, "Price must be greater than 0"),
  compareAtPrice: z.number().optional(),
  sku: z.string().optional(),
  quantity: z.number().min(0, "Quantity cannot be negative"),
  category: z.string().min(1, "Category is required"),
  subcategory: z.string().optional(),
});

type ProductFormData = z.infer<typeof productSchema>;

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  product?: any;
  mode: "add" | "edit";
}

const categories = [
  "Electronics",
  "Clothing",
  "Home & Garden",
  "Health & Beauty",
  "Sports & Outdoors",
  "Books & Media",
  "Toys & Games",
  "Food & Beverages",
  "Automotive",
  "Other"
];

const ProductFormModal: React.FC<ProductFormModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  product,
  mode
}) => {
  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    description: "",
    price: 0,
    compareAtPrice: undefined,
    sku: "",
    quantity: 0,
    category: "",
    subcategory: "",
  });
  
  const [images, setImages] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (product && mode === "edit") {
      setFormData({
        name: product.name || "",
        description: product.description || "",
        price: parseFloat(product.price) || 0,
        compareAtPrice: product.compare_at_price ? parseFloat(product.compare_at_price) : undefined,
        sku: product.sku || "",
        quantity: product.quantity || 0,
        category: product.category || "",
        subcategory: product.subcategory || "",
      });
      setExistingImages(product.product_images || []);
    } else {
      // Reset form for add mode
      setFormData({
        name: "",
        description: "",
        price: 0,
        compareAtPrice: undefined,
        sku: "",
        quantity: 0,
        category: "",
        subcategory: "",
      });
      setExistingImages([]);
      setImages([]);
    }
    setErrors({});
  }, [product, mode, isOpen]);

  const handleInputChange = (field: keyof ProductFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newImages = Array.from(e.target.files);
      setImages(prev => [...prev, ...newImages]);
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = async (imageId: string) => {
    try {
      const { error } = await supabase
        .from('product_images')
        .delete()
        .eq('id', imageId);

      if (error) throw error;

      setExistingImages(prev => prev.filter(img => img.id !== imageId));
      toast({
        title: "Image Removed",
        description: "Product image has been removed successfully.",
      });
    } catch (error) {
      console.error('Error removing image:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to remove image.",
      });
    }
  };

  const uploadImages = async (productId: string) => {
    const uploadPromises = images.map(async (image, index) => {
      const fileExt = image.name.split('.').pop();
      const fileName = `${productId}/${Date.now()}-${index}.${fileExt}`;
      
      const { data, error } = await supabase.storage
        .from('product-images')
        .upload(fileName, image);

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(fileName);

      // Save image record to database
      await supabase
        .from('product_images')
        .insert({
          product_id: productId,
          image_url: publicUrl,
          position: existingImages.length + index,
        });
    });

    await Promise.all(uploadPromises);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      // Validate form data
      const validatedData = productSchema.parse(formData);

      // Get vendor's store
      const { data: vendorData, error: vendorError } = await supabase
        .from('vendors')
        .select('id, stores(id)')
        .eq('user_id', user?.id)
        .single();

      if (vendorError || !vendorData?.stores?.[0]) {
        throw new Error("Vendor store not found");
      }

      const storeId = vendorData.stores[0].id;

      if (mode === "add") {
        // Create new product
        const { data: newProduct, error: productError } = await supabase
          .from('products')
          .insert({
            store_id: storeId,
            name: validatedData.name,
            slug: validatedData.name.toLowerCase().replace(/\s+/g, '-'),
            description: validatedData.description,
            price: validatedData.price,
            compare_at_price: validatedData.compareAtPrice,
            sku: validatedData.sku,
            quantity: validatedData.quantity,
            category: validatedData.category,
            subcategory: validatedData.subcategory,
            status: 'pending'
          })
          .select()
          .single();

        if (productError) throw productError;

        // Upload images if any
        if (images.length > 0) {
          await uploadImages(newProduct.id);
        }

        toast({
          title: "Product Created",
          description: "Your product has been created and is pending approval.",
        });
      } else {
        // Update existing product
        const { error: updateError } = await supabase
          .from('products')
          .update({
            name: validatedData.name,
            slug: validatedData.name.toLowerCase().replace(/\s+/g, '-'),
            description: validatedData.description,
            price: validatedData.price,
            compare_at_price: validatedData.compareAtPrice,
            sku: validatedData.sku,
            quantity: validatedData.quantity,
            category: validatedData.category,
            subcategory: validatedData.subcategory,
          })
          .eq('id', product.id);

        if (updateError) throw updateError;

        // Upload new images if any
        if (images.length > 0) {
          await uploadImages(product.id);
        }

        toast({
          title: "Product Updated",
          description: "Your product has been updated successfully.",
        });
      }

      onSuccess();
      onClose();
    } catch (error: any) {
      console.error('Error saving product:', error);
      
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            fieldErrors[err.path[0]] = err.message;
          }
        });
        setErrors(fieldErrors);
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message || "Failed to save product.",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === "add" ? "Add New Product" : "Edit Product"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Product Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Enter product name"
              />
              {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category && <p className="text-sm text-destructive">{errors.category}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Enter product description"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price (R) *</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e) => handleInputChange("price", parseFloat(e.target.value) || 0)}
              />
              {errors.price && <p className="text-sm text-destructive">{errors.price}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="compareAtPrice">Compare At Price (R)</Label>
              <Input
                id="compareAtPrice"
                type="number"
                step="0.01"
                min="0"
                value={formData.compareAtPrice || ""}
                onChange={(e) => handleInputChange("compareAtPrice", parseFloat(e.target.value) || undefined)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity *</Label>
              <Input
                id="quantity"
                type="number"
                min="0"
                value={formData.quantity}
                onChange={(e) => handleInputChange("quantity", parseInt(e.target.value) || 0)}
              />
              {errors.quantity && <p className="text-sm text-destructive">{errors.quantity}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="sku">SKU</Label>
              <Input
                id="sku"
                value={formData.sku}
                onChange={(e) => handleInputChange("sku", e.target.value)}
                placeholder="Enter SKU (optional)"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="subcategory">Subcategory</Label>
              <Input
                id="subcategory"
                value={formData.subcategory}
                onChange={(e) => handleInputChange("subcategory", e.target.value)}
                placeholder="Enter subcategory (optional)"
              />
            </div>
          </div>

          {/* Existing Images */}
          {existingImages.length > 0 && (
            <div className="space-y-2">
              <Label>Current Images</Label>
              <div className="grid grid-cols-3 gap-2">
                {existingImages.map((image) => (
                  <div key={image.id} className="relative">
                    <img
                      src={image.image_url}
                      alt="Product"
                      className="w-full h-20 object-cover rounded"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute -top-2 -right-2 h-6 w-6"
                      onClick={() => removeExistingImage(image.id)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* New Images */}
          <div className="space-y-2">
            <Label htmlFor="images">Add Images</Label>
            <Input
              id="images"
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
            />
            {images.length > 0 && (
              <div className="grid grid-cols-3 gap-2 mt-2">
                {images.map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={URL.createObjectURL(image)}
                      alt="Preview"
                      className="w-full h-20 object-cover rounded"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute -top-2 -right-2 h-6 w-6"
                      onClick={() => removeImage(index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {mode === "add" ? "Create Product" : "Update Product"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProductFormModal;
