
import React from "react";
import { useForm } from "react-hook-form";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

interface SettingsForm {
  platformName: string;
  platformEmail: string;
  platformFee: string;
  vendorFee: string;
  supportEmail: string;
  termsOfService: string;
  privacyPolicy: string;
}

const AdminSettings: React.FC = () => {
  const { toast } = useToast();

  const form = useForm<SettingsForm>({
    defaultValues: {
      platformName: "WWE Marketplace",
      platformEmail: "support@wwe-marketplace.com",
      platformFee: "5",
      vendorFee: "10",
      supportEmail: "help@wwe-marketplace.com",
      termsOfService: "Standard terms of service for WWE marketplace...",
      privacyPolicy: "Privacy policy for WWE marketplace..."
    },
  });

  const onSubmit = (data: SettingsForm) => {
    toast({
      title: "Settings updated",
      description: "Platform settings have been saved.",
    });
    console.log("Settings updated:", data);
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold">Platform Settings</h2>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>Configure basic platform details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="platformName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Platform Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="platformEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Platform Email</FormLabel>
                    <FormControl>
                      <Input {...field} type="email" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Fee Configuration</CardTitle>
              <CardDescription>Set platform and vendor fees</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="platformFee"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Platform Fee (%)</FormLabel>
                    <FormControl>
                      <Input {...field} type="number" min="0" max="100" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="vendorFee"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vendor Fee (%)</FormLabel>
                    <FormControl>
                      <Input {...field} type="number" min="0" max="100" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Support & Legal</CardTitle>
              <CardDescription>Configure support and legal documents</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="supportEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Support Email</FormLabel>
                    <FormControl>
                      <Input {...field} type="email" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="termsOfService"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Terms of Service</FormLabel>
                    <FormControl>
                      <Textarea {...field} rows={5} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="privacyPolicy"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Privacy Policy</FormLabel>
                    <FormControl>
                      <Textarea {...field} rows={5} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
          
          <Button type="submit" className="w-full md:w-auto">Save Settings</Button>
        </form>
      </Form>
    </div>
  );
};

export default AdminSettings;
