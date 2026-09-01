"use client";

import React, { useEffect, useState } from "react";
import { ArrowLeft, CheckCircle2, User, CreditCard, Building2, Hash, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { use } from "react";

export default function RefundDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [transferSuccess, setTransferSuccess] = useState(false);
  const [transferError, setTransferError] = useState<string | null>(null);

  // Body scroll lock
  useEffect(() => {
    if (showTransferModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [showTransferModal]);

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

  const processRefund = async () => {
    setProcessing(true);
    setTransferError(null);
    try {
      const response = await fetch(`/api/admin/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentStatus: "refunded" }),
      });
      if (response.ok) {
        const updatedOrder = await response.json();
        setOrder(updatedOrder);
        setTransferSuccess(true);
        setTimeout(() => {
          setShowTransferModal(false);
          setTransferSuccess(false);
        }, 2000);
      } else {
        const errorData = await response.json();
        setTransferError(errorData.error || "Failed to process transfer");
      }
    } catch (error) {
      console.error("Failed to process refund", error);
      setTransferError("A network error occurred. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 w-full h-full flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#e6127d]"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <h2 className="text-xl font-bold text-gray-900">Refund details not found</h2>
        <Link href="/admin/refunds" className="text-[#101b4d] font-semibold hover:underline">
          Return to Refunds
        </Link>
      </div>
    );
  }

  const { refundDetails, cancellationInfo, shippingAddress, totalAmount } = order;

  return (
    <div className="flex flex-col gap-6 pb-10 max-w-5xl mx-auto w-full">
      <div className="flex items-center gap-4">
        <Link 
          href="/admin/refunds" 
          className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
        >
          <ArrowLeft className="size-5" />
        </Link>
        <div>
          <h1 className="text-2xl md:text-3xl font-heading font-bold text-[#101b4d]">
            Refund Details
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Order #{order._id.substring(order._id.length - 6).toUpperCase()}
          </p>
        </div>
        
        <div className="ml-auto">
          {order.paymentStatus === "refunded" ? (
            <div className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 font-bold rounded-lg border border-green-200">
              <CheckCircle2 className="size-5" /> Refund Completed
            </div>
          ) : !refundDetails?.bankName ? (
            <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 text-gray-500 font-bold rounded-lg border border-gray-200">
              <AlertTriangle className="size-5" /> Waiting for Customer Details
            </div>
          ) : (
            <div className="flex items-center gap-2 px-4 py-2 bg-orange-50 text-orange-700 font-bold rounded-lg border border-orange-200 animate-pulse">
              <AlertTriangle className="size-5" /> Pending Refund Processing
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Order & Cancellation Info */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-4">Customer Details</h3>
            <div className="flex flex-col gap-3">
              <div>
                <p className="text-sm font-semibold text-gray-900">{shippingAddress?.firstName} {shippingAddress?.lastName}</p>
                <p className="text-xs text-gray-500">{shippingAddress?.email}</p>
                <p className="text-xs text-gray-500">{shippingAddress?.phone}</p>
              </div>
              <div className="pt-3 border-t border-gray-100">
                <p className="text-xs text-gray-500 font-medium">Refund Amount</p>
                <p className="text-xl font-bold text-red-600">₹{totalAmount.toFixed(2)}</p>
              </div>
            </div>
          </div>

          {cancellationInfo && (
            <div className="bg-red-50/50 rounded-xl shadow-sm border border-red-100 p-6">
              <h3 className="text-[11px] font-bold text-red-400 uppercase tracking-widest mb-4">Cancellation Info</h3>
              <div className="flex flex-col gap-3">
                <div>
                  <p className="text-xs font-semibold text-red-400">Reason</p>
                  <p className="text-sm font-medium text-gray-900">{cancellationInfo.reason}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-red-400">Date Cancelled</p>
                  <p className="text-sm font-medium text-gray-900">
                    {new Date(cancellationInfo.date).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Bank Details & Actions */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col h-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Bank Account Details</h3>
              {refundDetails?.submittedAt && refundDetails?.bankName && (
                <span className="text-xs text-gray-400 font-medium">
                  Submitted on {new Date(refundDetails.submittedAt).toLocaleDateString()}
                </span>
              )}
            </div>

            {refundDetails?.bankName ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8 flex-1">
                <div className="flex flex-col gap-1.5">
                  <span className="flex items-center gap-1.5 text-xs font-bold text-gray-500 uppercase">
                    <Building2 className="size-3.5" /> Bank Name
                  </span>
                  <div className="p-3 bg-gray-50 border border-gray-100 rounded-lg text-sm font-bold text-[#101b4d]">
                    {refundDetails.bankName}
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <span className="flex items-center gap-1.5 text-xs font-bold text-gray-500 uppercase">
                    <User className="size-3.5" /> Account Holder
                  </span>
                  <div className="p-3 bg-gray-50 border border-gray-100 rounded-lg text-sm font-bold text-[#101b4d]">
                    {refundDetails.accountHolder}
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <span className="flex items-center gap-1.5 text-xs font-bold text-gray-500 uppercase">
                    <CreditCard className="size-3.5" /> Account Number
                  </span>
                  <div className="p-3 bg-gray-50 border border-gray-100 rounded-lg text-sm font-mono font-bold text-gray-900 tracking-wider">
                    {refundDetails.accountNumber}
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <span className="flex items-center gap-1.5 text-xs font-bold text-gray-500 uppercase">
                    <Hash className="size-3.5" /> IFSC Code
                  </span>
                  <div className="p-3 bg-gray-50 border border-gray-100 rounded-lg text-sm font-mono font-bold text-gray-900 tracking-wider">
                    {refundDetails.ifscCode}
                  </div>
                </div>
              </div>
            ) : order.paymentMethod === "razorpay" && order.paymentStatus === "refunded" ? (
              <div className="flex-1 flex flex-col items-center justify-center py-12 text-center">
                <div className="size-12 bg-green-50 rounded-full flex items-center justify-center text-green-500 mb-3 border border-green-100">
                  <CheckCircle2 className="size-6" />
                </div>
                <h4 className="text-sm font-bold text-gray-900">Refunded via Razorpay</h4>
                <p className="text-xs text-gray-500 mt-1 max-w-xs">
                  This order was automatically refunded to the customer's original payment method. No manual bank transfer is required.
                </p>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center py-12 text-center">
                <div className="size-12 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 mb-3 border border-gray-100">
                  <CreditCard className="size-6" />
                </div>
                <h4 className="text-sm font-bold text-gray-900">Waiting for Customer Details</h4>
                <p className="text-xs text-gray-500 mt-1 max-w-xs">
                  The customer has not submitted their bank details for this refund yet.
                </p>
              </div>
            )}

            <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end">
              <button 
                onClick={() => setShowTransferModal(true)}
                disabled={order.paymentStatus === "refunded" || (!refundDetails?.bankName && order.paymentMethod !== "razorpay")}
                className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-sm transition-all duration-300 ${
                  order.paymentStatus === "refunded" || (!refundDetails?.bankName && order.paymentMethod !== "razorpay")
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-[#101b4d] hover:bg-[#1b2c8d] text-white shadow-sm hover:-translate-y-0.5"
                }`}
              >
                {order.paymentStatus === "refunded" ? (
                  <>
                    <CheckCircle2 className="size-4" /> Refund Processed
                  </>
                ) : (
                  "Process Bank Transfer"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Transfer Simulation Modal */}
      {showTransferModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={() => !processing && !transferSuccess && setShowTransferModal(false)} />
          <div className="relative bg-white rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-gray-100 flex flex-col animate-in fade-in zoom-in duration-200">
            {transferSuccess ? (
              <div className="flex flex-col items-center justify-center py-8 text-center animate-in fade-in zoom-in duration-300">
                <div className="size-16 bg-green-50 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle2 className="size-8 text-green-500" />
                </div>
                <h4 className="text-xl font-heading font-bold text-[#101b4d]">Refund Successful!</h4>
                <p className="text-sm text-gray-500 mt-2">
                  The funds have been transferred to the customer's bank account.
                </p>
              </div>
            ) : (
              <>
                <h3 className="text-xl font-heading font-bold text-[#101b4d] mb-1">
                  Initiate Bank Transfer
                </h3>
                <p className="text-sm text-gray-500 mb-6">
                  Select the source account to transfer the refund amount.
                </p>

                <div className="flex flex-col gap-4">
                  {transferError && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600 flex items-start gap-2">
                      <AlertTriangle className="size-4 mt-0.5 shrink-0" />
                      <span className="font-medium">{transferError}</span>
                    </div>
                  )}

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Transfer To</label>
                    <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 flex flex-col">
                      <span className="font-bold text-[#101b4d]">{refundDetails?.accountHolder}</span>
                      <span className="text-xs">{refundDetails?.bankName} - {refundDetails?.accountNumber}</span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Amount</label>
                    <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-lg font-bold text-red-600">
                      ₹{totalAmount.toFixed(2)}
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Source Account</label>
                    <select 
                      className="w-full p-3 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#101b4d]/20 focus:border-[#101b4d]/50 font-medium text-gray-900"
                    >
                      <option>Cresta Global - RazorpayX Nodal (Auto)</option>
                      <option>Cresta Global - HDFC Current A/C (**** 4567)</option>
                      <option>Cresta Global - SBI Corporate A/C (**** 8901)</option>
                    </select>
                  </div>

                  <div className="pt-4 flex gap-3 mt-2">
                    <button 
                      type="button"
                      onClick={() => setShowTransferModal(false)}
                      disabled={processing}
                      className="flex-1 px-4 py-3 rounded-xl border border-gray-200 text-gray-700 font-bold text-sm hover:bg-gray-50 transition-colors disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={processRefund}
                      disabled={processing}
                      className="flex-1 px-4 py-3 rounded-xl bg-[#26a541] text-white font-bold text-sm hover:bg-[#1f8c36] transition-colors disabled:opacity-80 flex items-center justify-center gap-2"
                    >
                      {processing ? (
                        <div className="size-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                      ) : (
                        <>
                          Confirm Transfer
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
