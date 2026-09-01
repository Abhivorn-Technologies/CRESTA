import React from "react";
import Image from "next/image";

export const OurMission = React.memo(function OurMission() {
  return (
    <section className="w-full bg-white py-20 lg:py-32">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-10">
        
        {/* Bordered Container */}
        <div className="flex flex-col lg:flex-row items-center border border-[#e5e7eb] rounded-3xl overflow-hidden bg-white">
          
          {/* Left Content */}
          <div className="w-full lg:w-1/2 p-10 lg:p-16 flex flex-col justify-center">
            <h2 className="font-heading text-4xl lg:text-5xl font-bold text-[#101b4d] mb-8">
              Our Mission
            </h2>
            
            <p className="text-[#6b7280] font-medium leading-relaxed mb-6">
              At Cresta Global Private Limited, we believe that ice cream is more than just a dessert—it's a celebration. Whether it's a birthday, an anniversary, a promotion, or simply a Tuesday night that needs a little sweetening, we are dedicated to making those moments perfect.
            </p>
            
            <p className="text-[#6b7280] font-medium leading-relaxed mb-12">
              As an authorized distributor for Baskin Robbins, we hold ourselves to the highest global standards. Our state-of-the-art cold chain logistics ensure that from the moment a tub leaves our facility to the second it arrives at your door, it remains at the exact optimal temperature.
            </p>
            
            {/* Badge */}
            <div className="flex items-center gap-4 bg-white border border-gray-100 shadow-sm rounded-full px-6 py-3 w-fit">
              <span className="font-heading font-black text-[#e6127d] text-lg italic tracking-tighter">
                BR
              </span>
              <div className="h-8 w-[1px] bg-gray-200" />
              <span className="text-[#101b4d] font-bold text-sm leading-tight">
                Proud Authorized Distributor <br/> of Baskin Robbins
              </span>
            </div>
          </div>
          
          {/* Right Image */}
          <div className="w-full lg:w-1/2 h-[400px] lg:h-auto lg:min-h-[500px] relative bg-[#fdfdfd] flex items-center justify-center p-8">
            <div className="relative w-full max-w-[600px] aspect-[4/3]">
              <Image 
                src="/api/images/about-mission"
                alt="Baskin Robbins Tubs and Delivery Truck"
                fill
                className="object-contain drop-shadow-xl"
               sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
            </div>
          </div>
          
        </div>

      </div>
    </section>
  );
});
