import { Check, Truck, Package, Home } from "lucide-react";

export function TrackingProgressBar() {
  const steps = [
    { name: "Order Placed", status: "completed", icon: Check },
    { name: "Processed", status: "completed", icon: Check },
    { name: "In Transit", status: "active", icon: Truck },
    { name: "Delivered", status: "pending", icon: Home },
  ];

  return (
    <div className="w-full max-w-[800px] mx-auto mb-10 px-4">
      <div className="relative flex items-center justify-between">
        
        {/* Connecting Lines */}
        <div className="absolute left-[10%] right-[10%] top-6 h-1 bg-gray-100 rounded-full -z-10 shadow-inner">
          {/* Active Progress Line */}
          <div className="h-full bg-blue-600 w-[66%] rounded-full shadow-[0_0_10px_rgba(37,99,235,0.4)] transition-all duration-1000 ease-in-out" />
        </div>

        {/* Steps */}
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isCompleted = step.status === "completed";
          const isActive = step.status === "active";
          const isPending = step.status === "pending";

          return (
            <div key={index} className="flex flex-col items-center gap-3 relative z-10 w-24">
              {/* Circle */}
              <div 
                className={`flex h-12 w-12 items-center justify-center rounded-full border-[3px] transition-all duration-500 bg-white shadow-sm
                  ${isCompleted ? 'border-blue-600 text-blue-600' : ''}
                  ${isActive ? 'border-blue-600 text-white bg-blue-600 shadow-[0_4px_14px_0_rgba(37,99,235,0.39)] scale-110' : ''}
                  ${isPending ? 'border-gray-200 text-gray-400 bg-white' : ''}
                `}
              >
                {isCompleted ? <Check className="size-5 stroke-[3]" /> : <Icon className={`size-5 ${isActive ? 'text-white' : ''}`} />}
              </div>
              
              {/* Label */}
              <span 
                className={`text-[11px] sm:text-xs font-bold text-center tracking-wide mt-1 transition-colors
                  ${isCompleted ? 'text-gray-700' : ''}
                  ${isActive ? 'text-blue-600 scale-105 transform origin-top' : ''}
                  ${isPending ? 'text-gray-400' : ''}
                `}
              >
                {step.name}
              </span>
            </div>
          );
        })}

      </div>
    </div>
  );
}
