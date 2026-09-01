"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

import { PackageSearch, X, Upload, Pencil, Trash2, AlertCircle, CheckCircle2 } from "lucide-react";
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

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch(`/api/admin/products?_cb=${Date.now()}`, { cache: "no-store" });
        if (response.ok) {
          const data = await response.json();
          setProducts(data);
        }
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();

    const onFocus = () => fetchProducts();
    window.addEventListener("focus", onFocus);
    window.addEventListener("visibilitychange", () => {
      if (document.visibilityState === 'visible') fetchProducts();
    });

    return () => {
      window.removeEventListener("focus", onFocus);
      window.removeEventListener("visibilitychange", onFocus);
    };
  }, []);

  const toggleStockStatus = async (productId: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inStock: !currentStatus }),
      });
      if (response.ok) {
        const updatedProduct = await response.json();
        setProducts(products.map(p => p._id === productId ? updatedProduct : p));
      }
    } catch (error) {
      console.error("Failed to update product stock status", error);
    }
  };

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Body scroll lock
  useEffect(() => {
    if (showAddModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [showAddModal]);
  
  const initialFormState = {
    name: "",
    category: "ice-cream",
    price: "",
    volume: "",
    image: "",
  };
  const [formData, setFormData] = useState(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Dialog State
  const [dialogConfig, setDialogConfig] = useState<{ open: boolean; type: 'success' | 'error'; title: string; message: string }>({
    open: false,
    type: 'success',
    title: '',
    message: ''
  });

  const [confirmDelete, setConfirmDelete] = useState<{ open: boolean, productId: string | null }>({
    open: false,
    productId: null,
  });

  const openAddModal = () => {
    setEditingId(null);
    setFormData(initialFormState);
    setShowAddModal(true);
  };

  const openEditModal = (product: any) => {
    setEditingId(product._id);
    setFormData({
      name: product.name,
      category: product.category,
      price: product.price.toString(),
      volume: product.volume,
      image: product.image || "",
    });
    setShowAddModal(true);
  };

  const handleDeleteProduct = (productId: string) => {
    setConfirmDelete({ open: true, productId });
  };

  const confirmDeleteAction = async () => {
    const productId = confirmDelete.productId;
    if (!productId) return;
    
    setConfirmDelete({ open: false, productId: null });
    
    try {
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setProducts(products.filter(p => p._id !== productId));
        setDialogConfig({
          open: true,
          type: 'success',
          title: 'Product Deleted',
          message: 'The product has been successfully removed from your catalog.'
        });
      } else {
        setDialogConfig({
          open: true,
          type: 'error',
          title: 'Delete Failed',
          message: 'There was a problem deleting the product. Please try again.'
        });
      }
    } catch (error) {
      console.error("Failed to delete product", error);
      setDialogConfig({
        open: true,
        type: 'error',
        title: 'Connection Error',
        message: 'An unexpected error occurred. Please check your connection and try again.'
      });
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setDialogConfig({
          open: true,
          type: 'error',
          title: 'File Too Large',
          message: 'The selected image exceeds the maximum size of 5MB. Please choose a smaller file.'
        });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const payload = {
      ...formData,
      price: Number(formData.price)
    };

    try {
      if (editingId) {
        // Update existing product
        const response = await fetch(`/api/admin/products/${editingId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (response.ok) {
          const updatedProduct = await response.json();
          setProducts(products.map(p => p._id === editingId ? updatedProduct : p));
          setShowAddModal(false);
          setFormData(initialFormState);
          setDialogConfig({
            open: true,
            type: 'success',
            title: 'Product Updated',
            message: 'Your product details have been successfully updated.'
          });
        } else {
          setDialogConfig({
            open: true,
            type: 'error',
            title: 'Update Failed',
            message: 'There was a problem updating the product. Please try again.'
          });
        }
      } else {
        // Add new product
        const response = await fetch("/api/admin/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (response.ok) {
          const newProduct = await response.json();
          setProducts([newProduct, ...products]);
          setShowAddModal(false);
          setFormData(initialFormState);
          setDialogConfig({
            open: true,
            type: 'success',
            title: 'Product Added',
            message: 'The new product has been successfully added to your catalog.'
          });
        } else {
          setDialogConfig({
            open: true,
            type: 'error',
            title: 'Add Failed',
            message: 'There was a problem adding the product. Please try again.'
          });
        }
      }
    } catch (error) {
      console.error("Failed to save product", error);
    } finally {
      setIsSubmitting(false);
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
    <div className="flex flex-col gap-6 pb-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-heading font-bold text-[#101b4d]">Products</h1>
          <p className="text-gray-500 text-sm mt-1">Manage your product catalog and inventory.</p>
        </div>
        <button 
          onClick={openAddModal}
          className="px-4 py-2.5 bg-[#101b4d] hover:bg-[#1b2c8d] text-white font-semibold text-sm rounded-lg shadow-sm transition-all hover:-translate-y-0.5"
        >
          + Add Product
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left whitespace-nowrap">
            <thead className="bg-gray-50 border-b border-gray-200 text-gray-500">
              <tr>
                <th className="px-6 py-4 font-semibold w-[80px]">Image</th>
                <th className="px-6 py-4 font-semibold">Product Name</th>
                <th className="px-6 py-4 font-semibold">Category</th>
                <th className="px-6 py-4 font-semibold">Price</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="size-12 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 border border-gray-100">
                        <PackageSearch className="size-5" />
                      </div>
                      <h3 className="text-sm font-semibold text-gray-900">No Products Found</h3>
                      <p className="text-sm text-gray-500">You haven't added any products to your catalog yet.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product._id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-3">
                      <div className="size-12 rounded-lg bg-gray-50 border border-gray-200 overflow-hidden transition-transform group-hover:scale-105">
                        {product.image ? (
                          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-gray-100" />
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-3">
                      <div className="flex flex-col">
                        <span className="font-semibold text-gray-900 group-hover:text-[#e6127d] transition-colors">{product.name}</span>
                        <span className="text-xs text-gray-500">{product.volume}</span>
                      </div>
                    </td>
                    <td className="px-6 py-3 text-gray-500 capitalize">
                      {product.category}
                    </td>
                    <td className="px-6 py-3 font-semibold text-[#101b4d]">
                      ₹{product.price.toFixed(2)}
                    </td>
                    <td className="px-6 py-3">
                      {product.inStock ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-green-50 text-green-700">
                          In Stock
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-red-50 text-red-700">
                          Out of Stock
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => toggleStockStatus(product._id, product.inStock)}
                          className={`text-xs font-semibold px-3 py-1.5 rounded-md border transition-all ${
                            product.inStock 
                              ? "border-red-200 text-red-600 hover:bg-red-50" 
                              : "border-green-200 text-green-600 hover:bg-green-50"
                          }`}
                        >
                          {product.inStock ? "Mark Out of Stock" : "Mark In Stock"}
                        </button>
                        <button
                          onClick={() => openEditModal(product)}
                          title="Edit Product"
                          className="p-1.5 text-gray-400 hover:text-[#101b4d] hover:bg-gray-100 rounded-md transition-colors"
                        >
                          <Pencil className="size-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product._id)}
                          title="Delete Product"
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
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

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-[95vw] sm:w-full max-w-lg max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h2 className="text-xl font-bold text-[#101b4d]">
                {editingId ? "Edit Product" : "Add New Product"}
              </h2>
              <button 
                onClick={() => setShowAddModal(false)}
                className="p-2 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
              >
                <X className="size-5" />
              </button>
            </div>
            
            <form onSubmit={handleSaveProduct} className="p-6">
              <div className="space-y-4">
                {/* Image Upload */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-[#101b4d]">Product Image</label>
                  <div className="flex items-center gap-4">
                    <div className="size-20 rounded-xl bg-gray-50 border border-gray-200 overflow-hidden flex items-center justify-center shrink-0">
                      {formData.image ? (
                        <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <Upload className="size-6 text-gray-400" />
                      )}
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-[#101b4d] bg-gray-50 hover:bg-gray-100 px-4 py-2 rounded-lg transition-colors border border-gray-200 cursor-pointer inline-block w-fit">
                        Choose Image
                        <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                      </label>
                      <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 5MB</p>
                    </div>
                  </div>
                </div>

                {/* Name */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-[#101b4d]">Product Name <span className="text-[#e6127d]">*</span></label>
                  <input 
                    required
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="e.g., Belgian Chocolate Pint"
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-[#101b4d] focus:ring-1 focus:ring-[#101b4d] outline-none transition-all text-sm"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Category */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-[#101b4d]">Category <span className="text-[#e6127d]">*</span></label>
                    <select 
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-[#101b4d] focus:ring-1 focus:ring-[#101b4d] outline-none transition-all text-sm bg-white"
                    >
                      <option value="ice-cream">Ice Cream</option>
                      <option value="sundae">Sundae</option>
                      <option value="shake">Milkshake</option>
                      <option value="cake">Ice Cream Cake</option>
                    </select>
                  </div>

                  {/* Price */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-[#101b4d]">Price (₹) <span className="text-[#e6127d]">*</span></label>
                    <input 
                      required
                      type="number" 
                      min="0"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: e.target.value})}
                      placeholder="0.00"
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-[#101b4d] focus:ring-1 focus:ring-[#101b4d] outline-none transition-all text-sm"
                    />
                  </div>
                </div>

                {/* Volume */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-[#101b4d]">Volume / Size <span className="text-[#e6127d]">*</span></label>
                  <input 
                    required
                    type="text" 
                    value={formData.volume}
                    onChange={(e) => setFormData({...formData, volume: e.target.value})}
                    placeholder="e.g., 500ml, 1L"
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-[#101b4d] focus:ring-1 focus:ring-[#101b4d] outline-none transition-all text-sm"
                  />
                </div>
              </div>

              <div className="mt-8 flex justify-end gap-3">
                <button 
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-5 py-2.5 text-sm font-semibold text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 text-sm font-semibold text-white bg-[#e6127d] hover:bg-[#c90d6b] rounded-lg transition-colors disabled:opacity-70 flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/20 border-t-white" />
                  ) : editingId ? "Save Changes" : "Add Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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

      {/* Confirmation Dialog for Deleting */}
      <AlertDialog open={confirmDelete.open} onOpenChange={(open) => setConfirmDelete(prev => ({ ...prev, open }))}>
        <AlertDialogContent className="bg-white rounded-2xl p-0 max-w-md shadow-2xl border-0 overflow-hidden z-[100]">
          <div className="h-2 w-full bg-red-500" />
          <div className="p-6 sm:p-8">
            <AlertDialogHeader className="flex flex-col items-center sm:items-start w-full">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 w-full">
                <div className="size-14 rounded-2xl flex items-center justify-center shrink-0 shadow-sm border bg-red-50 text-red-600 border-red-100">
                  <Trash2 className="size-7" />
                </div>
                <div className="flex flex-col gap-2 mt-1 text-center sm:text-left">
                  <AlertDialogTitle className="text-xl font-heading font-bold text-[#101b4d]">
                    Delete Product?
                  </AlertDialogTitle>
                  <AlertDialogDescription className="text-[15px] text-gray-500 leading-relaxed">
                    Are you sure you want to completely remove this product? This action cannot be undone.
                  </AlertDialogDescription>
                </div>
              </div>
            </AlertDialogHeader>
            <AlertDialogFooter className="!m-0 !p-0 !bg-transparent border-none mt-8 flex flex-col sm:flex-row items-center justify-center sm:justify-end w-full gap-3">
              <AlertDialogCancel 
                onClick={() => setConfirmDelete({ open: false, productId: null })}
                className="rounded-xl px-6 py-2.5 text-sm font-semibold border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 m-0 w-full sm:w-auto transition-colors"
              >
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction 
                onClick={confirmDeleteAction}
                className="rounded-xl px-6 py-2.5 text-sm font-bold text-white border-0 transition-all shadow-md hover:shadow-lg bg-red-600 hover:bg-red-700 hover:-translate-y-0.5 m-0 w-full sm:w-auto"
              >
                Delete Product
              </AlertDialogAction>
            </AlertDialogFooter>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
