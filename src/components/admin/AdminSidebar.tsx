"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Package, 
  Users, 
  Banknote, 
  Bell, 
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon,
  Truck
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useAuth } from "@/context/AuthContext";

export function AdminSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const links = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
    { href: "/admin/products", label: "Products", icon: Package },
    { href: "/admin/customers", label: "Customers", icon: Users },
    { href: "/admin/refunds", label: "Refunds", icon: Banknote },
    { href: "/admin/notifications", label: "Notifications", icon: Bell },
    { href: "/admin/images", label: "Site Images", icon: ImageIcon },
    { href: "/admin/drivers", label: "Drivers", icon: Truck },
  ];

  return (
    <TooltipProvider delayDuration={0}>
      <aside 
        className={`bg-white border-r border-gray-100 text-[#101b4d] hidden md:flex flex-col relative shrink-0 transition-all duration-300 ${
          isCollapsed ? "w-[88px]" : "w-64"
        } h-full`}
      >
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3.5 top-6 bg-white border border-gray-200 rounded-full p-1.5 text-gray-400 hover:text-[#101b4d] hover:border-[#101b4d] transition-colors z-50 shadow-sm"
        >
          {isCollapsed ? <ChevronRight className="size-4" /> : <ChevronLeft className="size-4" />}
        </button>

        <nav className="flex-1 px-4 flex flex-col gap-2 mt-6 overflow-y-auto overflow-x-hidden hide-scrollbar">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = link.href === '/admin' ? pathname === '/admin' : (pathname === link.href || pathname.startsWith(`${link.href}/`));
            
            const linkContent = (
              <Link 
                href={link.href}
                prefetch={true}
                className={`flex items-center ${isCollapsed ? 'justify-center px-0' : 'justify-start px-4'} py-3 rounded-xl transition-all ${
                  isActive 
                    ? "bg-[#e6127d] text-white font-semibold shadow-md shadow-[#e6127d]/20" 
                    : "text-gray-500 hover:bg-[#fce4ec] hover:text-[#e6127d]"
                }`}
              >
                <Icon className={`size-5 shrink-0 ${isActive ? "text-white" : "text-gray-400 group-hover:text-[#e6127d]"}`} />
                {!isCollapsed && <span className="ml-3 truncate">{link.label}</span>}
              </Link>
            );

            if (isCollapsed) {
              return (
                <Tooltip key={link.href}>
                  <TooltipTrigger asChild>
                    {linkContent}
                  </TooltipTrigger>
                  <TooltipContent side="right" className="font-semibold" sideOffset={10}>
                    {link.label}
                  </TooltipContent>
                </Tooltip>
              );
            }

            return <div key={link.href}>{linkContent}</div>;
          })}
        </nav>

        <div className="p-4 border-t border-gray-100 mt-auto shrink-0 flex flex-col gap-2 relative">
          {isCollapsed ? (
             <Tooltip>
               <TooltipTrigger asChild>
                 <Link href="/admin/settings" className="flex items-center justify-center w-full py-3 rounded-xl text-gray-500 hover:bg-[#fce4ec] hover:text-[#e6127d] transition-all">
                   <Settings className="size-5 text-gray-400" />
                 </Link>
               </TooltipTrigger>
               <TooltipContent side="right" className="font-semibold" sideOffset={10}>Settings</TooltipContent>
             </Tooltip>
          ) : (
            <Link href="/admin/settings" className="flex w-full items-center gap-3 px-4 py-3 rounded-xl text-gray-500 hover:bg-[#fce4ec] hover:text-[#e6127d] transition-all text-left">
              <Settings className="size-5 text-gray-400 group-hover:text-[#e6127d]" />
              Settings
            </Link>
          )}
          
          <AlertDialog>
            <Tooltip>
              <TooltipTrigger asChild>
                <AlertDialogTrigger asChild>
                  <button className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between px-4'} w-full py-3 rounded-xl text-gray-500 hover:bg-red-50 hover:text-red-600 transition-all text-left group`}>
                    <div className="flex items-center gap-3">
                      <Avatar className="size-8 border border-gray-200 shrink-0">
                        <AvatarImage src="/avatar-placeholder.png" alt="Admin" />
                        <AvatarFallback className="bg-[#101b4d] text-white font-semibold text-xs">
                          {user?.name ? user.name.charAt(0).toUpperCase() : "A"}
                        </AvatarFallback>
                      </Avatar>
                      {!isCollapsed && <span className="font-medium text-sm truncate">Logout</span>}
                    </div>
                    {!isCollapsed && <LogOut className="size-4 shrink-0 opacity-50 group-hover:opacity-100 transition-opacity" />}
                  </button>
                </AlertDialogTrigger>
              </TooltipTrigger>
              {isCollapsed && <TooltipContent side="right" className="font-semibold text-red-500" sideOffset={10}>Logout</TooltipContent>}
            </Tooltip>
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
                <AlertDialogAction onClick={logout} className="rounded-full px-8 py-3 text-sm font-bold bg-red-600 hover:bg-red-700 text-white border-0 transition-colors shadow-md">
                  Sign Out
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </aside>
    </TooltipProvider>
  );
}
