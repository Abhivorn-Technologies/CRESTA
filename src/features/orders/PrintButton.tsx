"use client";

import { Printer } from "lucide-react";

export function PrintButton({ orderId }: { orderId: string }) {
  const handlePrint = () => {
    const originalTitle = document.title;
    document.title = `Invoice-${orderId}`;
    window.print();
    // Restore original title slightly after to ensure the print dialog catches the new title
    setTimeout(() => {
      document.title = originalTitle;
    }, 100);
  };

  return (
    <button 
      onClick={handlePrint}
      className="flex items-center gap-2 bg-white border border-gray-200 text-[#101b4d] px-6 py-2 rounded-lg text-sm font-bold hover:bg-gray-50 transition-colors shadow-sm print:hidden"
    >
      <Printer className="size-4" />
      Invoice PDF
    </button>
  );
}
