"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { MapPin, Phone, CheckCircle2, Navigation, Clock, Loader2, Package, MessageSquare } from "lucide-react";

type Order = any; // We can type this properly later, using any for speed

export default function DriverDashboard() {
  const [activeTab, setActiveTab] = useState<"available" | "active">("available");
  const [availableOrders, setAvailableOrders] = useState<Order[]>([]);
  const [activeOrders, setActiveOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [otpInputs, setOtpInputs] = useState<{ [key: string]: string }>({});
  const [rejectedOrders, setRejectedOrders] = useState<string[]>([]);
  const [otpSentFor, setOtpSentFor] = useState<string[]>([]);
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/driver/orders");
      const data = await res.json();
      if (res.ok) {
        setAvailableOrders(data.availableOrders);
        setActiveOrders(data.activeOrders);
      }
    } catch (error) {
      console.error("Failed to fetch orders");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    // Poll every 15 seconds to check for new orders
    const interval = setInterval(fetchOrders, 15000);
    return () => clearInterval(interval);
  }, []);

  // Location Polling
  useEffect(() => {
    const hasOutForDelivery = activeOrders.some(o => o.orderStatus === "out_for_delivery");
    const sendLocationUpdate = () => {
      const ORIGIN_LAT = 17.4665816; // Cresta Store (Aparna Neo Mall)
      const ORIGIN_LNG = 78.3099937;

      for (const order of activeOrders.filter(o => o.orderStatus === "out_for_delivery")) {
        const destLat = order.shippingAddress?.lat || 17.4483; // fallback destination
        const destLng = order.shippingAddress?.lng || 78.3915;
        
        // Assume a 5-minute total drive time (300,000 ms)
        // If updatedAt is not available, fallback to now just for safety
        const startTime = new Date(order.updatedAt || Date.now()).getTime();
        const elapsed = Date.now() - startTime;
        const duration = 5 * 60 * 1000;
        
        // Calculate fraction of journey completed (0 to 1)
        const fraction = Math.min(elapsed / duration, 1);
        
        // Interpolate current position
        const currentLat = ORIGIN_LAT + (destLat - ORIGIN_LAT) * fraction;
        const currentLng = ORIGIN_LNG + (destLng - ORIGIN_LNG) * fraction;

        fetch(`/api/driver/orders/${order._id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "update_location", lat: currentLat, lng: currentLng })
        });
      }
    };

    // Send immediately upon entering out_for_delivery state
    sendLocationUpdate();
    
    // Then poll every 3 seconds
    const intervalId = setInterval(sendLocationUpdate, 3000);

    return () => clearInterval(intervalId);
  }, [activeOrders]);


  const handleAction = async (orderId: string, action: string, data = {}) => {
    setActionLoading(`${orderId}-${action}`);
    try {
      const res = await fetch(`/api/driver/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, ...data })
      });
      const result = await res.json();
      
      if (res.ok) {
        toast.success(result.message || "Success");
        
        if (action === "verify_otp_and_complete") {
          const order = activeOrders.find(o => o._id === orderId);
          if (order && order.shippingAddress?.phone) {
            let formattedPhone = order.shippingAddress.phone;
            if (formattedPhone.length === 10) formattedPhone = "91" + formattedPhone;
            else if (formattedPhone.startsWith("+")) formattedPhone = formattedPhone.substring(1);
            
            const message = `*Cresta Global*\n🎉 *Your Order has been Delivered!*\n\nGreat news! Your Cresta Global order (*#${orderId.slice(-6).toUpperCase()}*) has been successfully delivered.\n\nWe hope you enjoy your premium desserts! If you have any issues or feedback regarding your order, please reply to this message.\n\nThank you for shopping with us! 🍨`;
            const waUrl = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`;
            window.open(waUrl, "_blank");
          }
        }

        if (action === "accept") setActiveTab("active");
        fetchOrders();
      } else {
        toast.error(result.error || "Failed action");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setActionLoading(null);
    }
  };

  const handleStartDelivery = async (order: any) => {
    // Just call the API to update status to out_for_delivery
    // The driver app will automatically start polling and updating liveLocation
    await handleAction(order._id, "start_delivery");
  };

  const handleSendOtp = (order: any) => {
    const phone = order.shippingAddress?.phone;
    const otp = order.deliveryOtp;
    if (phone && otp) {
      let formattedPhone = phone;
      if (formattedPhone.length === 10) {
        formattedPhone = "91" + formattedPhone;
      } else if (formattedPhone.startsWith("+")) {
         formattedPhone = formattedPhone.substring(1);
      }
      
      const message = `Hi ${order.shippingAddress?.firstName}, your OTP for Cresta Delivery is ${otp}. Please share this with the delivery executive.`;
      const waUrl = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`;
      window.open(waUrl, "_blank");
      if (!otpSentFor.includes(order._id)) {
        setOtpSentFor(prev => [...prev, order._id]);
      }
    } else {
      toast.error("Phone number or OTP missing for this order");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="size-8 animate-spin text-[#e6127d]" />
      </div>
    );
  }

  const visibleAvailableOrders = availableOrders.filter(o => !rejectedOrders.includes(o._id));
  const totalPages = Math.ceil(visibleAvailableOrders.length / itemsPerPage);
  const currentAvailableOrders = visibleAvailableOrders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleReject = (orderId: string) => {
    setRejectedOrders(prev => [...prev, orderId]);
    toast.info("Order skipped");
  };

  return (
    <div className="flex flex-col h-full w-full bg-slate-50 min-h-screen font-sans">
      {/* Header & Tabs */}
      <div className="bg-white px-6 py-4 border-b border-slate-200 sticky top-0 z-40 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#00113A]">Driver Hub</h1>
          <p className="text-sm text-slate-500 font-medium">Manage your active and incoming deliveries</p>
        </div>
        
        {/* Modern Pill Tabs */}
        <div className="flex bg-slate-100 p-1.5 rounded-xl border border-slate-200 shadow-inner">
          <button 
            onClick={() => setActiveTab("available")}
            className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === "available" ? 'bg-white text-[#00113A] shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Available ({visibleAvailableOrders.length})
          </button>
          <button 
            onClick={() => setActiveTab("active")}
            className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === "active" ? 'bg-white text-[#00113A] shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Active ({activeOrders.length})
          </button>
        </div>
      </div>

      <div className="p-6 max-w-7xl mx-auto w-full flex flex-col gap-6">
        {activeTab === "available" && (
          <>
            {visibleAvailableOrders.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-32 text-slate-400">
                <Package className="size-16 mb-4 opacity-20" />
                <p className="font-semibold text-lg">No new orders right now.</p>
                <p className="text-sm">We'll notify you when a delivery is ready.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 xl:gap-6">
                {currentAvailableOrders.map(order => (
                  <div key={order._id} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 flex flex-col gap-4 hover:shadow-md transition-shadow group">
                    <div className="flex justify-between items-start">
                      <div className="flex flex-col">
                        <span className="text-[11px] font-black tracking-widest text-slate-400 uppercase">Order #{order._id.slice(-6)}</span>
                        <h3 className="text-lg font-bold text-[#00113A] mt-0.5">{order.shippingAddress?.area || "Local Delivery"}</h3>
                      </div>
                      <span className="bg-emerald-50 text-emerald-600 border border-emerald-100 text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider">
                        Ready
                      </span>
                    </div>
                    
                    <div className="flex items-start gap-3 mt-2 bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <Package className="size-4 text-slate-400 mt-0.5 shrink-0" />
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-700">{order.items.length} {order.items.length === 1 ? 'Item' : 'Items'}</span>
                        <span className="text-xs font-medium text-slate-500 line-clamp-1">{order.items.map((i:any) => i.name).join(", ")}</span>
                      </div>
                    </div>

                    <div className="mt-auto pt-4 flex justify-between items-center border-t border-slate-100">
                      <span className="text-lg font-black text-[#e6127d]">₹{Number(order.totalAmount).toFixed(2)}</span>
                      <div className="flex gap-2">
                        <button onClick={() => handleReject(order._id)} className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">Skip</button>
                        <button onClick={() => handleAction(order._id, "accept")} disabled={actionLoading === `${order._id}-accept`} className="px-6 py-2 text-xs font-bold bg-[#00113A] text-white rounded-lg hover:bg-blue-900 transition-colors flex items-center gap-2 shadow-sm">
                            {actionLoading === `${order._id}-accept` ? <Loader2 className="size-3 animate-spin" /> : 'Accept Delivery'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {totalPages > 1 && (
              <div className="flex justify-center items-center mt-8 gap-4">
                <button 
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-5 py-2 text-sm font-bold bg-white text-slate-700 hover:bg-slate-50 border border-slate-200 rounded-lg disabled:opacity-50 shadow-sm"
                >
                  Previous
                </button>
                <span className="text-sm font-bold text-slate-400">Page {currentPage} of {totalPages}</span>
                <button 
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-5 py-2 text-sm font-bold bg-white text-slate-700 hover:bg-slate-50 border border-slate-200 rounded-lg disabled:opacity-50 shadow-sm"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}

        {activeTab === "active" && (
          <>
            {activeOrders.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-32 text-slate-400">
                <CheckCircle2 className="size-16 mb-4 opacity-20" />
                <p className="font-semibold text-lg">No active deliveries.</p>
                <p className="text-sm">Accept an order from the Available tab to start.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 xl:gap-6">
                {activeOrders.map(order => (
                  <div key={order._id} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col gap-5 hover:shadow-md transition-shadow relative overflow-hidden">
                    
                    {/* Status Indicator Top Bar */}
                    <div className={`absolute top-0 left-0 w-full h-1 ${order.orderStatus === 'assigned' ? 'bg-orange-400' : 'bg-emerald-500'}`}></div>

                    <div className="flex justify-between items-start pt-1">
                      <div className="flex flex-col">
                        <span className="text-[11px] font-black tracking-widest text-slate-400 uppercase">Order #{order._id.slice(-6)}</span>
                        <h3 className="text-xl font-bold text-[#00113A] mt-0.5">{order.shippingAddress?.firstName} {order.shippingAddress?.lastName}</h3>
                      </div>
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider border ${
                        order.orderStatus === 'out_for_delivery' 
                          ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                          : 'bg-orange-50 text-orange-600 border-orange-100'
                      }`}>
                        {order.orderStatus.replace(/_/g, ' ')}
                      </span>
                    </div>

                    <div className="flex flex-col gap-4 mt-2">
                      <div className="flex items-start gap-3">
                        <div className="bg-slate-50 p-2 rounded-xl shrink-0">
                          <MapPin className="size-4 text-slate-500" />
                        </div>
                        <span className="text-sm font-medium text-slate-600 leading-snug pt-1">{order.shippingAddress?.address}, {order.shippingAddress?.area}, {order.shippingAddress?.city}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="bg-slate-50 p-2 rounded-xl shrink-0">
                          <Phone className="size-4 text-slate-500" />
                        </div>
                        <a href={`tel:${order.shippingAddress?.phone}`} className="text-sm font-bold text-[#00113A] hover:text-[#e6127d] transition-colors">{order.shippingAddress?.phone}</a>
                      </div>
                    </div>

                    <div className="mt-auto pt-5 border-t border-slate-100">
                      {order.orderStatus === "assigned" && (
                        <button 
                          onClick={() => handleStartDelivery(order)}
                          disabled={actionLoading === `${order._id}-start_delivery`}
                          className="w-full py-3 bg-[#e6127d] hover:bg-[#c90a69] text-white text-sm font-bold rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm shadow-pink-200"
                        >
                          {actionLoading === `${order._id}-start_delivery` ? <Loader2 className="size-4 animate-spin" /> : <><Navigation className="size-4" /> Start Delivery Route</>}
                        </button>
                      )}

                      {order.orderStatus === "out_for_delivery" && (
                        <div className="flex flex-col gap-4">
                          {!otpSentFor.includes(order._id) ? (
                            <button 
                              onClick={() => handleSendOtp(order)}
                              className="w-full py-3 bg-[#25D366] hover:bg-[#20bd5a] text-white text-sm font-bold rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm shadow-green-200"
                            >
                              <MessageSquare className="size-4" /> WhatsApp OTP Link
                            </button>
                          ) : (
                            <div className="flex flex-col gap-3">
                              <div className="flex items-center justify-between">
                                  <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Verify Delivery OTP</span>
                                  <button onClick={() => handleSendOtp(order)} className="text-[11px] font-bold text-[#25D366] hover:underline">Resend WhatsApp</button>
                              </div>
                              <div className="flex gap-2">
                                  <input 
                                    type="text"
                                    placeholder="----"
                                    value={otpInputs[order._id] || ""}
                                    onChange={(e) => setOtpInputs({...otpInputs, [order._id]: e.target.value.replace(/\D/g, '').slice(0, 4)})}
                                    className="flex-1 min-w-0 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-center font-black text-lg tracking-[0.2em] focus:border-[#e6127d] focus:ring-1 focus:ring-[#e6127d] outline-none transition-all"
                                  />
                                  <button 
                                    onClick={() => handleAction(order._id, "verify_otp_and_complete", { otp: otpInputs[order._id] })}
                                    disabled={actionLoading === `${order._id}-verify_otp_and_complete` || !otpInputs[order._id] || otpInputs[order._id].length !== 4}
                                    className="shrink-0 px-6 py-2.5 bg-[#00113A] hover:bg-blue-900 text-white text-sm font-bold rounded-xl disabled:opacity-50 transition-colors flex items-center justify-center min-w-[100px] shadow-sm"
                                  >
                                    {actionLoading === `${order._id}-verify_otp_and_complete` ? <Loader2 className="size-4 animate-spin" /> : 'Confirm'}
                                  </button>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
