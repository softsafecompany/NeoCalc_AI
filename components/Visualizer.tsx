
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface VisualizerProps {
  data: { x: number; y: number }[];
  label?: string;
}

const Visualizer: React.FC<VisualizerProps> = ({ data, label }) => {
  if (!data || data.length === 0) return null;

  return (
    <div className="w-full h-64 bg-zinc-900/50 rounded-2xl border border-zinc-800 p-4 mt-4">
      <h3 className="text-zinc-400 text-xs font-semibold mb-2 uppercase tracking-wider">{label || 'Function Visualization'}</h3>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#333" />
          <XAxis dataKey="x" stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
          <Tooltip 
            contentStyle={{ backgroundColor: '#18181b', border: '1px solid #3f3f46', borderRadius: '8px' }}
            itemStyle={{ color: '#818cf8' }}
          />
          <Line 
            type="monotone" 
            dataKey="y" 
            stroke="#818cf8" 
            strokeWidth={3} 
            dot={{ fill: '#818cf8', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, strokeWidth: 0 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Visualizer;
