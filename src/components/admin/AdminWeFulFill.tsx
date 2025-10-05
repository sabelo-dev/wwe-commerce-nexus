import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Download, CheckCircle, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const AdminWeFulFill = () => {
  const [importing, setImporting] = useState(false);
  const [importStatus, setImportStatus] = useState<{
    total: number;
    success: number;
    failed: number;
  } | null>(null);
  const { toast } = useToast();

  const handleImportProducts = async () => {
    setImporting(true);
    setImportStatus(null);

    try {
      const { data, error } = await supabase.functions.invoke('import-wefullfill-products', {
        body: { action: 'import' }
      });

      if (error) throw error;

      setImportStatus({
        total: data.total || 0,
        success: data.success || 0,
        failed: data.failed || 0,
      });

      toast({
        title: "Import Complete",
        description: `Successfully imported ${data.success} products. ${data.failed} failed.`,
      });
    } catch (error: any) {
      console.error('Import error:', error);
      toast({
        title: "Import Failed",
        description: error.message || "Failed to import products from WeFulFill",
        variant: "destructive",
      });
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">WeFulFill Integration</h2>
        <p className="text-muted-foreground">
          Manage product imports from WeFulFill API
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Product Import</CardTitle>
          <CardDescription>
            Import products from WeFulFill catalog into your marketplace
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Button
              onClick={handleImportProducts}
              disabled={importing}
              size="lg"
            >
              {importing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Importing...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Import Products
                </>
              )}
            </Button>
          </div>

          {importStatus && (
            <div className="mt-6 p-4 border rounded-lg space-y-3">
              <h4 className="font-semibold">Import Results</h4>
              <div className="grid grid-cols-3 gap-4">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-sm">
                    Total: {importStatus.total}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <Badge variant="outline" className="text-sm text-green-600">
                    Success: {importStatus.success}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <XCircle className="h-4 w-4 text-red-600" />
                  <Badge variant="outline" className="text-sm text-red-600">
                    Failed: {importStatus.failed}
                  </Badge>
                </div>
              </div>
            </div>
          )}

          <div className="mt-6 p-4 bg-muted rounded-lg">
            <h4 className="font-semibold mb-2">API Configuration</h4>
            <p className="text-sm text-muted-foreground mb-2">
              Base URL: <code className="bg-background px-2 py-1 rounded">https://wefullfill.com</code>
            </p>
            <p className="text-sm text-muted-foreground">
              API Token: <Badge variant="secondary">Configured</Badge>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
