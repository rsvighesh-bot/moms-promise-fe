"use client";

import { useState } from "react";
import { MapPin, Plus } from "lucide-react";
import { useAddresses } from "@/lib/hooks/useAddresses";
import { AddressCard } from "@/components/checkout/AddressCard";
import { AddressForm } from "@/components/checkout/AddressForm";
import { Skeleton } from "@/components/ui/Skeleton";
import type { Address } from "@/lib/api/address";
import { AuthGuard } from "@/components/auth/AuthGuard";

export default function AddressesPage() {
  const { data: addresses, isLoading } = useAddresses();
  const [showForm, setShowForm] = useState(false);
  const [editAddress, setEditAddress] = useState<Address | null>(null);

  const handleEdit = (address: Address) => {
    setEditAddress(address);
    setShowForm(true);
  };

  const handleClose = () => {
    setShowForm(false);
    setEditAddress(null);
  };

  return (
    <AuthGuard>
      <main className="mx-auto max-w-2xl px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl text-primary flex items-center gap-2">
            <MapPin size={28} className="text-primary" />
            Saved Addresses
          </h1>
          {!showForm && (
            <button
              onClick={() => {
                setEditAddress(null);
                setShowForm(true);
              }}
              className="flex items-center gap-2 rounded-chip bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90 transition-colors"
            >
              <Plus size={16} /> Add New
            </button>
          )}
        </div>

        {/* Add / Edit form */}
        {showForm && (
          <div className="rounded-card border border-foreground/10 p-5 mb-6">
            <h2 className="text-sm font-semibold text-foreground mb-4">
              {editAddress ? "Edit Address" : "Add New Address"}
            </h2>
            <AddressForm
              editAddress={editAddress}
              onSuccess={handleClose}
              onCancel={handleClose}
            />
          </div>
        )}

        {/* Loading */}
        {isLoading && (
          <div className="space-y-4">
            {Array.from({ length: 2 }).map((_, i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!isLoading && !showForm && addresses?.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
            <MapPin size={48} className="text-foreground/20" />
            <p className="text-foreground/50 text-sm">No saved addresses yet</p>
            <button
              onClick={() => setShowForm(true)}
              className="text-sm font-semibold text-primary hover:underline"
            >
              Add your first address
            </button>
          </div>
        )}

        {/* Address list */}
        {!isLoading && addresses && addresses.length > 0 && (
          <div className="space-y-4">
            {addresses.map((address) => (
              <AddressCard
                key={address._id}
                address={address}
                selected={false}
                onSelect={() => {}}
                onEdit={() => handleEdit(address)}
              />
            ))}
          </div>
        )}
      </main>
    </AuthGuard>
  );
}
