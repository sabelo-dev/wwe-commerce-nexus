
import React from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Package } from "lucide-react";
import { WeFulFilProduct } from "@/types/wefullfil";

interface WeFulFilImportControlsProps {
  products: WeFulFilProduct[];
  selectedProducts: Record<string, boolean>;
  onSelectAll: (checked: boolean) => void;
  onBulkImport: () => void;
  bulkImporting: boolean;
}

export const WeFulFilImportControls: React.FC<WeFulFilImportControlsProps> = ({
  products,
  selectedProducts,
  onSelectAll,
  onBulkImport,
  bulkImporting,
}) => {
  const selectedCount = Object.values(selectedProducts).filter(Boolean).length;

  return (
    <div className="bg-gray-50 p-4 rounded-md mb-4 flex items-center justify-between">
      <div className="flex items-center">
        <Checkbox 
          id="select-all"
          checked={products.length > 0 && selectedCount === products.length}
          onCheckedChange={(checked) => onSelectAll(!!checked)}
        />
        <label htmlFor="select-all" className="ml-2 text-sm font-medium">
          Select All ({selectedCount} of {products.length} selected)
        </label>
      </div>
      
      <Button 
        onClick={onBulkImport} 
        disabled={selectedCount === 0 || bulkImporting}
        variant="default"
      >
        <Package className="h-4 w-4 mr-2" />
        {bulkImporting ? `Importing ${selectedCount} Products...` : `Import Selected (${selectedCount})`}
      </Button>
    </div>
  );
};
