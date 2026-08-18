"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";

interface CategoryData {
  name: string;
  count: string;
  color: string;
  image: string;
}

const colorPalette = [
  "from-[#a78bfa] to-[#818cf8]",
  "from-[#d8b4fe] to-[#c084fc]",
  "from-[#fca5a5] to-[#f87171]",
  "from-[#93c5fd] to-[#60a5fa]",
  "from-[#fcd34d] to-[#fbbf24]",
  "from-[#bef264] to-[#a3e635]",
];

export function ShopByRange() {
  const [startIndex, setStartIndex] = useState(0);
  const [itemsToShow, setItemsToShow] = useState(4);
  const [isClient, setIsClient] = useState(false);
  const [categories, setCategories] = useState<CategoryData[]>([]);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch('/api/categories');
        if (res.ok) {
          const data = await res.json();
          // Map API data to component structure
          const mapped = data.categories.map((cat: any, index: number) => ({
            name: cat.label,
            count: "View Collection", // Can be dynamic if we query products count
            color: colorPalette[index % colorPalette.length],
            image: cat.image,
          }));
          setCategories(mapped);
        }
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      }
    }
    fetchCategories();
  }, []);

  useEffect(() => {
    setIsClient(true);
    const updateItemsToShow = () => {
      if (window.innerWidth < 640) {
        setItemsToShow(2);
      } else if (window.innerWidth < 1024) {
        setItemsToShow(3);
      } else {
        setItemsToShow(4);
      }
    };

    updateItemsToShow();
    window.addEventListener("resize", updateItemsToShow);
    return () => window.removeEventListener("resize", updateItemsToShow);
  }, []);

  useEffect(() => {
    if (startIndex + itemsToShow > categories.length) {
      setStartIndex(Math.max(0, categories.length - itemsToShow));
    }
  }, [itemsToShow, categories.length, startIndex]);

  const handleNext = () => {
    if (startIndex + itemsToShow < categories.length) {
      setStartIndex(startIndex + 1);
    }
  };

  const handlePrev = () => {
    if (startIndex > 0) {
      setStartIndex(startIndex - 1);
    }
  };
  return (
    <section className="relative w-full py-20 lg:py-28 bg-[#fdfdfd]">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-10">
        
        {/* Heading */}
        <div className="flex flex-col items-center justify-center text-center gap-3 mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="font-heading text-3xl md:text-4xl lg:text-[40px] font-[800] text-[#101b4d]"
          >
            Shop by Range
          </motion.h2>
          <motion.div 
            initial={{ width: 0 }}
            whileInView={{ width: "60px" }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="h-[3px] rounded-full bg-[#d97706]" // Gold underline matching figma
          />
        </div>

        {/* Slider Container */}
        <div className={`relative flex items-center justify-between w-full max-w-[1200px] mx-auto gap-2 sm:gap-4 transition-opacity duration-300 ${isClient ? 'opacity-100' : 'opacity-0'}`}>
          
          {/* Left Arrow */}
          <button 
            onClick={handlePrev}
            disabled={startIndex === 0}
            className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center text-[#93c5fd] hover:text-[#3b82f6] disabled:opacity-30 disabled:cursor-not-allowed transition-colors shrink-0 z-10"
          >
            <ChevronLeft strokeWidth={2.5} className="size-8 sm:size-10" />
          </button>
          
          {/* Items Grid */}
          <div className="flex flex-1 overflow-hidden relative">
            <motion.div 
              animate={{ x: `-${startIndex * (100 / itemsToShow)}%` }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="flex w-full"
            >
              {categories.map((category, i) => (
                <div 
                  key={category.name} 
                  className="flex flex-col items-center gap-6 shrink-0 group cursor-pointer"
                  style={{ width: `${100 / itemsToShow}%` }}
                >
                  {/* Image Circle */}
                  <div className="relative flex h-[120px] sm:h-[180px] w-full items-center justify-center transition-transform duration-500 group-hover:-translate-y-2">
                    <div className={`absolute inset-0 mx-auto w-[120px] sm:w-[180px] rounded-[2rem] bg-gradient-to-br ${category.color} opacity-10 blur-xl group-hover:opacity-30 transition-opacity`} />
                    <div className="relative flex h-[100px] w-[100px] sm:h-[160px] sm:w-[160px] items-center justify-center overflow-hidden rounded-full bg-transparent">
                      <Image src={category.image} alt={category.name} fill priority={i < itemsToShow} className="object-contain drop-shadow-lg"  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
                    </div>
                  </div>
                  
                  {/* Text Content */}
                  <div className="flex flex-col items-center gap-1 text-center mt-2 sm:mt-0">
                    <span className="font-heading font-bold text-[#101b4d] text-[14px] sm:text-[18px]">
                      {category.name}
                    </span>
                    <span className="text-[11px] sm:text-[13px] font-medium text-[#6b7280]">
                      {category.count}
                    </span>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right Arrow */}
          <button 
            onClick={handleNext}
            disabled={startIndex >= categories.length - itemsToShow}
            className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center text-[#93c5fd] hover:text-[#3b82f6] disabled:opacity-30 disabled:cursor-not-allowed transition-colors shrink-0 z-10"
          >
            <ChevronRight strokeWidth={2.5} className="size-8 sm:size-10" />
          </button>

        </div>

      </div>
    </section>
  );
}
