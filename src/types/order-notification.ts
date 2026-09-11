export interface NewOrderEventPayload {
  orderId: string;
  orderNumber: string;
  customerName: string;
  totalAmount: number;
  paymentMethod: string;
  itemCount: number;
  createdAt: string;
}
