"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export function CheckoutForm() {
  const router = useRouter();
  
  const [email, setEmail] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [city, setCity] = useState("");
  const [isFetchingCity, setIsFetchingCity] = useState(false);

  useEffect(() => {
    if (postalCode.length === 6) {
      setIsFetchingCity(true);
      fetch(`https://api.postalpincode.in/pincode/${postalCode}`)
        .then(res => res.json())
        .then(data => {
          if (data && data[0] && data[0].Status === "Success") {
            const postOffice = data[0].PostOffice[0];
            setCity(postOffice.District || postOffice.Region || "");
          }
        })
        .catch(() => {
          // Silently ignore postal code API errors as it's just an enhancement
        })
        .finally(() => setIsFetchingCity(false));
    }
  }, [postalCode]);

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    // Save email so the Payment Summary screen knows where to send the OTP
    sessionStorage.setItem("checkoutEmail", email);
    router.push("/checkout/payment");
  };

  return (
    <div className="flex-1 max-w-[760px] w-full bg-white rounded-[12px] p-6 lg:p-10 border border-gray-100 shadow-sm flex flex-col h-fit">
      
      <h2 className="font-heading text-xl font-bold text-[#00113A] mb-8">Shipping Information</h2>

      <form onSubmit={handleContinue} className="flex flex-col gap-8">
        
        {/* Contact Section */}
        <section className="flex flex-col gap-4">
          <h3 className="text-sm font-bold text-[#00113A]">Contact</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                First Name <span className="text-red-500">*</span>
              </label>
              <input 
                type="text" 
                required
                maxLength={50}
                pattern="^[A-Za-z_][A-Za-z_ ]*$"
                title="First name must contain only letters, spaces, and underscores. Cannot start with a space."
                placeholder="Enter first name"
                onInput={(e) => { e.currentTarget.value = e.currentTarget.value.replace(/[^A-Za-z_ ]/g, '').replace(/^ /, '') }}
                className="px-4 py-3 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#00113A] focus:ring-1 focus:ring-[#00113A] transition-all invalid:[&:not(:placeholder-shown):not(:focus)]:border-red-500"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                Last Name <span className="text-red-500">*</span>
              </label>
              <input 
                type="text" 
                required
                maxLength={50}
                pattern="^[A-Za-z_][A-Za-z_ ]*$"
                title="Last name must contain only letters, spaces, and underscores. Cannot start with a space."
                placeholder="Enter last name"
                onInput={(e) => { e.currentTarget.value = e.currentTarget.value.replace(/[^A-Za-z_ ]/g, '').replace(/^ /, '') }}
                className="px-4 py-3 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#00113A] focus:ring-1 focus:ring-[#00113A] transition-all invalid:[&:not(:placeholder-shown):not(:focus)]:border-red-500"
              />
            </div>
            <div className="flex flex-col gap-1.5 md:col-span-2">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                pattern="[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}"
                title="Please enter a valid email address without special characters like ! or #"
                placeholder="Enter email address"
                className="px-4 py-3 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#00113A] focus:ring-1 focus:ring-[#00113A] transition-all invalid:[&:not(:placeholder-shown):not(:focus)]:border-red-500"
              />
            </div>
            <div className="flex flex-col gap-1.5 md:col-span-2">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input 
                type="tel" 
                required
                maxLength={10}
                minLength={10}
                pattern="^[6-9][0-9]{9}$"
                title="Phone number must be exactly 10 digits and must start with 6, 7, 8, or 9."
                placeholder="Enter phone number"
                onInput={(e) => { e.currentTarget.value = e.currentTarget.value.replace(/[^0-9]/g, '').replace(/^[0-5]/, '') }}
                className="px-4 py-3 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#00113A] focus:ring-1 focus:ring-[#00113A] transition-all invalid:[&:not(:placeholder-shown):not(:focus)]:border-red-500"
              />
            </div>
          </div>
        </section>

        {/* Delivery Address Section */}
        <section className="flex flex-col gap-4">
          <h3 className="text-sm font-bold text-[#00113A]">Delivery Address</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5 md:col-span-2">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                Street Address <span className="text-red-500">*</span>
              </label>
              <input 
                type="text" 
                required
                maxLength={100}
                pattern="^[a-zA-Z0-9\s,.'#\-]+$"
                title="Street address contains invalid special characters."
                placeholder="Street address, company name, c/o"
                onInput={(e) => { e.currentTarget.value = e.currentTarget.value.replace(/[^a-zA-Z0-9\s,.'#\-]/g, '') }}
                className="px-4 py-3 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#00113A] focus:ring-1 focus:ring-[#00113A] transition-all invalid:[&:not(:placeholder-shown):not(:focus)]:border-red-500"
              />
            </div>
            <div className="flex flex-col gap-1.5 md:col-span-2">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                Apartment, suite, etc. (optional)
              </label>
              <input 
                type="text"
                maxLength={100}
                pattern="^[a-zA-Z0-9\s,.'#\-]*$"
                title="Contains invalid special characters."
                placeholder="Apartment, suite, unit, building, floor, etc."
                onInput={(e) => { e.currentTarget.value = e.currentTarget.value.replace(/[^a-zA-Z0-9\s,.'#\-]/g, '') }}
                className="px-4 py-3 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#00113A] focus:ring-1 focus:ring-[#00113A] transition-all invalid:[&:not(:placeholder-shown):not(:focus)]:border-red-500"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                City <span className="text-red-500">*</span>
              </label>
              <input 
                type="text" 
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                maxLength={50}
                pattern="^[a-zA-Z\s.\-]+$"
                title="City must contain only letters, spaces, dots, or hyphens."
                placeholder="City"
                onInput={(e) => { e.currentTarget.value = e.currentTarget.value.replace(/[^a-zA-Z\s.\-]/g, '') }}
                className={`px-4 py-3 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#00113A] focus:ring-1 focus:ring-[#00113A] transition-all invalid:[&:not(:placeholder-shown):not(:focus)]:border-red-500 ${isFetchingCity ? 'bg-gray-50 opacity-70 animate-pulse' : ''}`}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                Postal / Zip Code <span className="text-red-500">*</span>
              </label>
              <input 
                type="text" 
                required
                value={postalCode}
                onChange={(e) => {
                  const val = e.target.value.replace(/[^0-9]/g, '').replace(/^[0]/, '');
                  setPostalCode(val);
                }}
                maxLength={6}
                minLength={6}
                pattern="^[1-9][0-9]{5}$"
                title="Please enter a valid 6-digit postal code (cannot start with 0)."
                placeholder="Postal Code"
                className="px-4 py-3 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#00113A] focus:ring-1 focus:ring-[#00113A] transition-all invalid:[&:not(:placeholder-shown):not(:focus)]:border-red-500"
              />
            </div>
          </div>
        </section>

        {/* Checkbox */}
        <label className="flex items-center gap-3 cursor-pointer group mt-2">
          <div className="relative flex items-center justify-center">
            <input type="checkbox" className="peer appearance-none w-4 h-4 border-2 border-gray-300 rounded focus:ring-2 focus:ring-[#00113A]/20 checked:bg-[#00113A] checked:border-[#00113A] transition-all" />
            <svg className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 pointer-events-none" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 5L4.5 8.5L13 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="text-xs text-gray-500 group-hover:text-gray-700 transition-colors">
            Save this information for next time
          </span>
        </label>

        {/* Divider */}
        <div className="w-full h-px bg-gray-100 my-2" />

        {/* Actions */}
        <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-6">
          <Link 
            href="/cart" 
            className="flex items-center gap-2 text-xs font-bold text-[#00113A] hover:text-[#e6127d] transition-colors"
          >
            <ArrowLeft className="size-4" />
            RETURN TO CART
          </Link>

          <button 
            type="submit"
            className="w-full md:w-auto bg-[#8c7322] hover:bg-[#735e1c] text-white text-xs font-bold uppercase tracking-wider py-4 px-8 rounded shadow-md transition-colors"
          >
            Continue to Payment
          </button>
        </div>

      </form>
    </div>
  );
}
