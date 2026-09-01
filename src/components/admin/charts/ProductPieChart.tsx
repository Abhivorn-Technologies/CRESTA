"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

interface ProductPieChartProps {
  data: {
    name: string;
    value: number;
    color: string;
  }[];
}

export function ProductPieChart({ data }: ProductPieChartProps) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-[400px] flex flex-col">
      <h3 className="font-bold text-[#101b4d] text-lg mb-4 shrink-0">Top Products</h3>
      
      <div className="flex-1 w-full min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={5}
              dataKey="value"
              stroke="none"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value: any) => [`${value}%`, 'Share']}
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
              itemStyle={{ color: '#101b4d', fontWeight: 600 }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-x-2 gap-y-3 pt-4 border-t border-gray-100 shrink-0">
        {data.map((entry, index) => (
          <div key={index} className="flex items-center gap-2 overflow-hidden">
            <div 
              className="size-3 rounded-full shrink-0" 
              style={{ backgroundColor: entry.color }} 
            />
            <span className="text-xs font-medium text-gray-600 truncate" title={entry.name}>
              {entry.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
