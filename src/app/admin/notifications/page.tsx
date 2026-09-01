"use client";

import { useState, useEffect } from "react";
import { Bell, Package, AlertTriangle, MessageSquare, CreditCard, Check } from "lucide-react";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNotifications() {
      try {
        const response = await fetch("/api/admin/notifications");
        if (response.ok) {
          const data = await response.json();
          setNotifications(data);
        }
      } catch (error) {
        console.error("Failed to load notifications:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchNotifications();
  }, []);

  const markAllAsRead = async () => {
    // Optimistic update
    setNotifications(notifications.map(n => ({ ...n, unread: false })));
    
    try {
      await fetch("/api/admin/notifications", {
        method: "PATCH",
      });
    } catch (error) {
      console.error("Failed to mark notifications as read:", error);
    }
  };

  const hasUnread = notifications.some(n => n.unread);

  const getNotificationStyle = (type: string) => {
    switch(type) {
      case 'order': return { icon: Package, iconColor: "text-blue-600", bgColor: "bg-blue-50" };
      case 'inventory': return { icon: AlertTriangle, iconColor: "text-orange-600", bgColor: "bg-orange-50" };
      case 'payment': return { icon: CreditCard, iconColor: "text-green-600", bgColor: "bg-green-50" };
      case 'support': return { icon: MessageSquare, iconColor: "text-purple-600", bgColor: "bg-purple-50" };
      default: return { icon: Bell, iconColor: "text-gray-600", bgColor: "bg-gray-100" };
    }
  };

  if (loading) {
    return (
      <div className="flex-1 w-full h-full flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#e6127d]"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 pb-10 max-w-4xl mx-auto w-full">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl md:text-4xl font-heading font-extrabold text-[#101b4d] tracking-tight">Notifications</h1>
          <p className="text-gray-500 text-base mt-2">Stay updated with store activities and system alerts.</p>
        </div>
        <button 
          onClick={markAllAsRead}
          disabled={!hasUnread}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
            hasUnread 
              ? "bg-[#101b4d] hover:bg-[#1b2c8d] text-white shadow-md shadow-[#101b4d]/20"
              : "bg-gray-100 text-gray-400 cursor-not-allowed"
          }`}
        >
          <Check className="size-4" />
          Mark all as read
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden">
        <div className="divide-y divide-gray-100">
          {notifications.length === 0 ? (
            <div className="py-20 text-center flex flex-col items-center justify-center">
              <div className="size-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mb-4">
                <Bell className="size-8" />
              </div>
              <h3 className="text-lg font-bold text-[#101b4d]">All Caught Up!</h3>
              <p className="text-gray-500 text-sm mt-1">There are no new notifications at the moment.</p>
            </div>
          ) : (
            notifications.map((notification) => {
              const { icon: Icon, iconColor, bgColor } = getNotificationStyle(notification.type);
              
              const timeString = new Date(notification.createdAt).toLocaleDateString('en-US', {
                month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
              });

              return (
                <div 
                  key={notification._id} 
                  className={`p-5 sm:p-6 flex gap-4 transition-all duration-200 hover:bg-gray-50/80 ${
                    notification.unread ? "bg-[#f8faff]" : ""
                  }`}
                >
                  <div className={`shrink-0 flex items-center justify-center size-10 rounded-full border border-white shadow-sm ${bgColor}`}>
                    <Icon className={`size-4.5 ${iconColor}`} />
                  </div>
                  
                  <div className="flex-1 flex justify-between items-start gap-4">
                    <div className="flex flex-col gap-1 mt-0.5">
                      <h3 className={`text-sm font-bold ${notification.unread ? "text-[#101b4d]" : "text-gray-700"}`}>
                        {notification.title}
                      </h3>
                      <p className="text-sm text-gray-500 leading-relaxed">
                        {notification.description}
                      </p>
                      <span className="text-xs font-medium text-gray-400 mt-1">
                        {timeString}
                      </span>
                    </div>
                    
                    {notification.unread && (
                      <div className="shrink-0 size-2.5 bg-[#e6127d] rounded-full mt-1.5 shadow-sm"></div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
