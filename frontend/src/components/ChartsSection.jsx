import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

// Color map matching the Dribbble accent styles (Green, Orange, White, Slate-gray)
const CATEGORY_COLORS = {
  Food: '#10B981',          // Green
  Transport: '#3B82F6',     // Blue
  Shopping: '#FF5500',      // Orange
  Entertainment: '#8B5CF6', // Purple
  Education: '#F59E0B',     // Amber
  Healthcare: '#EF4444',    // Red
  Other: '#64748B',         // Slate Gray
};

const ChartsSection = ({ expenses }) => {
  // --- 1. Prepare Category Breakdown Data (Pie Chart) ---
  const categoryMap = {};
  expenses.forEach((exp) => {
    if (exp) {
      const cat = exp.category || 'Other';
      const amt = typeof exp.amount === 'number' ? exp.amount : parseFloat(exp.amount) || 0;
      categoryMap[cat] = (categoryMap[cat] || 0) + amt;
    }
  });

  const pieData = Object.entries(categoryMap).map(([name, value]) => ({
    name,
    value: parseFloat((value || 0).toFixed(2)),
  })).sort((a, b) => b.value - a.value);

  // --- 2. Prepare Trend Data (Area Chart) ---
  const trendMap = {};
  expenses.forEach((exp) => {
    if (exp) {
      let dateStr = 'Unknown';
      try {
        const d = new Date(exp.date);
        if (!isNaN(d.getTime())) {
          dateStr = d.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
          });
        }
      } catch (e) {
        console.error('Date parsing error:', e);
      }
      const amt = typeof exp.amount === 'number' ? exp.amount : parseFloat(exp.amount) || 0;
      trendMap[dateStr] = (trendMap[dateStr] || 0) + amt;
    }
  });

  const trendData = Object.entries(trendMap)
    .map(([date, amount]) => ({
      date,
      Amount: parseFloat((amount || 0).toFixed(2)),
    }))
    .reverse()
    .slice(-15);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length && payload[0]) {
      const val = payload[0].value;
      return (
        <div className="bg-[#0C1226] border border-slate-800 p-3 rounded-xl shadow-xl backdrop-blur-md text-xs">
          <p className="text-slate-400 font-semibold mb-1">{label}</p>
          <p className="text-brand-green font-bold">
            ₹{typeof val === 'number' ? val.toFixed(2) : parseFloat(val || 0).toFixed(2)}
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomPieTooltip = ({ active, payload }) => {
    if (active && payload && payload.length && payload[0]) {
      const { name, value } = payload[0];
      return (
        <div className="bg-[#0C1226] border border-slate-800 p-3 rounded-xl shadow-xl backdrop-blur-md text-xs flex flex-col gap-1">
          <p className="font-semibold" style={{ color: CATEGORY_COLORS[name] || '#fff' }}>
            {name}
          </p>
          <p className="text-slate-350 font-bold">
            ₹{typeof value === 'number' ? value.toFixed(2) : parseFloat(value || 0).toFixed(2)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Area Chart: Spending Trend */}
      <div className="glass-panel rounded-2xl p-5 lg:col-span-2 flex flex-col justify-between">
        <div>
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Spending Trend
          </h3>
          <p className="text-slate-500 text-xs mt-0.5 font-medium">
            Daily activity totals (past 15 active days)
          </p>
        </div>
        
        <div className="h-72 w-full mt-6">
          {trendData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.02)" vertical={false} />
                <XAxis 
                  dataKey="date" 
                  stroke="#475569" 
                  fontSize={10} 
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  stroke="#475569" 
                  fontSize={10} 
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(val) => `₹${val}`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area 
                  type="monotone" 
                  dataKey="Amount" 
                  stroke="#10B981" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorAmount)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-slate-600 text-sm">
              Log transactions to generate trend data.
            </div>
          )}
        </div>
      </div>

      {/* Pie Chart: Category shares */}
      <div className="glass-panel rounded-2xl p-5 flex flex-col justify-between">
        <div>
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Category Share
          </h3>
          <p className="text-slate-500 text-xs mt-0.5 font-medium">
            Proportional spending breakdown
          </p>
        </div>

        <div className="h-72 w-full mt-4 relative flex items-center justify-center">
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="45%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={CATEGORY_COLORS[entry.name] || '#64748B'} 
                      stroke="#0C1226"
                      strokeWidth={2}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomPieTooltip />} />
                <Legend 
                  verticalAlign="bottom" 
                  align="center"
                  iconType="circle"
                  iconSize={7}
                  formatter={(value) => <span className="text-[10px] text-slate-400 font-bold">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-slate-600 text-sm">
              No category data available.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChartsSection;
