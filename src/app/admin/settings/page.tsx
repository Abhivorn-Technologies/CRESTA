"use client";

import { useState, useEffect } from "react";
import { User, Bell, Lock, Store, Globe, CheckCircle2 } from "lucide-react";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  const [settings, setSettings] = useState({
    profile: { firstName: "", lastName: "", email: "", avatar: "" },
    store: { name: "", description: "", contactEmail: "", contactPhone: "", location: "" },
    notifications: { orderAlerts: true, stockAlerts: true, newsletterSubscribers: false },
    localization: { currency: "INR", timezone: "Asia/Kolkata" }
  });

  useEffect(() => {
    async function fetchSettings() {
      try {
        const response = await fetch("/api/admin/settings");
        if (response.ok) {
          const data = await response.json();
          setSettings(data);
        }
      } catch (error) {
        console.error("Failed to load settings:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchSettings();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      if (response.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (error) {
      console.error("Failed to save settings:", error);
    } finally {
      setSaving(false);
    }
  };

  const updateSetting = (section: keyof typeof settings, field: string, value: any) => {
    setSettings((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const [avatarError, setAvatarError] = useState("");

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAvatarError("");
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setAvatarError("File size must be less than 5MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        updateSetting("profile", "avatar", reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "store", label: "Store Info", icon: Store },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "localization", label: "Localization", icon: Globe },
  ];

  if (loading) {
    return (
      <div className="flex-1 w-full h-full flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#e6127d]"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 pb-10 max-w-[1400px] w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-heading font-extrabold text-[#101b4d] tracking-tight">Settings</h1>
          <p className="text-gray-500 text-base mt-2">Manage your administrative preferences and store configurations.</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={saving || saved}
          className={`px-6 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-sm flex items-center gap-2 ${
            saved 
              ? "bg-green-500 text-white shadow-green-500/20" 
              : "bg-[#101b4d] hover:bg-[#1b2c8d] text-white shadow-[#101b4d]/20 hover:-translate-y-0.5"
          }`}
        >
          {saving ? (
            <div className="size-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
          ) : saved ? (
            <CheckCircle2 className="size-4" />
          ) : null}
          {saving ? "Saving..." : saved ? "Saved" : "Save Changes"}
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
        <div className="w-full lg:w-72 shrink-0">
          <nav className="flex flex-row lg:flex-col gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-hide">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 px-5 py-3.5 rounded-xl font-semibold text-[15px] transition-all whitespace-nowrap ${
                    isActive 
                      ? "bg-white text-[#101b4d] shadow-sm border border-gray-100" 
                      : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <Icon className={`size-5 ${isActive ? "text-[#e6127d]" : "text-gray-400"}`} />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="flex-1 max-w-4xl">
          <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100/50 p-8 sm:p-12">
            {activeTab === "profile" && (
              <div className="space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="flex items-center gap-6">
                  <div className="size-24 rounded-full bg-gradient-to-br from-[#fce4ec] to-white border border-gray-100 shadow-sm flex items-center justify-center text-3xl font-bold text-[#e6127d] overflow-hidden shrink-0">
                    {settings.profile.avatar ? (
                      <img src={settings.profile.avatar} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      settings.profile.firstName?.charAt(0).toUpperCase() || "A"
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-[#101b4d] bg-gray-50 hover:bg-gray-100 px-5 py-2.5 rounded-lg transition-colors border border-gray-200 cursor-pointer inline-block text-center w-fit">
                      Upload Avatar
                      <input 
                        type="file" 
                        accept="image/png, image/jpeg, image/gif" 
                        className="hidden" 
                        onChange={handleImageUpload}
                      />
                    </label>
                    <p className="text-xs text-gray-500">JPG, GIF or PNG. Max size of 5MB.</p>
                    {avatarError && <p className="text-xs text-red-500 font-medium">{avatarError}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">First Name</label>
                    <input 
                      type="text" 
                      value={settings.profile.firstName} 
                      onChange={(e) => updateSetting("profile", "firstName", e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#e6127d]/20 focus:border-[#e6127d]/50 transition-all text-gray-900 font-medium" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Last Name</label>
                    <input 
                      type="text" 
                      value={settings.profile.lastName} 
                      onChange={(e) => updateSetting("profile", "lastName", e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#e6127d]/20 focus:border-[#e6127d]/50 transition-all text-gray-900 font-medium" 
                    />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <label className="text-sm font-bold text-gray-700">Email Address</label>
                    <input 
                      type="email" 
                      value={settings.profile.email} 
                      onChange={(e) => updateSetting("profile", "email", e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#e6127d]/20 focus:border-[#e6127d]/50 transition-all text-gray-900 font-medium" 
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === "store" && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Store Name</label>
                  <input 
                    type="text" 
                    value={settings.store.name} 
                    onChange={(e) => updateSetting("store", "name", e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#e6127d]/20 focus:border-[#e6127d]/50 transition-all text-gray-900 font-medium" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Store Description</label>
                  <textarea 
                    rows={4} 
                    value={settings.store.description} 
                    onChange={(e) => updateSetting("store", "description", e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#e6127d]/20 focus:border-[#e6127d]/50 transition-all text-gray-900 font-medium resize-none" 
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Contact Email</label>
                    <input 
                      type="email" 
                      value={settings.store.contactEmail} 
                      onChange={(e) => updateSetting("store", "contactEmail", e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#e6127d]/20 focus:border-[#e6127d]/50 transition-all text-gray-900 font-medium" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Contact Phone</label>
                    <input 
                      type="text" 
                      value={settings.store.contactPhone} 
                      onChange={(e) => updateSetting("store", "contactPhone", e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#e6127d]/20 focus:border-[#e6127d]/50 transition-all text-gray-900 font-medium" 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Store Location / Address</label>
                  <textarea 
                    rows={3}
                    value={settings.store.location || ""} 
                    onChange={(e) => updateSetting("store", "location", e.target.value)}
                    placeholder="Enter physical store location, address, or coordinates"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#e6127d]/20 focus:border-[#e6127d]/50 transition-all text-gray-900 font-medium resize-none" 
                  />
                </div>
              </div>
            )}

            {activeTab === "notifications" && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="flex items-center justify-between p-4 border border-gray-100 rounded-2xl bg-gray-50/50">
                  <div>
                    <h4 className="text-sm font-bold text-gray-900">Order Alerts</h4>
                    <p className="text-xs text-gray-500 mt-0.5">Receive notifications for new orders</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={settings.notifications.orderAlerts}
                      onChange={(e) => updateSetting("notifications", "orderAlerts", e.target.checked)}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#e6127d]"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 border border-gray-100 rounded-2xl bg-gray-50/50">
                  <div>
                    <h4 className="text-sm font-bold text-gray-900">Low Stock Alerts</h4>
                    <p className="text-xs text-gray-500 mt-0.5">Receive notifications when products run low</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={settings.notifications.stockAlerts}
                      onChange={(e) => updateSetting("notifications", "stockAlerts", e.target.checked)}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#e6127d]"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 border border-gray-100 rounded-2xl bg-gray-50/50">
                  <div>
                    <h4 className="text-sm font-bold text-gray-900">Newsletter Subscribers</h4>
                    <p className="text-xs text-gray-500 mt-0.5">Notify when someone subscribes to the newsletter</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={settings.notifications.newsletterSubscribers}
                      onChange={(e) => updateSetting("notifications", "newsletterSubscribers", e.target.checked)}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#e6127d]"></div>
                  </label>
                </div>
              </div>
            )}

            {activeTab === "localization" && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Currency</label>
                  <select 
                    value={settings.localization.currency}
                    onChange={(e) => updateSetting("localization", "currency", e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#e6127d]/20 focus:border-[#e6127d]/50 transition-all text-gray-900 appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2224%22%20height%3D%2224%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20stroke%3D%22%236b7280%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%2F%3E%3C%2Fsvg%3E')] bg-[length:16px_16px] bg-no-repeat bg-[position:right_12px_center] pr-10"
                  >
                    <option value="INR">Indian Rupee (₹)</option>
                    <option value="USD">US Dollar ($)</option>
                    <option value="EUR">Euro (€)</option>
                    <option value="GBP">British Pound (£)</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Timezone</label>
                  <select 
                    value={settings.localization.timezone}
                    onChange={(e) => updateSetting("localization", "timezone", e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#e6127d]/20 focus:border-[#e6127d]/50 transition-all text-gray-900 appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2224%22%20height%3D%2224%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20stroke%3D%22%236b7280%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%2F%3E%3C%2Fsvg%3E')] bg-[length:16px_16px] bg-no-repeat bg-[position:right_12px_center] pr-10"
                  >
                    <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                    <option value="UTC">UTC</option>
                    <option value="America/New_York">America/New_York (EST)</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
