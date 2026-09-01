"use client";

import { Navbar } from "@/components/layout/Navbar";
import { MapPin, Phone, Mail, ExternalLink, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { siteConfig } from "@/constants/site";

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ name: "", phone: "", email: "", message: "" });
  const [errors, setErrors] = useState({ name: "", phone: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    let value = e.target.value;
    const name = e.target.name;

    // Physically restrict what can be typed
    if (name === "name") {
      // Only allow letters (any language), spaces, hyphens, apostrophes, periods, and commas
      value = value.replace(/[^\p{L}\s\-'.,]/gu, "");
    }
    
    if (name === "phone") {
      // Only allow digits
      value = value.replace(/\D/g, "");
      // Do not allow starting with 0-5
      if (value.length > 0 && /^[0-5]/.test(value)) {
        value = value.replace(/^[0-5]+/, "");
      }
    }

    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user types
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validateField = (name: string, value: string) => {
    const nameRegex = /^[\p{L}]+(([',. -][\p{L} ])?[\p{L}]+)*$/u;
    const phoneRegex = /^[6-9][0-9]{9}$/;
    
    if (name === "name") {
      if (value && (!nameRegex.test(value) || value.length > 50)) {
        setErrors(prev => ({ ...prev, name: "Please enter a valid name (max 50 chars, no numbers or special symbols)." }));
      }
    }
    
    if (name === "phone") {
      if (value && !phoneRegex.test(value)) {
        setErrors(prev => ({ ...prev, phone: "Please enter a valid 10-digit mobile number starting with 6, 7, 8, or 9." }));
      }
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    validateField(e.target.name, e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const nameRegex = /^[\p{L}]+(([',. -][\p{L} ])?[\p{L}]+)*$/u;
    const phoneRegex = /^[6-9][0-9]{9}$/;
    
    let hasError = false;
    const newErrors = { name: "", phone: "" };

    if (!nameRegex.test(formData.name) || formData.name.length > 50) {
      newErrors.name = "Please enter a valid name (max 50 chars, no numbers).";
      hasError = true;
    }
    
    if (!phoneRegex.test(formData.phone)) {
      newErrors.phone = "Please enter a valid 10-digit mobile number starting with 6, 7, 8, or 9.";
      hasError = true;
    }

    if (hasError) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    
    // Format the WhatsApp message
    const message = `*New Contact Request*
*Name:* ${formData.name}
*Mobile:* ${formData.phone}
*Email:* ${formData.email}
*Message:*
${formData.message}`;

    const whatsappUrl = `https://wa.me/919000199047?text=${encodeURIComponent(message)}`;

    // Open WhatsApp in a new tab
    window.open(whatsappUrl, '_blank');

    setIsSubmitting(false);
    toast.success("Redirecting to WhatsApp...");
    setFormData({ name: "", phone: "", email: "", message: "" });
  };

  return (
    <main className="flex min-h-screen flex-col relative bg-white">
      <Navbar />

      <div className="flex-1 w-full max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24 relative z-10">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-[#e6127d] font-bold text-sm tracking-widest uppercase mb-4 block">
            Contact Us
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-[#00113A] mb-6 leading-tight">
            Let's Start Your <span className="text-[#e6127d] italic font-serif">Ice Cream</span> Journey
          </h1>
          <p className="text-gray-600 text-lg">
            Ready to order for an event, have a question, or want to partner with us? Fill out the form below and our team will get back to you shortly.
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          
          {/* Left Column: Map & Info Card */}
          <div className="relative h-[600px] rounded-3xl overflow-hidden shadow-lg border border-gray-100 group">
            {/* Google Maps Embed */}
            <iframe 
              src="https://maps.google.com/maps?q=17.4665816,78.3099937&t=&z=17&ie=UTF8&iwloc=&output=embed" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen={true} 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0 grayscale-[20%] group-hover:grayscale-0 transition-all duration-500"
            />

            {/* Floating Info Card */}
            <div className="absolute bottom-6 left-6 right-6 sm:right-auto sm:w-[360px] bg-white rounded-2xl p-6 shadow-2xl border border-gray-100 transform translate-y-0 transition-transform duration-300 z-10">
              
              <div className="flex items-center gap-4 mb-6 border-b border-gray-100 pb-4">
                <div className="w-12 h-12 bg-[#00113A] rounded-xl flex items-center justify-center text-white shrink-0 shadow-md">
                  <MapPin className="size-6" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-[#00113A] text-lg leading-none mb-1">Baskin Robbins</h3>
                  <p className="text-sm text-gray-500">Premium Ice Cream Distributor</p>
                </div>
              </div>

              <div className="flex flex-col gap-4 mb-6">
                <div className="flex gap-3">
                  <MapPin className="size-5 text-[#e6127d] shrink-0 mt-0.5" />
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {siteConfig.address}
                  </p>
                </div>
                <div className="flex gap-3 items-center">
                  <Phone className="size-5 text-[#e6127d] shrink-0" />
                  <a href={`tel:${siteConfig.phone.replace(/[^0-9+]/g, '')}`} className="text-sm font-medium text-gray-700 hover:text-[#e6127d] transition-colors">
                    {siteConfig.phone}
                  </a>
                </div>
                <div className="flex gap-3 items-center">
                  <Mail className="size-5 text-[#e6127d] shrink-0" />
                  <a href={`mailto:${siteConfig.email}`} className="text-sm font-medium text-gray-700 hover:text-[#e6127d] transition-colors">
                    {siteConfig.email}
                  </a>
                </div>
              </div>

              <a 
                href="https://www.google.com/maps?q=17.4665816,78.3099937&z=17&hl=en" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full bg-[#00113A] hover:bg-[#1a2b7c] text-white font-bold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg text-sm uppercase tracking-wider"
              >
                Get Directions
                <ExternalLink className="size-4" />
              </a>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="bg-gray-50/50 rounded-3xl p-8 sm:p-10 border border-gray-100 shadow-sm flex flex-col h-full justify-center">
            <h2 className="text-2xl font-heading font-bold text-[#00113A] mb-8 text-center sm:text-left">
              Send us a Message
            </h2>
            
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Your Name <span className="text-[#e6127d]">*</span>
                  </label>
                  <input 
                    type="text" 
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="John Doe"
                    maxLength={50}
                    className={`w-full bg-white px-4 py-3.5 border ${errors.name ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:border-[#00113A] focus:ring-[#00113A]'} rounded-xl focus:ring-1 outline-none transition-all shadow-sm placeholder:text-gray-300 text-sm`}
                  />
                  {errors.name && <span className="text-xs text-red-500 font-medium">{errors.name}</span>}
                </div>
                
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Mobile Number <span className="text-[#e6127d]">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium text-sm">+91</span>
                    <input 
                      type="tel" 
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="99999 99999"
                      maxLength={10}
                      className={`w-full bg-white pl-12 pr-4 py-3.5 border ${errors.phone ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:border-[#00113A] focus:ring-[#00113A]'} rounded-xl focus:ring-1 outline-none transition-all shadow-sm placeholder:text-gray-300 text-sm`}
                    />
                  </div>
                  {errors.phone && <span className="text-xs text-red-500 font-medium">{errors.phone}</span>}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Email Address <span className="text-[#e6127d]">*</span>
                </label>
                <input 
                  type="email" 
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john@company.com"
                  className="w-full bg-white px-4 py-3.5 border border-gray-200 rounded-xl focus:border-[#00113A] focus:ring-1 focus:ring-[#00113A] outline-none transition-all shadow-sm placeholder:text-gray-300 text-sm"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Your Message
                </label>
                <textarea 
                  rows={4}
                  name="message"
                  required
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell us about your requirement, bulk order, or any questions..."
                  className="w-full bg-white px-4 py-3.5 border border-gray-200 rounded-xl focus:border-[#00113A] focus:ring-1 focus:ring-[#00113A] outline-none transition-all shadow-sm placeholder:text-gray-300 text-sm resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#F7CA00] hover:bg-[#F2C200] text-[#00113A] font-bold py-4 px-8 rounded-xl shadow-md border border-[#F2C200] transition-all flex items-center justify-center gap-2 mt-2 hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed uppercase tracking-wider text-sm"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="size-5 animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Submit Request"
                )}
              </button>
              
              <p className="text-[11px] text-gray-400 text-center mt-2">
                By submitting this form, you agree to our Terms of Service and Privacy Policy.
              </p>
            </form>
          </div>
          
        </div>
      </div>
    </main>
  );
}
