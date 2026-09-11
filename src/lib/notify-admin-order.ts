import { pusherServer } from "@/lib/pusher-server";
import { NewOrderEventPayload } from "@/types/order-notification";

interface OrderLike {
  _id?: unknown;
  id?: string;
  totalAmount?: number;
  paymentMethod?: string;
  items?: Array<{ quantity?: number }>;
  shippingAddress?: {
    firstName?: string;
    lastName?: string;
  };
  createdAt?: string | Date;
}

/**
 * Triggers a real-time 'new-order' event on the private admin channel 'private-admin-orders'.
 * Gracefully swallows and logs errors so that any Pusher downtime or network failure
 * NEVER impacts the customer's successful order placement.
 */
export async function notifyAdminNewOrder(order: OrderLike): Promise<void> {
  try {
    if (!pusherServer) {
      console.warn(
        "[notifyAdminNewOrder] Pusher server not initialized; skipping real-time notification."
      );
      return;
    }

    const rawId = order._id ? String(order._id) : (order.id || "");
    const orderNumber = rawId.length >= 6
      ? `#${rawId.slice(-6).toUpperCase()}`
      : `#${rawId.toUpperCase() || "NEW"}`;

    const firstName = order.shippingAddress?.firstName?.trim() || "";
    const lastName = order.shippingAddress?.lastName?.trim() || "";
    const customerName = [firstName, lastName].filter(Boolean).join(" ") || "Customer";

    const itemCount = Array.isArray(order.items)
      ? order.items.reduce((sum, item) => sum + (Number(item?.quantity) || 1), 0)
      : 0;

    const payload: NewOrderEventPayload = {
      orderId: rawId,
      orderNumber,
      customerName,
      totalAmount: Number(order.totalAmount) || 0,
      paymentMethod: (order.paymentMethod || "cod").toUpperCase(),
      itemCount,
      createdAt: order.createdAt
        ? new Date(order.createdAt).toISOString()
        : new Date().toISOString(),
    };

    await pusherServer.trigger("private-admin-orders", "new-order", payload);
    console.log(`[Pusher] Successfully triggered new-order for ${orderNumber}`);
  } catch (error) {
    // Log error but NEVER throw so order flow remains 100% successful
    console.error("[Pusher] Failed to send real-time new order notification:", error);
  }
}
