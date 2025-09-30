-- Allow anyone to view stores (needed for public storefront pages)
CREATE POLICY "Anyone can view stores"
ON public.stores
FOR SELECT
USING (true);