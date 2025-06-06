
import React from "react";
import { useCart } from "@/contexts/CartContext";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/lib/utils";

const OrderSummary: React.FC = () => {
  const { cart } = useCart();

  if (!cart?.items?.length) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No items in cart</p>
      </div>
    );
  }

  const shipping = 0; // Free shipping for now
  const tax = cart.subtotal * 0.15; // 15% VAT
  const total = cart.subtotal + shipping + tax;

  return (
    <div>
      <h2 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h2>
      
      <div className="space-y-4">
        {cart.items.map((item) => (
          <div key={item.productId} className="flex items-center space-x-4">
            <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border">
              <img
                src={item.image}
                alt={item.name}
                className="h-full w-full object-cover object-center"
              />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-medium text-gray-900">{item.name}</h3>
              <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
            </div>
            <p className="text-sm font-medium text-gray-900">
              {formatCurrency(item.price * item.quantity)}
            </p>
          </div>
        ))}
      </div>

      <Separator className="my-6" />

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Subtotal</span>
          <span>{formatCurrency(cart.subtotal)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Shipping</span>
          <span>{shipping === 0 ? "Free" : formatCurrency(shipping)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>VAT (15%)</span>
          <span>{formatCurrency(tax)}</span>
        </div>
        <Separator className="my-2" />
        <div className="flex justify-between text-base font-medium">
          <span>Total</span>
          <span>{formatCurrency(total)}</span>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
