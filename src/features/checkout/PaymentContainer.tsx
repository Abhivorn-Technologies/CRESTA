"use client";

import { useState } from "react";
import { PaymentForm } from "./PaymentForm";
import { PaymentSummary } from "./PaymentSummary";

export type PaymentMethodType = "online" | "cod";

export function PaymentContainer() {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethodType>("online");

  return (
    <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 justify-center items-start w-full">
      <PaymentForm 
        selectedMethod={selectedMethod} 
        onSelectMethod={setSelectedMethod} 
      />
      <PaymentSummary 
        selectedMethod={selectedMethod} 
      />
    </div>
  );
}
