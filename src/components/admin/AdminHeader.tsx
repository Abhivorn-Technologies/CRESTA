"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, LayoutDashboard, ShoppingCart, Package, Users, Banknote, Bell, Settings, LogOut, Image as ImageIcon } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/context/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function AdminHeader() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
    { href: "/admin/products", label: "Products", icon: Package },
    { href: "/admin/customers", label: "Customers", icon: Users },
    { href: "/admin/refunds", label: "Refunds", icon: Banknote },
    { href: "/admin/notifications", label: "Notifications", icon: Bell },
    { href: "/admin/images", label: "Site Images", icon: ImageIcon },
  ];

  return (
    <header className="h-[72px] bg-white border-b border-gray-100 flex items-center px-4 md:px-6 justify-between shrink-0 sticky top-0 z-40">
      <div className="flex items-center gap-4">
        <Link href="/admin" className="block relative h-14 w-40 md:h-16 md:w-48 md:ml-16">
          <img 
            src="/cresta-logo.png" 
            alt="Cresta Admin" 
            className="object-contain w-full h-full object-left md:object-left"
          />
        </Link>
      </div>
      
      <div className="flex items-center gap-4">
        {/* Placeholder for top right actions if needed */}
        
        {/* Mobile Menu Trigger */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors">
            <Menu className="size-7" />
          </SheetTrigger>
          <SheetContent side="right" className="w-[280px] p-0 flex flex-col bg-white">
            <nav className="flex-1 overflow-y-auto p-4 flex flex-col gap-2 mt-4">
              {links.map((link) => {
                const Icon = link.icon;
                const isActive = link.href === '/admin' ? pathname === '/admin' : (pathname === link.href || pathname.startsWith(`${link.href}/`));
                return (
                  <Link 
                    key={link.href} 
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                      isActive ? "bg-[#e6127d] text-white font-semibold shadow-md shadow-[#e6127d]/20" : "text-gray-500 hover:bg-[#fce4ec] hover:text-[#e6127d]"
                    }`}
                  >
                    <Icon className={`size-5 ${isActive ? "text-white" : "text-gray-400 group-hover:text-[#e6127d]"}`} />
                    {link.label}
                  </Link>
                );
              })}
            </nav>
            <div className="p-4 border-t border-gray-100 mt-auto shrink-0 flex flex-col gap-2">
              <Link href="/admin/settings" onClick={() => setIsOpen(false)} className="flex w-full items-center gap-3 px-4 py-3 rounded-xl text-gray-500 hover:bg-[#fce4ec] hover:text-[#e6127d] transition-all text-left">
                <Settings className="size-5 text-gray-400 group-hover:text-[#e6127d]" />
                Settings
              </Link>
              <button onClick={() => { setIsOpen(false); logout(); }} className="flex w-full items-center justify-between px-4 py-3 rounded-xl text-gray-500 hover:bg-red-50 hover:text-red-600 transition-all text-left group">
                <div className="flex items-center gap-3">
                  <Avatar className="size-8 border border-gray-200">
                    <AvatarImage src="/avatar-placeholder.png" alt="Admin" />
                    <AvatarFallback className="bg-[#101b4d] text-white font-semibold text-xs">
                      {user?.name ? user.name.charAt(0).toUpperCase() : "A"}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-medium text-sm">Logout</span>
                </div>
                <LogOut className="size-4 opacity-50 group-hover:opacity-100 transition-opacity" />
              </button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
