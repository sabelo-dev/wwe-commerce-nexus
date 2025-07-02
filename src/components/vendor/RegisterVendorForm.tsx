
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

const vendorSchema = z.object({
  businessName: z.string().min(2, "Business name must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  agreeTerms: z.boolean().refine(val => val === true, {
    message: "You must agree to the terms and conditions",
  }),
});

type VendorFormValues = z.infer<typeof vendorSchema>;

const RegisterVendorForm: React.FC = () => {
  const { user, refreshUserProfile } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const form = useForm<VendorFormValues>({
    resolver: zodResolver(vendorSchema),
    defaultValues: {
      businessName: "",
      description: "",
      agreeTerms: false,
    },
  });

  const onSubmit = async (values: VendorFormValues) => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Authentication Error",
        description: "You must be logged in to register as a vendor",
      });
      return;
    }

    try {
      // Update user role to vendor in profiles table
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ role: 'vendor' })
        .eq('id', user.id);

      if (profileError) throw profileError;

      // Create vendor profile in Supabase with trial subscription
      const trialEndDate = new Date();
      trialEndDate.setDate(trialEndDate.getDate() + 90); // 90 days trial

      const { data, error } = await supabase.from("vendors").insert({
        user_id: user.id,
        business_name: values.businessName,
        description: values.description,
        status: "pending",
        subscription_tier: "trial",
        trial_start_date: new Date().toISOString(),
        trial_end_date: trialEndDate.toISOString(),
        subscription_status: "trial"
      }).select();

      if (error) throw error;

      // Refresh user profile to update the auth context
      await refreshUserProfile();

      toast({
        title: "Registration Successful",
        description: "Welcome! You have a 90-day free trial to explore all features.",
      });
      
      // Redirect to vendor onboarding
      navigate(`/vendor/onboarding/${data[0].id}`);
    } catch (error) {
      console.error("Error registering vendor:", error);
      toast({
        variant: "destructive",
        title: "Registration Failed",
        description: "Failed to register as a vendor. Please try again later.",
      });
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6">Become a Vendor</h1>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="businessName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Business Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your business name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Business Description</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Tell us about your business..." 
                    className="resize-none min-h-[100px]"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="agreeTerms"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md p-4 border">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>
                    I agree to the Terms and Conditions and Vendor Guidelines
                  </FormLabel>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />
          
          <Button type="submit" className="w-full bg-wwe-navy">
            Register as Vendor
          </Button>
        </form>
      </Form>
      
      <div className="mt-6 text-sm text-gray-500">
        <p>
          By registering as a vendor, you agree to our vendor guidelines and
          terms of service. Your application will be reviewed within 1-2 business
          days.
        </p>
      </div>
    </div>
  );
};

export default RegisterVendorForm;
