import { notFound } from "next/navigation";
import { connectToDatabase } from "@/lib/mongodb";
import OrderModel from "@/models/Order";
import { Navbar } from "@/components/layout/Navbar";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, Truck, XCircle, Clock, MapPin, Receipt, Box } from "lucide-react";
import { PrintButton } from "@/features/orders/PrintButton";
import { RefundDialog } from "@/features/orders/RefundDialog";
import { LiveTrackingMapWrapper as LiveTrackingMap } from "@/features/orders/LiveTrackingMapWrapper";
import { OrderStatusPoller } from "@/features/orders/OrderStatusPoller";

export default async function OrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  await connectToDatabase();
  let dbOrder;
  try {
    dbOrder = await OrderModel.findById(id).lean();
  } catch (e) {
    return notFound(); // Invalid ID format
  }

  if (!dbOrder) {
    return notFound();
  }

  const order = {
    id: dbOrder._id.toString(),
    items: dbOrder.items.length > 0 ? dbOrder.items.map((i: any) => i.name || i.product?.name).join(", ") : "Items",
    date: new Date(dbOrder.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
    image: "/images/image 5.png",
    deliveryAddress: `${dbOrder.shippingAddress?.firstName || ""} ${dbOrder.shippingAddress?.lastName || ""}\n${dbOrder.shippingAddress?.address || ""}, ${dbOrder.shippingAddress?.city || ""}\n${dbOrder.shippingAddress?.postalCode || ""}`,
    status: 
      dbOrder.orderStatus === "delivered" ? "Delivered" :
      dbOrder.orderStatus === "out_for_delivery" ? "Out for Delivery" :
      dbOrder.orderStatus === "cancelled" ? "Cancelled" : "Upcoming",
    statusTime: new Date(dbOrder.updatedAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
    totalAmount: dbOrder.totalAmount,
    cancellationInfo: dbOrder.cancellationInfo || (dbOrder.orderStatus === "cancelled" ? {
      reason: "Requested by customer",
      date: dbOrder.updatedAt,
      eligibleForRefund: true,
      refundAmount: dbOrder.totalAmount,
      cancellationFee: 0,
    } : null),
    refundDetails: dbOrder.refundDetails,
    liveLocation: dbOrder.liveLocation,
    deliveryOtp: dbOrder.deliveryOtp,
    totalQuantity: dbOrder.items.reduce((sum: number, item: any) => sum + (item.quantity || 1), 0),
    paymentStatus: dbOrder.paymentStatus,
  };


  const getStatusDisplay = () => {
    switch (order.status) {
      case "Delivered":
        return {
          icon: <CheckCircle2 className="size-5 text-emerald-500" />,
          text: "Delivered",
          color: "text-emerald-500",
          bgColor: "bg-emerald-50",
          timeLabel: "Delivered on",
        };
      case "Out for Delivery":
        return {
          icon: <Truck className="size-5 text-blue-500" />,
          text: "Out for Delivery",
          color: "text-blue-500",
          bgColor: "bg-blue-50",
          timeLabel: "Estimated Delivery",
        };
      case "Upcoming":
        return {
          icon: <Clock className="size-5 text-orange-500" />,
          text: "Upcoming",
          color: "text-orange-500",
          bgColor: "bg-orange-50",
          timeLabel: "Estimated Delivery",
        };
      case "Cancelled":
        return {
          icon: <XCircle className="size-5 text-red-500" />,
          text: "Cancelled",
          color: "text-red-500",
          bgColor: "bg-red-50",
          timeLabel: "Cancelled on",
        };
      default:
        return {
          icon: <Clock className="size-5 text-gray-500" />,
          text: "Unknown",
          color: "text-gray-500",
          bgColor: "bg-gray-50",
          timeLabel: "Updated on",
        };
    }
  };

  const status = getStatusDisplay();

  return (
    <main className="flex min-h-screen flex-col bg-[#f4f5f7] print:bg-white">
      <div className="print:hidden">
        <Navbar />
      </div>

      <div className="mx-auto max-w-[1024px] w-full px-6 pt-32 pb-24 print:pt-10 flex-1">
        
        <OrderStatusPoller orderId={order.id} currentStatus={order.status} />

        {/* Back Navigation */}
        <Link 
          href="/orders" 
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-[#101b4d] transition-colors mb-6 group print:hidden"
        >
          <ArrowLeft className="size-4 group-hover:-translate-x-1 transition-transform" /> Back to Orders
        </Link>

        {/* Professional Single Card Invoice */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden print:shadow-none print:border-none">
          
          {/* Invoice Header */}
          <div className="p-8 border-b border-gray-100 flex flex-col sm:flex-row sm:items-start justify-between gap-6">
            <div className="flex flex-col gap-2">
              <h1 className="font-heading text-2xl font-bold text-[#101b4d] tracking-tight whitespace-nowrap">
                Order Details
              </h1>
              
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 text-sm text-gray-500 mt-1">
                <span className="whitespace-nowrap">
                  Order <span className="font-semibold text-gray-700">#{order.id}</span>
                </span>
                <div className="hidden sm:block size-1 rounded-full bg-gray-300" />
                <span className="whitespace-nowrap">
                  Placed on {order.date}
                </span>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${status.bgColor} border border-white shrink-0`}>
                {status.icon}
                <span className={`text-[13px] font-bold ${status.color}`}>{status.text}</span>
              </div>
              
              {/* PDF Download Button */}
              {order.status === "Delivered" && (
                <PrintButton orderId={order.id} />
              )}
            </div>
          </div>

          {/* Live Tracking Map Section (Visible only when Out for Delivery) */}
          {order.status === "Out for Delivery" && (
            <div className="p-8 border-b border-gray-100 bg-gray-50/50">
              <LiveTrackingMap 
                orderId={order.id} 
                initialLocation={order.liveLocation} 
                otp={order.deliveryOtp} 
              />
            </div>
          )}

          {/* Items Section */}
          <div className="p-8 border-b border-gray-100">
            <h2 className="text-[13px] font-bold text-gray-400 uppercase tracking-widest mb-6">
              Items Ordered
            </h2>
            
            <div className="flex items-center justify-between group">
              <div className="flex items-center gap-6">
                <div className="relative h-20 w-20 rounded-lg bg-[#f8f9fa] border border-gray-100 flex items-center justify-center shrink-0">
                  <Image 
                    src={order.image} 
                    alt={order.items}
                    fill
                    className="object-contain p-3"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="font-bold text-[#101b4d] text-base">{order.items}</span>
                  <span className="text-sm text-gray-500">Qty: {order.totalQuantity}</span>
                </div>
              </div>
              <span className="font-bold text-[#101b4d] text-lg">₹{order.totalAmount.toFixed(2)}</span>
            </div>
          </div>

          {/* Info Section Grid */}
          <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-12 print:grid-cols-2">
            
            {/* Delivery Details */}
            <div className="flex flex-col">
              <h2 className="text-[13px] font-bold text-gray-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                <MapPin className="size-4" /> Delivery Information
              </h2>
              <div className="flex flex-col flex-1">
                <p className="text-[15px] font-medium text-gray-700 leading-relaxed whitespace-pre-line mb-6">
                  {order.deliveryAddress}
                </p>
                <div className="flex flex-col gap-1 mt-auto">
                  <span className="text-[11px] font-bold text-gray-400 uppercase">{status.timeLabel}</span>
                  <span className="text-[15px] font-bold text-[#101b4d]">{order.statusTime}</span>
                </div>
              </div>
            </div>

            {/* Payment Summary */}
            <div className="flex flex-col">
              <h2 className="text-[13px] font-bold text-gray-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                <Receipt className="size-4" /> Payment Summary
              </h2>
              <div className="flex flex-col gap-5 flex-1">
                <div className="flex items-center justify-between text-[15px]">
                  <span className="text-gray-500 font-medium">Subtotal</span>
                  <span className="font-bold text-gray-700">₹{order.totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between text-[15px]">
                  <span className="text-gray-500 font-medium">Delivery Fee</span>
                  <span className="font-bold text-gray-700">₹0.00</span>
                </div>
                <div className="flex items-center justify-between text-[15px]">
                  <span className="text-gray-500 font-medium">Payment Method</span>
                  <span className="font-bold text-gray-700">Online Payment</span>
                </div>
                
                <div className="h-px w-full bg-gray-100 my-1" />
                
                <div className="flex items-center justify-between">
                  <span className="font-black text-[#101b4d] text-base uppercase tracking-wider">Total</span>
                  <span className="font-black text-2xl text-[#101b4d]">₹{order.totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>

          </div>

          {/* Cancellation Information (If Cancelled) */}
          {order.status === "Cancelled" && order.cancellationInfo && (
            <div className="p-8 border-t border-gray-100 bg-red-50/30">
              <h2 className="text-[13px] font-bold text-red-500 uppercase tracking-widest mb-5 flex items-center gap-2">
                <XCircle className="size-4" /> Cancellation Details
              </h2>
              <div className="bg-white p-6 rounded-lg border border-red-100 flex flex-col gap-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
                  <div>
                    <span className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Reason</span>
                    <span className="font-medium text-gray-900">{order.cancellationInfo.reason}</span>
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Date</span>
                    <span className="font-medium text-gray-900">
                      {new Date(order.cancellationInfo.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Refund Eligibility</span>
                    <span className={`font-bold ${order.cancellationInfo.eligibleForRefund ? "text-green-600" : "text-red-500"}`}>
                      {order.cancellationInfo.eligibleForRefund ? "Eligible" : "Not Eligible"}
                    </span>
                  </div>
                  {order.cancellationInfo.eligibleForRefund && (
                    <div>
                      <span className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Refund Amount</span>
                      <span className="font-bold text-[#101b4d]">₹{order.cancellationInfo.refundAmount.toFixed(2)}</span>
                    </div>
                  )}
                  {order.cancellationInfo.cancellationFee > 0 && (
                    <div>
                      <span className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Cancellation Fee</span>
                      <span className="font-medium text-red-500">₹{order.cancellationInfo.cancellationFee.toFixed(2)}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Action Footer */}
          {order.status === "Delivered" && (
            <div className="px-8 py-6 border-t border-gray-100 flex justify-end print:hidden">
              <button className="flex items-center gap-2 bg-[#101b4d] text-white px-8 py-3 rounded-lg text-sm font-bold hover:bg-[#e6127d] transition-colors shadow-sm">
                <Box className="size-4" /> Reorder Items
              </button>
            </div>
          )}

          {order.status === "Cancelled" && order.cancellationInfo?.eligibleForRefund && (
            <div className="bg-gray-50 px-8 py-5 border-t border-gray-100 flex justify-end print:hidden">
              {order.paymentStatus === "refunded" ? (
                <div className="flex items-center gap-2 px-6 py-3 rounded-lg bg-emerald-50 border border-emerald-100 text-emerald-700 font-bold text-sm">
                  <CheckCircle2 className="size-5" /> 
                  Refund Successfully Processed
                </div>
              ) : order.refundDetails?.bankName ? (
                <div className="flex items-center gap-2 px-6 py-3 rounded-lg bg-green-50 border border-green-100 text-green-700 font-bold text-sm">
                  <Clock className="size-5" /> 
                  Refund Requested (Pending)
                </div>
              ) : (
                <RefundDialog orderId={order.id} refundAmount={order.cancellationInfo.refundAmount} />
              )}
            </div>
          )}

        </div>

      </div>
    </main>
  );
}
