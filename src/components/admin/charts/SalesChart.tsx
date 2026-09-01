"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface SalesChartProps {
  data: {
    date: string;
    sales: number;
    orders: number;
  }[];
  timeframe: string;
  onTimeframeChange: (val: string) => void;
}

export function SalesChart({ data, timeframe, onTimeframeChange }: SalesChartProps) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-[400px]">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-[#101b4d] text-lg">Sales Overview</h3>
        <select 
          value={timeframe}
          onChange={(e) => onTimeframeChange(e.target.value)}
          className="bg-[#f0f3fa] text-sm text-[#101b4d] font-medium px-3 py-1.5 rounded-lg border-none outline-none"
        >
          <option value="today">Today</option>
          <option value="7days">Last 7 Days</option>
          <option value="30days">Last 30 Days</option>
          <option value="year">This Year</option>
        </select>
      </div>
      
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#e6127d" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#e6127d" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis 
              dataKey="date" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#9ca3af', fontSize: 12 }}
              dy={10}
              interval="preserveStartEnd"
              minTickGap={15}
              tickFormatter={(value) => {
                const strValue = String(value);
                if (!strValue || strValue === "No Data") return "";
                if (timeframe === "today") return strValue;
                if (timeframe === "year") {
                  const d = new Date(strValue + "-01");
                  return d.toLocaleDateString('en-US', { month: 'short' });
                }
                const d = new Date(strValue);
                return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
              }}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#9ca3af', fontSize: 12 }}
              tickFormatter={(value) => `₹${value}`}
            />
            <Tooltip
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
              itemStyle={{ color: '#101b4d', fontWeight: 600 }}
              formatter={(value: any) => [`₹${value.toLocaleString()}`, 'Sales']}
              labelFormatter={(label) => {
                const strLabel = String(label);
                if (timeframe === "today") return strLabel;
                if (timeframe === "year") {
                  const d = new Date(strLabel + "-01");
                  return d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
                }
                const d = new Date(strLabel);
                return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
              }}
            />
            <Area
              type="monotone"
              dataKey="sales"
              stroke="#e6127d"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorSales)"
              activeDot={{ r: 6, fill: "#e6127d", stroke: "#fff", strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
