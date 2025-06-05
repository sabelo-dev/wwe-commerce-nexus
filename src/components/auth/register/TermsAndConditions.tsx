
import React from "react";
import { Control } from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

interface RegisterFormValues {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: "consumer" | "vendor";
  terms: boolean;
}

interface TermsAndConditionsProps {
  control: Control<RegisterFormValues>;
}

const TermsAndConditions: React.FC<TermsAndConditionsProps> = ({ control }) => {
  return (
    <FormField
      control={control}
      name="terms"
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
              I agree to the{" "}
              <a
                href="/terms"
                className="text-wwe-navy hover:underline"
              >
                Terms of Service
              </a>{" "}
              and{" "}
              <a
                href="/privacy"
                className="text-wwe-navy hover:underline"
              >
                Privacy Policy
              </a>
            </FormLabel>
            <FormMessage />
          </div>
        </FormItem>
      )}
    />
  );
};

export default TermsAndConditions;
