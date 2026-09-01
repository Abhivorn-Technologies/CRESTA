"use client";

import React, { useState, useEffect } from "react";
import { X, Loader2 } from "lucide-react";
import { IAddress } from "@/models/User";

interface AddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (address: IAddress) => void;
  addressToEdit: IAddress | null;
  isGuest?: boolean;
}

export const AddressModal = React.memo(function AddressModal({ isOpen, onClose, onSave, addressToEdit, isGuest = false }: AddressModalProps) {
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    postalCode: "",
    street: "",
    apartment: "",
    city: "",
    state: "Telangana",
    area: "",
    lat: 0,
    lng: 0,
    isDefault: false,
  });
  const [areas, setAreas] = useState<any[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/serviceable-areas")
      .then(res => res.json())
      .then(data => {
        if (data.areas) setAreas(data.areas);
      })
      .catch(console.error);
  }, []);

  // Body scroll lock
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  useEffect(() => {
    if (addressToEdit) {
      setFormData({
        fullName: addressToEdit.fullName,
        phone: addressToEdit.phone,
        postalCode: addressToEdit.postalCode,
        street: addressToEdit.street,
        apartment: addressToEdit.apartment || "",
        city: addressToEdit.city,
        state: "Telangana",
        area: addressToEdit.area || "",
        lat: addressToEdit.lat || 0,
        lng: addressToEdit.lng || 0,
        isDefault: addressToEdit.isDefault,
      });
    } else {
      setFormData({
        fullName: "",
        phone: "",
        postalCode: "",
        street: "",
        apartment: "",
        city: "",
        state: "Telangana",
        area: "",
        lat: 0,
        lng: 0,
        isDefault: false,
      });
    }
  }, [addressToEdit, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const checked = (e.target as HTMLInputElement).checked;
    
    if (name === "area") {
      const selectedArea = areas.find(a => a.area === value);
      if (selectedArea) {
        setFormData((prev) => ({
          ...prev,
          area: value,
          postalCode: selectedArea.pincode,
          city: selectedArea.city,
          lat: selectedArea.lat,
          lng: selectedArea.lng,
        }));
        return;
      }
    }

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError("");

    try {
      const sanitize = (str: string) => (str || "").trim().replace(/\s+/g, " ");

      const fullName = sanitize(formData.fullName);
      const phone = sanitize(formData.phone);
      const apartment = sanitize(formData.apartment);
      const street = sanitize(formData.street);
      const postalCode = sanitize(formData.postalCode);
      const area = formData.area;

      // 1. Full name
      if (!fullName || !/^[a-zA-Z]+([ \-'][a-zA-Z]+)*$/.test(fullName) || fullName.length < 2 || fullName.length > 50) {
        throw new Error("Please enter a valid full name (letters only, min 2 characters).");
      }

      // 2. Mobile number
      if (!phone || !/^[6-9]\d{9}$/.test(phone)) {
        throw new Error("Please enter a valid 10-digit mobile number starting with 6, 7, 8, or 9.");
      }

      // 3. Service Area
      if (!area) {
        throw new Error("Please select a service area or locality.");
      }

      // 4. Pincode
      if (!postalCode || !/^[1-9][0-9]{5}$/.test(postalCode)) {
        throw new Error("Please enter a valid 6-digit postal PIN code.");
      }

      // 5. Flat, House no.
      if (!apartment || !/^[a-zA-Z0-9\s,./\-#&()]{3,100}$/.test(apartment)) {
        throw new Error("Please enter a valid address line (min 3 characters, avoid special characters like %, $, ;, ).");
      }

      // 6. Area, Street
      if (!street || !/^[a-zA-Z0-9\s,./\-&]{3,100}$/.test(street)) {
        throw new Error("Please enter a valid street or area name (letters, numbers, commas, and hyphens only).");
      }

      const sanitizedData = {
        ...formData,
        fullName,
        phone,
        apartment,
        street,
        postalCode,
      };

      // Verify Pincode is serviceable before saving
      const pincodeRes = await fetch(`/api/delivery/check-pincode?pincode=${sanitizedData.postalCode}`);
      const pincodeData = await pincodeRes.json();
      
      if (!pincodeData.data?.serviceable) {
        throw new Error(`Sorry, we do not deliver to pincode ${sanitizedData.postalCode}.`);
      }

      if (isGuest) {
        // Bypass API for guests, pass data directly to parent to save in session storage
        onSave(sanitizedData as IAddress);
        onClose();
        return;
      }

      const url = addressToEdit ? `/api/user/addresses/${addressToEdit._id}` : "/api/user/addresses";
      const method = addressToEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sanitizedData),
      });

      const data = await res.json();
      if (!res.ok) {
        const debugStr = data.debug ? ` | Debug: ${JSON.stringify(data.debug)}` : "";
        throw new Error((data.error || "Failed to save address") + debugStr);
      }

      onSave(data.address);
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-white w-full max-w-[500px] rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-gray-50/50">
          <h3 className="font-heading font-bold text-[#00113A] text-xl">
            {addressToEdit ? "Update delivery address" : "Enter a new delivery address"}
          </h3>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-[#e6127d] transition-colors rounded-full hover:bg-pink-50">
            <X className="size-5" />
          </button>
        </div>

        {/* Form */}
        <div className="overflow-y-auto p-6 custom-scrollbar">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form id="address-form" onSubmit={handleSubmit} className="flex flex-col gap-5">
            
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-bold text-[#00113A]">
                Full name (First and Last name)
              </label>
              <input 
                type="text" 
                name="fullName"
                required
                value={formData.fullName}
                onChange={handleChange}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:border-[#e6127d] focus:ring-1 focus:ring-[#e6127d] outline-none transition-all shadow-sm"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-bold text-[#00113A]">
                Mobile number
              </label>
              <input 
                type="tel" 
                name="phone"
                required
                maxLength={10}
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:border-[#e6127d] focus:ring-1 focus:ring-[#e6127d] outline-none transition-all shadow-sm"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-bold text-[#00113A]">
                Service Area / Locality
              </label>
              <select
                name="area"
                required
                value={formData.area}
                onChange={handleChange}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:border-[#e6127d] focus:ring-1 focus:ring-[#e6127d] outline-none transition-all shadow-sm"
              >
                <option value="">Select Delivery Area</option>
                {areas.map(a => (
                  <option key={a._id} value={a.area}>{a.area}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-bold text-[#00113A]">
                Pincode
              </label>
              <input 
                type="text" 
                name="postalCode"
                required
                readOnly
                value={formData.postalCode}
                placeholder="Auto-populated from Area"
                className="w-full px-3 py-2.5 border border-gray-200 bg-gray-50 text-gray-500 rounded-lg outline-none cursor-not-allowed"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-bold text-[#00113A]">
                Flat, House no., Building, Company, Apartment
              </label>
              <input 
                type="text" 
                name="apartment"
                value={formData.apartment}
                onChange={handleChange}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:border-[#e6127d] focus:ring-1 focus:ring-[#e6127d] outline-none transition-all shadow-sm"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-bold text-[#00113A]">
                Area, Street, Sector, Village
              </label>
              <input 
                type="text" 
                name="street"
                required
                value={formData.street}
                onChange={handleChange}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:border-[#e6127d] focus:ring-1 focus:ring-[#e6127d] outline-none transition-all shadow-sm"
              />
            </div>

            <div className="flex flex-col gap-1.5 hidden">
              <label className="text-sm font-bold text-[#00113A]">
                City
              </label>
              <input 
                type="text" 
                name="city"
                readOnly
                value={formData.city}
                className="w-full px-3 py-2.5 border border-gray-200 bg-gray-50 text-gray-500 rounded-lg outline-none cursor-not-allowed"
              />
            </div>

            <label className="flex items-center gap-3 mt-2 cursor-pointer group">
              <input 
                type="checkbox" 
                name="isDefault"
                checked={formData.isDefault}
                onChange={handleChange}
                className="w-4 h-4 text-[#e6127d] focus:ring-[#e6127d] border-gray-300 rounded" 
              />
              <span className="text-sm text-[#00113A] group-hover:text-[#e6127d] transition-colors">Make this my default address</span>
            </label>

          </form>
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-gray-100 bg-gray-50/50 flex justify-end">
          <button
            type="submit"
            form="address-form"
            disabled={isSaving}
            className="w-full sm:w-auto bg-[#F7CA00] hover:bg-[#F2C200] text-[#00113A] font-bold py-3 px-8 rounded-lg shadow-sm border border-[#F2C200] transition-colors flex items-center justify-center gap-2"
          >
            {isSaving ? <Loader2 className="size-4 animate-spin" /> : null}
            {addressToEdit ? "Update address" : "Add address"}
          </button>
        </div>
      </div>
    </div>
  );
});
