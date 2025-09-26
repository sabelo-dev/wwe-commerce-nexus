
import React from "react";
import { Control } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent } from "@/components/ui/card";
import { CreditCard, Smartphone } from "lucide-react";

interface PaymentMethodSelectorProps {
  control: Control<any>;
}

const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({ control }) => {
  return (
    <FormField
      control={control}
      name="paymentMethod"
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <RadioGroup
              onValueChange={field.onChange}
              defaultValue={field.value}
              className="space-y-3"
            >
              <Card className="border-2 hover:border-wwe-navy/20 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="card" id="card" />
                    <FormLabel htmlFor="card" className="flex items-center space-x-3 cursor-pointer flex-1">
                      <CreditCard className="h-6 w-6 text-blue-600" />
                      <div>
                        <div className="font-medium">Credit/Debit Card</div>
                        <div className="text-sm text-gray-500">
                          Visa, Mastercard, American Express
                        </div>
                      </div>
                    </FormLabel>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 hover:border-wwe-navy/20 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="eft" id="eft" />
                    <FormLabel htmlFor="eft" className="flex items-center space-x-3 cursor-pointer flex-1">
                      <Smartphone className="h-6 w-6 text-green-600" />
                      <div>
                        <div className="font-medium">EFT (Instant Transfer)</div>
                        <div className="text-sm text-gray-500">
                          Secure electronic funds transfer
                        </div>
                      </div>
                    </FormLabel>
                  </div>
                </CardContent>
              </Card>
            </RadioGroup>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default PaymentMethodSelector;
