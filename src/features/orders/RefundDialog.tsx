"use client";

import { useState, useEffect } from "react";
import { X, Building2, User, CreditCard, Hash, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface RefundDialogProps {
  orderId: string;
  refundAmount: number;
}

export function RefundDialog({ orderId, refundAmount }: RefundDialogProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

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

  const [formData, setFormData] = useState({
    bankName: "",
    accountHolder: "",
    accountNumber: "",
    ifscCode: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const bankName = formData.bankName.trim();
    const accountHolder = formData.accountHolder.trim();
    const accountNumber = formData.accountNumber.trim();
    const ifscCode = formData.ifscCode.trim().toUpperCase();
    
    // 1. Bank Name Validation
    if (!/^[a-zA-Z\s.&-']{2,100}$/.test(bankName)) {
      setError("Bank Name must be 2-100 characters and contain only letters, spaces, ., &, -, '");
      return;
    }

    // 2. Account Holder Name Validation
    if (!/^[a-zA-Z\s.\-'/&]{2,100}$/.test(accountHolder) || !/[a-zA-Z]/.test(accountHolder)) {
      setError("Account Holder Name must be 2-100 characters, contain at least one letter, and no numbers/emojis.");
      return;
    }

    // 3. Account Number Validation
    if (!/^\d{6,20}$/.test(accountNumber)) {
      setError("Account Number must be 6-20 digits and contain no spaces or letters.");
      return;
    }

    // 4. IFSC Code Validation
    if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifscCode)) {
      setError("Invalid IFSC Code. Must be exactly 11 characters (e.g., HDFC0001234) with a zero as the 5th character.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const res = await fetch(`/api/orders/${orderId}/refund`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bankName, accountHolder, accountNumber, ifscCode }),
      });

      if (!res.ok) throw new Error("Failed to submit refund request.");
      
      setSuccess(true);
      setTimeout(() => {
        setIsOpen(false);
        router.refresh();
      }, 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="flex items-center justify-center bg-[#101b4d] text-white px-8 py-3 rounded-lg text-sm font-bold hover:bg-[#1b2c8d] transition-colors shadow-sm w-full sm:w-auto"
      >
        Claim Refund (₹{refundAmount.toFixed(2)})
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
            onClick={() => !submitting && !success && setIsOpen(false)}
          />
          <div className="relative bg-white rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-gray-100 flex flex-col animate-in fade-in zoom-in duration-200">
            
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-xl font-heading font-bold text-[#101b4d]">
                  Refund Details
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Securely provide your bank details for the refund.
                </p>
              </div>
              {!submitting && !success && (
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <X className="size-5" />
                </button>
              )}
            </div>

            {success ? (
              <div className="flex flex-col items-center justify-center py-8 text-center animate-in fade-in zoom-in duration-300">
                <div className="size-16 bg-green-50 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle2 className="size-8 text-green-500" />
                </div>
                <h4 className="text-lg font-bold text-[#101b4d]">Request Submitted</h4>
                <p className="text-sm text-gray-500 mt-2">
                  Your bank details have been saved. We will process your refund shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                
                {error && (
                  <div className="p-3 bg-red-50 text-red-600 text-sm font-medium rounded-lg border border-red-100">
                    {error}
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Bank Name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <Building2 className="size-4.5 text-gray-400" />
                    </div>
                    <input 
                      type="text" 
                      required
                      value={formData.bankName}
                      onChange={(e) => setFormData(prev => ({ ...prev, bankName: e.target.value.replace(/[^a-zA-Z\s.&-']/g, '') }))}
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#101b4d]/20 focus:border-[#101b4d]/50 transition-all font-medium text-gray-900" 
                      placeholder="e.g. HDFC Bank"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Account Holder Name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <User className="size-4.5 text-gray-400" />
                    </div>
                    <input 
                      type="text" 
                      required
                      value={formData.accountHolder}
                      onChange={(e) => setFormData(prev => ({ ...prev, accountHolder: e.target.value.replace(/[^a-zA-Z\s.\-'/&]/g, '') }))}
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#101b4d]/20 focus:border-[#101b4d]/50 transition-all font-medium text-gray-900" 
                      placeholder="As per bank records"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Account Number</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <CreditCard className="size-4.5 text-gray-400" />
                    </div>
                    <input 
                      type="text" 
                      required
                      pattern="[0-9]*"
                      value={formData.accountNumber}
                      onChange={(e) => setFormData(prev => ({ ...prev, accountNumber: e.target.value.replace(/\D/g, '').slice(0, 20) }))}
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#101b4d]/20 focus:border-[#101b4d]/50 transition-all font-medium text-gray-900 tracking-wide" 
                      placeholder="Enter account number"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">IFSC Code</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <Hash className="size-4.5 text-gray-400" />
                    </div>
                    <input 
                      type="text" 
                      required
                      value={formData.ifscCode}
                      onChange={(e) => setFormData(prev => ({ ...prev, ifscCode: e.target.value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 11) }))}
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#101b4d]/20 focus:border-[#101b4d]/50 transition-all font-medium text-gray-900 uppercase" 
                      placeholder="e.g. HDFC0001234"
                    />
                  </div>
                </div>

                <div className="pt-4 flex gap-3">
                  <button 
                    type="button"
                    onClick={() => setIsOpen(false)}
                    disabled={submitting}
                    className="flex-1 px-4 py-3 rounded-xl border border-gray-200 text-gray-700 font-bold text-sm hover:bg-gray-50 transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    disabled={submitting}
                    className="flex-1 bg-[#101b4d] text-white px-4 py-3 rounded-xl font-bold text-sm hover:bg-[#1b2c8d] transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
                  >
                    {submitting ? (
                      <div className="size-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    ) : (
                      "Submit Details"
                    )}
                  </button>
                </div>

              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
