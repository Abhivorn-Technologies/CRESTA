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
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon,
  Truck
} from "lucide-react";

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export function AdminSidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

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
    <TooltipProvider delayDuration={0}>
      <aside 
        className={`bg-white border-r border-gray-100 text-[#101b4d] hidden md:flex flex-col relative shrink-0 transition-all duration-300 ${
          isCollapsed ? "w-[80px]" : "w-64"
        } h-full select-none`}
      >
        {/* Toggle Button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3.5 top-6 bg-white border border-gray-200 rounded-full p-1.5 text-gray-400 hover:text-[#101b4d] hover:border-[#101b4d] transition-colors z-50 shadow-sm"
          title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {isCollapsed ? <ChevronRight className="size-4" /> : <ChevronLeft className="size-4" />}
        </button>

        {/* Navigation List with scrollbar completely removed */}
        <nav className="flex-1 px-3.5 flex flex-col gap-1 mt-4 overflow-y-auto overflow-x-hidden no-scrollbar hide-scrollbar [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = link.href === '/admin' ? pathname === '/admin' : (pathname === link.href || pathname.startsWith(`${link.href}/`));
            
            const linkContent = (
              <Link 
                href={link.href}
                prefetch={true}
                className={`flex items-center ${isCollapsed ? 'justify-center px-0' : 'justify-start px-3.5'} py-2.5 rounded-xl transition-all ${
                  isActive 
                    ? "bg-[#e6127d] text-white font-semibold shadow-md shadow-[#e6127d]/20" 
                    : "text-gray-500 hover:bg-[#fce4ec] hover:text-[#e6127d]"
                }`}
              >
                <Icon className={`size-5 shrink-0 ${isActive ? "text-white" : "text-gray-400 group-hover:text-[#e6127d]"}`} />
                {!isCollapsed && <span className="ml-3 font-medium text-sm truncate">{link.label}</span>}
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

        {/* Bottom Settings Link */}
        <div className="p-3.5 border-t border-gray-100 mt-auto shrink-0 flex flex-col relative">
          {isCollapsed ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <Link 
                  href="/admin/settings" 
                  className={`flex items-center justify-center w-full py-2.5 rounded-xl transition-all ${
                    pathname === '/admin/settings'
                      ? "bg-[#e6127d] text-white font-semibold shadow-md shadow-[#e6127d]/20"
                      : "text-gray-500 hover:bg-[#fce4ec] hover:text-[#e6127d]"
                  }`}
                >
                  <Settings className={`size-5 ${pathname === '/admin/settings' ? "text-white" : "text-gray-400"}`} />
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right" className="font-semibold" sideOffset={10}>Settings</TooltipContent>
            </Tooltip>
          ) : (
            <Link 
              href="/admin/settings" 
              className={`flex w-full items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all text-left ${
                pathname === '/admin/settings'
                  ? "bg-[#e6127d] text-white font-semibold shadow-md shadow-[#e6127d]/20"
                  : "text-gray-500 hover:bg-[#fce4ec] hover:text-[#e6127d]"
              }`}
            >
              <Settings className={`size-5 ${pathname === '/admin/settings' ? "text-white" : "text-gray-400"}`} />
              <span className="font-medium text-sm">Settings</span>
            </Link>
          )}
        </div>
      </aside>
    </TooltipProvider>
  );
}
