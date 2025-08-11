import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { MapPin, Plus, Edit, Trash2 } from "lucide-react";

const ConsumerAddresses: React.FC = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<any>(null);

  // Mock data - replace with actual API calls
  const addresses = [
    {
      id: "1",
      type: "Home",
      name: "John Doe",
      phone: "+27 123 456 789",
      street: "123 Main Street",
      city: "Cape Town",
      province: "Western Cape",
      postalCode: "8001",
      country: "South Africa",
      isDefault: true
    },
    {
      id: "2",
      type: "Office",
      name: "John Doe",
      phone: "+27 123 456 789",
      street: "456 Business Ave, Suite 200",
      city: "Johannesburg",
      province: "Gauteng",
      postalCode: "2001",
      country: "South Africa",
      isDefault: false
    }
  ];

  const AddressForm = ({ address, onSave, onCancel }: any) => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Full Name</Label>
          <Input id="name" defaultValue={address?.name || ""} />
        </div>
        <div>
          <Label htmlFor="phone">Phone Number</Label>
          <Input id="phone" defaultValue={address?.phone || ""} />
        </div>
      </div>
      
      <div>
        <Label htmlFor="type">Address Type</Label>
        <Input id="type" placeholder="e.g. Home, Office, etc." defaultValue={address?.type || ""} />
      </div>
      
      <div>
        <Label htmlFor="street">Street Address</Label>
        <Input id="street" defaultValue={address?.street || ""} />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="city">City</Label>
          <Input id="city" defaultValue={address?.city || ""} />
        </div>
        <div>
          <Label htmlFor="province">Province</Label>
          <Input id="province" defaultValue={address?.province || ""} />
        </div>
        <div>
          <Label htmlFor="postalCode">Postal Code</Label>
          <Input id="postalCode" defaultValue={address?.postalCode || ""} />
        </div>
      </div>
      
      <div>
        <Label htmlFor="country">Country</Label>
        <Input id="country" defaultValue={address?.country || "South Africa"} />
      </div>
      
      <div className="flex items-center space-x-2">
        <input 
          type="checkbox" 
          id="isDefault" 
          defaultChecked={address?.isDefault || false}
        />
        <Label htmlFor="isDefault">Set as default address</Label>
      </div>
      
      <div className="flex gap-2 pt-4">
        <Button onClick={onSave}>Save Address</Button>
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          <span className="text-lg font-medium">Shipping Addresses</span>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-1" />
              Add Address
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Address</DialogTitle>
            </DialogHeader>
            <AddressForm
              onSave={() => setIsAddDialogOpen(false)}
              onCancel={() => setIsAddDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {addresses.map((address) => (
          <Card key={address.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CardTitle className="text-lg">{address.type}</CardTitle>
                  {address.isDefault && (
                    <Badge variant="default">Default</Badge>
                  )}
                </div>
                <div className="flex gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Edit Address</DialogTitle>
                      </DialogHeader>
                      <AddressForm
                        address={address}
                        onSave={() => {}}
                        onCancel={() => {}}
                      />
                    </DialogContent>
                  </Dialog>
                  <Button variant="outline" size="sm">
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-1 text-sm">
                <div className="font-medium">{address.name}</div>
                <div className="text-muted-foreground">{address.phone}</div>
                <div className="text-muted-foreground">
                  {address.street}
                </div>
                <div className="text-muted-foreground">
                  {address.city}, {address.province} {address.postalCode}
                </div>
                <div className="text-muted-foreground">
                  {address.country}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {addresses.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <MapPin className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No addresses saved</h3>
            <p className="text-muted-foreground text-center mb-4">
              Add your first shipping address to make checkout faster
            </p>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-1" />
              Add Address
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ConsumerAddresses;