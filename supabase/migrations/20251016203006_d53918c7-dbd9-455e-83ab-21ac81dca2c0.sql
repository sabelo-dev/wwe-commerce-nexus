-- Create attribute types table
CREATE TABLE public.attribute_types (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  type TEXT NOT NULL CHECK (type IN ('color', 'size', 'custom')),
  category TEXT CHECK (category IN ('clothing', 'shoes', 'general')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create attribute values table
CREATE TABLE public.attribute_values (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  attribute_type_id UUID NOT NULL REFERENCES public.attribute_types(id) ON DELETE CASCADE,
  value TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  color_hex TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(attribute_type_id, value)
);

-- Create custom attribute values for vendors
CREATE TABLE public.custom_attribute_values (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  vendor_id UUID NOT NULL REFERENCES public.vendors(id) ON DELETE CASCADE,
  attribute_type_id UUID NOT NULL REFERENCES public.attribute_types(id) ON DELETE CASCADE,
  value TEXT NOT NULL,
  color_hex TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(vendor_id, attribute_type_id, value)
);

-- Enable RLS
ALTER TABLE public.attribute_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attribute_values ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.custom_attribute_values ENABLE ROW LEVEL SECURITY;

-- RLS Policies for attribute_types
CREATE POLICY "Anyone can view attribute types"
  ON public.attribute_types
  FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage attribute types"
  ON public.attribute_types
  FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for attribute_values
CREATE POLICY "Anyone can view attribute values"
  ON public.attribute_values
  FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage attribute values"
  ON public.attribute_values
  FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for custom_attribute_values
CREATE POLICY "Anyone can view custom attribute values"
  ON public.custom_attribute_values
  FOR SELECT
  USING (true);

CREATE POLICY "Vendors can manage their own custom attributes"
  ON public.custom_attribute_values
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.vendors
      WHERE vendors.id = custom_attribute_values.vendor_id
      AND vendors.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.vendors
      WHERE vendors.id = custom_attribute_values.vendor_id
      AND vendors.user_id = auth.uid()
    )
  );

-- Insert default color attributes
INSERT INTO public.attribute_types (name, type, category) VALUES
  ('Color', 'color', 'general');

INSERT INTO public.attribute_values (attribute_type_id, value, display_order, color_hex) VALUES
  ((SELECT id FROM public.attribute_types WHERE name = 'Color'), 'Black', 1, '#000000'),
  ((SELECT id FROM public.attribute_types WHERE name = 'Color'), 'White', 2, '#FFFFFF'),
  ((SELECT id FROM public.attribute_types WHERE name = 'Color'), 'Red', 3, '#FF0000'),
  ((SELECT id FROM public.attribute_types WHERE name = 'Color'), 'Blue', 4, '#0000FF'),
  ((SELECT id FROM public.attribute_types WHERE name = 'Color'), 'Green', 5, '#00FF00'),
  ((SELECT id FROM public.attribute_types WHERE name = 'Color'), 'Yellow', 6, '#FFFF00'),
  ((SELECT id FROM public.attribute_types WHERE name = 'Color'), 'Orange', 7, '#FFA500'),
  ((SELECT id FROM public.attribute_types WHERE name = 'Color'), 'Purple', 8, '#800080'),
  ((SELECT id FROM public.attribute_types WHERE name = 'Color'), 'Pink', 9, '#FFC0CB'),
  ((SELECT id FROM public.attribute_types WHERE name = 'Color'), 'Brown', 10, '#A52A2A'),
  ((SELECT id FROM public.attribute_types WHERE name = 'Color'), 'Grey', 11, '#808080'),
  ((SELECT id FROM public.attribute_types WHERE name = 'Color'), 'Navy', 12, '#000080'),
  ((SELECT id FROM public.attribute_types WHERE name = 'Color'), 'Beige', 13, '#F5F5DC');

-- Insert clothing size attributes
INSERT INTO public.attribute_types (name, type, category) VALUES
  ('Clothing Size', 'size', 'clothing');

INSERT INTO public.attribute_values (attribute_type_id, value, display_order) VALUES
  ((SELECT id FROM public.attribute_types WHERE name = 'Clothing Size'), 'XXS', 1),
  ((SELECT id FROM public.attribute_types WHERE name = 'Clothing Size'), 'XS', 2),
  ((SELECT id FROM public.attribute_types WHERE name = 'Clothing Size'), 'S', 3),
  ((SELECT id FROM public.attribute_types WHERE name = 'Clothing Size'), 'M', 4),
  ((SELECT id FROM public.attribute_types WHERE name = 'Clothing Size'), 'L', 5),
  ((SELECT id FROM public.attribute_types WHERE name = 'Clothing Size'), 'XL', 6),
  ((SELECT id FROM public.attribute_types WHERE name = 'Clothing Size'), 'XXL', 7),
  ((SELECT id FROM public.attribute_types WHERE name = 'Clothing Size'), '3XL', 8),
  ((SELECT id FROM public.attribute_types WHERE name = 'Clothing Size'), '4XL', 9),
  ((SELECT id FROM public.attribute_types WHERE name = 'Clothing Size'), '5XL', 10);

-- Insert shoe size attributes (UK)
INSERT INTO public.attribute_types (name, type, category) VALUES
  ('Shoe Size (UK)', 'size', 'shoes');

INSERT INTO public.attribute_values (attribute_type_id, value, display_order) VALUES
  ((SELECT id FROM public.attribute_types WHERE name = 'Shoe Size (UK)'), 'UK 2', 1),
  ((SELECT id FROM public.attribute_types WHERE name = 'Shoe Size (UK)'), 'UK 2.5', 2),
  ((SELECT id FROM public.attribute_types WHERE name = 'Shoe Size (UK)'), 'UK 3', 3),
  ((SELECT id FROM public.attribute_types WHERE name = 'Shoe Size (UK)'), 'UK 3.5', 4),
  ((SELECT id FROM public.attribute_types WHERE name = 'Shoe Size (UK)'), 'UK 4', 5),
  ((SELECT id FROM public.attribute_types WHERE name = 'Shoe Size (UK)'), 'UK 4.5', 6),
  ((SELECT id FROM public.attribute_types WHERE name = 'Shoe Size (UK)'), 'UK 5', 7),
  ((SELECT id FROM public.attribute_types WHERE name = 'Shoe Size (UK)'), 'UK 5.5', 8),
  ((SELECT id FROM public.attribute_types WHERE name = 'Shoe Size (UK)'), 'UK 6', 9),
  ((SELECT id FROM public.attribute_types WHERE name = 'Shoe Size (UK)'), 'UK 6.5', 10),
  ((SELECT id FROM public.attribute_types WHERE name = 'Shoe Size (UK)'), 'UK 7', 11),
  ((SELECT id FROM public.attribute_types WHERE name = 'Shoe Size (UK)'), 'UK 7.5', 12),
  ((SELECT id FROM public.attribute_types WHERE name = 'Shoe Size (UK)'), 'UK 8', 13),
  ((SELECT id FROM public.attribute_types WHERE name = 'Shoe Size (UK)'), 'UK 8.5', 14),
  ((SELECT id FROM public.attribute_types WHERE name = 'Shoe Size (UK)'), 'UK 9', 15),
  ((SELECT id FROM public.attribute_types WHERE name = 'Shoe Size (UK)'), 'UK 9.5', 16),
  ((SELECT id FROM public.attribute_types WHERE name = 'Shoe Size (UK)'), 'UK 10', 17),
  ((SELECT id FROM public.attribute_types WHERE name = 'Shoe Size (UK)'), 'UK 10.5', 18),
  ((SELECT id FROM public.attribute_types WHERE name = 'Shoe Size (UK)'), 'UK 11', 19),
  ((SELECT id FROM public.attribute_types WHERE name = 'Shoe Size (UK)'), 'UK 11.5', 20),
  ((SELECT id FROM public.attribute_types WHERE name = 'Shoe Size (UK)'), 'UK 12', 21),
  ((SELECT id FROM public.attribute_types WHERE name = 'Shoe Size (UK)'), 'UK 13', 22),
  ((SELECT id FROM public.attribute_types WHERE name = 'Shoe Size (UK)'), 'UK 14', 23);

-- Create trigger for updated_at
CREATE TRIGGER update_attribute_types_updated_at
  BEFORE UPDATE ON public.attribute_types
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_attribute_values_updated_at
  BEFORE UPDATE ON public.attribute_values
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();