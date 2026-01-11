
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface ScoreBoardProps {
  score: number;
}

const ScoreBoard: React.FC<ScoreBoardProps> = ({ score }) => {
  const data = [
    { name: 'Match', value: score },
    { name: 'Gap', value: 100 - score },
  ];

  const getColor = (s: number) => {
    if (s >= 80) return '#10b981'; // Emerald 500
    if (s >= 60) return '#f59e0b'; // Amber 500
    return '#ef4444'; // Red 500
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center">
      <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">ATS Match Score</h3>
      <div className="w-48 h-48 relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              innerRadius={60}
              outerRadius={80}
              startAngle={90}
              endAngle={450}
              dataKey="value"
            >
              <Cell fill={getColor(score)} />
              <Cell fill="#f1f5f9" />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-bold text-slate-800">{score}%</span>
          <span className="text-xs text-slate-400 font-medium">Relevance</span>
        </div>
      </div>
      <p className="mt-4 text-center text-sm text-slate-600 italic">
        {score >= 80 ? 'Excellent alignment! High chance of parsing.' : 
         score >= 60 ? 'Good start. Try adding more missing keywords.' : 
         'Needs optimization to pass the filter.'}
      </p>
    </div>
  );
};

export default ScoreBoard;
