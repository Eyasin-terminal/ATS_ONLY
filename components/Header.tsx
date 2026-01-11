
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <i className="fas fa-file-invoice text-white text-xl"></i>
            </div>
            <span className="text-xl font-bold text-slate-900 tracking-tight">
              ATS <span className="text-indigo-600">Optimizer</span>
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-slate-500 hidden sm:inline-block">AI-Powered Resume Transformation</span>
            <button className="text-slate-600 hover:text-indigo-600 transition-colors">
              <i className="fas fa-question-circle text-lg"></i>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
