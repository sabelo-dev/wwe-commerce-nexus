
import React, { useState } from "react";
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
import { Loader2 } from "lucide-react";

const vendorSchema = z.object({
  businessName: z.string().min(2, "Business name must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  agreeTerms: z.boolean().refine(val => val === true, {
    message: "You must agree to the terms and conditions",
  }),
});

type VendorFormValues = z.infer<typeof vendorSchema>;

const RegisterVendorForm: React.FC = () => {
  const { user, register: registerUser, refreshUserProfile } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  
  const form = useForm<VendorFormValues>({
    resolver: zodResolver(vendorSchema),
    defaultValues: {
      businessName: "",
      description: "",
      agreeTerms: false,
    },
  });

  const onSubmit = async (values: VendorFormValues) => {
    console.log('RegisterVendorForm onSubmit called with:', values);
    console.log('User context:', user);
    
    // If user is not logged in, redirect to main registration with vendor role
    if (!user) {
      console.log('No user found, redirecting to /register');
      navigate('/register', { state: { role: 'vendor', businessName: values.businessName, description: values.description } });
      return;
    }

    console.log('User is logged in, proceeding with vendor creation');
    setIsLoading(true);
    
    try {
      // Get fresh user data to ensure we have the latest session
      const { data: { user: currentUser }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !currentUser) {
        throw new Error('Authentication required. Please log in again.');
      }

      console.log('Current authenticated user ID:', currentUser.id);

      // Check if vendor already exists
      const { data: existingVendor, error: checkError } = await supabase
        .from('vendors')
        .select('id')
        .eq('user_id', currentUser.id)
        .maybeSingle();

      if (checkError) {
        console.error('Error checking existing vendor:', checkError);
        throw checkError;
      }

      if (existingVendor) {
        console.log('Vendor already exists, redirecting to dashboard');
        toast({
          title: "Already Registered",
          description: "You're already registered as a vendor.",
        });
        navigate('/vendor/dashboard');
        return;
      }

      console.log('Creating vendor record...');
      // Create vendor profile in Supabase with trial subscription
      const trialEndDate = new Date();
      trialEndDate.setDate(trialEndDate.getDate() + 90); // 90 days trial

      const vendorData = {
        user_id: currentUser.id,
        business_name: values.businessName,
        description: values.description,
        status: "pending",
        subscription_tier: "trial",
        trial_start_date: new Date().toISOString(),
        trial_end_date: trialEndDate.toISOString(),
        subscription_status: "trial"
      };

      console.log('Inserting vendor data:', vendorData);

      const { data: vendorResult, error: vendorError } = await supabase
        .from("vendors")
        .insert(vendorData)
        .select()
        .single();

      if (vendorError) {
        console.error('Vendor insert error:', vendorError);
        throw vendorError;
      }

      console.log('Vendor created successfully:', vendorResult);

      // Update user role to vendor in profiles table AFTER successful vendor creation
      console.log('Updating user profile role...');
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ role: 'vendor' })
        .eq('id', currentUser.id);

      if (profileError) {
        console.error('Profile update error:', profileError);
        // Don't throw here as vendor was created successfully
        console.warn('Failed to update profile role, but vendor record created');
      }

      // Refresh user profile to update the auth context
      await refreshUserProfile();

      toast({
        title: "Registration Successful",
        description: "Welcome! You have a 90-day free trial to explore all features.",
      });

      // Redirect to vendor onboarding
      navigate(`/vendor/onboarding/${vendorResult.id}`);
    } catch (error: any) {
      console.error("Error during vendor registration:", error);
      toast({
        variant: "destructive",
        title: "Registration Failed",
        description: error.message || 'Failed to register as a vendor. Please try again later.',
      });
    } finally {
      setIsLoading(false);
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
          
          <Button type="submit" disabled={isLoading} className="w-full bg-wwe-navy">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Registering...
              </>
            ) : (
              "Register as Vendor"
            )}
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
