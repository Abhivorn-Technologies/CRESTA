"use client";

import { useEffect, useState, useRef } from "react";
import { 
  Plus, 
  Trash2, 
  Edit3, 
  Upload, 
  CheckCircle2, 
  AlertCircle, 
  Film, 
  Camera, 
  RefreshCcw, 
  X,
  Maximize2,
  Sparkles,
  Play,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface GalleryItemType {
  _id: string;
  type: "image" | "video";
  title: string;
  caption: string;
  src: string;
  order: number;
  createdAt: string;
}

// ─── Video Card with Silent Auto-Preview on Hover ────────────────────────────
function AdminVideoCard({
  item,
  idx,
  onOpenEdit,
  onOpenDelete,
  onPreview,
}: {
  item: GalleryItemType;
  idx: number;
  onOpenEdit: () => void;
  onOpenDelete: () => void;
  onPreview: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  const [aspectRatio, setAspectRatio] = useState<number>(16 / 9);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleMouseEnter = () => {
    setHovered(true);
    videoRef.current?.play().catch(() => {});
  };

  const handleMouseLeave = () => {
    setHovered(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  return (
    <div 
      className="bg-white rounded-3xl border border-gray-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_16px_40px_rgba(230,18,125,0.09)] hover:border-[#e6127d]/40 transition-all duration-300 flex flex-col overflow-hidden group"
      style={{
        flexGrow: Math.max(0.6, Math.min(aspectRatio, 2.4)),
        flexShrink: 1,
        flexBasis: `${Math.round(260 * Math.max(0.65, Math.min(aspectRatio, 2.0)))}px`,
        minWidth: `${Math.max(220, Math.round(260 * Math.min(aspectRatio, 1.2)))}px`,
        maxWidth: '100%',
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Uniform Row Height Video Container (Google Photos justified style) */}
      <div 
        className="relative w-full h-[260px] bg-neutral-950 overflow-hidden cursor-pointer flex items-center justify-center"
        onClick={onPreview}
      >
        <video
          ref={videoRef}
          src={item.src}
          muted
          loop
          playsInline
          preload="metadata"
          onLoadedMetadata={(e) => {
            const vid = e.currentTarget;
            if (vid.videoWidth && vid.videoHeight) {
              setAspectRatio(vid.videoWidth / vid.videoHeight);
            }
          }}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />

        {/* Center Play Button Overlay */}
        <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${hovered ? 'opacity-0 pointer-events-none' : 'opacity-100 bg-black/25'}`}>
          <div className="size-14 rounded-full bg-white/20 hover:bg-[#e6127d] backdrop-blur-md border border-white/40 flex items-center justify-center text-white shadow-2xl transition-all duration-300">
            <Play className="size-6 fill-white ml-0.5" />
          </div>
        </div>

        {/* Floating Badges */}
        <div className="absolute top-3.5 left-3.5 z-10 pointer-events-none flex items-center gap-1.5">
          <span className="text-[11px] font-extrabold px-2.5 py-1 rounded-xl bg-black/60 text-white backdrop-blur-md border border-white/10">
            #{idx + 1}
          </span>
          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-lg bg-[#e6127d] text-white uppercase tracking-wider shadow-sm">
            Video
          </span>
        </div>

        <div className="absolute top-3.5 right-3.5 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button 
            type="button"
            onClick={(e) => { e.stopPropagation(); onPreview(); }}
            className="size-8 rounded-xl bg-black/60 hover:bg-[#e6127d] text-white backdrop-blur-md flex items-center justify-center transition-colors border border-white/10"
            title="Watch Fullscreen"
          >
            <Maximize2 className="size-4" />
          </button>
        </div>

        {/* Bottom hover hint */}
        <div className="absolute bottom-2.5 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
          <span className="text-[10px] font-semibold text-white/90 bg-black/70 px-2.5 py-1 rounded-md backdrop-blur-sm border border-white/10">
            Hover to play • Click to view
          </span>
        </div>
      </div>

      {/* Card Info & Actions */}
      <div className="p-5 flex flex-col gap-2.5 bg-white flex-1 justify-between">
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between gap-2">
            <h3 
              onClick={onPreview}
              className="font-heading font-bold text-[#101b4d] text-base leading-snug truncate cursor-pointer hover:text-[#e6127d] transition-colors" 
              title={item.title}
            >
              {item.title}
            </h3>
            <span className="text-[10px] font-mono font-bold text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded shrink-0">
              {aspectRatio > 1.3 ? '16:9' : aspectRatio < 0.8 ? '9:16' : '4:3'}
            </span>
          </div>
          {item.caption && (
            <p className="text-xs text-gray-500 line-clamp-1 leading-relaxed" title={item.caption}>
              {item.caption}
            </p>
          )}
        </div>

        <div className="pt-3.5 mt-auto border-t border-gray-100 flex items-center justify-between gap-2.5">
          <button
            type="button"
            onClick={onOpenEdit}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-gray-50 hover:bg-[#101b4d] text-gray-700 hover:text-white font-bold text-xs border border-gray-200 transition-all duration-200 shadow-2xs"
          >
            <Edit3 className="size-3.5" />
            <span>Edit</span>
          </button>
          <button
            type="button"
            onClick={onOpenDelete}
            className="flex items-center justify-center gap-1.5 py-2.5 px-3.5 rounded-xl bg-red-50 hover:bg-red-600 text-red-600 hover:text-white font-bold text-xs border border-red-100 transition-all duration-200 shadow-2xs"
          >
            <Trash2 className="size-3.5" />
            <span>Delete</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Image Card with Justified Level Rows (Google Photos style) ──────────────
function AdminImageCard({
  item,
  idx,
  onOpenEdit,
  onOpenDelete,
  onPreview,
}: {
  item: GalleryItemType;
  idx: number;
  onOpenEdit: () => void;
  onOpenDelete: () => void;
  onPreview: () => void;
}) {
  const [aspectRatio, setAspectRatio] = useState<number>(4 / 3);

  return (
    <div 
      className="bg-white rounded-3xl border border-gray-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_16px_40px_rgba(230,18,125,0.09)] hover:border-[#e6127d]/40 transition-all duration-300 flex flex-col overflow-hidden group"
      style={{
        flexGrow: Math.max(0.6, Math.min(aspectRatio, 2.4)),
        flexShrink: 1,
        flexBasis: `${Math.round(260 * Math.max(0.65, Math.min(aspectRatio, 2.0)))}px`,
        minWidth: `${Math.max(220, Math.round(260 * Math.min(aspectRatio, 1.2)))}px`,
        maxWidth: '100%',
      }}
    >
      {/* Uniform Row Height Image Container (Google Photos justified style) */}
      <div 
        className="relative w-full h-[260px] overflow-hidden cursor-pointer bg-slate-900 flex items-center justify-center"
        onClick={onPreview}
      >
        <img
          src={item.src}
          alt={item.title}
          onLoad={(e) => {
            const img = e.currentTarget;
            if (img.naturalWidth && img.naturalHeight) {
              setAspectRatio(img.naturalWidth / img.naturalHeight);
            }
          }}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />

        {/* Floating Badges */}
        <div className="absolute top-3.5 left-3.5 z-10 pointer-events-none flex items-center gap-1.5">
          <span className="text-[11px] font-extrabold px-2.5 py-1 rounded-xl bg-black/60 text-white backdrop-blur-md border border-white/10">
            #{idx + 1}
          </span>
          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-lg bg-emerald-600 text-white uppercase tracking-wider shadow-sm">
            Photo
          </span>
        </div>

        <div className="absolute top-3.5 right-3.5 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button 
            type="button"
            onClick={(e) => { e.stopPropagation(); onPreview(); }}
            className="size-8 rounded-xl bg-black/60 hover:bg-[#e6127d] text-white backdrop-blur-md flex items-center justify-center transition-colors border border-white/10"
            title="Zoom Photo"
          >
            <Maximize2 className="size-4" />
          </button>
        </div>

        {/* Hover overlay hint */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3.5 pointer-events-none">
          <span className="text-white text-xs font-semibold drop-shadow-md">
            Click to view full resolution
          </span>
        </div>
      </div>

      {/* Card Info & Actions */}
      <div className="p-5 flex flex-col gap-2.5 bg-white flex-1 justify-between">
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between gap-2">
            <h3 
              onClick={onPreview}
              className="font-heading font-bold text-[#101b4d] text-base leading-snug truncate cursor-pointer hover:text-[#e6127d] transition-colors" 
              title={item.title}
            >
              {item.title}
            </h3>
            <span className="text-[10px] font-mono font-bold text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded shrink-0">
              {aspectRatio > 1.3 ? 'Landscape' : aspectRatio < 0.8 ? 'Portrait' : '1:1'}
            </span>
          </div>
          {item.caption && (
            <p className="text-xs text-gray-500 line-clamp-1 leading-relaxed" title={item.caption}>
              {item.caption}
            </p>
          )}
        </div>

        <div className="pt-3.5 mt-auto border-t border-gray-100 flex items-center justify-between gap-2.5">
          <button
            type="button"
            onClick={onOpenEdit}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-gray-50 hover:bg-[#101b4d] text-gray-700 hover:text-white font-bold text-xs border border-gray-200 transition-all duration-200 shadow-2xs"
          >
            <Edit3 className="size-3.5" />
            <span>Edit</span>
          </button>
          <button
            type="button"
            onClick={onOpenDelete}
            className="flex items-center justify-center gap-1.5 py-2.5 px-3.5 rounded-xl bg-red-50 hover:bg-red-600 text-red-600 hover:text-white font-bold text-xs border border-red-100 transition-all duration-200 shadow-2xs"
          >
            <Trash2 className="size-3.5" />
            <span>Delete</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Admin Gallery Component ────────────────────────────────────────────
export function AdminGalleryClient() {
  const [activeTab, setActiveTab] = useState<"images" | "videos">("images");
  const [images, setImages] = useState<GalleryItemType[]>([]);
  const [videos, setVideos] = useState<GalleryItemType[]>([]);
  const [loading, setLoading] = useState(true);

  // Fullscreen Preview Lightbox
  const [previewItem, setPreviewItem] = useState<GalleryItemType | null>(null);

  // Add Modal State
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [addTitle, setAddTitle] = useState("");
  const [addCaption, setAddCaption] = useState("");
  const [addFile, setAddFile] = useState<File | null>(null);
  const [addFilePreview, setAddFilePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Edit Modal State
  const [editingItem, setEditingItem] = useState<GalleryItemType | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editCaption, setEditCaption] = useState("");
  const [editFile, setEditFile] = useState<File | null>(null);
  const [editFilePreview, setEditFilePreview] = useState<string | null>(null);

  // Delete Modal State
  const [itemToDelete, setItemToDelete] = useState<GalleryItemType | null>(null);

  // Status Feedback Dialog
  const [feedback, setFeedback] = useState<{ open: boolean; type: "success" | "error"; title: string; message: string }>({
    open: false,
    type: "success",
    title: "",
    message: ""
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const editFileInputRef = useRef<HTMLInputElement>(null);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/gallery?_cb=${Date.now()}`, { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setImages(data.images || []);
        setVideos(data.videos || []);
      }
    } catch (err) {
      console.error("Failed to load gallery items", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  // Listen for Escape key and Arrow navigation when fullscreen preview is open
  useEffect(() => {
    if (!previewItem) return;

    const list = previewItem.type === "image" ? images : videos;
    const currentIndex = list.findIndex((it) => it._id === previewItem._id);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setPreviewItem(null);
      } else if (e.key === "ArrowLeft" && currentIndex > 0) {
        setPreviewItem(list[currentIndex - 1]);
      } else if (e.key === "ArrowRight" && currentIndex < list.length - 1) {
        setPreviewItem(list[currentIndex + 1]);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [previewItem, images, videos]);

  // Handle Add File selection
  const handleAddFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 20 * 1024 * 1024) {
      setFeedback({
        open: true,
        type: "error",
        title: "File Too Large",
        message: "The selected file exceeds the 20MB limit. Please choose a smaller file."
      });
      return;
    }

    setAddFile(file);
    const url = URL.createObjectURL(file);
    setAddFilePreview(url);
  };

  // Submit Add
  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addTitle.trim()) {
      alert("Please provide a title");
      return;
    }
    if (!addFile) {
      alert("Please select a file to upload");
      return;
    }

    setIsSubmitting(true);

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result as string;
      try {
        const res = await fetch("/api/admin/gallery", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: activeTab === "images" ? "image" : "video",
            title: addTitle.trim(),
            caption: addCaption.trim(),
            fileBase64: base64,
            mimeType: addFile.type
          })
        });

        if (res.ok) {
          const result = await res.json();
          if (activeTab === "images") {
            setImages(prev => [result.item, ...prev]);
          } else {
            setVideos(prev => [result.item, ...prev]);
          }
          setIsAddOpen(false);
          setAddTitle("");
          setAddCaption("");
          setAddFile(null);
          setAddFilePreview(null);
          setFeedback({
            open: true,
            type: "success",
            title: "Published Successfully",
            message: `The new ${activeTab === "images" ? "photo" : "video"} is now completely live in your gallery.`
          });
        } else {
          const err = await res.json();
          setFeedback({
            open: true,
            type: "error",
            title: "Upload Failed",
            message: err.error || "Failed to upload asset"
          });
        }
      } catch (err) {
        setFeedback({
          open: true,
          type: "error",
          title: "Connection Error",
          message: "An unexpected error occurred during upload."
        });
      } finally {
        setIsSubmitting(false);
      }
    };
    reader.readAsDataURL(addFile);
  };

  // Open Edit Modal
  const handleOpenEdit = (item: GalleryItemType) => {
    setEditingItem(item);
    setEditTitle(item.title);
    setEditCaption(item.caption || "");
    setEditFile(null);
    setEditFilePreview(null);
  };

  // Handle Edit File selection
  const handleEditFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 20 * 1024 * 1024) {
      setFeedback({
        open: true,
        type: "error",
        title: "File Too Large",
        message: "The selected file exceeds the 20MB limit. Please choose a smaller file."
      });
      return;
    }

    setEditFile(file);
    const url = URL.createObjectURL(file);
    setEditFilePreview(url);
  };

  // Submit Edit
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem || !editTitle.trim()) return;

    setIsSubmitting(true);

    const updatePayload = async (base64?: string, mimeType?: string) => {
      try {
        const body: any = {
          id: editingItem._id,
          title: editTitle.trim(),
          caption: editCaption.trim()
        };
        if (base64 && mimeType) {
          body.fileBase64 = base64;
          body.mimeType = mimeType;
        }

        const res = await fetch("/api/admin/gallery", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body)
        });

        if (res.ok) {
          const result = await res.json();
          const updated = result.item;
          if (editingItem.type === "image") {
            setImages(prev => prev.map(it => it._id === updated._id ? updated : it));
          } else {
            setVideos(prev => prev.map(it => it._id === updated._id ? updated : it));
          }
          setEditingItem(null);
          setFeedback({
            open: true,
            type: "success",
            title: "Saved Successfully",
            message: "Asset details have been updated."
          });
        } else {
          const err = await res.json();
          setFeedback({
            open: true,
            type: "error",
            title: "Update Failed",
            message: err.error || "Failed to update item"
          });
        }
      } catch (err) {
        setFeedback({
          open: true,
          type: "error",
          title: "Connection Error",
          message: "An unexpected error occurred during update."
        });
      } finally {
        setIsSubmitting(false);
      }
    };

    if (editFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updatePayload(reader.result as string, editFile.type);
      };
      reader.readAsDataURL(editFile);
    } else {
      updatePayload();
    }
  };

  // Delete Action
  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return;
    const target = itemToDelete;
    setItemToDelete(null);

    try {
      const res = await fetch(`/api/admin/gallery?id=${target._id}`, {
        method: "DELETE"
      });

      if (res.ok) {
        if (target.type === "image") {
          setImages(prev => prev.filter(it => it._id !== target._id));
        } else {
          setVideos(prev => prev.filter(it => it._id !== target._id));
        }
        setFeedback({
          open: true,
          type: "success",
          title: "Deleted",
          message: `"${target.title}" was removed from the gallery.`
        });
      } else {
        setFeedback({
          open: true,
          type: "error",
          title: "Delete Failed",
          message: "Could not delete this gallery item. Please try again."
        });
      }
    } catch (err) {
      setFeedback({
        open: true,
        type: "error",
        title: "Connection Error",
        message: "An unexpected error occurred while deleting."
      });
    }
  };

  if (loading) {
    return (
      <div className="flex-1 w-full h-full flex items-center justify-center min-h-[450px]">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-12 w-12 border-3 border-[#e6127d] border-t-transparent"></div>
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Loading Studio...</span>
        </div>
      </div>
    );
  }

  const currentList = activeTab === "images" ? images : videos;

  return (
    <div className="flex flex-col gap-8 pb-16 max-w-7xl mx-auto select-none">
      {/* Top Banner & Action Area */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-200/80 shadow-[0_4px_24px_rgba(0,0,0,0.03)] flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-gradient-to-r from-pink-500/10 to-rose-500/10 text-[#e6127d] border border-[#e6127d]/20">
              <Sparkles className="size-3" />
              Gallery Studio
            </span>
            <span className="text-xs font-semibold text-gray-400">
              • {images.length} Photos &amp; {videos.length} Videos
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-heading font-extrabold text-[#101b4d] tracking-tight">
            Gallery Media Manager
          </h1>
          <p className="text-gray-500 text-sm max-w-2xl leading-relaxed">
            Curate, edit, and publish high-definition photos and videos to your public gallery. 
            All items are displayed in full visual detail with zero cropping.
          </p>
        </div>

        {/* Tab & Action Controls */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Segmented Tab Pill */}
          <div className="inline-flex bg-gray-100/90 rounded-2xl p-1.5 border border-gray-200/60 shadow-inner">
            <button
              onClick={() => setActiveTab("images")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs transition-all duration-200 ${
                activeTab === "images" 
                  ? "bg-white text-[#101b4d] shadow-sm font-extrabold" 
                  : "text-gray-500 hover:text-[#101b4d]"
              }`}
            >
              <Camera className={`size-4 ${activeTab === "images" ? "text-[#e6127d]" : "text-gray-400"}`} />
              <span>Photos ({images.length})</span>
            </button>
            <button
              onClick={() => setActiveTab("videos")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs transition-all duration-200 ${
                activeTab === "videos" 
                  ? "bg-white text-[#101b4d] shadow-sm font-extrabold" 
                  : "text-gray-500 hover:text-[#101b4d]"
              }`}
            >
              <Film className={`size-4 ${activeTab === "videos" ? "text-[#e6127d]" : "text-gray-400"}`} />
              <span>Videos ({videos.length})</span>
            </button>
          </div>

          {/* Add Button */}
          <Button
            onClick={() => {
              setAddTitle("");
              setAddCaption("");
              setAddFile(null);
              setAddFilePreview(null);
              setIsAddOpen(true);
            }}
            className="bg-gradient-to-r from-[#e6127d] to-[#d40f70] hover:from-[#c90d6b] hover:to-[#be0c65] text-white font-bold text-xs rounded-2xl h-11 px-5 shadow-md shadow-[#e6127d]/25 transition-all hover:scale-[1.02] active:scale-95 flex items-center gap-2"
          >
            <Plus className="size-4" />
            <span>Add {activeTab === "images" ? "Photo" : "Video"}</span>
          </Button>
        </div>
      </div>

      {/* Grid Status Header */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-[#101b4d]">
            {activeTab === "images" ? "Gallery Photos" : "Gallery Videos"}
          </span>
          <span className="text-xs font-semibold text-gray-500 bg-white px-2.5 py-0.5 rounded-full border border-gray-200 shadow-2xs">
            {currentList.length} items
          </span>
        </div>
        <span className="text-xs text-gray-400 font-medium hidden sm:inline">
          Justified Level Rows • Auto-Scaled Proportions • 100% Visual Detail
        </span>
      </div>

      {/* Media Cards Grid - Masonry natural height layout (100% visual, zero cropping) */}
      {currentList.length === 0 ? (
        <div className="bg-white border-2 border-dashed border-gray-200 rounded-3xl p-16 text-center flex flex-col items-center justify-center gap-4">
          <div className="size-16 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 shadow-inner">
            {activeTab === "images" ? <Camera className="size-8 text-gray-300" /> : <Film className="size-8 text-gray-300" />}
          </div>
          <div className="flex flex-col gap-1">
            <h3 className="font-bold text-[#101b4d] text-lg">No {activeTab} yet</h3>
            <p className="text-gray-400 text-xs max-w-sm">
              Upload your first {activeTab === "images" ? "photo" : "video"} to showcase on the public gallery.
            </p>
          </div>
          <Button
            onClick={() => setIsAddOpen(true)}
            className="bg-[#e6127d] hover:bg-[#c90d6b] text-white font-bold text-xs rounded-xl px-5 py-2.5 shadow-sm mt-2"
          >
            <Plus className="size-4 mr-1.5" /> Add New {activeTab === "images" ? "Photo" : "Video"}
          </Button>
        </div>
      ) : (
        <div className="flex flex-wrap gap-6 items-stretch">
          {currentList.map((item, idx) => (
            activeTab === "images" ? (
              <AdminImageCard
                key={item._id}
                item={item}
                idx={idx}
                onOpenEdit={() => handleOpenEdit(item)}
                onOpenDelete={() => setItemToDelete(item)}
                onPreview={() => setPreviewItem(item)}
              />
            ) : (
              <AdminVideoCard
                key={item._id}
                item={item}
                idx={idx}
                onOpenEdit={() => handleOpenEdit(item)}
                onOpenDelete={() => setItemToDelete(item)}
                onPreview={() => setPreviewItem(item)}
              />
            )
          ))}
          {/* Spacer to prevent solitary last-row cards from expanding across 100% width */}
          <div className="flex-grow-[10] h-0 min-w-0" />
        </div>
      )}

      {/* FULLSCREEN PREVIEW LIGHTBOX (Supports ESC key, Arrow keys, backdrop click to close) */}
      {previewItem && (
        <div 
          className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center p-4 md:p-8 animate-in fade-in duration-200 cursor-zoom-out"
          onClick={() => setPreviewItem(null)}
        >
          {/* Top Bar with ESC Hint & Close Button */}
          <div className="absolute top-6 right-6 z-30 flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
            <span className="hidden sm:inline-flex items-center gap-1.5 text-xs text-white/70 bg-white/10 px-3 py-1.5 rounded-full border border-white/15 backdrop-blur-md font-medium">
              <kbd className="font-mono font-bold bg-white/20 px-1.5 py-0.5 rounded text-[11px] text-white">ESC</kbd> to exit
            </span>
            <button 
              onClick={() => setPreviewItem(null)}
              className="size-11 rounded-full bg-white/10 hover:bg-[#e6127d] text-white flex items-center justify-center backdrop-blur-md transition-all border border-white/20 hover:scale-105 active:scale-95"
              title="Close (ESC)"
            >
              <X className="size-5" />
            </button>
          </div>

          {/* Left / Right Arrow Navigation */}
          {(() => {
            const list = previewItem.type === "image" ? images : videos;
            const currentIndex = list.findIndex((it) => it._id === previewItem._id);
            return (
              <>
                {currentIndex > 0 && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setPreviewItem(list[currentIndex - 1]);
                    }}
                    className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-30 size-12 rounded-full bg-white/10 hover:bg-[#e6127d] text-white flex items-center justify-center backdrop-blur-md transition-all border border-white/20 hover:scale-110 active:scale-95"
                    title="Previous (Left Arrow)"
                  >
                    <ChevronLeft className="size-6" />
                  </button>
                )}
                {currentIndex < list.length - 1 && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setPreviewItem(list[currentIndex + 1]);
                    }}
                    className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-30 size-12 rounded-full bg-white/10 hover:bg-[#e6127d] text-white flex items-center justify-center backdrop-blur-md transition-all border border-white/20 hover:scale-110 active:scale-95"
                    title="Next (Right Arrow)"
                  >
                    <ChevronRight className="size-6" />
                  </button>
                )}
              </>
            );
          })()}

          {/* Media Content Area */}
          <div 
            className="relative max-w-5xl max-h-[80vh] w-full flex items-center justify-center cursor-default"
            onClick={(e) => e.stopPropagation()}
          >
            {previewItem.type === "image" ? (
              <img 
                src={previewItem.src} 
                alt={previewItem.title} 
                className="max-h-[75vh] max-w-full object-contain rounded-2xl shadow-2xl"
              />
            ) : (
              <video 
                src={previewItem.src} 
                controls 
                autoPlay 
                playsInline
                className="max-h-[75vh] max-w-full object-contain rounded-2xl shadow-2xl bg-black"
              />
            )}
          </div>

          {/* Title & Caption */}
          <div 
            className="mt-4 text-center text-white max-w-xl cursor-default"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold font-heading">{previewItem.title}</h2>
            {previewItem.caption && <p className="text-sm text-gray-400 mt-1">{previewItem.caption}</p>}
          </div>
        </div>
      )}

      {/* ADD MODAL */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="bg-white rounded-3xl max-w-lg p-6 sm:p-8 shadow-2xl border-0 z-[100]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-heading font-bold text-[#101b4d]">
              Add New {activeTab === "images" ? "Gallery Photo" : "Gallery Video"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleAddSubmit} className="flex flex-col gap-4 mt-2">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-gray-700">Title *</label>
              <input 
                type="text"
                required
                value={addTitle}
                onChange={e => setAddTitle(e.target.value)}
                placeholder="e.g. Joyful Moments"
                className="px-4 py-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-[#e6127d] transition-colors"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-gray-700">Caption (Optional)</label>
              <input 
                type="text"
                value={addCaption}
                onChange={e => setAddCaption(e.target.value)}
                placeholder="e.g. Pure happiness in every scoop"
                className="px-4 py-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-[#e6127d] transition-colors"
              />
            </div>

            {/* File Selector */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-gray-700">
                Media File * (Max 20MB)
              </label>

              <input 
                type="file"
                ref={fileInputRef}
                onChange={handleAddFileSelect}
                accept={activeTab === "images" ? "image/png, image/jpeg, image/webp" : "video/mp4, video/webm, video/ogg"}
                className="hidden"
              />

              {!addFile ? (
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-200 hover:border-[#e6127d] rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all bg-gray-50/50 hover:bg-pink-50/20"
                >
                  <Upload className="size-8 text-[#e6127d] mb-2" />
                  <p className="text-xs font-bold text-gray-800">Click to upload {activeTab === "images" ? "a photo" : "a video"}</p>
                  <p className="text-[11px] text-gray-400 mt-1">
                    {activeTab === "images" ? "PNG, JPG, WebP up to 20MB" : "MP4, WebM, OGG up to 20MB"}
                  </p>
                </div>
              ) : (
                <div className="relative rounded-2xl border border-gray-200 overflow-hidden bg-black p-3 flex flex-col items-center">
                  {activeTab === "images" ? (
                    <img src={addFilePreview || ""} alt="Preview" className="max-h-48 rounded-xl object-contain" />
                  ) : (
                    <video src={addFilePreview || ""} controls className="max-h-48 rounded-xl object-contain" />
                  )}
                  <div className="w-full flex items-center justify-between pt-3 px-1 text-white text-xs">
                    <span className="truncate max-w-[220px]">{addFile.name} ({(addFile.size / (1024 * 1024)).toFixed(1)} MB)</span>
                    <button 
                      type="button" 
                      onClick={() => { setAddFile(null); setAddFilePreview(null); }}
                      className="text-pink-400 hover:text-pink-300 font-bold ml-2 underline"
                    >
                      Change File
                    </button>
                  </div>
                </div>
              )}
            </div>

            <DialogFooter className="mt-4 flex flex-row items-center justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAddOpen(false)}
                className="rounded-xl px-5 py-2.5 text-xs font-semibold border-gray-200"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || !addFile || !addTitle.trim()}
                className="bg-[#e6127d] hover:bg-[#c90d6b] text-white font-bold text-xs rounded-xl px-6 py-2.5 shadow-md shadow-[#e6127d]/20"
              >
                {isSubmitting ? <RefreshCcw className="size-3.5 animate-spin mr-1.5" /> : <Plus className="size-3.5 mr-1.5" />}
                {isSubmitting ? "Uploading..." : "Upload & Publish"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* EDIT MODAL */}
      <Dialog open={!!editingItem} onOpenChange={open => !open && setEditingItem(null)}>
        <DialogContent className="bg-white rounded-3xl max-w-lg p-6 sm:p-8 shadow-2xl border-0 z-[100]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-heading font-bold text-[#101b4d]">
              Edit Gallery {editingItem?.type === "image" ? "Photo" : "Video"}
            </DialogTitle>
          </DialogHeader>

          {editingItem && (
            <form onSubmit={handleEditSubmit} className="flex flex-col gap-4 mt-2">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-700">Title *</label>
                <input 
                  type="text"
                  required
                  value={editTitle}
                  onChange={e => setEditTitle(e.target.value)}
                  className="px-4 py-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-[#e6127d] transition-colors"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-700">Caption</label>
                <input 
                  type="text"
                  value={editCaption}
                  onChange={e => setEditCaption(e.target.value)}
                  className="px-4 py-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-[#e6127d] transition-colors"
                />
              </div>

              {/* Replace Media File */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-700">
                  Replace File (Optional, max 20MB)
                </label>

                <input 
                  type="file"
                  ref={editFileInputRef}
                  onChange={handleEditFileSelect}
                  accept={editingItem.type === "image" ? "image/png, image/jpeg, image/webp" : "video/mp4, video/webm, video/ogg"}
                  className="hidden"
                />

                <div className="relative rounded-2xl border border-gray-200 overflow-hidden bg-black p-3 flex flex-col items-center">
                  {editFilePreview ? (
                    editingItem.type === "image" ? (
                      <img src={editFilePreview} alt="New Preview" className="max-h-44 rounded-xl object-contain" />
                    ) : (
                      <video src={editFilePreview} controls className="max-h-44 rounded-xl object-contain" />
                    )
                  ) : (
                    editingItem.type === "image" ? (
                      <img src={editingItem.src} alt="Current" className="max-h-44 rounded-xl object-contain" />
                    ) : (
                      <video src={editingItem.src} controls className="max-h-44 rounded-xl object-contain" />
                    )
                  )}

                  <div className="w-full flex items-center justify-between pt-3 px-1 text-white text-xs">
                    <span className="truncate max-w-[220px]">
                      {editFile ? `New: ${editFile.name}` : "Current Asset"}
                    </span>
                    <button 
                      type="button" 
                      onClick={() => editFileInputRef.current?.click()}
                      className="text-pink-400 hover:text-white font-bold ml-2 underline"
                    >
                      {editFile ? "Choose Different" : "Choose New File"}
                    </button>
                  </div>
                </div>
              </div>

              <DialogFooter className="mt-4 flex flex-row items-center justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditingItem(null)}
                  className="rounded-xl px-5 py-2.5 text-xs font-semibold border-gray-200"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting || !editTitle.trim()}
                  className="bg-[#101b4d] hover:bg-[#1a2b75] text-white font-bold text-xs rounded-xl px-6 py-2.5 shadow-sm"
                >
                  {isSubmitting ? <RefreshCcw className="size-3.5 animate-spin mr-1.5" /> : null}
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* DELETE CONFIRMATION DIALOG - Exactly matches requested Sign Out modal style */}
      <AlertDialog open={!!itemToDelete} onOpenChange={open => !open && setItemToDelete(null)}>
        <AlertDialogContent className="bg-white rounded-3xl p-8 max-w-sm shadow-2xl border border-red-100 flex flex-col items-center justify-center text-center z-[110]">
          <AlertDialogHeader className="flex flex-col items-center space-y-4 w-full">
            <AlertDialogTitle className="text-2xl font-heading font-bold text-red-600 text-center w-full">
              Delete {itemToDelete?.type === "image" ? "Photo" : "Video"}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-[15px] text-gray-500 leading-relaxed text-center w-full">
              Are you sure you want to delete <strong className="text-gray-900 font-bold">&quot;{itemToDelete?.title}&quot;</strong>? This item will be permanently removed from the gallery.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="!m-0 !p-0 !bg-transparent border-none mt-8 flex flex-row items-center justify-center gap-4 w-full sm:justify-center">
            <AlertDialogCancel 
              onClick={() => setItemToDelete(null)}
              className="mt-0 rounded-full px-8 py-3 text-sm font-bold border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteConfirm}
              className="rounded-full px-8 py-3 text-sm font-bold bg-red-600 hover:bg-red-700 text-white border-0 transition-colors shadow-md"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* STATUS FEEDBACK DIALOG */}
      <AlertDialog open={feedback.open} onOpenChange={open => setFeedback(prev => ({ ...prev, open }))}>
        <AlertDialogContent className="bg-white rounded-3xl p-0 max-w-md shadow-2xl border-0 overflow-hidden z-[100]">
          <div className={`h-2 w-full ${feedback.type === 'success' ? 'bg-emerald-500' : 'bg-red-500'}`} />
          <div className="p-6 sm:p-8">
            <AlertDialogHeader className="flex flex-col items-center sm:items-start w-full">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 w-full">
                <div className={`size-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm border ${feedback.type === 'success' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-red-50 text-red-600 border-red-100'}`}>
                  {feedback.type === 'success' ? (
                    <CheckCircle2 className="size-6" />
                  ) : (
                    <AlertCircle className="size-6" />
                  )}
                </div>
                <div className="flex flex-col gap-1 text-center sm:text-left">
                  <AlertDialogTitle className="text-xl font-heading font-bold text-[#101b4d]">
                    {feedback.title}
                  </AlertDialogTitle>
                  <AlertDialogDescription className="text-sm text-gray-500 leading-relaxed">
                    {feedback.message}
                  </AlertDialogDescription>
                </div>
              </div>
            </AlertDialogHeader>
            <AlertDialogFooter className="!m-0 !p-0 !bg-transparent border-none mt-6 flex flex-row items-center justify-center sm:justify-end w-full">
              <AlertDialogAction 
                onClick={() => setFeedback(prev => ({ ...prev, open: false }))}
                className="rounded-xl px-7 py-2.5 text-xs font-bold text-white border-0 transition-all shadow-md bg-[#101b4d] hover:bg-[#1a2b75]"
              >
                Got it
              </AlertDialogAction>
            </AlertDialogFooter>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
