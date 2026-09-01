"use client";

import { Printer } from "lucide-react";

export function PrintButton({ orderId }: { orderId: string }) {
  const handlePrint = () => {
    const originalTitle = document.title;
    const shortId = orderId.length > 6 ? orderId.substring(orderId.length - 6).toUpperCase() : orderId;
    document.title = `Order_${shortId}_Invoice`;
    
    // We MUST use setTimeout here to give Chrome/Edge a split second 
    // to actually register the title change before locking the thread with window.print()
    setTimeout(() => {
      window.print();
      
      // Since window.print() is blocking, the code below runs AFTER the print dialog is closed
      document.title = originalTitle;
    }, 50);
  };

  return (
    <button 
      onClick={handlePrint}
      className="flex items-center gap-2 bg-white border border-gray-200 text-[#101b4d] px-6 py-2 rounded-lg text-sm font-bold hover:bg-gray-50 transition-colors shadow-sm print:hidden whitespace-nowrap shrink-0"
    >
      <Printer className="size-4" />
      Invoice PDF
    </button>
  );
}
