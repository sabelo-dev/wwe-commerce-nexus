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
import { Loader2, Upload, X, Plus, Trash2, GripVertical } from "lucide-react";
import { z } from "zod";
import { fetchCategories, fetchSubcategoriesByCategory } from "@/services/products";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

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

const variationSchema = z.object({
  id: z.string(),
  attributes: z.record(z.string()),
  price: z.number().min(0.01, "Price must be greater than 0"),
  quantity: z.number().min(0, "Quantity cannot be negative"),
  sku: z.string().optional(),
});

type ProductFormData = z.infer<typeof productSchema>;

interface AttributeWithImage {
  name: string;
  value: string;
  image?: ImageWithPreview;
}

interface ProductVariation {
  id?: string;
  attributes: AttributeWithImage[];
  price: number;
  quantity: number;
  sku?: string;
  images?: ImageWithPreview[];
}

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  product?: any;
  mode: "add" | "edit";
}

interface ImageWithPreview {
  file?: File;
  url: string;
  id?: string;
  position: number;
}

// Sortable Image Component
const SortableImageItem = ({ image, index, onRemove }: { 
  image: ImageWithPreview; 
  index: number; 
  onRemove: () => void;
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: `image-${index}` });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="relative group">
      <div className="relative">
        <img
          src={image.url}
          alt="Product"
          className="w-full h-20 object-cover rounded border"
        />
        <div
          {...attributes}
          {...listeners}
          className="absolute top-1 left-1 bg-black/50 text-white p-1 rounded cursor-grab hover:bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <GripVertical className="h-3 w-3" />
        </div>
        <Button
          type="button"
          variant="destructive"
          size="icon"
          className="absolute -top-2 -right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={onRemove}
        >
          <X className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
};

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
  
  const [variations, setVariations] = useState<ProductVariation[]>([]);
  const [images, setImages] = useState<ImageWithPreview[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [subcategories, setSubcategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const { user } = useAuth();
  const { toast } = useToast();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Load categories on mount
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const categoriesData = await fetchCategories();
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error loading categories:', error);
      } finally {
        setLoadingCategories(false);
      }
    };
    loadCategories();
  }, []);

  // Update subcategories when category changes
  useEffect(() => {
    const loadSubcategories = async () => {
      if (formData.category) {
        const selectedCategory = categories.find(cat => cat.name === formData.category);
        if (selectedCategory) {
          const subs = await fetchSubcategoriesByCategory(selectedCategory.id);
          setSubcategories(subs);
          
          // Reset subcategory if current selection is not valid for new category
          if (formData.subcategory && !subs.some((sub: any) => sub.name === formData.subcategory)) {
            setFormData(prev => ({ ...prev, subcategory: "" }));
          }
        }
      } else {
        setSubcategories([]);
        setFormData(prev => ({ ...prev, subcategory: "" }));
      }
    };

    loadSubcategories();
  }, [formData.category, categories]);

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
      
      // Load existing images
      const existingImages: ImageWithPreview[] = (product.product_images || []).map((img: any, index: number) => ({
        url: img.image_url,
        id: img.id,
        position: index,
      }));
      setImages(existingImages);

      // Load existing variations (if any)
      // This would require fetching from product_variations table
      // For now, we'll start with empty variations
      setVariations([]);
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
      setImages([]);
      setVariations([]);
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
      const newFiles = Array.from(e.target.files);
      const newImages: ImageWithPreview[] = newFiles.map((file, index) => ({
        file,
        url: URL.createObjectURL(file),
        position: images.length + index,
      }));
      setImages(prev => [...prev, ...newImages]);
    }
  };

  const removeImage = async (index: number) => {
    const image = images[index];
    
    // If it's an existing image, delete from database
    if (image.id) {
      try {
        const { error } = await supabase
          .from('product_images')
          .delete()
          .eq('id', image.id);

        if (error) throw error;

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
        return;
      }
    }

    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setImages((items) => {
        const oldIndex = items.findIndex((item, index) => `image-${index}` === active.id);
        const newIndex = items.findIndex((item, index) => `image-${index}` === over?.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  // Variation management functions
  const addVariation = () => {
    const newVariation: ProductVariation = {
      id: `temp-${Date.now()}`,
      attributes: [],
      price: formData.price,
      quantity: 0,
      sku: "",
      images: [],
    };
    setVariations(prev => [...prev, newVariation]);
  };

  const removeVariation = (index: number) => {
    setVariations(prev => prev.filter((_, i) => i !== index));
  };

  const updateVariation = (index: number, field: keyof ProductVariation, value: any) => {
    setVariations(prev => 
      prev.map((variation, i) => 
        i === index ? { ...variation, [field]: value } : variation
      )
    );
  };

  const addVariationAttribute = (variationIndex: number) => {
    setVariations(prev => 
      prev.map((variation, i) => 
        i === variationIndex 
          ? { 
              ...variation, 
              attributes: [...variation.attributes, { name: '', value: '', image: undefined }]
            } 
          : variation
      )
    );
  };

  const updateVariationAttribute = (variationIndex: number, attrIndex: number, field: keyof AttributeWithImage, value: any) => {
    setVariations(prev => 
      prev.map((variation, i) => 
        i === variationIndex 
          ? {
              ...variation,
              attributes: variation.attributes.map((attr, ai) =>
                ai === attrIndex ? { ...attr, [field]: value } : attr
              )
            }
          : variation
      )
    );
  };

  const removeVariationAttribute = (variationIndex: number, attrIndex: number) => {
    setVariations(prev => 
      prev.map((variation, i) => 
        i === variationIndex 
          ? { 
              ...variation, 
              attributes: variation.attributes.filter((_, ai) => ai !== attrIndex)
            } 
          : variation
      )
    );
  };

  const handleAttributeImageChange = (variationIndex: number, attrIndex: number, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const newImage: ImageWithPreview = {
        file,
        url: URL.createObjectURL(file),
        position: 0,
      };
      updateVariationAttribute(variationIndex, attrIndex, 'image', newImage);
    }
  };

  const removeAttributeImage = (variationIndex: number, attrIndex: number) => {
    updateVariationAttribute(variationIndex, attrIndex, 'image', undefined);
  };

  const handleVariationImageChange = (variationIndex: number, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      const newImages: ImageWithPreview[] = newFiles.map((file, index) => ({
        file,
        url: URL.createObjectURL(file),
        position: (variations[variationIndex].images?.length || 0) + index,
      }));
      
      const updatedVariations = [...variations];
      updatedVariations[variationIndex] = {
        ...updatedVariations[variationIndex],
        images: [...(updatedVariations[variationIndex].images || []), ...newImages]
      };
      setVariations(updatedVariations);
    }
  };

  const removeVariationImage = (variationIndex: number, imageIndex: number) => {
    const updatedVariations = [...variations];
    const currentImages = updatedVariations[variationIndex].images || [];
    updatedVariations[variationIndex] = {
      ...updatedVariations[variationIndex],
      images: currentImages.filter((_, index) => index !== imageIndex)
    };
    setVariations(updatedVariations);
  };

  const uploadImages = async (productId: string) => {
    const uploadPromises = images
      .filter(img => img.file) // Only upload new files
      .map(async (image, index) => {
        const fileExt = image.file!.name.split('.').pop();
        const fileName = `${productId}/${Date.now()}-${index}.${fileExt}`;
        
        const { data, error } = await supabase.storage
          .from('product-images')
          .upload(fileName, image.file!);

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
            position: image.position,
          });
      });

    await Promise.all(uploadPromises);
  };

  const saveVariations = async (productId: string) => {
    if (variations.length === 0) return;

    // Delete existing variations if in edit mode
    if (mode === "edit") {
      await supabase
        .from('product_variations')
        .delete()
        .eq('product_id', productId);
    }

    // Create variations and handle their images
    for (const variation of variations) {
      if (variation.attributes.length > 0) {
        // Convert attributes array to object for storage and upload attribute images
        const attributesObject: Record<string, string> = {};
        const attributeImageUrls: Record<string, string> = {};
        
        for (const attr of variation.attributes) {
          if (attr.name && attr.value) {
            attributesObject[attr.name] = attr.value;
            
            // Upload attribute image if exists
            if (attr.image?.file) {
              const fileExt = attr.image.file.name.split('.').pop();
              const fileName = `attribute-images/${Date.now()}-${Math.random()}.${fileExt}`;
              
              const { error: uploadError } = await supabase.storage
                .from('product-images')
                .upload(fileName, attr.image.file);

              if (!uploadError) {
                const { data: urlData } = supabase.storage
                  .from('product-images')
                  .getPublicUrl(fileName);
                
                attributeImageUrls[attr.name] = urlData.publicUrl;
              }
            }
          }
        }

        const { data: variationResult, error: variationError } = await supabase
          .from('product_variations')
          .insert({
            product_id: productId,
            attributes: { ...attributesObject, _images: attributeImageUrls },
            price: variation.price,
            quantity: variation.quantity,
            sku: variation.sku
          })
          .select()
          .single();

        if (variationError) {
          console.error('Error creating variation:', variationError);
          continue;
        }

        // Handle variation gallery images
        if (variation.images && variation.images.length > 0) {
          for (let i = 0; i < variation.images.length; i++) {
            const image = variation.images[i];
            if (image.file) {
              const fileExt = image.file.name.split('.').pop();
              const fileName = `variation-images/${Date.now()}-${Math.random()}.${fileExt}`;
              const filePath = fileName;

              const { error: uploadError } = await supabase.storage
                .from('product-images')
                .upload(filePath, image.file);

              if (uploadError) {
                console.error('Error uploading variation image:', uploadError);
                continue;
              }

              const { data: urlData } = supabase.storage
                .from('product-images')
                .getPublicUrl(filePath);

              // Save variation image record
              const { error: imageError } = await supabase
                .from('variation_images')
                .insert({
                  variation_id: variationResult.id,
                  image_url: urlData.publicUrl,
                  position: i
                });

              if (imageError) {
                console.error('Error saving variation image:', imageError);
              }
            }
          }
        }
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      // Validate form data
      const validatedData = productSchema.parse(formData);

      // Get vendor's store and info
      const { data: vendorData, error: vendorError } = await supabase
        .from('vendors')
        .select('id, business_name, stores(id)')
        .eq('user_id', user?.id)
        .single();

      if (vendorError || !vendorData?.stores?.[0]) {
        throw new Error("Vendor store not found");
      }

      const storeId = vendorData.stores[0].id;

      if (mode === "add") {
        // Create new product with vendor tracking
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

        // Upload images and save variations
        await Promise.all([
          uploadImages(newProduct.id),
          saveVariations(newProduct.id),
        ]);

        toast({
          title: "Product Created",
          description: `Your product has been created by ${vendorData.business_name} and is pending approval.`,
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

        // Upload new images and save variations
        await Promise.all([
          uploadImages(product.id),
          saveVariations(product.id),
        ]);

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
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === "add" ? "Add New Product" : "Edit Product"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
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
              <Select 
                value={formData.category} 
                onValueChange={(value) => handleInputChange("category", value)}
                disabled={loadingCategories}
              >
                <SelectTrigger>
                  <SelectValue placeholder={loadingCategories ? "Loading..." : "Select category"} />
                </SelectTrigger>
                <SelectContent className="bg-popover border border-border z-50">
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.name}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category && <p className="text-sm text-destructive">{errors.category}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="subcategory">Subcategory</Label>
              <Select 
                value={formData.subcategory} 
                onValueChange={(value) => handleInputChange("subcategory", value)}
                disabled={!formData.category || subcategories.length === 0}
              >
                <SelectTrigger>
                  <SelectValue placeholder={
                    !formData.category ? "Select category first" : 
                    subcategories.length === 0 ? "No subcategories available" : 
                    "Select subcategory"
                  } />
                </SelectTrigger>
                <SelectContent className="bg-popover border border-border z-50">
                  {subcategories.map((subcategory) => (
                    <SelectItem key={subcategory.id} value={subcategory.name}>
                      {subcategory.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="sku">SKU</Label>
              <Input
                id="sku"
                value={formData.sku}
                onChange={(e) => handleInputChange("sku", e.target.value)}
                placeholder="Enter SKU (optional)"
              />
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

          {/* Product Variations */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-lg font-semibold">Product Variations</Label>
              <Button type="button" onClick={addVariation} variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Variation
              </Button>
            </div>
            
            {variations.map((variation, variationIndex) => (
              <div key={variation.id} className="border rounded-lg p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Variation {variationIndex + 1}</h4>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => removeVariation(variationIndex)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                {/* Variation Attributes */}
                <div className="space-y-2">
                  <Label>Attributes (e.g., Color: Red, Size: Large)</Label>
                  <div className="space-y-3">
                    {variation.attributes.map((attr, attrIndex) => (
                      <div key={attrIndex} className="border rounded p-3 space-y-2">
                        <div className="flex gap-2">
                          <Input
                            placeholder="Attribute name (e.g., Color)"
                            value={attr.name}
                            onChange={(e) => updateVariationAttribute(variationIndex, attrIndex, 'name', e.target.value)}
                            className="flex-1"
                          />
                          <Input
                            placeholder="Attribute value (e.g., Red)"
                            value={attr.value}
                            onChange={(e) => updateVariationAttribute(variationIndex, attrIndex, 'value', e.target.value)}
                            className="flex-1"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => removeVariationAttribute(variationIndex, attrIndex)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        {/* Attribute Image */}
                        <div className="space-y-2">
                          <Label className="text-sm">Attribute Image (optional)</Label>
                          <div className="flex gap-2 items-start">
                            <Input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleAttributeImageChange(variationIndex, attrIndex, e)}
                              className="flex-1"
                            />
                            {attr.image && (
                              <div className="relative">
                                <img
                                  src={attr.image.url}
                                  alt={`${attr.name} ${attr.value}`}
                                  className="w-16 h-16 object-cover rounded border"
                                />
                                <Button
                                  type="button"
                                  variant="destructive"
                                  size="icon"
                                  className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0"
                                  onClick={() => removeAttributeImage(variationIndex, attrIndex)}
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => addVariationAttribute(variationIndex)}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Attribute
                    </Button>
                  </div>
                </div>

                {/* Variation Details */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Price (R)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      value={variation.price}
                      onChange={(e) => updateVariation(variationIndex, 'price', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Quantity</Label>
                    <Input
                      type="number"
                      min="0"
                      value={variation.quantity}
                      onChange={(e) => updateVariation(variationIndex, 'quantity', parseInt(e.target.value) || 0)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>SKU</Label>
                    <Input
                      value={variation.sku}
                      onChange={(e) => updateVariation(variationIndex, 'sku', e.target.value)}
                      placeholder="Variation SKU"
                    />
                  </div>
                </div>

                {/* Variation Gallery */}
                <div className="space-y-2">
                  <Label>Variation Gallery (Multiple Images)</Label>
                  <p className="text-sm text-muted-foreground">Add multiple images showcasing this variation</p>
                  <div className="mt-2">
                    <Input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => handleVariationImageChange(variationIndex, e)}
                      className="mb-4"
                    />
                    
                    {variation.images && variation.images.length > 0 && (
                      <div className="grid grid-cols-4 gap-2">
                        {variation.images.map((image, imgIndex) => (
                          <div key={imgIndex} className="relative group">
                            <img
                              src={image.url}
                              alt={`Variation ${variationIndex + 1} gallery ${imgIndex + 1}`}
                              className="w-full h-24 object-cover rounded border"
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              size="icon"
                              className="absolute -top-2 -right-2 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => removeVariationImage(variationIndex, imgIndex)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Image Gallery */}
          <div className="space-y-4">
            <Label className="text-lg font-semibold">Product Images</Label>
            
            <div className="space-y-2">
              <Label htmlFor="images">Add Images</Label>
              <Input
                id="images"
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
              />
            </div>

            {images.length > 0 && (
              <div className="space-y-2">
                <Label>Image Gallery (Drag to reorder)</Label>
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext
                    items={images.map((_, index) => `image-${index}`)}
                    strategy={verticalListSortingStrategy}
                  >
                    <div className="grid grid-cols-4 gap-4">
                      {images.map((image, index) => (
                        <SortableImageItem
                          key={`image-${index}`}
                          image={image}
                          index={index}
                          onRemove={() => removeImage(index)}
                        />
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>
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