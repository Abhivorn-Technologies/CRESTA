"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function OrderStatusPoller({ orderId, currentStatus }: { orderId: string, currentStatus: string }) {
  const router = useRouter();

  useEffect(() => {
    // Only poll if the order is not in a final state
    if (currentStatus === "Delivered" || currentStatus === "Cancelled") {
      return;
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

        // If the status changed dynamically on the server, refresh the page!
        if (newStatus !== currentStatus) {
          router.refresh();
        }
      } catch (error) {
        // Silent catch for polling
      }
    };

    const interval = setInterval(checkStatus, 3000);
    return () => clearInterval(interval);
  }, [orderId, currentStatus, router]);

  return null; // Invisible logical component
}
