"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminOrderNotifications } from "@/components/admin/AdminOrderNotifications";
import { Loader2 } from "lucide-react";

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    // If not on login page, verify admin access
    if (!isLoginPage && !isLoading) {
      if (!user || user.role !== "admin") {
        router.push("/admin/login");
      }
    }
  }, [user, isLoading, isLoginPage, router]);

  // Dedicated full-screen rendering for admin login page (no sidebar or header)
  if (isLoginPage) {
    return <>{children}</>;
  }

  // Guard loading state while verifying admin authentication
  if (isLoading || !user || user.role !== "admin") {
    return (
      <div className="min-h-screen bg-[#070D1E] flex flex-col items-center justify-center text-white px-4">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="relative flex items-center justify-center">
            <div className="size-12 rounded-full border-2 border-white/10 border-t-[#e6127d] animate-spin" />
            <div className="absolute inset-0 rounded-full blur-sm bg-[#e6127d]/20" />
          </div>
          <div>
            <h3 className="font-heading font-bold text-lg text-white">Cresta Administration</h3>
            <p className="text-xs font-medium text-gray-400 mt-1">Verifying secure administrative session...</p>
          </div>
        </div>
      </div>
    );
  }

  // Authenticated Admin Dashboard Layout
  return (
    <div className="flex flex-col h-screen bg-[#f0f3fa]">
      <AdminOrderNotifications />
      <AdminHeader />
      <div className="flex flex-1 min-h-0">
        <AdminSidebar />
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          <div className="mx-auto w-full max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
