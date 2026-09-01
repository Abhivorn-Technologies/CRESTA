"use client";

import { motion } from "framer-motion";
import { CmsImage } from "@/components/ui/CmsImage";

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const occasions = [
  {
    id: "wedding",
    title: "Weddings & Engagements",
    description: "Make your special day sweeter with our premium dessert stations and bespoke ice cream selections.",
    imageKey: "occasion-wedding",
    defaultUrl: "/images/occasion-wedding.jpg",
  },
  {
    id: "birthday",
    title: "Birthdays & Parties",
    description: "Joyful sundae stations and colorful treats that will be the highlight of any celebration.",
    imageKey: "occasion-birthday",
    defaultUrl: "/images/occasion-birthday.jpg",
  },
  {
    id: "corporate",
    title: "Corporate & Office Events",
    description: "Impress your clients and reward your team with professional, sleek dessert catering.",
    imageKey: "occasion-corporate",
    defaultUrl: "/images/occasion-corporate.jpg",
  },
  {
    id: "anniversary",
    title: "Anniversaries & Dinners",
    description: "Romantic, elegant ice cream desserts perfect for intimate gatherings and celebrations.",
    imageKey: "occasion-anniversary",
    defaultUrl: "/images/occasion-anniversary.jpg",
  },
  {
    id: "houseparty",
    title: "House Parties",
    description: "Casual fun meets premium taste with bulk tub deliveries for your friends and family.",
    imageKey: "occasion-houseparty",
    defaultUrl: "/images/occasion-houseparty.jpg",
  },
  {
    id: "festival",
    title: "Festivals & Gatherings",
    description: "Rich, vibrant flavors to complement your traditional celebrations and festive feasts.",
    imageKey: "occasion-festival",
    defaultUrl: "/images/occasion-festival.jpg",
  },
];

export function OccasionsSection() {
  const [selectedOccasion, setSelectedOccasion] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({ name: "", phone: "" });
  
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    let value = e.target.value;
    const name = e.target.name;

    if (name === "name") {
      value = value.replace(/[^\p{L}\s\-'.,]/gu, "");
    }
    
    if (name === "phone") {
      value = value.replace(/\D/g, "");
      if (value.length > 0 && /^[0-5]/.test(value)) {
        value = value.replace(/^[0-5]+/, "");
      }
    }

    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validateField = (name: string, value: string) => {
    const nameRegex = /^[\p{L}]+(([',. -][\p{L} ])?[\p{L}]+)*$/u;
    const phoneRegex = /^[6-9][0-9]{9}$/;
    
    if (name === "name") {
      if (value && (!nameRegex.test(value) || value.length > 50)) {
        setErrors(prev => ({ ...prev, name: "Enter a valid name (max 50 chars)." }));
      }
    }
    
    if (name === "phone") {
      if (value && !phoneRegex.test(value)) {
        setErrors(prev => ({ ...prev, phone: "Enter a valid 10-digit mobile number." }));
      }
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    validateField(e.target.name, e.target.value);
  };

  const handleWhatsAppSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const nameRegex = /^[\p{L}]+(([',. -][\p{L} ])?[\p{L}]+)*$/u;
    const phoneRegex = /^[6-9][0-9]{9}$/;
    
    let hasError = false;
    const newErrors = { name: "", phone: "" };

    if (!nameRegex.test(formData.name) || formData.name.length > 50) {
      newErrors.name = "Enter a valid name (max 50 chars).";
      hasError = true;
    }
    
    if (!phoneRegex.test(formData.phone)) {
      newErrors.phone = "Enter a valid 10-digit mobile number.";
      hasError = true;
    }

    if (hasError) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    
    const occasionTitle = occasions.find(o => o.id === selectedOccasion)?.title || selectedOccasion;
    
    const message = `Hi Cresta Global,\n\nI would like to inquire about ice cream catering for an event.\n\n*Name:* ${formData.name}\n*Phone:* ${formData.phone}\n*Event Type:* ${occasionTitle}\n*Details:* ${formData.message}`;
    
    const waLink = `https://wa.me/919000199047?text=${encodeURIComponent(message)}`;
    window.open(waLink, '_blank');
    
    setIsSubmitting(false);
    setSelectedOccasion(null);
    setFormData({ name: "", phone: "", message: "" });
  };

  return (
    <section className="relative w-full py-20 px-6 overflow-hidden bg-[#fdfdfd]">
      <div className="absolute top-0 left-0 w-full h-[300px] bg-gradient-to-b from-[#f9fafb] to-transparent" />
      
      <div className="mx-auto max-w-[1440px] relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-[11px] font-bold tracking-[0.25em] text-[#e6127d] uppercase mb-3"
          >
            Catering & Bulk Delivery
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-[#101b4d] mb-4"
          >
            Perfect For Every Occasion
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="max-w-[600px] text-gray-500 text-[15px] leading-relaxed"
          >
            From intimate house parties to grand wedding receptions, we deliver 100% authentic Baskin Robbins joy right to your venue.
          </motion.p>
        </div>

        {/* Occasions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {occasions.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              onClick={() => setSelectedOccasion(item.id)}
              className="cursor-pointer group relative flex flex-col rounded-[24px] overflow-hidden bg-white shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-gray-100 hover:shadow-[0_20px_40px_-12px_rgba(230,18,125,0.15)] transition-all duration-500 hover:-translate-y-1"
            >
              {/* Image Container */}
              <div className="relative w-full h-[240px] sm:h-[280px] overflow-hidden bg-gray-50">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10 opacity-60 group-hover:opacity-40 transition-opacity duration-500" />
                <CmsImage 
                  imageKey={item.imageKey}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>

              {/* Content */}
              <div className="relative flex flex-col flex-1 p-6 z-20 bg-white">
                <h3 className="font-heading text-xl font-bold text-[#101b4d] mb-2 group-hover:text-[#e6127d] transition-colors duration-300">
                  {item.title}
                </h3>
                <p className="text-[14px] text-gray-600 leading-relaxed">
                  {item.description}
                </p>
                
                {/* Subtle decorative line that expands on hover */}
                <div className="absolute bottom-0 left-6 right-6 h-[2px] bg-gradient-to-r from-[#e6127d] to-[#f5a623] scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500 ease-out" />
              </div>
            </motion.div>
          ))}
        </div>

      </div>

      {/* Inquiry Dialog */}
      <Dialog open={!!selectedOccasion} onOpenChange={(open) => {
        if (!open) {
          setSelectedOccasion(null);
          setFormData({ name: "", phone: "", message: "" });
          setErrors({ name: "", phone: "" });
        }
      }}>
        <DialogContent className="sm:max-w-[460px] bg-white shadow-2xl border-0 p-6 sm:p-8 rounded-3xl">
          <DialogHeader className="mb-2">
            <DialogTitle className="font-heading text-2xl text-[#00113A] font-bold">Book an Event</DialogTitle>
            <DialogDescription className="text-gray-500 text-sm">
              Fill out the details below and we will connect with you on WhatsApp instantly.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleWhatsAppSubmit} className="flex flex-col gap-5 mt-2">
            
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                Full Name <span className="text-[#e6127d]">*</span>
              </label>
              <input 
                name="name" 
                required 
                placeholder="John Doe" 
                value={formData.name}
                onChange={handleChange}
                onBlur={handleBlur}
                maxLength={50}
                className={`w-full bg-gray-50/50 px-4 py-3 border ${errors.name ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:border-[#00113A] focus:ring-[#00113A]'} rounded-xl focus:ring-1 outline-none transition-all shadow-sm placeholder:text-gray-400 text-sm`}
              />
              {errors.name && <span className="text-xs text-red-500 font-medium">{errors.name}</span>}
            </div>
            
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                Phone Number <span className="text-[#e6127d]">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium text-sm">+91</span>
                <input 
                  name="phone" 
                  required 
                  type="tel"
                  placeholder="99999 99999" 
                  value={formData.phone}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  maxLength={10}
                  className={`w-full bg-gray-50/50 pl-12 pr-4 py-3 border ${errors.phone ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:border-[#00113A] focus:ring-[#00113A]'} rounded-xl focus:ring-1 outline-none transition-all shadow-sm placeholder:text-gray-400 text-sm`}
                />
              </div>
              {errors.phone && <span className="text-xs text-red-500 font-medium">{errors.phone}</span>}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                Event Type <span className="text-[#e6127d]">*</span>
              </label>
              <div className="relative">
                <select
                  value={selectedOccasion || ""}
                  onChange={(e) => setSelectedOccasion(e.target.value)}
                  required
                  className="w-full bg-gray-50/50 px-4 py-3 pr-10 border border-gray-200 focus:border-[#00113A] focus:ring-[#00113A] rounded-xl focus:ring-1 outline-none transition-all shadow-sm text-sm appearance-none cursor-pointer"
                >
                  <option value="" disabled>Select Occasion</option>
                  {occasions.map(o => (
                    <option key={o.id} value={o.id}>{o.title}</option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                Additional Details (Optional)
              </label>
              <textarea 
                name="message" 
                placeholder="Expected guest count, location, specific flavors..." 
                rows={3}
                value={formData.message}
                onChange={handleChange}
                className="w-full bg-gray-50/50 px-4 py-3 border border-gray-200 focus:border-[#00113A] focus:ring-[#00113A] rounded-xl focus:ring-1 outline-none transition-all shadow-sm placeholder:text-gray-400 text-sm resize-none"
              />
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold py-3.5 px-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 mt-2 hover:shadow-lg disabled:opacity-70 uppercase tracking-wider text-sm"
            >
              {isSubmitting ? "Opening..." : "Send via WhatsApp"}
            </button>
          </form>
        </DialogContent>
      </Dialog>
    </section>
  );
}
