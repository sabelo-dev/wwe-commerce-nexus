import React from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription 
} from "@/components/ui/dialog";
import SubscriptionPlans from "./SubscriptionPlans";
import { SubscriptionPlan } from "@/types/subscription";

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPlan: (plan: SubscriptionPlan) => void;
  currentTier?: string;
}

const UpgradeModal: React.FC<UpgradeModalProps> = ({
  isOpen,
  onClose,
  onSelectPlan,
  currentTier
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Choose Your Plan</DialogTitle>
          <DialogDescription>
            Select the plan that best fits your business needs. You can upgrade or downgrade at any time.
          </DialogDescription>
        </DialogHeader>
        
        <div className="mt-6">
          <SubscriptionPlans 
            onSelectPlan={onSelectPlan}
            currentTier={currentTier}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UpgradeModal;