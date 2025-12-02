import { supabase } from "@/integrations/supabase/client";

interface ShippingRate {
  id: string;
  zone_id: string;
  name: string;
  rate_type: string;
  min_order_value: number;
  max_order_value: number | null;
  price: number;
  free_shipping_threshold: number | null;
  is_active: boolean;
}

interface CartItem {
  productId: string;
  productType?: string;
}

export const calculateShipping = async (subtotal: number, cartItems?: CartItem[]): Promise<number> => {
  // If all items are downloadable, shipping is free
  if (cartItems && cartItems.length > 0) {
    const allDownloadable = cartItems.every(item => item.productType === 'downloadable');
    if (allDownloadable) {
      return 0;
    }
  }
  try {
    // Fetch active shipping rates
    const { data: rates, error } = await supabase
      .from("shipping_rates")
      .select("*")
      .eq("is_active", true)
      .order("min_order_value", { ascending: true });

    if (error) {
      console.error("Error fetching shipping rates:", error);
      return 0; // Fallback to free shipping on error
    }

    if (!rates || rates.length === 0) {
      return 0; // No rates configured, free shipping
    }

    // Find the applicable rate based on order value
    const applicableRate = rates.find((rate: ShippingRate) => {
      const meetsMin = subtotal >= rate.min_order_value;
      const meetsMax = rate.max_order_value === null || subtotal <= rate.max_order_value;
      return meetsMin && meetsMax;
    });

    if (!applicableRate) {
      // No matching rate found, use the last rate or free shipping
      return 0;
    }

    // Check if order qualifies for free shipping
    if (
      applicableRate.free_shipping_threshold !== null &&
      subtotal >= applicableRate.free_shipping_threshold
    ) {
      return 0;
    }

    // Calculate shipping based on rate type
    const rateType = applicableRate.rate_type.toLowerCase();
    
    if (rateType === 'flat_rate' || rateType === 'flat') {
      // Fixed price shipping
      return Number(applicableRate.price);
    } else if (rateType === 'order_value' || rateType === 'percentage') {
      // Percentage-based shipping (price field represents percentage)
      return Number((subtotal * applicableRate.price) / 100);
    }

    // Default to flat rate if type is unknown
    return Number(applicableRate.price);
  } catch (error) {
    console.error("Error calculating shipping:", error);
    return 0; // Fallback to free shipping on error
  }
};
