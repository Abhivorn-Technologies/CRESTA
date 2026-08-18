"use client";

import { User, Zap, Star } from "lucide-react";

export function EnquiryForm() {
  return (
    <div className="flex-1 max-w-[851px] w-full border border-gray-100 rounded-2xl p-8 md:p-12 shadow-sm bg-white flex flex-col gap-10">
      
      {/* Contact Details Section */}
      <section className="flex flex-col gap-6">
        <div className="flex items-center gap-2 text-[#f5a623]">
          <User className="size-5" />
          <h2 className="font-heading text-lg font-bold text-[#00113A]">Contact Details</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-bold text-gray-500 tracking-widest uppercase">Full Name</label>
            <input 
              type="text" 
              placeholder="e.g., Eleanor Sterling"
              className="px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#00113A] focus:ring-1 focus:ring-[#00113A] transition-all placeholder:text-gray-300"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-bold text-gray-500 tracking-widest uppercase">Email Address</label>
            <input 
              type="email" 
              placeholder="eleanor@example.com"
              className="px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#00113A] focus:ring-1 focus:ring-[#00113A] transition-all placeholder:text-gray-300"
            />
          </div>
          <div className="flex flex-col gap-2 md:col-span-1">
            <label className="text-[10px] font-bold text-gray-500 tracking-widest uppercase">Phone Number</label>
            <input 
              type="tel" 
              placeholder="+1 (555) 123-4567"
              className="px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#00113A] focus:ring-1 focus:ring-[#00113A] transition-all placeholder:text-gray-300"
            />
          </div>
        </div>
      </section>

      <div className="w-full h-px bg-gray-100 border-none" />

      {/* Event Details Section */}
      <section className="flex flex-col gap-6">
        <div className="flex items-center gap-2 text-[#f5a623]">
          <Zap className="size-5" />
          <h2 className="font-heading text-lg font-bold text-[#00113A]">Event Details</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-bold text-gray-500 tracking-widest uppercase">Type of Event</label>
            <select className="px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#00113A] focus:ring-1 focus:ring-[#00113A] transition-all bg-white appearance-none text-gray-600">
              <option value="">Select event type...</option>
              <option value="wedding">Wedding Reception</option>
              <option value="corporate">Corporate Event</option>
              <option value="birthday">Birthday Party</option>
              <option value="other">Other Occasion</option>
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-bold text-gray-500 tracking-widest uppercase">Date of Event</label>
            <input 
              type="date" 
              className="px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#00113A] focus:ring-1 focus:ring-[#00113A] transition-all text-gray-600"
            />
          </div>
          <div className="flex flex-col gap-2 md:col-span-2">
            <label className="text-[10px] font-bold text-gray-500 tracking-widest uppercase">Event Location</label>
            <input 
              type="text" 
              placeholder="Venue Name, City"
              className="px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#00113A] focus:ring-1 focus:ring-[#00113A] transition-all placeholder:text-gray-300"
            />
          </div>
        </div>
      </section>

      <div className="w-full h-px bg-gray-100 border-none" />

      {/* Order Requirements Section */}
      <section className="flex flex-col gap-6">
        <div className="flex items-center gap-2 text-[#f5a623]">
          <Star className="size-5" />
          <h2 className="font-heading text-lg font-bold text-[#00113A]">Order Requirements</h2>
        </div>
        
        <div className="grid grid-cols-1 gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-bold text-gray-500 tracking-widest uppercase">Approximate Guests</label>
            <input 
              type="number" 
              placeholder="e.g., 150"
              className="px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#00113A] focus:ring-1 focus:ring-[#00113A] transition-all placeholder:text-gray-300 w-full md:max-w-xs"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-bold text-gray-500 tracking-widest uppercase">Preferred Flavors or Products</label>
            <input 
              type="text" 
              placeholder="e.g., Madagascar Vanilla, Truffle Chocolate..."
              className="px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#00113A] focus:ring-1 focus:ring-[#00113A] transition-all placeholder:text-gray-300"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-bold text-gray-500 tracking-widest uppercase">Message & Special Requests</label>
            <textarea 
              placeholder="Please share any dietary restrictions, aesthetic preferences, or specific service requirements..."
              rows={4}
              className="px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#00113A] focus:ring-1 focus:ring-[#00113A] transition-all placeholder:text-gray-300 resize-none"
            />
          </div>
        </div>
      </section>

      {/* Submit Button */}
      <button 
        className="w-full bg-[#00113A] text-white font-bold py-4 rounded-xl shadow-md hover:bg-[#1a2b7c] hover:shadow-lg transition-all mt-4"
        onClick={() => alert("Thank you for your inquiry! Our concierges will reach out to you shortly.")}
      >
        Submit Inquiry
      </button>

    </div>
  );
}
