"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function OrderStatusPoller({ 
  orderId, 
  currentStatus, 
  currentPaymentStatus,
  isEligibleForRefund 
}: { 
  orderId: string, 
  currentStatus: string, 
  currentPaymentStatus?: string,
  isEligibleForRefund?: boolean
}) {
  const router = useRouter();

  useEffect(() => {
    // Only poll if the order is not in a final state
    if (currentStatus === "Delivered") return;
    if (currentStatus === "Cancelled") {
      // If cancelled but waiting for a refund, keep polling
      if (!isEligibleForRefund || currentPaymentStatus === "refunded") {
        return;
      }
    }

    const checkStatus = async () => {
      try {
        const res = await fetch(`/api/orders/${orderId}`);
        if (!res.ok) return;
        const data = await res.json();
        
        let newStatus = "Upcoming";
        if (data.order?.orderStatus === "delivered") newStatus = "Delivered";
        else if (data.order?.orderStatus === "out_for_delivery") newStatus = "Out for Delivery";
        else if (data.order?.orderStatus === "cancelled") newStatus = "Cancelled";

        const newPaymentStatus = data.order?.paymentStatus;

        // If the status changed dynamically on the server, refresh the page!
        if (newStatus !== currentStatus || (newPaymentStatus && newPaymentStatus !== currentPaymentStatus)) {
          router.refresh();
        }
      } catch (error) {
        // Silent catch for polling
      }
    };

    const interval = setInterval(checkStatus, 3000);
    return () => clearInterval(interval);
  }, [orderId, currentStatus, currentPaymentStatus, isEligibleForRefund, router]);

  return null; // Invisible logical component
}
