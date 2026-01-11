
import React from 'react';

interface JobDescriptionProps {
  value: string;
  onChange: (value: string) => void;
}

const JobDescription: React.FC<JobDescriptionProps> = ({ value, onChange }) => {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-slate-700">
        Job Description
      </label>
      <div className="relative">
        <textarea
          className="w-full h-48 p-4 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all resize-none text-slate-700 placeholder:text-slate-400"
          placeholder="Paste the full job description here (Role, Responsibilities, Skills)..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
        ></textarea>
        <div className="absolute bottom-3 right-3 text-xs text-slate-400">
          {value.length} characters
        </div>
      </div>
    </div>
  );
};

export default JobDescription;
