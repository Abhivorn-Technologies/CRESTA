"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { getPusherClient } from "@/lib/pusher-client";
import { NewOrderEventPayload } from "@/types/order-notification";
import { Bell, ArrowRight, X, Volume2 } from "lucide-react";

// Global audio context reference to allow pre-warming and unlocking
let globalAudioCtx: AudioContext | null = null;
let audioUnlocked = false;

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!globalAudioCtx) {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioCtx) {
      globalAudioCtx = new AudioCtx();
    }
  }
  if (globalAudioCtx && globalAudioCtx.state === "suspended") {
    globalAudioCtx.resume().catch(() => {});
  }
  return globalAudioCtx;
}

/**
 * Pre-warms and unlocks browser audio permissions on the first user interaction
 */
function unlockBrowserAudio() {
  if (audioUnlocked) return;
  try {
    const ctx = getAudioContext();
    if (ctx && ctx.state === "suspended") {
      ctx.resume().then(() => {
        audioUnlocked = true;
      }).catch(() => {});
    } else if (ctx && ctx.state === "running") {
      audioUnlocked = true;
    }

    // Also prime HTML5 Audio
    const primeAudio = new Audio("/sounds/order-chime.wav");
    primeAudio.volume = 0.01;
    primeAudio.play().then(() => {
      primeAudio.pause();
      primeAudio.currentTime = 0;
      audioUnlocked = true;
    }).catch(() => {});
  } catch {}
}

/**
 * Plays the order chime sound with boosted volume and rich harmonics.
 */
export function playOrderChime() {
  unlockBrowserAudio();

  // 1. Play the boosted WAV audio file
  try {
    const audio = new Audio(`/sounds/order-chime.wav?v=${Date.now()}`);
    audio.volume = 1.0;
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch((err) => {
        console.warn("[AdminOrderNotifications] HTML5 Audio play restricted, falling back to Web Audio API:", err.message);
        playWebAudioFallback();
      });
    }
  } catch {
    playWebAudioFallback();
  }
}

function playWebAudioFallback() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    if (ctx.state === "suspended") {
      ctx.resume().then(() => synthesizeTones(ctx)).catch(() => {});
    } else {
      synthesizeTones(ctx);
    }
  } catch (err) {
    console.debug("[AdminOrderNotifications] Web Audio playback skipped:", err);
  }
}

function synthesizeTones(ctx: AudioContext) {
  const now = ctx.currentTime;
  
  // Compressor for loud, punchy presence without distortion
  const compressor = ctx.createDynamicsCompressor();
  compressor.threshold.setValueAtTime(-10, now);
  compressor.knee.setValueAtTime(12, now);
  compressor.ratio.setValueAtTime(8, now);
  compressor.attack.setValueAtTime(0.002, now);
  compressor.release.setValueAtTime(0.2, now);
  compressor.connect(ctx.destination);

  const masterGain = ctx.createGain();
  masterGain.gain.setValueAtTime(1.0, now);
  masterGain.connect(compressor);

  const tone = (freq: number, start: number, dur: number, vol: number) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "triangle"; // richer, louder harmonic profile than plain sine
    osc.frequency.setValueAtTime(freq, start);
    gain.gain.setValueAtTime(0.001, start);
    gain.gain.linearRampToValueAtTime(vol, start + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + dur);
    osc.connect(gain);
    gain.connect(masterGain);
    osc.start(start);
    osc.stop(start + dur);
  };

  // Dual chime (C6 -> F6) with loud overtone reinforcement
  tone(1046.5, now, 0.45, 0.85);        // C6
  tone(2093.0, now, 0.35, 0.45);        // C7 overtone
  tone(1396.9, now + 0.14, 0.65, 0.95); // F6
  tone(2793.8, now + 0.14, 0.5, 0.5);   // F7 overtone
}

export function AdminOrderNotifications() {
  const router = useRouter();
  const seenOrderIds = useRef<Set<string>>(new Set());
  const isInitialLoad = useRef(true);

  useEffect(() => {
    // Listen for any user gesture (click, touch, key) to unlock audio playback permanently
    const handleGesture = () => {
      unlockBrowserAudio();
    };

    window.addEventListener("pointerdown", handleGesture);
    window.addEventListener("click", handleGesture);
    window.addEventListener("keydown", handleGesture);

    // Helper to display the Sonner toast at bottom-right
    const showOrderToast = (order: NewOrderEventPayload) => {
      if (!order.orderId || seenOrderIds.current.has(order.orderId)) {
        return;
      }
      seenOrderIds.current.add(order.orderId);

      console.log("[AdminOrderNotifications] Showing toast for order:", order);

      // Play audio notification chime
      playOrderChime();

      // Dispatch window event so dashboard stats / orders table refresh immediately
      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("cresta:new-order", { detail: order })
        );
      }

      // Display clean, non-intrusive Sonner toast anchored at bottom-right
      toast.custom(
        (t) => (
          <div className="w-[340px] sm:w-[370px] !bg-white dark:!bg-[#0b1329] border border-gray-200/90 dark:border-white/10 border-l-[5px] border-l-[#e6127d] rounded-2xl shadow-[0_20px_50px_-10px_rgba(0,0,0,0.28)] p-4 flex flex-col gap-3 font-sans transition-all duration-300 pointer-events-auto">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="size-8 rounded-xl bg-[#e6127d]/10 flex items-center justify-center text-[#e6127d] shrink-0">
                  <Bell className="size-4 animate-bounce" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-sm text-[#00113A] dark:text-white leading-tight">
                      New Order Received!
                    </h4>
                    <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-md bg-pink-50 text-[#e6127d] dark:bg-pink-950/40">
                      {order.orderNumber}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
                    Paid via <span className="font-semibold uppercase text-gray-700 dark:text-gray-300">{order.paymentMethod}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                {/* Speaker icon to replay chime or grant audio */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    playOrderChime();
                  }}
                  className="text-gray-400 hover:text-[#e6127d] transition-colors p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 cursor-pointer"
                  title="Play alert sound"
                  aria-label="Play sound"
                >
                  <Volume2 className="size-4 text-[#e6127d]" />
                </button>
                {/* Close Button */}
                <button
                  onClick={() => toast.dismiss(t)}
                  className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 cursor-pointer"
                  aria-label="Close notification"
                >
                  <X className="size-4" />
                </button>
              </div>
            </div>

            {/* Order Details Mini-Card */}
            <div className="bg-[#f8fafc] dark:bg-white/5 rounded-xl p-3 grid grid-cols-2 gap-2 text-xs border border-gray-100 dark:border-white/5">
              <div>
                <span className="text-gray-400 text-[10px] uppercase font-semibold tracking-wider block">
                  Customer
                </span>
                <span className="font-semibold text-gray-900 dark:text-white truncate block mt-0.5">
                  {order.customerName || "Customer"}
                </span>
              </div>
              <div>
                <span className="text-gray-400 text-[10px] uppercase font-semibold tracking-wider block">
                  Items
                </span>
                <span className="font-semibold text-gray-900 dark:text-white block mt-0.5">
                  {order.itemCount} {order.itemCount === 1 ? "item" : "items"}
                </span>
              </div>
              <div>
                <span className="text-gray-400 text-[10px] uppercase font-semibold tracking-wider block">
                  Payment
                </span>
                <span className="font-bold text-[#e6127d] uppercase block mt-0.5">
                  {order.paymentMethod}
                </span>
              </div>
              <div>
                <span className="text-gray-400 text-[10px] uppercase font-semibold tracking-wider block">
                  Total Amount
                </span>
                <span className="font-extrabold text-[#00113A] dark:text-white text-sm block mt-0.5">
                  ₹{Number(order.totalAmount).toLocaleString("en-IN")}
                </span>
              </div>
            </div>

            {/* Action Button */}
            <button
              onClick={() => {
                toast.dismiss(t);
                router.push(`/admin/orders/${order.orderId}`);
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#e6127d] to-[#ff4797] hover:from-[#c20b66] hover:to-[#e6127d] text-white text-xs font-semibold shadow-md shadow-[#e6127d]/20 flex items-center justify-center gap-1.5 transition-all duration-150 active:scale-[0.98] cursor-pointer"
            >
              <span>View Order Details</span>
              <ArrowRight className="size-3.5" />
            </button>
          </div>
        ),
        {
          duration: 10000,
          position: "bottom-right",
        }
      );
    };

    // Subscribe to Pusher Channels (WebSocket)
    const pusher = getPusherClient();
    let channel: any = null;
    const channelName = "private-admin-orders";

    if (pusher) {
      try {
        channel = pusher.subscribe(channelName);
        channel.bind("new-order", (order: NewOrderEventPayload) => {
          showOrderToast(order);
        });
        channel.bind("pusher:subscription_error", (status: any) => {
          console.warn("[AdminOrderNotifications] Pusher subscription error:", status);
        });
      } catch (err) {
        console.warn("[AdminOrderNotifications] Pusher subscribe error:", err);
      }
    }

    // Resilient Fallback Sync (guarantees notification even if Pusher is offline)
    const syncLatestOrders = async () => {
      try {
        const res = await fetch(`/api/admin/orders?_cb=${Date.now()}`, {
          cache: "no-store",
        });
        if (!res.ok) return;
        const orders = await res.json();
        if (!Array.isArray(orders) || orders.length === 0) return;

        // Register initial orders on mount so they don't fire toasts
        if (isInitialLoad.current) {
          orders.forEach((o: any) => {
            if (o._id) seenOrderIds.current.add(String(o._id));
          });
          isInitialLoad.current = false;
          return;
        }

        // Check for new orders
        for (const o of orders.slice(0, 3)) {
          const id = String(o._id || "");
          if (!seenOrderIds.current.has(id)) {
            const rawId = id;
            const orderNumber = rawId.length >= 6
              ? `#${rawId.slice(-6).toUpperCase()}`
              : `#${rawId.toUpperCase() || "NEW"}`;

            const firstName = o.shippingAddress?.firstName?.trim() || "";
            const lastName = o.shippingAddress?.lastName?.trim() || "";
            const customerName = [firstName, lastName].filter(Boolean).join(" ") || o.userId?.name || "Customer";

            const itemCount = Array.isArray(o.items)
              ? o.items.reduce((sum: number, item: any) => sum + (Number(item?.quantity) || 1), 0)
              : 0;

            showOrderToast({
              orderId: rawId,
              orderNumber,
              customerName,
              totalAmount: Number(o.totalAmount) || 0,
              paymentMethod: (o.paymentMethod || "COD").toUpperCase(),
              itemCount,
              createdAt: o.createdAt || new Date().toISOString(),
            });
          }
        }
      } catch (e) {
        // Ignore background fetch error
      }
    };

    syncLatestOrders();
    const intervalId = setInterval(syncLatestOrders, 3000);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener("pointerdown", handleGesture);
      window.removeEventListener("click", handleGesture);
      window.removeEventListener("keydown", handleGesture);
      if (channel && pusher) {
        channel.unbind("new-order");
        channel.unbind("pusher:subscription_error");
        pusher.unsubscribe(channelName);
      }
    };
  }, [router]);

  return null;
}
