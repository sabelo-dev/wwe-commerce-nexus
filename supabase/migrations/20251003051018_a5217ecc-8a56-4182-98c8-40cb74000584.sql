-- Create reviews table
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  sentiment TEXT CHECK (sentiment IN ('positive', 'neutral', 'negative')),
  vendor_response TEXT,
  vendor_responded_at TIMESTAMP WITH TIME ZONE,
  flagged BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create promotions table
CREATE TABLE IF NOT EXISTS public.promotions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id UUID NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  code TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('percentage', 'fixed', 'free_shipping')),
  value NUMERIC NOT NULL,
  min_order_value NUMERIC DEFAULT 0,
  usage_limit INTEGER,
  usage_count INTEGER DEFAULT 0,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'expired', 'paused')),
  products JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(store_id, code)
);

-- Create conversations table
CREATE TABLE IF NOT EXISTS public.conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id UUID NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
  customer_id UUID NOT NULL,
  subject TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('customer_inquiry', 'order_support', 'admin_notification')),
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'resolved', 'pending')),
  order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
  last_message_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create messages table
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL,
  sender_type TEXT NOT NULL CHECK (sender_type IN ('customer', 'vendor', 'admin')),
  content TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create support_tickets table
CREATE TABLE IF NOT EXISTS public.support_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id UUID NOT NULL REFERENCES public.vendors(id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'pending', 'resolved', 'closed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create vendor_payment_methods table
CREATE TABLE IF NOT EXISTS public.vendor_payment_methods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id UUID NOT NULL REFERENCES public.vendors(id) ON DELETE CASCADE,
  account_holder_name TEXT NOT NULL,
  bank_name TEXT NOT NULL,
  account_number TEXT NOT NULL,
  account_type TEXT,
  is_default BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create inventory_settings table
CREATE TABLE IF NOT EXISTS public.inventory_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id UUID NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
  auto_restock_enabled BOOLEAN DEFAULT false,
  restock_threshold INTEGER DEFAULT 10,
  restock_quantity INTEGER DEFAULT 50,
  notifications_enabled BOOLEAN DEFAULT true,
  notification_threshold INTEGER DEFAULT 10,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(store_id)
);

-- Enable RLS
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.promotions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendor_payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for reviews
CREATE POLICY "Anyone can view reviews" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "Users can create reviews for their orders" ON public.reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Vendors can respond to reviews on their products" ON public.reviews FOR UPDATE 
  USING (EXISTS (
    SELECT 1 FROM products p
    JOIN stores s ON p.store_id = s.id
    JOIN vendors v ON s.vendor_id = v.id
    WHERE p.id = reviews.product_id AND v.user_id = auth.uid()
  ));

-- RLS Policies for promotions
CREATE POLICY "Vendors can manage their store promotions" ON public.promotions FOR ALL
  USING (EXISTS (
    SELECT 1 FROM stores s
    JOIN vendors v ON s.vendor_id = v.id
    WHERE s.id = promotions.store_id AND v.user_id = auth.uid()
  ));
CREATE POLICY "Anyone can view active promotions" ON public.promotions FOR SELECT 
  USING (status = 'active' AND start_date <= now() AND end_date >= now());

-- RLS Policies for conversations
CREATE POLICY "Customers can view their conversations" ON public.conversations FOR SELECT
  USING (auth.uid() = customer_id);
CREATE POLICY "Vendors can view conversations for their stores" ON public.conversations FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM stores s
    JOIN vendors v ON s.vendor_id = v.id
    WHERE s.id = conversations.store_id AND v.user_id = auth.uid()
  ));
CREATE POLICY "Customers can create conversations" ON public.conversations FOR INSERT
  WITH CHECK (auth.uid() = customer_id);

-- RLS Policies for messages
CREATE POLICY "Users can view messages in their conversations" ON public.messages FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM conversations c
    WHERE c.id = messages.conversation_id 
    AND (c.customer_id = auth.uid() OR EXISTS (
      SELECT 1 FROM stores s
      JOIN vendors v ON s.vendor_id = v.id
      WHERE s.id = c.store_id AND v.user_id = auth.uid()
    ))
  ));
CREATE POLICY "Users can send messages in their conversations" ON public.messages FOR INSERT
  WITH CHECK (auth.uid() = sender_id);
CREATE POLICY "Users can mark messages as read" ON public.messages FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM conversations c
    WHERE c.id = messages.conversation_id 
    AND (c.customer_id = auth.uid() OR EXISTS (
      SELECT 1 FROM stores s
      JOIN vendors v ON s.vendor_id = v.id
      WHERE s.id = c.store_id AND v.user_id = auth.uid()
    ))
  ));

-- RLS Policies for support_tickets
CREATE POLICY "Vendors can manage their tickets" ON public.support_tickets FOR ALL
  USING (EXISTS (
    SELECT 1 FROM vendors v
    WHERE v.id = support_tickets.vendor_id AND v.user_id = auth.uid()
  ));

-- RLS Policies for vendor_payment_methods
CREATE POLICY "Vendors can manage their payment methods" ON public.vendor_payment_methods FOR ALL
  USING (EXISTS (
    SELECT 1 FROM vendors v
    WHERE v.id = vendor_payment_methods.vendor_id AND v.user_id = auth.uid()
  ));

-- RLS Policies for inventory_settings
CREATE POLICY "Vendors can manage inventory settings for their stores" ON public.inventory_settings FOR ALL
  USING (EXISTS (
    SELECT 1 FROM stores s
    JOIN vendors v ON s.vendor_id = v.id
    WHERE s.id = inventory_settings.store_id AND v.user_id = auth.uid()
  ));

-- Create indexes
CREATE INDEX idx_reviews_product_id ON public.reviews(product_id);
CREATE INDEX idx_reviews_user_id ON public.reviews(user_id);
CREATE INDEX idx_promotions_store_id ON public.promotions(store_id);
CREATE INDEX idx_promotions_code ON public.promotions(store_id, code);
CREATE INDEX idx_conversations_store_id ON public.conversations(store_id);
CREATE INDEX idx_conversations_customer_id ON public.conversations(customer_id);
CREATE INDEX idx_messages_conversation_id ON public.messages(conversation_id);
CREATE INDEX idx_support_tickets_vendor_id ON public.support_tickets(vendor_id);

-- Create triggers for updated_at
CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON public.reviews
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_promotions_updated_at BEFORE UPDATE ON public.promotions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_conversations_updated_at BEFORE UPDATE ON public.conversations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_support_tickets_updated_at BEFORE UPDATE ON public.support_tickets
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_vendor_payment_methods_updated_at BEFORE UPDATE ON public.vendor_payment_methods
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_inventory_settings_updated_at BEFORE UPDATE ON public.inventory_settings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();