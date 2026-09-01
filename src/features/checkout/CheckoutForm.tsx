"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Plus, Edit2, Loader2, MapPin } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { AddressModal } from "./AddressModal";
import { IAddress } from "@/models/User";

import { toast } from "sonner";

export const CheckoutForm = React.memo(function CheckoutForm() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  
  const [addresses, setAddresses] = useState<IAddress[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [addressToEdit, setAddressToEdit] = useState<IAddress | null>(null);

  // Fetch addresses if logged in or redirect
  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      router.push('/login');
      return;
    }

    if (user) {
      fetch("/api/user/addresses", { cache: "no-store" })
        .then(res => res.json())
        .then(data => {
          if (data.addresses) {
            setAddresses(data.addresses);
            const defaultAddr = data.addresses.find((a: IAddress) => a.isDefault);
            if (defaultAddr) {
              setSelectedAddressId(defaultAddr._id);
            } else if (data.addresses.length > 0) {
              setSelectedAddressId(data.addresses[0]._id);
            }
          }
        })
        .finally(() => setIsLoading(false));
    }
  }, [user, authLoading, router]);

  const handleContinue = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAddressId) {
      toast.error("Please select a delivery address.");
      return;
    }

    const selectedAddr = addresses.find(a => a._id === selectedAddressId);
    if (selectedAddr) {
      try {
        const res = await fetch(`/api/delivery/check-pincode?pincode=${selectedAddr.postalCode}&area=${encodeURIComponent(selectedAddr.area || "")}`);
        const data = await res.json();
        if (data.data?.serviceable) {
          sessionStorage.setItem("checkoutAddress", JSON.stringify(selectedAddr));
          sessionStorage.setItem("checkoutDistanceKm", data.data.distanceKm.toString());
          sessionStorage.setItem("checkoutEmail", user ? user.email : "guest@example.com");
          router.push("/checkout/payment");
        } else {
          toast.error(`Sorry, we do not deliver to pincode ${selectedAddr.postalCode}.`);
        }
      } catch (err) {
        toast.error("Failed to verify pincode. Please try again.");
      }
    }
  };

  const handleSaveAddress = (newAddress: IAddress) => {
    if (user) {
      // API already saved it, just refresh the list or update state
      if (addressToEdit) {
        setAddresses(prev => prev.map(a => a._id === newAddress._id ? newAddress : a));
      } else {
        setAddresses(prev => [...prev, newAddress]);
      }
      setSelectedAddressId(newAddress._id || null);
    } else {
      // Guest mode
      const updatedAddress = { ...newAddress, _id: addressToEdit?._id || Math.random().toString(36).substring(7) };
      let newAddresses;
      if (addressToEdit) {
        newAddresses = addresses.map(a => a._id === updatedAddress._id ? updatedAddress : a);
      } else {
        newAddresses = [...addresses, updatedAddress];
      }
      setAddresses(newAddresses);
      sessionStorage.setItem("guestAddresses", JSON.stringify(newAddresses));
      setSelectedAddressId(updatedAddress._id);
    }
  };

  const openAddModal = () => {
    setAddressToEdit(null);
    setIsModalOpen(true);
  };

  const openEditModal = (addr: IAddress) => {
    setAddressToEdit(addr);
    setIsModalOpen(true);
  };

  if (authLoading || isLoading) {
    return (
      <div className="flex-1 max-w-[760px] w-full flex items-center justify-center p-20">
        <Loader2 className="size-8 animate-spin text-[#00113A]" />
      </div>
    );
  }

  return (
    <div className="flex-1 max-w-[760px] w-full h-fit flex flex-col gap-6">
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-5 md:p-6 border-b border-gray-100 bg-[#f9fafb] flex items-center justify-between">
          <h2 className="font-heading text-xl font-bold text-[#00113A]">Select a delivery address</h2>
        </div>

        <div className="p-5 md:p-6 flex flex-col gap-4">
          
          {addresses.length === 0 ? (
            <div className="p-8 text-center border-2 border-dashed border-gray-200 rounded-xl bg-gray-50 flex flex-col items-center">
              <MapPin className="size-10 text-gray-400 mb-3" />
              <p className="text-gray-500 font-medium mb-4">You have no saved addresses.</p>
              <button 
                onClick={openAddModal}
                className="bg-[#00113A] hover:bg-[#1a2b7c] text-white px-6 py-2.5 rounded-lg text-sm font-bold shadow-sm transition-colors"
              >
                Add a new address
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {addresses.map((addr, index) => {
                const computedId = addr._id || `addr-${index}`;
                return (
                <div 
                  key={computedId}
                  className={`relative rounded-xl border p-4 transition-all ${
                    selectedAddressId === computedId 
                      ? "border-[#F7CA00] bg-[#F7CA00]/5 ring-1 ring-[#F7CA00]" 
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <label className="flex items-start gap-3 cursor-pointer w-full">
                    <div className="flex items-center justify-center mt-1 shrink-0">
                      <input 
                        type="radio" 
                        name="addressSelection"
                        checked={selectedAddressId === computedId}
                        onChange={() => setSelectedAddressId(computedId)}
                        className="w-4 h-4 text-[#e6127d] border-gray-300 focus:ring-[#e6127d]" 
                      />
                    </div>
                    <div className="flex-1 flex flex-col">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-[#00113A]">{addr.fullName}</span>
                        {addr.isDefault && (
                          <span className="bg-gray-100 text-gray-600 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Default</span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 leading-relaxed mb-2">
                        {addr.apartment && `${addr.apartment}, `}
                        {addr.street}, {addr.area && `${addr.area}, `}{addr.city}, Telangana {addr.postalCode}
                      </p>
                      <p className="text-sm text-gray-600">
                        Phone number: <span className="font-medium">{addr.phone}</span>
                      </p>
                      
                      <div className="flex gap-4 mt-3">
                        <button 
                          onClick={(e) => { e.preventDefault(); openEditModal(addr); }}
                          className="text-sm font-medium text-[#0066c0] hover:text-[#c45500] hover:underline"
                        >
                          Edit address
                        </button>
                      </div>

                      {/* Deliver Button matches Amazon style */}
                      {selectedAddressId === computedId && (
                        <div className="mt-4 pt-4 border-t border-gray-100">
                          <button
                            id="deliver-button"
                            onClick={async (e) => {
                              e.preventDefault();
                              const selectedAddr = addresses.find((a, i) => (a._id || `addr-${i}`) === selectedAddressId);
                              if (selectedAddr) {
                                try {
                                  const res = await fetch(`/api/delivery/check-pincode?pincode=${selectedAddr.postalCode}&area=${encodeURIComponent(selectedAddr.area || "")}`);
                                  const data = await res.json();
                                  if (data.data?.serviceable) {
                                    sessionStorage.setItem("checkoutAddress", JSON.stringify(selectedAddr));
                                    sessionStorage.setItem("checkoutDistanceKm", data.data.distanceKm.toString());
                                    sessionStorage.setItem("checkoutEmail", user ? user.email : "guest@example.com");
                                    router.push("/checkout/payment");
                                  } else {
                                    toast.error(`Sorry, we do not deliver to pincode ${selectedAddr.postalCode}.`);
                                  }
                                } catch (err) {
                                  toast.error("Failed to verify pincode. Please try again.");
                                }
                              } else {
                                toast.error("Please select a valid address.");
                              }
                            }}
                            className="bg-[#F7CA00] hover:bg-[#F2C200] text-[#00113A] font-bold py-2.5 px-6 rounded-lg shadow-sm border border-[#F2C200] transition-colors"
                          >
                            Deliver to this address
                          </button>
                        </div>
                      )}

                    </div>
                  </label>
                </div>
                );
              })}
            </div>
          )}

          {addresses.length > 0 && (
            <div className="mt-2 flex items-center gap-2">
              <button 
                onClick={openAddModal}
                className="flex items-center gap-2 text-sm font-medium text-[#0066c0] hover:text-[#c45500] hover:underline"
              >
                <Plus className="size-4" />
                Add a new delivery address
              </button>
            </div>
          )}
          
        </div>
      </div>

      <AddressModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveAddress}
        addressToEdit={addressToEdit}
        isGuest={!user}
      />
    </div>
  );
});
