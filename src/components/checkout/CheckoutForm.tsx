
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ShippingForm from "./ShippingForm";
import PaymentMethodSelector from "./PaymentMethodSelector";
import { supabase } from "@/integrations/supabase/client";

const checkoutSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  postalCode: z.string().min(1, "Postal code is required"),
  phone: z.string().min(1, "Phone number is required"),
  paymentMethod: z.enum(["card", "eft"], {
    required_error: "Please select a payment method",
  }),
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

interface CheckoutFormProps {
  isProcessing: boolean;
  setIsProcessing: (processing: boolean) => void;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({
  isProcessing,
  setIsProcessing,
}) => {
  const { cart, clearCart } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      email: user?.email || "",
      firstName: "",
      lastName: "",
      address: "",
      city: "",
      postalCode: "",
      phone: "",
      paymentMethod: "card",
    },
  });

  const onSubmit = async (values: CheckoutFormValues) => {
    if (!cart?.items?.length) {
      toast({
        variant: "destructive",
        title: "Cart is empty",
        description: "Please add items to your cart before checking out.",
      });
      return;
    }

    setIsProcessing(true);

    try {
      const orderData = {
        ...values,
        items: cart.items,
        total: cart.subtotal || 0,
        userId: user?.id,
      };

      if (values.paymentMethod === "card" || values.paymentMethod === "eft") {
        // Use the PayFast edge function for both card and EFT payments
        const { data: paymentData, error } = await supabase.functions.invoke('payfast-payment', {
          body: {
            amount: cart.subtotal || 0,
            itemName: `Order for ${cart.items.length} items`,
            returnUrl: `${window.location.origin}/checkout/success`,
            cancelUrl: `${window.location.origin}/checkout/cancel`,
            notifyUrl: `${window.location.origin}/api/payfast/notify`,
            customerEmail: values.email,
            customerFirstName: values.firstName,
            customerLastName: values.lastName,
            paymentMethod: values.paymentMethod, // Pass the specific payment method
          },
        });

        if (error) {
          throw new Error(error.message || "Failed to create payment");
        }

        if (paymentData?.success && paymentData?.formData) {
          // Create and submit form to PayFast
          const form = document.createElement('form');
          form.method = 'POST';
          form.action = paymentData.action;
          form.style.display = 'none';

          // Add all payment data as hidden inputs
          Object.entries(paymentData.formData).forEach(([key, value]) => {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = key;
            input.value = value.toString();
            form.appendChild(input);
          });

          document.body.appendChild(form);
          form.submit();
        } else {
          throw new Error("No payment data received");
        }
      } else {
        // Handle other payment methods here
        toast({
          title: "Payment method not implemented",
          description: "This payment method is not yet available.",
        });
      }
    } catch (error) {
      console.error("Checkout error:", error);
      toast({
        variant: "destructive",
        title: "Checkout failed",
        description: error instanceof Error ? error.message : "An error occurred during checkout",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div>
          <h2 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h2>
          <ShippingForm control={form.control} />
        </div>

        <div>
          <h2 className="text-lg font-medium text-gray-900 mb-4">Payment Method</h2>
          <PaymentMethodSelector control={form.control} />
        </div>

        <Button
          type="submit"
          className="w-full bg-wwe-navy hover:bg-wwe-navy/90"
          disabled={isProcessing}
        >
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            `Complete Order - R${(cart?.subtotal || 0).toFixed(2)}`
          )}
        </Button>
      </form>
    </Form>
  );
};

export default CheckoutForm;
