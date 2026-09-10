"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { X, ChevronLeft, ChevronRight, Play, ZoomIn, Camera, Film } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

// â”€â”€â”€ Data â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const IMAGES = [
  { id: 1,  key: "gallery-img-1",  src: "/gallary/eating image.jpeg",          title: "Joyful Moments",       caption: "Pure happiness in every scoop"      },
  { id: 2,  key: "gallery-img-2",  src: "/gallary/hand-cup image.jpeg",         title: "Handcrafted Delight",  caption: "Served with love and care"          },
  { id: 3,  key: "gallery-img-3",  src: "/gallary/style.jpeg",                  title: "Styled to Perfection", caption: "Where art meets flavour"            },
  { id: 4,  key: "gallery-img-4",  src: "/gallary/tri icecream with love.jpeg", title: "Triple Treat",         caption: "Three scoops, infinite smiles"      },
  { id: 5,  key: "gallery-img-5",  src: "/images/occasion-birthday.jpg",        title: "Birthday Celebrations",caption: "Make every birthday sweeter"       },
  { id: 6,  key: "gallery-img-6",  src: "/images/occasion-wedding.jpg",         title: "Wedding Bliss",        caption: "Sweeten your special day"          },
  { id: 7,  key: "gallery-img-7",  src: "/images/occasion-anniversary.jpg",     title: "Anniversary Love",     caption: "Celebrate milestones with us"      },
  { id: 8,  key: "gallery-img-8",  src: "/images/occasion-festival.jpg",        title: "Festival Vibes",       caption: "Every festival deserves a treat"   },
  { id: 9,  key: "gallery-img-9",  src: "/images/occasion-houseparty.jpg",      title: "House Party Fun",      caption: "Share the sweetness"               },
  { id: 10, key: "gallery-img-10", src: "/images/store-interior-br.jpg",        title: "Our Store",            caption: "Step into a world of flavours"     },
  { id: 11, key: "gallery-img-11", src: "/images/sundae-deliciousness.png",     title: "Sundae Special",       caption: "The classic, perfected"            },
  { id: 12, key: "gallery-img-12", src: "/images/occasion-corporate.jpg",       title: "Corporate Events",     caption: "Premium treats for every occasion" },
];


const VIDEOS = [
  { id: 1, key: "gallery-vid-1", src: "/gallary/br.mp4", title: "Baskin Robbins Experience", caption: "Relive the magic" },
  { id: 2, key: "gallery-vid-2", src: "/gallary/entry.mp4", title: "Grand Entry", caption: "A spectacle worth watching" },
  { id: 3, key: "gallery-vid-3", src: "/gallary/advatisement.mp4", title: "Our Advertisement", caption: "Taste the story" },
  { id: 4, key: "gallery-vid-4", src: "/gallary/ingrients.mp4", title: "Premium Ingredients", caption: "Only the finest go in" },
  { id: 5, key: "gallery-vid-5", src: "/gallary/milky ice cream.mp4", title: "Milky Ice Cream", caption: "Creaminess, redefined" },
  { id: 6, key: "gallery-vid-6", src: "/gallary/scoope.mp4", title: "The Perfect Scoop", caption: "Art in every serving" },
  { id: 7, key: "gallery-vid-7", src: "/gallary/straw.mp4", title: "Sip & Enjoy", caption: "Refreshingly delicious" },
  { id: 8, key: "gallery-vid-8", src: "/gallary/videp.mp4", title: "Cresta Moments", caption: "Memories we cherish" },
];

// â”€â”€â”€ Lightbox â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

type MediaItem = { type: "image" | "video"; src: string; title: string; caption: string; index: number };

function Lightbox({ item, total, onClose, onPrev, onNext }: {
  item: MediaItem; total: number; onClose: () => void; onPrev: () => void; onNext: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose, onPrev, onNext]);

  useEffect(() => { if (videoRef.current) videoRef.current.load(); }, [item.src]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[300] flex items-center justify-center p-4 md:p-10"
    >
      <div className="absolute inset-0 bg-black/92 backdrop-blur-xl" onClick={onClose} />
      <motion.div
        key={item.src}
        initial={{ scale: 0.88, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.88, opacity: 0 }}
        transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="relative z-10 w-full max-w-5xl rounded-3xl overflow-hidden shadow-[0_40px_120px_rgba(230,18,125,0.35)]"
      >
        <button onClick={onClose} className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-white/10 hover:bg-[#e6127d] text-white backdrop-blur-md border border-white/20 flex items-center justify-center transition-all duration-200 hover:scale-110">
          <X className="size-5" />
        </button>
        <div className="relative w-full bg-black" style={{ aspectRatio: "16/9" }}>
          {item.type === "image" ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={item.src} alt={item.title} className="w-full h-full object-contain" />
          ) : (
            <video ref={videoRef} src={item.src} controls autoPlay playsInline className="w-full h-full object-contain" />
          )}
          <button onClick={(e) => { e.stopPropagation(); onPrev(); }} className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-[#e6127d] text-white backdrop-blur-md border border-white/20 flex items-center justify-center transition-all duration-200 hover:scale-110">
            <ChevronLeft className="size-6" />
          </button>
          <button onClick={(e) => { e.stopPropagation(); onNext(); }} className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-[#e6127d] text-white backdrop-blur-md border border-white/20 flex items-center justify-center transition-all duration-200 hover:scale-110">
            <ChevronRight className="size-6" />
          </button>
        </div>
        <div className="px-6 py-4 bg-[#111] border-t border-white/10 flex items-center justify-between">
          <div>
            <p className="text-white font-bold text-base">{item.title}</p>
            <p className="text-white/50 text-sm">{item.caption}</p>
          </div>
          <span className="text-white/30 text-sm font-mono">{item.index + 1} / {total}</span>
        </div>
      </motion.div>
    </motion.div>
  );
}

// â”€â”€â”€ Video Card â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function VideoCard({ video, index, onOpen }: {
  video: typeof VIDEOS[number]; index: number; onOpen: (i: number) => void;
}) {
  const [hovered, setHovered] = useState(false);
  const ref = useRef<HTMLVideoElement>(null);
  const enter = () => { setHovered(true); ref.current?.play().catch(() => {}); };
  const leave = () => {
    setHovered(false);
    if (ref.current) { ref.current.pause(); ref.current.currentTime = 0; }
  };
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.45, delay: (index % 4) * 0.07 }}
      onClick={() => onOpen(index)}
      onMouseEnter={enter}
      onMouseLeave={leave}
      className="relative overflow-hidden rounded-2xl cursor-pointer group bg-black aspect-video"
    >
      <video ref={ref} src={video.src} muted loop playsInline preload="metadata"
        className={`w-full h-full object-cover transition-all duration-500 ${hovered ? "scale-105 opacity-100" : "opacity-70"}`}
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className={`w-16 h-16 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
          hovered ? "bg-[#e6127d] border-[#e6127d] scale-110 shadow-[0_0_32px_rgba(230,18,125,0.7)]" : "bg-white/10 border-white/40 backdrop-blur-md"
        }`}>
          <Play className="size-7 text-white fill-white ml-1" />
        </div>
      </div>
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 to-transparent p-4">
        <div className="flex items-center gap-2 mb-1">
          <Film className="size-3.5 text-[#e6127d]" />
          <span className="text-[#e6127d] text-[10px] font-bold uppercase tracking-widest">Video</span>
        </div>
        <p className="text-white font-bold text-[15px] leading-tight">{video.title}</p>
        <p className="text-white/60 text-xs mt-0.5">{video.caption}</p>
      </div>
      <div className={`absolute inset-0 rounded-2xl border-2 transition-colors duration-300 ${hovered ? "border-[#e6127d]/60" : "border-transparent"}`} />
    </motion.div>
  );
}

// â”€â”€â”€ Page â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export default function GalleryPage() {
  const [tab, setTab] = useState<"images" | "videos">("images");
  const [lightbox, setLightbox] = useState<MediaItem | null>(null);

  const [itemsImages, setItemsImages] = useState<any[]>(IMAGES);
  const [itemsVideos, setItemsVideos] = useState<any[]>(VIDEOS);

  const loadGallery = useCallback(() => {
    fetch(`/api/gallery?_cb=${Date.now()}`, { cache: "no-store" })
      .then(res => res.json())
      .then(data => {
        if (data.images && Array.isArray(data.images) && data.images.length > 0) {
          setItemsImages(data.images.map((img: any, i: number) => ({
            id: img._id || i + 1,
            src: img.src,
            title: img.title,
            caption: img.caption || "",
          })));
        }
        if (data.videos && Array.isArray(data.videos) && data.videos.length > 0) {
          setItemsVideos(data.videos.map((vid: any, i: number) => ({
            id: vid._id || i + 1,
            src: vid.src,
            title: vid.title,
            caption: vid.caption || "",
          })));
        }
      })
      .catch((err) => {
        console.error("Failed to load gallery items", err);
      });
  }, []);

  useEffect(() => {
    loadGallery();

    const onFocus = () => loadGallery();
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [loadGallery]);

  const openImage = useCallback((i: number) => {
    const img = itemsImages[i];
    setLightbox({ type: "image", src: img.src, title: img.title, caption: img.caption, index: i });
  }, [itemsImages]);

  const openVideo = useCallback((i: number) => {
    const vid = itemsVideos[i];
    setLightbox({ type: "video", src: vid.src, title: vid.title, caption: vid.caption, index: i });
  }, [itemsVideos]);

  const close = useCallback(() => setLightbox(null), []);

  const prev = useCallback(() => {
    if (!lightbox) return;
    const items = lightbox.type === "image" ? itemsImages : itemsVideos;
    const ni = (lightbox.index - 1 + items.length) % items.length;
    const it = items[ni];
    setLightbox({ type: lightbox.type, src: it.src, title: it.title, caption: it.caption, index: ni });
  }, [lightbox, itemsImages, itemsVideos]);

  const next = useCallback(() => {
    if (!lightbox) return;
    const items = lightbox.type === "image" ? itemsImages : itemsVideos;
    const ni = (lightbox.index + 1) % items.length;
    const it = items[ni];
    setLightbox({ type: lightbox.type, src: it.src, title: it.title, caption: it.caption, index: ni });
  }, [lightbox, itemsImages, itemsVideos]);

  useEffect(() => {
    document.body.style.overflow = lightbox ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [lightbox]);

  return (
    <div className="min-h-screen bg-[#faf8f9] overflow-hidden">

      {/* â”€â”€ Hero â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <section className="relative pt-28 pb-10 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#fce7f3] via-[#fef6fb] to-[#faf8f9]" />
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[420px] bg-[#e6127d]/10 rounded-full blur-[90px]" />

        <div className="relative z-10 max-w-3xl mx-auto px-6">
          <motion.span
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#e6127d]/25 text-[#e6127d] text-xs font-semibold uppercase tracking-widest shadow-sm mb-6"
          >
            <Camera className="size-3.5" /> Visual Showcase
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            className="text-5xl md:text-6xl font-extrabold text-[#1a1a2e] leading-tight mb-4"
          >
            Our{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#e6127d] to-[#f472b6]">
              Gallery
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="text-[#6b7280] text-lg leading-relaxed max-w-xl mx-auto"
          >
            Explore moments of joy â€” flavours, celebrations, and the smiles that make every scoop worthwhile.
          </motion.p>

          {/* Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.22 }}
            className="flex justify-center mt-8"
          >
            <div className="inline-flex bg-white rounded-2xl p-1.5 shadow-lg border border-gray-100 gap-1">
              {(["images", "videos"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`relative flex items-center gap-2.5 px-7 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 ${
                    tab === t ? "text-white" : "text-gray-400 hover:text-[#e6127d]"
                  }`}
                >
                  {tab === t && (
                    <motion.div
                      layoutId="galleryTab"
                      className="absolute inset-0 bg-gradient-to-r from-[#e6127d] to-[#f472b6] rounded-xl shadow-md"
                      transition={{ type: "spring", bounce: 0.22, duration: 0.5 }}
                    />
                  )}
                  <span className="relative z-10">
                    {t === "images" ? <Camera className="size-4" /> : <Film className="size-4" />}
                  </span>
                  <span className="relative z-10 capitalize">{t}</span>
                  <span className={`relative z-10 px-2 py-0.5 rounded-full text-xs font-bold ${
                    tab === t ? "bg-white/25 text-white" : "bg-gray-100 text-gray-400"
                  }`}>
                    {t === "images" ? IMAGES.length : VIDEOS.length}
                  </span>
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* â”€â”€ Gallery Grid â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 pb-28">
        <AnimatePresence mode="wait">
          {tab === "images" ? (
            <motion.div
              key="images"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* CSS columns masonry — images show at full natural height, no cropping */}
              <div
                style={{
                  columnCount: 3,
                  columnGap: "16px",
                }}
              >
                {itemsImages.map((img, i) => (
                  <motion.div
                    key={img.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.05 }}
                    onClick={() => openImage(i)}
                    className="relative overflow-hidden rounded-2xl cursor-pointer group mb-4"
                    style={{ breakInside: "avoid" }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={img.src}
                      alt={img.title}
                      className="w-full h-auto block transition-transform duration-700 group-hover:scale-105"
                      style={{ display: "block" }}
                    />
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />
                    {/* Zoom icon */}
                    <div className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/15 backdrop-blur-sm border border-white/30 flex items-center justify-center opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all duration-300">
                      <ZoomIn className="size-4 text-white" />
                    </div>
                    {/* Caption */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-400">
                      <p className="text-white font-bold text-[15px] drop-shadow-lg">{img.title}</p>
                      <p className="text-white/70 text-sm mt-0.5">{img.caption}</p>
                    </div>
                    {/* Pink border glow */}
                    <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-[#e6127d]/50 transition-colors duration-400" />
                  </motion.div>
                ))}
              </div>
            </motion.div>

          ) : (
            <motion.div
              key="videos"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
            >
              {itemsVideos.map((vid, i) => (
                <VideoCard key={vid.id} video={vid} index={i} onOpen={openVideo} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <Lightbox
            item={lightbox}
            total={lightbox.type === "image" ? itemsImages.length : itemsVideos.length}
            onClose={close}
            onPrev={prev}
            onNext={next}
          />
        )}
      </AnimatePresence>

    </div>
  );
}
