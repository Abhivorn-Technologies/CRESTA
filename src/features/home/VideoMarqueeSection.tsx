"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { Play, Film, X, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const DEFAULT_VIDEOS = [
  { id: "v1", src: "/gallary/br.mp4",              title: "Baskin Robbins Experience", caption: "Relive the magic" },
  { id: "v2", src: "/gallary/entry.mp4",           title: "Grand Entry",               caption: "A spectacle worth watching" },
  { id: "v3", src: "/gallary/advatisement.mp4",    title: "Our Advertisement",         caption: "Taste the story" },
  { id: "v4", src: "/gallary/ingrients.mp4",       title: "Premium Ingredients",       caption: "Only the finest go in" },
  { id: "v5", src: "/9.mp4",                       title: "Special Treat",             caption: "Crafted for pure happiness" },
  { id: "v6", src: "/gallary/milky ice cream.mp4", title: "Milky Ice Cream",           caption: "Creaminess, redefined" },
  { id: "v7", src: "/gallary/scoope.mp4",          title: "The Perfect Scoop",         caption: "Art in every serving" },
  { id: "v8", src: "/gallary/straw.mp4",           title: "Sip & Enjoy",               caption: "Refreshingly delicious" },
  { id: "v9", src: "/gallary/videp.mp4",           title: "Cresta Moments",            caption: "Memories we cherish" },
];

interface VideoItem {
  id: string | number;
  src: string;
  title: string;
  caption: string;
}

export function VideoMarqueeSection() {
  const [videos, setVideos] = useState<VideoItem[]>(DEFAULT_VIDEOS);
  const [activeVideoIndex, setActiveVideoIndex] = useState<number | null>(null);
  const [isPaused, setIsPaused] = useState(false);

  // Fetch dynamic videos from CMS / API
  useEffect(() => {
    fetch(`/api/gallery?_cb=${Date.now()}`, { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (data.videos && Array.isArray(data.videos) && data.videos.length > 0) {
          setVideos(
            data.videos.map((vid: any, i: number) => ({
              id: vid._id || `v-${i}`,
              src: vid.src,
              title: vid.title,
              caption: vid.caption || "",
            }))
          );
        }
      })
      .catch((err) => console.error("Failed to load marquee videos", err));
  }, []);

  const openLightbox = (index: number) => {
    setActiveVideoIndex(index % videos.length);
  };

  const closeLightbox = () => {
    setActiveVideoIndex(null);
  };

  const prevVideo = useCallback(() => {
    if (activeVideoIndex === null) return;
    setActiveVideoIndex((prev) => (prev! - 1 + videos.length) % videos.length);
  }, [activeVideoIndex, videos.length]);

  const nextVideo = useCallback(() => {
    if (activeVideoIndex === null) return;
    setActiveVideoIndex((prev) => (prev! + 1) % videos.length);
  }, [activeVideoIndex, videos.length]);

  // Double list for infinite seamless marquee loop
  const marqueeList = [...videos, ...videos];

  return (
    <section className="relative w-full pt-4 pb-12 overflow-hidden select-none">
      {/* Section Header */}
      <div className="mx-auto max-w-[1440px] px-6 lg:px-10 mb-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#e6127d]/10 text-[#e6127d]">
            <Film className="size-4" />
          </div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#e6127d]">
            Behind The Scoop
          </span>
          <span className="text-xs text-gray-400 font-medium hidden sm:inline">
            • Experience Baskin Robbins in Action
          </span>
        </div>

        <Link
          href="/gallery"
          className="text-xs font-bold text-[#101b4d] hover:text-[#e6127d] transition-colors flex items-center gap-1 group"
        >
          View All Gallery
          <span className="group-hover:translate-x-0.5 transition-transform">→</span>
        </Link>
      </div>

      {/* Marquee Track Container */}
      <div
        className="relative w-full overflow-hidden"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Soft edge gradient fades */}
        <div className="absolute left-0 inset-y-0 w-12 sm:w-24 bg-gradient-to-r from-white via-white/80 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 inset-y-0 w-12 sm:w-24 bg-gradient-to-l from-white via-white/80 to-transparent z-10 pointer-events-none" />

        {/* Marquee Scroller */}
        <div
          className="flex gap-5 w-max animate-marquee"
          style={{
            animationPlayState: isPaused ? "paused" : "running",
            animationDuration: `${Math.max(25, videos.length * 4)}s`,
          }}
        >
          {marqueeList.map((video, idx) => (
            <MarqueeVideoCard
              key={`${video.id}-${idx}`}
              video={video}
              index={idx % videos.length}
              onClick={() => openLightbox(idx % videos.length)}
            />
          ))}
        </div>
      </div>

      {/* Video Lightbox Modal */}
      <AnimatePresence>
        {activeVideoIndex !== null && videos[activeVideoIndex] && (
          <VideoModal
            video={videos[activeVideoIndex]}
            currentIndex={activeVideoIndex}
            totalCount={videos.length}
            onClose={closeLightbox}
            onPrev={prevVideo}
            onNext={nextVideo}
          />
        )}
      </AnimatePresence>
    </section>
  );
}

function MarqueeVideoCard({
  video,
  index,
  onClick,
}: {
  video: VideoItem;
  index: number;
  onClick: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }, [video.src]);

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative flex-shrink-0 w-[260px] sm:w-[310px] aspect-[16/10] rounded-2xl overflow-hidden cursor-pointer group bg-black shadow-md hover:shadow-2xl hover:scale-[1.03] transition-all duration-300 border border-gray-100"
    >
      {/* Video element - continuously plays while marquee scrolls */}
      <video
        ref={videoRef}
        src={video.src}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        className={`w-full h-full object-cover transition-all duration-500 ${
          isHovered ? "scale-105 opacity-100 brightness-105" : "opacity-90"
        }`}
      />

      {/* Central Play Button */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div
          className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
            isHovered
              ? "bg-[#e6127d] border-[#e6127d] scale-110 shadow-[0_0_24px_rgba(230,18,125,0.8)]"
              : "bg-black/40 border-white/60 backdrop-blur-md"
          }`}
        >
          <Play className="size-5 text-white fill-white ml-0.5" />
        </div>
      </div>

      {/* Card Info Overlay */}
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-3.5 flex flex-col justify-end">
        <div className="flex items-center gap-1.5 mb-1">
          <Film className="size-3 text-[#e6127d]" />
          <span className="text-[#e6127d] text-[10px] font-extrabold uppercase tracking-widest">
            Video
          </span>
        </div>
        <p className="text-white font-bold text-sm leading-snug line-clamp-1">
          {video.title}
        </p>
        {video.caption && (
          <p className="text-white/70 text-[11px] mt-0.5 line-clamp-1">
            {video.caption}
          </p>
        )}
      </div>

      {/* Border Glow on Hover */}
      <div
        className={`absolute inset-0 rounded-2xl border-2 transition-colors duration-300 pointer-events-none ${
          isHovered ? "border-[#e6127d]/80" : "border-transparent"
        }`}
      />
    </div>
  );
}

function VideoModal({
  video,
  currentIndex,
  totalCount,
  onClose,
  onPrev,
  onNext,
}: {
  video: VideoItem;
  currentIndex: number;
  totalCount: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  const modalVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, onPrev, onNext]);

  useEffect(() => {
    if (modalVideoRef.current) {
      modalVideoRef.current.load();
      modalVideoRef.current.play().catch(() => {});
    }
  }, [video.src]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[300] flex items-center justify-center p-4 md:p-10"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/90 backdrop-blur-xl"
        onClick={onClose}
      />

      {/* Modal Card */}
      <motion.div
        key={video.src}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="relative z-10 w-full max-w-4xl rounded-3xl overflow-hidden shadow-[0_30px_90px_rgba(230,18,125,0.3)] bg-black border border-white/10"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-30 w-10 h-10 rounded-full bg-white/10 hover:bg-[#e6127d] text-white backdrop-blur-md border border-white/20 flex items-center justify-center transition-all duration-200 hover:scale-110"
        >
          <X className="size-5" />
        </button>

        {/* Video Player */}
        <div className="relative w-full aspect-video bg-black flex items-center justify-center">
          <video
            ref={modalVideoRef}
            src={video.src}
            controls
            autoPlay
            playsInline
            className="w-full h-full object-contain"
          />

          {/* Nav Controls */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPrev();
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/10 hover:bg-[#e6127d] text-white backdrop-blur-md border border-white/20 flex items-center justify-center transition-all duration-200 hover:scale-110"
          >
            <ChevronLeft className="size-6" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onNext();
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/10 hover:bg-[#e6127d] text-white backdrop-blur-md border border-white/20 flex items-center justify-center transition-all duration-200 hover:scale-110"
          >
            <ChevronRight className="size-6" />
          </button>
        </div>

        {/* Caption Bar */}
        <div className="px-6 py-4 bg-[#0d0d0d] border-t border-white/10 flex items-center justify-between">
          <div>
            <p className="text-white font-bold text-base">{video.title}</p>
            {video.caption && (
              <p className="text-white/60 text-xs mt-0.5">{video.caption}</p>
            )}
          </div>
          <span className="text-white/40 text-xs font-mono">
            {currentIndex + 1} / {totalCount}
          </span>
        </div>
      </motion.div>
    </motion.div>
  );
}
