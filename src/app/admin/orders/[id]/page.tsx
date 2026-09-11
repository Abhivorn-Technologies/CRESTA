"use client";

import React, { useEffect, useState, use } from "react";
import Link from "next/link";
import { 
  ArrowLeft, 
  User, 
  MapPin, 
  Package, 
  CreditCard, 
  MessageCircle, 
  Printer, 
  CheckCircle2, 
  Clock, 
  Truck, 
  AlertCircle,
  ExternalLink,
  Phone,
  Mail,
  ShieldCheck,
  Calendar,
  Copy,
  Check
} from "lucide-react";
import { toast } from "sonner";

export default function OrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [copiedOtp, setCopiedOtp] = useState(false);

  useEffect(() => {
    async function fetchOrder() {
      try {
        const response = await fetch(`/api/admin/orders/${id}`, { cache: "no-store" });
        if (response.ok) {
          const data = await response.json();
          setOrder(data);
        }
      } catch (error) {
        console.error("Failed to fetch order details:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchOrder();
  }, [id]);

  const updateStatus = async (newStatus: string) => {
    setUpdating(true);
    try {
      const res = await fetch(`/api/admin/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderStatus: newStatus }),
      });
      if (res.ok) {
        const updated = await res.json();
        setOrder((prev: any) => ({ ...prev, orderStatus: newStatus }));
        toast.success(`Order status updated to "${newStatus.replace(/_/g, " ").toUpperCase()}"`);
      } else {
        toast.error("Failed to update status");
      }
    } catch {
      toast.error("Network error while updating status");
    } finally {
      setUpdating(false);
    }
  };

  const updatePaymentStatus = async (newPaymentStatus: string) => {
    setUpdating(true);
    try {
      const res = await fetch(`/api/admin/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentStatus: newPaymentStatus }),
      });
      if (res.ok) {
        setOrder((prev: any) => ({ ...prev, paymentStatus: newPaymentStatus }));
        toast.success(`Payment status marked as "${newPaymentStatus.toUpperCase()}"`);
      } else {
        toast.error("Failed to update payment status");
      }
    } catch {
      toast.error("Network error while updating payment status");
    } finally {
      setUpdating(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedOtp(true);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopiedOtp(false), 2000);
  };

  if (loading) {
    return (
      <div className="flex-1 w-full min-h-[550px] flex flex-col items-center justify-center gap-3">
        <div className="relative flex items-center justify-center">
          <div className="size-12 rounded-full border-3 border-gray-200 border-t-[#e6127d] animate-spin" />
        </div>
        <p className="text-sm font-medium text-gray-500">Loading order details...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[450px] gap-4 bg-white rounded-3xl p-10 border border-gray-100 shadow-sm max-w-xl mx-auto my-12 text-center">
        <div className="size-16 rounded-full bg-red-50 text-red-500 flex items-center justify-center">
          <AlertCircle className="size-8" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Order Not Found</h2>
          <p className="text-sm text-gray-500 mt-1">
            The requested order ID does not exist or may have been deleted.
          </p>
        </div>
        <Link 
          href="/admin/orders" 
          className="mt-2 px-6 py-2.5 rounded-xl bg-[#00113A] text-white text-xs font-semibold hover:bg-[#00113A]/90 transition-all"
        >
          Return to Orders List
        </Link>
      </div>
    );
  }

  const {
    shippingAddress,
    items = [],
    totalAmount = 0,
    orderStatus = "processing",
    paymentStatus = "pending",
    paymentMethod = "cod",
    createdAt,
    deliveryOtp,
    isOtpVerified,
    razorpayPaymentId,
    razorpayOrderId
  } = order;

  const rawId = order._id ? String(order._id) : "";
  const displayOrderNumber = rawId.length >= 6 ? `#${rawId.slice(-6).toUpperCase()}` : `#${rawId.toUpperCase() || "NEW"}`;

  // Timeline stages for order progress
  const stages = [
    { key: "order_placed", label: "Placed" },
    { key: "processing", label: "Processing" },
    { key: "out_for_delivery", label: "Out for Delivery" },
    { key: "delivered", label: "Delivered" },
  ];

  const currentStageIndex = (() => {
    if (orderStatus === "delivered") return 3;
    if (orderStatus === "out_for_delivery" || orderStatus === "shipped") return 2;
    if (orderStatus === "processing" || orderStatus === "preparing" || orderStatus === "order_confirmed") return 1;
    return 0;
  })();

  const isCancelled = orderStatus === "cancelled";

  return (
    <div className="flex flex-col gap-6 pb-16 max-w-6xl mx-auto w-full font-sans animate-in fade-in duration-300">
      
      {/* Top Breadcrumb & Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-2xl p-4 md:px-6 md:py-5 border border-gray-100 shadow-sm">
        <div className="flex items-center gap-3">
          <Link 
            href="/admin/orders" 
            className="size-10 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-600 flex items-center justify-center transition-all hover:scale-105 active:scale-95 border border-gray-200/70 shrink-0"
            title="Back to all orders"
          >
            <ArrowLeft className="size-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-gray-400">Orders</span>
              <span className="text-gray-300">/</span>
              <span className="text-xs font-mono font-bold text-[#e6127d] bg-pink-50 px-2 py-0.5 rounded-md">
                {displayOrderNumber}
              </span>
            </div>
            <h1 className="text-xl md:text-2xl font-heading font-extrabold text-[#00113A] mt-0.5">
              Order {displayOrderNumber}
            </h1>
          </div>
        </div>

        <div className="flex items-center flex-wrap gap-2.5">
          {/* WhatsApp Direct Action */}
          {shippingAddress?.phone && (
            <button
              onClick={() => {
                const cleanPhone = shippingAddress.phone.replace("+91", "").trim();
                const message = `*Cresta Global*\n✅ *Order Update*\n\nHello ${shippingAddress.firstName || "Customer"},\nWe are processing your order *${displayOrderNumber}* amounting to *₹${Number(totalAmount).toFixed(2)}*.\n\nStatus: *${orderStatus.toUpperCase()}*.\n\nThank you for choosing Cresta Global!`;
                window.open(`https://wa.me/91${cleanPhone}?text=${encodeURIComponent(message)}`, "_blank");
              }}
              className="flex items-center gap-1.5 bg-[#25D366] hover:bg-[#1EBE5D] text-white px-3.5 py-2 rounded-xl text-xs font-semibold transition-all shadow-xs active:scale-95 cursor-pointer"
            >
              <MessageCircle className="size-4" />
              <span>WhatsApp</span>
            </button>
          )}

          {/* Print Invoice Button */}
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200/80 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all shadow-xs active:scale-95 cursor-pointer"
          >
            <Printer className="size-4 text-gray-500" />
            <span>Print</span>
          </button>
        </div>
      </div>

      {/* Order Progress Stepper */}
      <div className="bg-white rounded-2xl p-5 md:p-6 border border-gray-100 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <Clock className="size-4 text-gray-400" />
            <span className="text-xs text-gray-500 font-medium">
              Placed on {new Date(createdAt).toLocaleString("en-US", { 
                month: "short", 
                day: "numeric", 
                year: "numeric", 
                hour: "2-digit", 
                minute: "2-digit" 
              })}
            </span>
          </div>

          {/* Status Changer Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-gray-500">Update Status:</span>
            <select
              value={orderStatus}
              disabled={updating}
              onChange={(e) => updateStatus(e.target.value)}
              className="text-xs font-bold rounded-xl border border-gray-200 bg-gray-50 px-3 py-1.5 text-[#00113A] focus:outline-none focus:ring-2 focus:ring-[#e6127d]/30 cursor-pointer disabled:opacity-50"
            >
              <option value="order_placed">Placed</option>
              <option value="processing">Processing</option>
              <option value="preparing">Preparing</option>
              <option value="out_for_delivery">Out for Delivery</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Visual Progress Bar */}
        {isCancelled ? (
          <div className="p-4 rounded-xl bg-red-50 border border-red-100 flex items-center gap-3 text-red-700">
            <AlertCircle className="size-5 shrink-0" />
            <div>
              <p className="text-xs font-bold">This order has been cancelled.</p>
              <p className="text-[11px] text-red-500 mt-0.5">No further delivery steps are required.</p>
            </div>
          </div>
        ) : (
          <div className="relative flex items-center justify-between w-full max-w-3xl mx-auto px-4">
            {/* Background Line */}
            <div className="absolute left-8 right-8 top-1/2 -translate-y-1/2 h-1 bg-gray-100 -z-0" />
            {/* Active Line */}
            <div 
              className="absolute left-8 top-1/2 -translate-y-1/2 h-1 bg-gradient-to-r from-[#e6127d] to-[#ff4797] transition-all duration-500 -z-0"
              style={{ width: `${(currentStageIndex / (stages.length - 1)) * 88}%` }}
            />

            {stages.map((stage, idx) => {
              const isCompleted = idx <= currentStageIndex;
              const isCurrent = idx === currentStageIndex;

              return (
                <div key={stage.key} className="flex flex-col items-center gap-2 z-10 bg-white px-2">
                  <div className={`size-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                    isCompleted
                      ? "bg-[#e6127d] text-white shadow-md shadow-[#e6127d]/30 scale-105"
                      : "bg-gray-100 text-gray-400 border border-gray-200"
                  }`}>
                    {isCompleted ? <Check className="size-4 stroke-[3]" /> : idx + 1}
                  </div>
                  <span className={`text-[11px] font-semibold text-center whitespace-nowrap ${
                    isCurrent ? "text-[#e6127d] font-bold" : isCompleted ? "text-gray-800" : "text-gray-400"
                  }`}>
                    {stage.label}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left Column (Items & Financial Summary) */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          
          {/* Ordered Items Card */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 md:p-6">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-gray-100">
              <div className="flex items-center gap-2.5">
                <div className="size-8 rounded-xl bg-[#e6127d]/10 flex items-center justify-center text-[#e6127d]">
                  <Package className="size-4" />
                </div>
                <h3 className="text-sm font-heading font-bold text-[#00113A]">
                  Ordered Items ({items.length})
                </h3>
              </div>
              <span className="text-xs text-gray-400 font-medium">
                {items.reduce((sum: number, it: any) => sum + (Number(it.quantity) || 1), 0)} Total Units
              </span>
            </div>

            <div className="flex flex-col divide-y divide-gray-50">
              {items.map((item: any, idx: number) => {
                const itemTotal = (Number(item.price) || 0) * (Number(item.quantity) || 1);

                return (
                  <div key={idx} className="py-3.5 first:pt-0 last:pb-0 flex items-center gap-4">
                    {/* Item Thumbnail */}
                    <div className="size-16 rounded-xl bg-gray-50 border border-gray-100 overflow-hidden shrink-0 flex items-center justify-center">
                      {item.image ? (
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-full h-full object-cover" 
                        />
                      ) : (
                        <div className="size-full bg-pink-50/60 flex items-center justify-center text-[#e6127d]">
                          <Package className="size-6" />
                        </div>
                      )}
                    </div>

                    {/* Item Info */}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-gray-900 truncate">
                        {item.name}
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                        {item.category && (
                          <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-gray-100 text-gray-600">
                            {item.category}
                          </span>
                        )}
                        {item.volume && (
                          <span className="text-[10px] font-medium text-gray-400">
                            {item.volume}
                          </span>
                        )}
                        <span className="text-xs text-gray-400">
                          ₹{Number(item.price).toFixed(2)} × {item.quantity}
                        </span>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="text-right shrink-0">
                      <span className="text-sm font-extrabold text-[#00113A]">
                        ₹{itemTotal.toFixed(2)}
                      </span>
                      <span className="text-[10px] text-gray-400 block mt-0.5">
                        Qty: {item.quantity}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Payment & Invoice Summary Card */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 md:p-6">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-gray-100">
              <div className="flex items-center gap-2.5">
                <div className="size-8 rounded-xl bg-[#e6127d]/10 flex items-center justify-center text-[#e6127d]">
                  <CreditCard className="size-4" />
                </div>
                <h3 className="text-sm font-heading font-bold text-[#00113A]">
                  Payment Summary
                </h3>
              </div>

              {/* Payment Method Badge */}
              <span className="text-xs font-bold uppercase px-3 py-1 rounded-lg bg-gray-100 text-gray-700 border border-gray-200/60">
                {paymentMethod === "cod" ? "Cash on Delivery" : paymentMethod.toUpperCase()}
              </span>
            </div>

            <div className="flex flex-col gap-2.5 text-xs text-gray-600">
              <div className="flex justify-between items-center py-1">
                <span className="text-gray-500">Items Subtotal</span>
                <span className="font-semibold text-gray-800">
                  ₹{Number(totalAmount).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-gray-500">Estimated Delivery Fee</span>
                <span className="font-semibold text-green-600">FREE</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-gray-500">Taxes & GST</span>
                <span className="font-medium text-gray-400">Included in prices</span>
              </div>

              <div className="pt-3 mt-1 border-t border-gray-100 flex justify-between items-center">
                <div>
                  <span className="text-sm font-extrabold text-[#00113A] block">
                    Total Amount
                  </span>
                  <span className="text-[10px] text-gray-400">
                    Includes all applicable taxes
                  </span>
                </div>
                <span className="text-2xl font-heading font-extrabold text-[#e6127d]">
                  ₹{Number(totalAmount).toFixed(2)}
                </span>
              </div>

              {/* Payment Status Bar with Quick Toggle */}
              <div className="mt-4 pt-4 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500 font-medium">Payment Status:</span>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-lg uppercase ${
                    paymentStatus === "completed" ? "bg-green-100 text-green-700" :
                    paymentStatus === "refunded" ? "bg-gray-100 text-gray-700" :
                    "bg-amber-100 text-amber-700"
                  }`}>
                    {paymentStatus}
                  </span>
                </div>

                {paymentStatus !== "completed" && (
                  <button
                    disabled={updating}
                    onClick={() => updatePaymentStatus("completed")}
                    className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-green-50 text-green-700 hover:bg-green-100 border border-green-200 transition-all cursor-pointer"
                  >
                    Mark as Paid (Cash Collected)
                  </button>
                )}
              </div>

              {/* Online Payment Transaction IDs (if applicable) */}
              {(razorpayPaymentId || razorpayOrderId) && (
                <div className="mt-3 p-3 rounded-xl bg-gray-50 border border-gray-100 flex flex-col gap-1 text-[11px] font-mono">
                  {razorpayPaymentId && (
                    <div className="flex justify-between text-gray-500">
                      <span>Razorpay Payment ID:</span>
                      <span className="font-bold text-gray-700">{razorpayPaymentId}</span>
                    </div>
                  )}
                  {razorpayOrderId && (
                    <div className="flex justify-between text-gray-500">
                      <span>Razorpay Order ID:</span>
                      <span className="font-bold text-gray-700">{razorpayOrderId}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column (Customer, Shipping & Security) */}
        <div className="flex flex-col gap-6">

          {/* Customer Profile Card */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 md:p-6">
            <div className="flex items-center gap-2.5 pb-4 mb-4 border-b border-gray-100">
              <div className="size-8 rounded-xl bg-[#e6127d]/10 flex items-center justify-center text-[#e6127d]">
                <User className="size-4" />
              </div>
              <h3 className="text-sm font-heading font-bold text-[#00113A]">
                Customer Details
              </h3>
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <div className="size-11 rounded-full bg-gradient-to-tr from-[#00113A] to-[#203a7a] text-white font-bold text-sm flex items-center justify-center shadow-sm shrink-0">
                  {shippingAddress?.firstName ? shippingAddress.firstName.charAt(0).toUpperCase() : "C"}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-900">
                    {shippingAddress?.firstName} {shippingAddress?.lastName}
                  </h4>
                  <span className="text-xs text-gray-400">Customer</span>
                </div>
              </div>

              <div className="flex flex-col gap-2 pt-2 text-xs border-t border-gray-50">
                {shippingAddress?.email && (
                  <a 
                    href={`mailto:${shippingAddress.email}`}
                    className="flex items-center gap-2 text-gray-600 hover:text-[#e6127d] transition-colors group truncate"
                  >
                    <Mail className="size-3.5 text-gray-400 group-hover:text-[#e6127d] shrink-0" />
                    <span className="truncate">{shippingAddress.email}</span>
                  </a>
                )}
                {shippingAddress?.phone && (
                  <a 
                    href={`tel:${shippingAddress.phone}`}
                    className="flex items-center gap-2 text-gray-600 hover:text-[#e6127d] transition-colors group"
                  >
                    <Phone className="size-3.5 text-gray-400 group-hover:text-[#e6127d] shrink-0" />
                    <span>{shippingAddress.phone}</span>
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Shipping Address Card */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 md:p-6">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-gray-100">
              <div className="flex items-center gap-2.5">
                <div className="size-8 rounded-xl bg-[#e6127d]/10 flex items-center justify-center text-[#e6127d]">
                  <MapPin className="size-4" />
                </div>
                <h3 className="text-sm font-heading font-bold text-[#00113A]">
                  Shipping Address
                </h3>
              </div>

              {shippingAddress?.address && (
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${shippingAddress.address}, ${shippingAddress.city || ""} ${shippingAddress.postalCode || ""}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-[#e6127d] transition-colors p-1"
                  title="Open location in Google Maps"
                >
                  <ExternalLink className="size-4" />
                </a>
              )}
            </div>

            <div className="flex flex-col gap-1.5 text-xs text-gray-700 leading-relaxed">
              <p className="font-semibold text-gray-900">{shippingAddress?.address}</p>
              {shippingAddress?.city && <p>{shippingAddress.city}</p>}
              <div className="mt-2 pt-2 border-t border-gray-50 flex items-center gap-2">
                <span className="text-gray-400 font-medium">PIN Code:</span>
                <span className="font-mono font-bold px-2 py-0.5 rounded bg-gray-100 text-gray-800">
                  {shippingAddress?.postalCode || "N/A"}
                </span>
              </div>
            </div>
          </div>

          {/* Delivery OTP & Security Card (If available) */}
          {deliveryOtp && (
            <div className="bg-gradient-to-br from-pink-50/70 to-purple-50/40 rounded-2xl border border-pink-100 p-5 md:p-6 shadow-sm">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-pink-100">
                <div className="flex items-center gap-2 text-[#e6127d]">
                  <ShieldCheck className="size-4" />
                  <h3 className="text-xs font-bold uppercase tracking-wider">
                    Delivery OTP
                  </h3>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  isOtpVerified ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                }`}>
                  {isOtpVerified ? "Verified" : "Pending Handover"}
                </span>
              </div>

              <div className="flex items-center justify-between bg-white rounded-xl p-3 border border-pink-100 shadow-xs">
                <span className="text-lg font-mono font-extrabold tracking-widest text-[#00113A]">
                  {deliveryOtp}
                </span>
                <button
                  onClick={() => copyToClipboard(deliveryOtp)}
                  className="text-gray-400 hover:text-[#e6127d] transition-colors p-1"
                  title="Copy OTP"
                >
                  {copiedOtp ? <Check className="size-4 text-green-600" /> : <Copy className="size-4" />}
                </button>
              </div>
              <p className="text-[10px] text-gray-500 mt-2">
                The customer will provide this OTP to the delivery partner upon receiving the parcel.
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
