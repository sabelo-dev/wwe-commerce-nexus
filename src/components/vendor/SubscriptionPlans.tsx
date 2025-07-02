import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Crown, Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { SubscriptionPlan } from "@/types/subscription";

interface SubscriptionPlansProps {
  onSelectPlan?: (plan: SubscriptionPlan) => void;
  currentTier?: string;
}

const SubscriptionPlans: React.FC<SubscriptionPlansProps> = ({ 
  onSelectPlan, 
  currentTier = 'trial' 
}) => {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const { data, error } = await supabase
          .from('subscription_plans')
          .select('*')
          .order('price', { ascending: true });

        if (error) throw error;
        setPlans((data || []) as SubscriptionPlan[]);
      } catch (error) {
        console.error('Error fetching subscription plans:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  if (loading) {
    return <div className="grid gap-6 md:grid-cols-3">
      {[1, 2, 3].map(i => (
        <Card key={i} className="animate-pulse">
          <CardHeader className="h-24 bg-muted"></CardHeader>
          <CardContent className="h-48 bg-muted/50"></CardContent>
        </Card>
      ))}
    </div>;
  }

  const getIcon = (planName: string) => {
    switch (planName.toLowerCase()) {
      case 'premium':
        return <Crown className="h-6 w-6" />;
      case 'standard':
        return <Star className="h-6 w-6" />;
      default:
        return null;
    }
  };

  const isCurrentPlan = (planName: string) => {
    return planName.toLowerCase() === currentTier.toLowerCase();
  };

  const getButtonText = (planName: string) => {
    if (isCurrentPlan(planName)) return 'Current Plan';
    if (planName.toLowerCase() === 'trial') return 'Start Trial';
    return 'Upgrade';
  };

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {plans.map((plan) => (
        <Card 
          key={plan.id} 
          className={`relative ${
            plan.name.toLowerCase() === 'premium' 
              ? 'border-primary ring-2 ring-primary/20' 
              : ''
          }`}
        >
          {plan.name.toLowerCase() === 'premium' && (
            <Badge className="absolute -top-2 left-1/2 -translate-x-1/2">
              Most Popular
            </Badge>
          )}
          
          <CardHeader className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              {getIcon(plan.name)}
              <CardTitle className="text-xl">{plan.name}</CardTitle>
            </div>
            <div className="text-3xl font-bold">
              ${plan.price}
              <span className="text-sm font-normal text-muted-foreground">
                /{plan.billing_period}
              </span>
            </div>
            {plan.name.toLowerCase() === 'trial' && (
              <Badge variant="outline">90 Days Free</Badge>
            )}
          </CardHeader>
          
          <CardContent className="space-y-4">
            <ul className="space-y-2">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-primary" />
                  {feature}
                </li>
              ))}
              
              {plan.max_products && (
                <li className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-primary" />
                  Up to {plan.max_products} products
                </li>
              )}
              
              {!plan.max_products && plan.name.toLowerCase() === 'premium' && (
                <li className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-primary" />
                  Unlimited products
                </li>
              )}
            </ul>
            
            <Button 
              className="w-full"
              variant={isCurrentPlan(plan.name) ? "outline" : "default"}
              disabled={isCurrentPlan(plan.name)}
              onClick={() => onSelectPlan?.(plan)}
            >
              {getButtonText(plan.name)}
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default SubscriptionPlans;