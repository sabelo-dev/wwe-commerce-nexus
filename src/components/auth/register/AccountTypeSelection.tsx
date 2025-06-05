
import React from "react";
import { Control } from "react-hook-form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RegisterFormValues } from "@/types/auth";

interface AccountTypeSelectionProps {
  control: Control<RegisterFormValues>;
}

const AccountTypeSelection: React.FC<AccountTypeSelectionProps> = ({ control }) => {
  return (
    <FormField
      control={control}
      name="role"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Account Type</FormLabel>
          <FormControl>
            <RadioGroup
              onValueChange={field.onChange}
              defaultValue={field.value}
              className="flex flex-col space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="consumer" id="consumer" />
                <label htmlFor="consumer" className="text-sm font-medium">
                  Consumer - Shop and buy products
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="vendor" id="vendor" />
                <label htmlFor="vendor" className="text-sm font-medium">
                  Vendor - Sell products on our platform
                </label>
              </div>
            </RadioGroup>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default AccountTypeSelection;
