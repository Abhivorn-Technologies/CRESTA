import { ShieldCheck, Truck, Award, Users } from "lucide-react";

const features = [
  {
    icon: <ShieldCheck className="size-6 text-[#101b4d]" />,
    title: "100% Authentic",
    description: "Directly sourced from Baskin Robbins. No compromises, no substitutes."
  },
  {
    icon: <Truck className="size-6 text-[#101b4d]" />,
    title: "Pristine Cold Chain",
    description: "Specialized freezer fleets guarantee zero melt from warehouse to doorstep."
  },
  {
    icon: <Award className="size-6 text-[#101b4d]" />,
    title: "Quality Assurance",
    description: "Every batch is rigorously tested before it earns the Cresta seal of approval."
  },
  {
    icon: <Users className="size-6 text-[#101b4d]" />,
    title: "Customer First",
    description: "Dedicated support team ensuring your celebrations go exactly as planned."
  }
];

export function WhyChooseCresta() {
  return (
    <section className="w-full bg-white px-6 lg:px-10 pb-32">
      <div className="mx-auto max-w-[1440px] flex flex-col items-center">
        
        {/* Header */}
        <div className="flex flex-col items-center mb-16 text-center">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-[#101b4d] mb-4">
            Why Choose Cresta
          </h2>
          <div className="w-16 h-1 bg-[#f5a623] rounded-full" />
        </div>

        {/* Grid */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, idx) => (
            <div 
              key={idx}
              className="flex flex-col items-center text-center p-8 bg-white border border-[#E1E7EF] rounded-2xl shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              {/* Icon */}
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#f0f2fa] mb-6">
                {feature.icon}
              </div>
              
              {/* Text */}
              <h3 className="font-heading font-bold text-[#101b4d] text-lg mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-500 text-[13px] font-medium leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
