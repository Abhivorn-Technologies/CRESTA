"use client";

import { useEffect, useState, useRef } from "react";
import { Upload, ImageIcon, RefreshCcw, CheckCircle2, AlertCircle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const SITE_PAGES = [
  {
    title: "Home Page",
    description: "Main landing page hero and promotional sections",
    images: [
      { key: "home-hero", label: "Hero Composite Image", defaultUrl: "/images/hero-composite.jpg", size: "1200x800" },
      { key: "home-banner", label: "Promotional Banner", defaultUrl: "/images/AB6AXuBm0DEBZy4ie0uQ.png", size: "1920x600" },
      { key: "home-bulk1", label: "Bulk Orders Top Image", defaultUrl: "/images/image 5.png", size: "600x600" },
      { key: "home-bulk2", label: "Bulk Orders Sundae", defaultUrl: "/images/Ice Cream Sundae.png", size: "500x500" },
      { key: "home-store-br", label: "Authorized Distributor Store", defaultUrl: "/images/store-interior-br.jpg", size: "800x600" },
      { key: "occasion-wedding", label: "Occasion: Weddings", defaultUrl: "/images/occasion-wedding.jpg", size: "800x600" },
      { key: "occasion-birthday", label: "Occasion: Birthdays", defaultUrl: "/images/occasion-birthday.jpg", size: "800x600" },
      { key: "occasion-corporate", label: "Occasion: Corporate Events", defaultUrl: "/images/occasion-corporate.jpg", size: "800x600" },
      { key: "occasion-anniversary", label: "Occasion: Anniversaries", defaultUrl: "/images/occasion-anniversary.jpg", size: "800x600" },
      { key: "occasion-houseparty", label: "Occasion: House Parties", defaultUrl: "/images/occasion-houseparty.jpg", size: "800x600" },
      { key: "occasion-festival", label: "Occasion: Festivals", defaultUrl: "/images/occasion-festival.jpg", size: "800x600" },
    ]
  },
  {
    title: "Products Page",
    description: "Header banner for the products listing page",
    images: [
      { key: "products-banner", label: "Products Page Header Banner", defaultUrl: "/images/AB6AXuBm0DEBZy4ie0uQ.png", size: "1920x400" },
    ]
  },
  {
    title: "About Us Page",
    description: "Images used in the mission and info sections",
    images: [
      { key: "about-mega", label: "Quick Info Megaphone", defaultUrl: "/images/blank-megaphone.jpg", size: "400x400" },
      { key: "about-basket", label: "Quick Info Basket", defaultUrl: "/images/grocery-basket.jpg", size: "400x400" },
      { key: "about-mission", label: "Our Mission Composite", defaultUrl: "/images/mission-composite.jpg", size: "800x800" },
    ]
  },
  {
    title: "Other Pages",
    description: "Delivery tracking map and enquiry sidebars",
    images: [
      { key: "delivery-map", label: "Delivery Tracking Map Background", defaultUrl: "/images/tracking-map-bg.jpg", size: "800x1200" },
      { key: "enquiry-cakes", label: "Enquiry Sidebar Cakes", defaultUrl: "/images/shop-cakes.jpg", size: "600x800" },
    ]
  },
  {
    title: "Shop by Range Categories",
    description: "Images for the product categories shown on the Home Page",
    images: [
      { key: "category-ice-cream-cakes", label: "Ice Cream Cakes", defaultUrl: "/images/Tiramisu_Cheesecake_414x.png (1).png", size: "400x400" },
      { key: "category-ice-cream-tubs", label: "Ice Cream Tubs", defaultUrl: "/images/image 5.png", size: "400x400" },
      { key: "category-party-packs", label: "Party Packs", defaultUrl: "/images/BEVERAGE_95b0dcd1-b1.png", size: "400x400" },
      { key: "category-premium-collection", label: "Premium Collection", defaultUrl: "/images/paleta-strawberry.png", size: "400x400" },
      { key: "category-scoops", label: "Scoops", defaultUrl: "/images/SCOOPS_d9897fbb-eccc.png", size: "400x400" },
      { key: "category-sundaes", label: "Sundaes", defaultUrl: "/images/sundae-deliciousness.png", size: "400x400" },
    ]
  }
];

export default function SiteImagesPage() {
  const [customizedKeys, setCustomizedKeys] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState<string | null>(null);

  // Dialog State
  const [dialogConfig, setDialogConfig] = useState<{ open: boolean; type: 'success' | 'error'; title: string; message: string }>({
    open: false,
    type: 'success',
    title: '',
    message: ''
  });

  const [confirmRestore, setConfirmRestore] = useState<{ open: boolean, key: string | null }>({
    open: false,
    key: null,
  });

  // Hidden file input reference
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedKey, setSelectedKey] = useState<string | null>(null);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const response = await fetch("/api/admin/page-images");
      if (response.ok) {
        const data = await response.json();
        const customMap: Record<string, string> = {};
        data.forEach((img: any) => {
          customMap[img.key] = img.updatedAt;
        });
        setCustomizedKeys(customMap);
      }
    } catch (error) {
      console.error("Failed to fetch page images statuses:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadClick = (key: string) => {
    setSelectedKey(key);
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedKey) return;

    if (file.size > 5 * 1024 * 1024) {
      setDialogConfig({
        open: true,
        type: 'error',
        title: 'File Too Large',
        message: 'The selected image exceeds the maximum size of 5MB. Please choose a smaller file.'
      });
      return;
    }

    setUploading(selectedKey);

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64Data = reader.result as string;
      try {
        const response = await fetch("/api/admin/page-images", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ key: selectedKey, imageBase64: base64Data }),
        });

        if (response.ok) {
          const result = await response.json();
          setCustomizedKeys(prev => ({ ...prev, [selectedKey]: result.updatedAt }));
          setDialogConfig({
            open: true,
            type: 'success',
            title: 'Upload Successful',
            message: 'The image has been replaced and is now live on the website.'
          });
        } else {
          setDialogConfig({
            open: true,
            type: 'error',
            title: 'Upload Failed',
            message: 'There was a problem updating the image. Please try again later.'
          });
        }
      } catch (error) {
        console.error("Upload error:", error);
        setDialogConfig({
          open: true,
          type: 'error',
          title: 'Connection Error',
          message: 'An unexpected error occurred. Please check your connection and try again.'
        });
      } finally {
        setUploading(null);
        setSelectedKey(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRestore = (key: string) => {
    setConfirmRestore({ open: true, key });
  };

  const confirmRestoreAction = async () => {
    const key = confirmRestore.key;
    if (!key) return;

    setConfirmRestore({ open: false, key: null });

    try {
      const response = await fetch(`/api/admin/page-images?key=${key}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setCustomizedKeys(prev => {
          const newKeys = { ...prev };
          delete newKeys[key];
          return newKeys;
        });
        setDialogConfig({
          open: true,
          type: 'success',
          title: 'Restored to Default',
          message: 'The image has been restored to its original state.'
        });
      } else {
        setDialogConfig({
          open: true,
          type: 'error',
          title: 'Restore Failed',
          message: 'There was a problem restoring the image. Please try again later.'
        });
      }
    } catch (error) {
      console.error("Restore error:", error);
      setDialogConfig({
        open: true,
        type: 'error',
        title: 'Connection Error',
        message: 'An unexpected error occurred. Please check your connection and try again.'
      });
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
    <div className="flex flex-col gap-10 pb-12 max-w-7xl mx-auto">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl md:text-4xl font-heading font-bold text-[#101b4d] tracking-tight">Site Images Manager</h1>
        <p className="text-gray-500 text-base max-w-2xl">
          Customize and replace the images displayed across your public pages. Keep your website fresh with seasonal banners and updated visuals.
        </p>
      </div>

      <input 
        type="file" 
        accept="image/png, image/jpeg, image/webp" 
        className="hidden" 
        ref={fileInputRef}
        onChange={handleFileChange}
      />

      <div className="flex flex-col gap-8">
        {SITE_PAGES.map((pageGroup, idx) => (
          <div key={idx} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8 flex flex-col gap-6">
            <div className="flex flex-col gap-1 border-b border-gray-100 pb-4">
              <h2 className="text-2xl font-heading font-bold text-[#101b4d]">
                {pageGroup.title}
              </h2>
              <p className="text-sm text-gray-500">{pageGroup.description}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {pageGroup.images.map((img) => {
                const isCustomized = !!customizedKeys[img.key];
                const imageUrl = isCustomized 
                  ? `/api/images/${img.key}?t=${new Date(customizedKeys[img.key]).getTime()}` 
                  : img.defaultUrl;

                return (
                  <div 
                    key={img.key} 
                    className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col group hover:shadow-md hover:border-[#e6127d]/30 transition-all duration-300"
                  >
                    <div className="h-44 bg-[#f8fafc] flex items-center justify-center p-6 relative overflow-hidden">
                      {/* Clean dotted background pattern */}
                      <div className="absolute inset-0 opacity-[0.4]" style={{ backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '16px 16px' }}></div>
                      
                      <img 
                        src={imageUrl} 
                        alt={img.label} 
                        className="max-h-full max-w-full object-contain relative z-10 drop-shadow-sm group-hover:scale-105 transition-transform duration-500 ease-out"
                      />
                      
                      {/* Upload Overlay */}
                      <div className="absolute inset-0 bg-[#101b4d]/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 flex flex-col items-center justify-center backdrop-blur-[2px]">
                        <Button 
                          onClick={() => handleUploadClick(img.key)}
                          disabled={uploading === img.key}
                          className="bg-white text-[#101b4d] hover:bg-[#e6127d] hover:text-white font-semibold rounded-full shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all duration-300"
                        >
                          {uploading === img.key ? <RefreshCcw className="size-4 animate-spin mr-2" /> : <Upload className="size-4 mr-2" />}
                          {uploading === img.key ? "Uploading..." : "Replace Image"}
                        </Button>
                      </div>
                    </div>
                    
                    <div className="p-5 flex flex-col gap-3 flex-1 bg-white relative z-30">
                      <div className="flex justify-between items-start gap-3">
                        <h3 className="font-bold text-[#101b4d] text-[15px] leading-snug">{img.label}</h3>
                        {isCustomized && (
                          <span className="bg-green-50 text-green-700 border border-green-200 text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider shrink-0 shadow-sm">
                            Custom
                          </span>
                        )}
                      </div>
                      <div className="mt-auto flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 text-xs font-medium text-gray-500 bg-gray-50 p-2 rounded-lg border border-gray-100 flex-1">
                          <ImageIcon className="size-4 text-gray-400 shrink-0" />
                          <span className="truncate">Recommended: {img.size}</span>
                        </div>
                        {isCustomized && (
                          <button
                            onClick={() => handleRestore(img.key)}
                            title="Restore Default Image"
                            className="p-2 rounded-lg bg-gray-50 text-gray-500 hover:text-red-600 hover:bg-red-50 border border-gray-200 transition-colors"
                          >
                            <RotateCcw className="size-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* AlertDialog for Success/Error feedback */}
      <AlertDialog open={dialogConfig.open} onOpenChange={(open) => setDialogConfig(prev => ({ ...prev, open }))}>
        <AlertDialogContent className="bg-white rounded-2xl p-0 max-w-md shadow-2xl border-0 overflow-hidden z-[100]">
          <div className={`h-2 w-full ${dialogConfig.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`} />
          <div className="p-6 sm:p-8">
            <AlertDialogHeader className="flex flex-col items-center sm:items-start w-full">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 w-full">
                <div className={`size-14 rounded-2xl flex items-center justify-center shrink-0 shadow-sm border ${dialogConfig.type === 'success' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-red-50 text-red-600 border-red-100'}`}>
                  {dialogConfig.type === 'success' ? (
                    <CheckCircle2 className="size-7" />
                  ) : (
                    <AlertCircle className="size-7" />
                  )}
                </div>
                <div className="flex flex-col gap-2 mt-1 text-center sm:text-left">
                  <AlertDialogTitle className="text-xl font-heading font-bold text-[#101b4d]">
                    {dialogConfig.title}
                  </AlertDialogTitle>
                  <AlertDialogDescription className="text-[15px] text-gray-500 leading-relaxed">
                    {dialogConfig.message}
                  </AlertDialogDescription>
                </div>
              </div>
            </AlertDialogHeader>
            <AlertDialogFooter className="!m-0 !p-0 !bg-transparent border-none mt-8 flex flex-row items-center justify-center sm:justify-end w-full">
              <AlertDialogAction 
                onClick={() => setDialogConfig(prev => ({ ...prev, open: false }))}
                className={`rounded-xl px-8 py-2.5 text-sm font-bold text-white border-0 transition-all shadow-md hover:shadow-lg ${dialogConfig.type === 'success' ? 'bg-[#101b4d] hover:bg-[#1a2b75] hover:-translate-y-0.5' : 'bg-red-600 hover:bg-red-700 hover:-translate-y-0.5'}`}
              >
                Got it
              </AlertDialogAction>
            </AlertDialogFooter>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      {/* Confirmation Dialog for Restoring */}
      <AlertDialog open={confirmRestore.open} onOpenChange={(open) => setConfirmRestore(prev => ({ ...prev, open }))}>
        <AlertDialogContent className="bg-white rounded-2xl p-0 max-w-md shadow-2xl border-0 overflow-hidden z-[100]">
          <div className="h-2 w-full bg-orange-500" />
          <div className="p-6 sm:p-8">
            <AlertDialogHeader className="flex flex-col items-center sm:items-start w-full">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 w-full">
                <div className="size-14 rounded-2xl flex items-center justify-center shrink-0 shadow-sm border bg-orange-50 text-orange-600 border-orange-100">
                  <RotateCcw className="size-7" />
                </div>
                <div className="flex flex-col gap-2 mt-1 text-center sm:text-left">
                  <AlertDialogTitle className="text-xl font-heading font-bold text-[#101b4d]">
                    Restore Default?
                  </AlertDialogTitle>
                  <AlertDialogDescription className="text-[15px] text-gray-500 leading-relaxed">
                    Are you sure you want to remove this custom image and restore the original default image?
                  </AlertDialogDescription>
                </div>
              </div>
            </AlertDialogHeader>
            <AlertDialogFooter className="!m-0 !p-0 !bg-transparent border-none mt-8 flex flex-col sm:flex-row items-center justify-center sm:justify-end w-full gap-3">
              <AlertDialogCancel 
                onClick={() => setConfirmRestore({ open: false, key: null })}
                className="rounded-xl px-6 py-2.5 text-sm font-semibold border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 m-0 w-full sm:w-auto transition-colors"
              >
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction 
                onClick={confirmRestoreAction}
                className="rounded-xl px-6 py-2.5 text-sm font-bold text-white border-0 transition-all shadow-md hover:shadow-lg bg-[#e6127d] hover:bg-[#c90d6b] hover:-translate-y-0.5 m-0 w-full sm:w-auto"
              >
                Restore Image
              </AlertDialogAction>
            </AlertDialogFooter>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
