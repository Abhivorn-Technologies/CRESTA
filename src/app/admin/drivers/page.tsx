"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { 
  Truck, 
  Plus, 
  Search, 
  Loader2,
  Trash2,
  X,
  User as UserIcon,
  Mail,
  Phone,
  Pencil
} from "lucide-react";
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
type Driver = {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  createdAt: string;
};

export default function AdminDriversPage() {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Add Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editingDriverId, setEditingDriverId] = useState<string | null>(null);
  const [errors, setErrors] = useState<{name?: string, email?: string, phone?: string, password?: string}>({});
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  // Delete State
  const [driverToDelete, setDriverToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchDrivers();
  }, []);

  const fetchDrivers = async () => {
    try {
      const res = await fetch("/api/admin/drivers");
      const data = await res.json();
      if (res.ok) {
        setDrivers(data.drivers);
      }
    } catch (error) {
      toast.error("Failed to load drivers");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddDriver = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validations
    const newErrors: typeof errors = {};
    const nameRegex = /^[a-zA-Z\s]+$/;
    if (!nameRegex.test(formData.name)) {
      newErrors.name = "Name can only contain letters and spaces";
    } else if (formData.name.trim().length < 3) {
      newErrors.name = "Name must be at least 3 characters long";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address (e.g., driver@gmail.com)";
    }

    if (formData.phone) {
      const phoneRegex = /^[6-9]\d{9}$/;
      if (!phoneRegex.test(formData.phone)) {
        newErrors.phone = "Must be a 10-digit Indian number starting with 6-9";
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);
    
    try {
      const url = editMode && editingDriverId ? `/api/admin/drivers/${editingDriverId}` : "/api/admin/drivers";
      const method = editMode ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      
      const data = await res.json();
      
      if (res.ok) {
        toast.success(editMode ? "Driver updated successfully!" : "Driver added successfully!");
        closeModal();
        fetchDrivers();
      } else {
        toast.error(data.error || (editMode ? "Failed to update driver" : "Failed to add driver"));
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  const openEditModal = (driver: Driver) => {
    setEditMode(true);
    setEditingDriverId(driver._id);
    setFormData({
      name: driver.name,
      email: driver.email,
      phone: driver.phone || "",
      password: "", // Leave blank for edit
    });
    setShowAddModal(true);
  };

  const closeModal = () => {
    setShowAddModal(false);
    setEditMode(false);
    setEditingDriverId(null);
    setErrors({});
    setFormData({ name: "", email: "", phone: "", password: "" });
  };

  const handleDelete = async () => {
    if (!driverToDelete) return;
    setIsDeleting(true);
    
    try {
      const res = await fetch(`/api/admin/drivers/${driverToDelete}`, {
        method: "DELETE",
      });
      
      if (res.ok) {
        toast.success("Driver deleted successfully");
        fetchDrivers();
      } else {
        toast.error("Failed to delete driver");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsDeleting(false);
      setDriverToDelete(null);
    }
  };

  const filteredDrivers = drivers.filter(d => 
    d.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    d.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (d.phone && d.phone.includes(searchQuery))
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-heading text-[#101b4d]">Delivery Partners</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your driver team and their access credentials.</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-[#e6127d] hover:bg-[#c20e69] text-white px-5 py-2.5 rounded-xl font-semibold transition-colors shadow-sm"
        >
          <Plus className="size-5" />
          Add Driver
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <div className="relative max-w-sm w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search drivers..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#e6127d] focus:ring-1 focus:ring-[#e6127d] transition-all"
            />
          </div>
          <div className="text-sm font-medium text-gray-500 hidden sm:block">
            Total Drivers: {filteredDrivers.length}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-gray-900 border-b border-gray-100 uppercase text-[11px] font-bold tracking-wider">
              <tr>
                <th className="px-6 py-4 rounded-tl-lg">Driver Info</th>
                <th className="px-6 py-4">Contact</th>
                <th className="px-6 py-4 hidden md:table-cell">Joined Date</th>
                <th className="px-6 py-4 text-right rounded-tr-lg">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-20 text-center">
                    <Loader2 className="size-6 animate-spin mx-auto text-[#e6127d]" />
                  </td>
                </tr>
              ) : filteredDrivers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <Truck className="size-10 text-gray-300" />
                      <p className="text-gray-500 font-medium text-base">No drivers found.</p>
                      <p className="text-gray-400 text-sm">Click "Add Driver" to create a new delivery partner account.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredDrivers.map((driver) => (
                  <tr key={driver._id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="size-10 rounded-full bg-blue-50 text-[#101b4d] flex items-center justify-center font-bold font-heading shadow-inner">
                          {driver.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-bold text-gray-900">{driver.name}</div>
                          <div className="text-[11px] font-mono text-gray-400">ID: {driver._id.slice(-6)}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <span className="flex items-center gap-1.5 font-medium text-gray-700">
                          <Mail className="size-3.5 text-gray-400" />
                          {driver.email}
                        </span>
                        {driver.phone && (
                          <span className="flex items-center gap-1.5 text-gray-500">
                            <Phone className="size-3.5 text-gray-400" />
                            {driver.phone}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      <div className="flex flex-col">
                        <span className="font-medium text-gray-900">{new Date(driver.createdAt).toLocaleDateString("en-US", { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                        <span className="text-xs text-gray-500">{new Date(driver.createdAt).toLocaleTimeString("en-US", { hour: 'numeric', minute: '2-digit' })}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => openEditModal(driver)}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit Driver"
                        >
                          <Pencil className="size-4" />
                        </button>
                        <button 
                          onClick={() => setDriverToDelete(driver._id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Driver"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Driver Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={closeModal} />
          <div className="relative bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h2 className="text-xl font-bold font-heading text-[#101b4d]">{editMode ? "Edit Driver" : "Add New Driver"}</h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-900 transition-colors">
                <X className="size-5" />
              </button>
            </div>
            
            <form onSubmit={handleAddDriver} className="p-6 flex flex-col gap-5">
              <div className="space-y-1.5">
                <label className={`text-sm font-semibold ${errors.name ? 'text-red-500' : 'text-gray-700'}`}>Full Name <span className="text-red-500">*</span></label>
                <div className="relative">
                  <UserIcon className={`absolute left-3 top-1/2 -translate-y-1/2 size-4 ${errors.name ? 'text-red-400' : 'text-gray-400'}`} />
                  <input 
                    type="text" 
                    required
                    value={formData.name}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === '' || /^[a-zA-Z\s]+$/.test(val)) {
                        setFormData({...formData, name: val});
                        if (errors.name) setErrors({...errors, name: undefined});
                      }
                    }}
                    placeholder="Enter driver's name"
                    className={`w-full pl-10 pr-4 py-2.5 bg-gray-50 border rounded-xl focus:bg-white focus:ring-1 outline-none transition-all text-sm ${
                      errors.name 
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20 bg-red-50/30' 
                        : 'border-gray-200 focus:border-[#e6127d] focus:ring-[#e6127d]'
                    }`}
                  />
                </div>
                {errors.name && <p className="text-xs font-medium text-red-500">{errors.name}</p>}
              </div>

              <div className="space-y-1.5">
                <label className={`text-sm font-semibold ${errors.email ? 'text-red-500' : 'text-gray-700'}`}>Email Address <span className="text-red-500">*</span></label>
                <div className="relative">
                  <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 size-4 ${errors.email ? 'text-red-400' : 'text-gray-400'}`} />
                  <input 
                    type="email" 
                    required
                    value={formData.email}
                    onChange={(e) => {
                      setFormData({...formData, email: e.target.value});
                      if (errors.email) setErrors({...errors, email: undefined});
                    }}
                    placeholder="driver@example.com"
                    className={`w-full pl-10 pr-4 py-2.5 bg-gray-50 border rounded-xl focus:bg-white focus:ring-1 outline-none transition-all text-sm ${
                      errors.email 
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20 bg-red-50/30' 
                        : 'border-gray-200 focus:border-[#e6127d] focus:ring-[#e6127d]'
                    }`}
                  />
                </div>
                {errors.email ? (
                  <p className="text-xs font-medium text-red-500">{errors.email}</p>
                ) : (
                  <p className="text-xs text-gray-500">They will use this email to log in.</p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className={`text-sm font-semibold ${errors.phone ? 'text-red-500' : 'text-gray-700'}`}>Phone Number (Optional)</label>
                <div className="relative">
                  <Phone className={`absolute left-3 top-1/2 -translate-y-1/2 size-4 ${errors.phone ? 'text-red-400' : 'text-gray-400'}`} />
                  <input 
                    type="tel" 
                    maxLength={10}
                    value={formData.phone}
                    onChange={(e) => {
                      let val = e.target.value.replace(/\D/g, "");
                      if (val.length > 0 && !/^[6-9]/.test(val)) {
                        val = "";
                      }
                      setFormData({...formData, phone: val});
                      if (errors.phone) setErrors({...errors, phone: undefined});
                    }}
                    placeholder="10-digit number"
                    className={`w-full pl-10 pr-4 py-2.5 bg-gray-50 border rounded-xl focus:bg-white focus:ring-1 outline-none transition-all text-sm ${
                      errors.phone 
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20 bg-red-50/30' 
                        : 'border-gray-200 focus:border-[#e6127d] focus:ring-[#e6127d]'
                    }`}
                  />
                </div>
                {errors.phone && <p className="text-xs font-medium text-red-500">{errors.phone}</p>}
              </div>

              <div className="space-y-1.5">
                <label className={`text-sm font-semibold ${errors.password ? 'text-red-500' : 'text-gray-700'}`}>Account Password {editMode ? <span className="text-gray-400 font-normal ml-1">(Leave blank to keep same)</span> : <span className="text-red-500">*</span>}</label>
                <input 
                  type="text" 
                  required={!editMode}
                  value={formData.password}
                  onChange={(e) => {
                    setFormData({...formData, password: e.target.value});
                    if (errors.password) setErrors({...errors, password: undefined});
                  }}
                  placeholder={editMode ? "Leave empty to keep current password" : "Set a strong password"}
                  className={`w-full px-4 py-2.5 bg-gray-50 border rounded-xl focus:bg-white focus:ring-1 outline-none transition-all text-sm ${
                    errors.password 
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20 bg-red-50/30' 
                      : 'border-gray-200 focus:border-[#e6127d] focus:ring-[#e6127d]'
                  }`}
                />
                {!editMode && !errors.password && <p className="text-xs text-gray-500">Provide this password to the driver.</p>}
                {errors.password && <p className="text-xs font-medium text-red-500">{errors.password}</p>}
              </div>

              <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
                <button 
                  type="button" 
                  onClick={closeModal}
                  className="px-5 py-2.5 text-sm font-bold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="px-6 py-2.5 text-sm font-bold bg-[#101b4d] hover:bg-[#0a1133] text-white rounded-xl transition-colors flex items-center gap-2 disabled:opacity-70"
                >
                  {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : (editMode ? 'Save Changes' : 'Create Account')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <AlertDialog open={!!driverToDelete} onOpenChange={(open) => !open && setDriverToDelete(null)}>
        <AlertDialogContent className="bg-white rounded-3xl p-8 max-w-sm shadow-2xl border border-red-100 flex flex-col items-center text-center">
          <AlertDialogHeader className="w-full flex flex-col items-center space-y-4">
            <div className="size-14 bg-red-50 rounded-full flex items-center justify-center mb-2">
              <Trash2 className="size-6 text-red-500" />
            </div>
            <AlertDialogTitle className="text-2xl font-bold text-gray-900 text-center w-full">Delete Driver?</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-500 text-center w-full">
              Are you sure you want to delete this delivery partner? Their account access will be permanently revoked.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="!m-0 !p-0 !bg-transparent border-none mt-8 flex flex-row items-center justify-center gap-3 w-full">
            <AlertDialogCancel disabled={isDeleting} className="mt-0 flex-1 rounded-xl py-3 text-sm font-bold border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={isDeleting} className="flex-1 rounded-xl py-3 text-sm font-bold bg-red-600 hover:bg-red-700 text-white border-0 transition-colors shadow-md">
              {isDeleting ? <Loader2 className="size-4 animate-spin mx-auto" /> : 'Yes, Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
