"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { X, ChevronLeft, ChevronRight, Play, ZoomIn, Camera, Film, Pause } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

const IMAGES = [
  { id: 1,  src: "/images/occasion-anniversary.jpg",                        title: "Anniversary Love",         caption: "Celebrate milestones with us"            },
  { id: 2,  src: "/images/occasion-festival.jpg",                           title: "Festival Vibes",           caption: "Every festival deserves a treat"         },
  { id: 3,  src: "/images/occasion-houseparty.jpg",                         title: "House Party Fun",          caption: "Share the sweetness"                     },
  { id: 4,  src: "/images/store-interior-br.jpg",                           title: "Our Store",                caption: "Step into a world of flavours"           },
  { id: 5,  src: "/images/occasion-corporate.jpg",                          title: "Corporate Events",         caption: "Premium treats for every occasion"       },
  { id: 6,  src: "/1IMGSSS/2.jpeg",                                         title: "Chocolate Almond Brownie", caption: "Rich brownie with dark chocolate drizzle" },
  { id: 7,  src: "/1IMGSSS/3.jpeg",                                         title: "Mango Fruit Sundae",       caption: "Tropical fruits meet mango ice cream"    },
  { id: 8,  src: "/1IMGSSS/4.jpeg",                                         title: "Vanilla Nuts Sundae",      caption: "Creamy vanilla with roasted nut toppings"},
  { id: 9,  src: "/1IMGSSS/4K_HD_AND_NO_TEXT_2K_20260916182751.jpeg",       title: "Classic Brownie Sundae",   caption: "Caramel drizzle on a chocolate brownie"  },
  { id: 10, src: "/1IMGSSS/4K_HD_AND_NO_TEXT_2K_20260916182841.jpeg",       title: "Berry Banana Fruit Cream", caption: "Strawberry, banana and tropical bliss"   },
  { id: 11, src: "/images/shop-cakes.jpg",                                  title: "Chocolate Indulgence",     caption: "Decadent layered chocolate cake slice"   },
  { id: 12, src: "/images/occasion-birthday.jpg",                           title: "Birthday Celebrations",    caption: "Make every birthday sweeter with us"     },
  { id: 13, src: "/images/occasion-wedding.jpg",                            title: "Wedding Bliss",            caption: "Sweeten your most special day"           },
];

const VIDEOS = [
  { id: 1, src: "/gallary/br.mp4",              title: "Baskin Robbins Experience", caption: "Relive the magic"            },
  { id: 2, src: "/gallary/entry.mp4",           title: "Grand Entry",               caption: "A spectacle worth watching" },
  { id: 3, src: "/gallary/advatisement.mp4",    title: "Our Advertisement",         caption: "Taste the story"            },
  { id: 4, src: "/gallary/ingrients.mp4",       title: "Premium Ingredients",       caption: "Only the finest go in"      },
  { id: 5, src: "/9.mp4",                       title: "Special Treat",             caption: "Crafted for pure happiness" },
  { id: 6, src: "/gallary/milky ice cream.mp4", title: "Milky Ice Cream",           caption: "Creaminess, redefined"      },
  { id: 7, src: "/gallary/scoope.mp4",          title: "The Perfect Scoop",         caption: "Art in every serving"       },
  { id: 8, src: "/gallary/straw.mp4",           title: "Sip & Enjoy",               caption: "Refreshingly delicious"     },
  { id: 9, src: "/gallary/videp.mp4",           title: "Cresta Moments",            caption: "Memories we cherish"        },
];

// ─── Cinematic Slider ─────────────────────────────────────────────────────────
function CinematicSlider({ images, onOpen }: { images: typeof IMAGES; onOpen?: (index: number) => void }) {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const [dir, setDir] = useState<1 | -1>(1);
  const thumbRef = useRef<HTMLDivElement>(null);
  const len = images.length;

  const goTo = useCallback((idx: number, d: 1 | -1 = 1) => {
    setDir(d);
    setCurrent((idx + len) % len);
  }, [len]);
  const goPrev = useCallback(() => goTo(current - 1, -1), [current, goTo]);
  const goNext = useCallback(() => goTo(current + 1, 1), [current, goTo]);

  // auto-play
  useEffect(() => {
    if (paused) return;
    const t = setInterval(goNext, 4500);
    return () => clearInterval(t);
  }, [paused, goNext]);

  // keyboard
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "ArrowLeft") goPrev(); if (e.key === "ArrowRight") goNext(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [goPrev, goNext]);

  // scroll active thumb into view
  useEffect(() => {
    const el = thumbRef.current?.children[current] as HTMLElement;
    el?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  }, [current]);

  const slideVariants = {
    enter: (d: number) => ({ x: d > 0 ? "100%" : "-100%", opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d > 0 ? "-100%" : "100%", opacity: 0 }),
  };

  // Guard: don't render until images are ready
  const safeIndex = Math.min(current, Math.max(0, images.length - 1));
  const activeImage = images[safeIndex];
  if (!images.length || !activeImage) return null;

  return (
    <div className="w-full" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>

      {/* ── Main Stage ── */}
      <div className="relative w-full overflow-hidden rounded-3xl bg-neutral-900 shadow-2xl" style={{ height: 540 }}>

        {/* Blurred ambient background */}
        <div className="absolute inset-0 overflow-hidden">
          <img
            key={`bg-${activeImage.src}`}
            src={activeImage.src}
            alt=""
            className="w-full h-full object-cover scale-125 blur-3xl brightness-70 transition-all duration-700"
            aria-hidden
          />
          <div className="absolute inset-0 bg-black/25" />
        </div>

        {/* Sliding image layer */}
        <AnimatePresence custom={dir} mode="popLayout">
          <motion.div
            key={current}
            custom={dir}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
            onClick={() => onOpen?.(safeIndex)}
            className="absolute inset-0 flex items-center justify-center p-3 md:p-6 cursor-pointer group"
          >
            {/* Main crisp image */}
            <img
              src={activeImage.src}
              alt={activeImage.title}
              className="w-full h-full object-contain z-10 drop-shadow-[0_15px_35px_rgba(0,0,0,0.5)] transition-transform duration-500 group-hover:scale-[1.02]"
            />
          </motion.div>
        </AnimatePresence>

        {/* Top right zoom hint button */}
        {onOpen && (
          <button
            onClick={() => onOpen(safeIndex)}
            className="absolute top-4 right-4 z-30 w-10 h-10 rounded-full bg-black/40 hover:bg-[#e6127d] border border-white/20 backdrop-blur-md text-white flex items-center justify-center transition-all duration-200 hover:scale-110 shadow-lg"
            title="View Fullscreen"
          >
            <ZoomIn className="size-4" />
          </button>
        )}

        {/* Bottom gradient for text */}
        <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-black/85 via-black/30 to-transparent z-20 pointer-events-none" />

        {/* Prev / Next arrows */}
        <button
          onClick={goPrev}
          className="absolute left-5 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-black/30 hover:bg-[#e6127d] border border-white/20 backdrop-blur-md text-white flex items-center justify-center transition-all duration-250 hover:scale-110 shadow-xl"
        >
          <ChevronLeft className="size-6" />
        </button>
        <button
          onClick={goNext}
          className="absolute right-5 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-black/30 hover:bg-[#e6127d] border border-white/20 backdrop-blur-md text-white flex items-center justify-center transition-all duration-250 hover:scale-110 shadow-xl"
        >
          <ChevronRight className="size-6" />
        </button>

        {/* Text overlay */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`caption-${current}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.45, delay: 0.2 }}
            className="absolute bottom-0 left-0 right-0 z-30 px-8 pb-7 pointer-events-none"
          >
            <h2 className="text-white text-3xl md:text-4xl font-extrabold leading-tight tracking-tight drop-shadow-md">
              {activeImage.title}
            </h2>
            <p className="text-white/75 text-base mt-1.5 drop-shadow">{activeImage.caption}</p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Thumbnail Strip ── */}
      <div
        ref={thumbRef}
        className="flex items-center gap-3 mt-5 px-1 overflow-x-auto pb-1 no-scrollbar scroll-smooth"
      >
        {images.map((img, i) => (
          <button
            key={img.id}
            onClick={() => goTo(i, i >= current ? 1 : -1)}
            className={`relative flex-shrink-0 overflow-hidden transition-all duration-350 ${
              i === current
                ? "w-[88px] h-16 rounded-xl ring-2 ring-[#e6127d] ring-offset-2 ring-offset-[#faf8f9] scale-110 shadow-[0_0_16px_rgba(230,18,125,0.35)]"
                : "w-16 h-12 rounded-lg opacity-45 hover:opacity-80 hover:scale-105"
            }`}
          >
            <img src={img.src} alt={img.title} className="w-full h-full object-cover" />
            {i === current && <div className="absolute inset-0 bg-[#e6127d]/10" />}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Lightbox ─────────────────────────────────────────────────────────────────
type MediaItem = { type: "image" | "video"; src: string; title: string; caption: string; index: number };

function Lightbox({ item, total, onClose, onPrev, onNext }: { item: MediaItem; total: number; onClose: () => void; onPrev: () => void; onNext: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); if (e.key === "ArrowLeft") onPrev(); if (e.key === "ArrowRight") onNext(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose, onPrev, onNext]);
  useEffect(() => { if (videoRef.current) videoRef.current.load(); }, [item.src]);
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[300] flex items-center justify-center p-4 md:p-10">
      <div className="absolute inset-0 bg-black/93 backdrop-blur-xl" onClick={onClose} />
      <motion.div key={item.src} initial={{ scale: 0.88, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.88, opacity: 0 }} transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }} className="relative z-10 w-full max-w-5xl rounded-3xl overflow-hidden shadow-[0_40px_120px_rgba(230,18,125,0.3)]">
        <button onClick={onClose} className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-white/10 hover:bg-[#e6127d] text-white backdrop-blur-md border border-white/20 flex items-center justify-center transition-all duration-200 hover:scale-110"><X className="size-5" /></button>
        <div className="relative w-full bg-black" style={{ aspectRatio: "16/9" }}>
          {item.type === "image" ? <img src={item.src} alt={item.title} className="w-full h-full object-contain" /> : <video ref={videoRef} src={item.src} controls autoPlay playsInline className="w-full h-full object-contain" />}
          <button onClick={(e) => { e.stopPropagation(); onPrev(); }} className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-[#e6127d] text-white backdrop-blur-md border border-white/20 flex items-center justify-center transition-all duration-200 hover:scale-110"><ChevronLeft className="size-6" /></button>
          <button onClick={(e) => { e.stopPropagation(); onNext(); }} className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-[#e6127d] text-white backdrop-blur-md border border-white/20 flex items-center justify-center transition-all duration-200 hover:scale-110"><ChevronRight className="size-6" /></button>
        </div>
        <div className="px-6 py-4 bg-[#0d0d0d] border-t border-white/10 flex items-center justify-between">
          <div><p className="text-white font-bold text-base">{item.title}</p><p className="text-white/50 text-sm">{item.caption}</p></div>
          <span className="text-white/30 text-sm font-mono">{item.index + 1} / {total}</span>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function GalleryPage() {
  const [lightbox, setLightbox] = useState<MediaItem | null>(null);
  const [itemsImages, setItemsImages] = useState<any[]>(IMAGES);

  const loadGallery = useCallback(() => {
    fetch(`/api/gallery?_cb=${Date.now()}`, { cache: "no-store" })
      .then(res => res.json())
      .then(data => {
        if (data.images?.length > 0) {
          setItemsImages(data.images.map((img: any, i: number) => ({
            id: img._id || i + 1,
            src: img.src,
            title: img.title,
            caption: img.caption || ""
          })));
        }
      })
      .catch(err => console.error("Failed to load gallery items", err));
  }, []);

  useEffect(() => {
    loadGallery();
    window.addEventListener("focus", loadGallery);
    return () => window.removeEventListener("focus", loadGallery);
  }, [loadGallery]);

  const openImage = useCallback((i: number) => {
    const img = itemsImages[i];
    if (!img) return;
    setLightbox({ type: "image", src: img.src, title: img.title, caption: img.caption, index: i });
  }, [itemsImages]);

  const close = useCallback(() => setLightbox(null), []);

  const prev = useCallback(() => {
    if (!lightbox) return;
    const ni = (lightbox.index - 1 + itemsImages.length) % itemsImages.length;
    const it = itemsImages[ni];
    setLightbox({ type: "image", src: it.src, title: it.title, caption: it.caption, index: ni });
  }, [lightbox, itemsImages]);

  const next = useCallback(() => {
    if (!lightbox) return;
    const ni = (lightbox.index + 1) % itemsImages.length;
    const it = itemsImages[ni];
    setLightbox({ type: "image", src: it.src, title: it.title, caption: it.caption, index: ni });
  }, [lightbox, itemsImages]);

  useEffect(() => {
    document.body.style.overflow = lightbox ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [lightbox]);

  return (
    <div className="min-h-screen bg-[#faf8f9]">

      {/* Hero header */}
      <section className="relative pt-28 pb-8 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#fce7f3] via-[#fef6fb] to-[#faf8f9]" />
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[420px] bg-[#e6127d]/10 rounded-full blur-[90px]" />
        <div className="relative z-10 max-w-3xl mx-auto px-6">
          <motion.span initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#e6127d]/25 text-[#e6127d] text-xs font-semibold uppercase tracking-widest shadow-sm mb-6">
            <Camera className="size-3.5" /> Photo Showcase
          </motion.span>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }} className="text-5xl md:text-6xl font-extrabold text-[#1a1a2e] leading-tight mb-4">
            Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#e6127d] to-[#f472b6]">Gallery</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="text-[#6b7280] text-lg leading-relaxed max-w-xl mx-auto">
            Explore moments of joy — signature creations, flavours, and sweet celebrations that make every scoop special.
          </motion.p>
        </div>
      </section>

      {/* ── Cinematic Slider ── */}
      <section className="max-w-6xl mx-auto px-4 md:px-6 pb-28">
        <CinematicSlider images={itemsImages} onOpen={(i) => openImage(i)} />
      </section>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightbox && <Lightbox item={lightbox} total={itemsImages.length} onClose={close} onPrev={prev} onNext={next} />}
      </AnimatePresence>
    </div>
  );
}
