import Image from "next/image";

export function EnquirySidebar() {
  return (
    <div className="relative w-[512px] h-[600px] shrink-0 overflow-hidden rounded-2xl shadow-md border border-gray-100 hidden lg:block">
      {/* Background Image */}
      <Image 
        src="/images/shop-cakes.png" 
        alt="Catering Setup" 
        fill 
        className="object-cover"
       sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#101b4d]/90 via-[#101b4d]/20 to-transparent" />

      {/* Text Content */}
      <div className="absolute bottom-0 left-0 p-10 flex flex-col gap-2">
        <h3 className="font-heading text-3xl font-bold text-white tracking-tight">
          Crafting Memories
        </h3>
        <p className="text-white/80 text-sm leading-relaxed max-w-[320px]">
          Every detail meticulously planned, every flavor impeccably executed for your special day.
        </p>
      </div>
    </div>
  );
}
