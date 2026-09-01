"use client";

import { ReactNode } from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  trend?: {
    value: number;
    label: string;
  };
  className?: string;
}

export function StatCard({ title, value, icon, trend, className = "" }: StatCardProps) {
  return (
    <div className={`bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col ${className}`}>
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-gray-500 font-medium text-sm">{title}</h3>
        <div className="p-2 bg-[#f0f3fa] rounded-lg text-[#101b4d]">
          {icon}
        </div>
      </div>
      <div className="mt-auto">
        <h4 className="text-2xl font-bold text-[#101b4d] font-heading">{value}</h4>
        {trend && (
          <p className="text-xs mt-2 font-medium">
            <span className={trend.value >= 0 ? "text-green-500" : "text-red-500"}>
              {trend.value >= 0 ? "+" : ""}{trend.value}%
            </span>
            <span className="text-gray-400 ml-1">{trend.label}</span>
          </p>
        )}
      </div>
    </div>
  );
}
