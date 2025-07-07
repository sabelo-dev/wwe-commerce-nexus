-- Fix RLS policies for missing tables and improve security

-- Add policies for orders (users can view/create their own orders)
CREATE POLICY "Users can view their own orders" ON public.orders FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own orders" ON public.orders FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- Add policies for order_items (users can view their order items, vendors can view items from their stores)
CREATE POLICY "Users can view their own order items" ON public.order_items FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM public.orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())
);
CREATE POLICY "Vendors can view order items from their stores" ON public.order_items FOR SELECT TO authenticated USING (
  EXISTS (
    SELECT 1 FROM public.stores 
    JOIN public.vendors ON stores.vendor_id = vendors.id 
    WHERE stores.id = order_items.store_id AND vendors.user_id = auth.uid()
  )
);
CREATE POLICY "Vendors can update order items from their stores" ON public.order_items FOR UPDATE TO authenticated USING (
  EXISTS (
    SELECT 1 FROM public.stores 
    JOIN public.vendors ON stores.vendor_id = vendors.id 
    WHERE stores.id = order_items.store_id AND vendors.user_id = auth.uid()
  )
);

-- Add policies for product_images (public access for approved products)
CREATE POLICY "Anyone can view product images for approved products" ON public.product_images FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.products 
    WHERE products.id = product_images.product_id 
    AND (products.status = 'approved' OR products.status = 'active')
  )
);
CREATE POLICY "Vendors can manage images for their own products" ON public.product_images FOR ALL TO authenticated USING (
  EXISTS (
    SELECT 1 FROM public.products
    JOIN public.stores ON products.store_id = stores.id
    JOIN public.vendors ON stores.vendor_id = vendors.id
    WHERE products.id = product_images.product_id AND vendors.user_id = auth.uid()
  )
);

-- Add policies for product_variations (public access for approved products)
CREATE POLICY "Anyone can view variations for approved products" ON public.product_variations FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.products 
    WHERE products.id = product_variations.product_id 
    AND (products.status = 'approved' OR products.status = 'active')
  )
);
CREATE POLICY "Vendors can manage variations for their own products" ON public.product_variations FOR ALL TO authenticated USING (
  EXISTS (
    SELECT 1 FROM public.products
    JOIN public.stores ON products.store_id = stores.id
    JOIN public.vendors ON stores.vendor_id = vendors.id
    WHERE products.id = product_variations.product_id AND vendors.user_id = auth.uid()
  )
);

-- Add policies for vendor_notifications (vendors can view their own notifications)
CREATE POLICY "Vendors can view their own notifications" ON public.vendor_notifications FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM public.vendors WHERE vendors.id = vendor_notifications.vendor_id AND vendors.user_id = auth.uid())
);
CREATE POLICY "Vendors can mark their notifications as read" ON public.vendor_notifications FOR UPDATE TO authenticated USING (
  EXISTS (SELECT 1 FROM public.vendors WHERE vendors.id = vendor_notifications.vendor_id AND vendors.user_id = auth.uid())
) WITH CHECK (
  EXISTS (SELECT 1 FROM public.vendors WHERE vendors.id = vendor_notifications.vendor_id AND vendors.user_id = auth.uid())
);

-- Add policies for collections (public access)
CREATE POLICY "Anyone can view collections" ON public.collections FOR SELECT USING (true);

-- Add policies for collection_products (public access)
CREATE POLICY "Anyone can view collection products" ON public.collection_products FOR SELECT USING (true);

-- Add policies for store_categories (public access)
CREATE POLICY "Anyone can view store categories" ON public.store_categories FOR SELECT USING (true);

-- Add policies for import_jobs (vendors and admins can view, admins can manage)
CREATE POLICY "Vendors can view import jobs they created" ON public.import_jobs FOR SELECT TO authenticated USING (
  created_by = auth.uid() OR 
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins can manage import jobs" ON public.import_jobs FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Add policies for wefullfil tables (admins and vendors can access)
CREATE POLICY "Admins and vendors can manage wefullfil products" ON public.wefullfil_products FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND (role = 'admin' OR role = 'vendor'))
);
CREATE POLICY "Admins and vendors can manage wefullfil variants" ON public.wefullfil_product_variants FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND (role = 'admin' OR role = 'vendor'))
);

-- Add policies for payouts (vendors can view their own, admins can view all)
CREATE POLICY "Vendors can view their own payouts" ON public.payouts FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM public.vendors WHERE vendors.id = payouts.vendor_id AND vendors.user_id = auth.uid())
);
CREATE POLICY "Admins can manage all payouts" ON public.payouts FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Improve admin policies with server-side validation
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;