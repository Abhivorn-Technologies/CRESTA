"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  Menu, 
  LayoutDashboard, 
  ShoppingCart, 
  Package, 
  Users, 
  Banknote, 
  Bell, 
  Settings, 
  LogOut, 
  Image as ImageIcon,
  Truck,
  ExternalLink
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useAuth } from "@/context/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function AdminHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    router.push("/admin/login");
  };

  const links = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
    { href: "/admin/products", label: "Products", icon: Package },
    { href: "/admin/customers", label: "Customers", icon: Users },
    { href: "/admin/refunds", label: "Refunds", icon: Banknote },
    { href: "/admin/notifications", label: "Notifications", icon: Bell },
    { href: "/admin/images", label: "Site Images", icon: ImageIcon },
    { href: "/admin/gallery", label: "Gallery Images", icon: ImageIcon },
    { href: "/admin/drivers", label: "Drivers", icon: Truck },
  ];

  return (
    <header className="h-[72px] bg-white border-b border-gray-100 flex items-center px-4 md:px-8 justify-between shrink-0 sticky top-0 z-40 shadow-[0_1px_3px_0_rgba(0,0,0,0.03)]">
      {/* Brand Logo */}
      <div className="flex items-center gap-4">
        <Link href="/admin" className="block relative h-12 w-36 md:h-14 md:w-44 transition-opacity hover:opacity-90">
          <img 
            src="/cresta-logo.png" 
            alt="Cresta Admin" 
            className="object-contain w-full h-full object-left"
          />
        </Link>
      </div>
      
      {/* Right Controls */}
      <div className="flex items-center gap-3 md:gap-5">
        {/* Quick View Public Website */}
        <Link 
          href="/" 
          target="_blank"
          className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-[#101b4d] bg-gray-50 hover:bg-gray-100 px-3.5 py-2 rounded-xl border border-gray-200/80 transition-all shadow-xs"
        >
          <ExternalLink className="size-3.5 text-gray-400" />
          <span>View Store</span>
        </Link>

        {/* User Info Profile Pill */}
        <div className="hidden sm:flex items-center gap-3 pl-3 border-l border-gray-100">
          <Avatar className="size-9 border border-gray-200 shadow-xs shrink-0">
            {user?.image ? (
              <AvatarImage src={user.image} alt={user?.name || "Admin"} />
            ) : null}
            <AvatarFallback className="bg-gradient-to-tr from-[#101b4d] to-[#25397e] text-white font-bold text-xs tracking-wider">
              {user?.name ? user.name.charAt(0).toUpperCase() : "A"}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col text-left">
            <span className="text-sm font-bold text-[#101b4d] leading-tight truncate max-w-[130px]">
              {user?.name || "Admin"}
            </span>
            <span className="text-[10px] font-bold text-[#e6127d] uppercase tracking-wider">
              Administrator
            </span>
          </div>
        </div>

        {/* Desktop Logout Button with Safe Modal */}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <button 
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-gray-600 hover:bg-red-50 hover:text-red-600 border border-gray-200/80 hover:border-red-200 text-xs font-bold transition-all group shadow-xs active:scale-95"
              title="Sign Out"
            >
              <LogOut className="size-4 text-gray-400 group-hover:text-red-600 transition-colors" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </AlertDialogTrigger>
          <AlertDialogContent className="bg-white rounded-3xl p-8 max-w-sm shadow-2xl border border-red-100 flex flex-col items-center justify-center text-center">
            <AlertDialogHeader className="flex flex-col items-center space-y-4 w-full">
              <AlertDialogTitle className="text-2xl font-heading font-bold text-red-600 text-center w-full">
                Sign Out
              </AlertDialogTitle>
              <AlertDialogDescription className="text-[15px] text-gray-500 leading-relaxed text-center w-full">
                Are you sure you want to log out of the admin dashboard? You will need to enter your credentials to access it again.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="!m-0 !p-0 !bg-transparent border-none mt-8 flex flex-row items-center justify-center gap-4 w-full sm:justify-center">
              <AlertDialogCancel className="mt-0 rounded-full px-8 py-3 text-sm font-bold border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction onClick={handleLogout} className="rounded-full px-8 py-3 text-sm font-bold bg-red-600 hover:bg-red-700 text-white border-0 transition-colors shadow-md">
                Sign Out
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        
        {/* Mobile Menu Trigger */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors">
            <Menu className="size-7" />
          </SheetTrigger>
          <SheetContent side="right" className="w-[280px] p-0 flex flex-col bg-white">
            <nav className="flex-1 overflow-y-auto p-4 flex flex-col gap-2 mt-4 no-scrollbar">
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
              <button onClick={() => { setIsOpen(false); handleLogout(); }} className="flex w-full items-center justify-between px-4 py-3 rounded-xl text-gray-500 hover:bg-red-50 hover:text-red-600 transition-all text-left group">
                <div className="flex items-center gap-3">
                  <Avatar className="size-8 border border-gray-200">
                    {user?.image ? (
                      <AvatarImage src={user.image} alt={user?.name || "Admin"} />
                    ) : null}
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
