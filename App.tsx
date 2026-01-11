
import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import FileUpload from './components/FileUpload';
import JobDescription from './components/JobDescription';
import ScoreBoard from './components/ScoreBoard';
import ResumePreview from './components/ResumePreview';
import { Step, OptimizationResult, ResumeData } from './types';
import { optimizeResume } from './services/geminiService';

const App: React.FC = () => {
  const [step, setStep] = useState<Step>(Step.UPLOAD);
  const [resumeBase64, setResumeBase64] = useState<string | null>(null);
  const [jobDescription, setJobDescription] = useState('');
  const [results, setResults] = useState<OptimizationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleOptimization = async () => {
    if (!resumeBase64 || jobDescription.trim().length < 50) {
      alert("Please upload a resume and provide a detailed job description.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setStep(Step.OPTIMIZING);

    try {
      const result = await optimizeResume(resumeBase64, jobDescription);
      setResults(result);
      setStep(Step.REVIEW);
    } catch (err) {
      console.error(err);
      setError("Failed to optimize resume. Please check your API key and file content.");
      setStep(Step.UPLOAD);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateResume = (updated: ResumeData) => {
    if (results) {
      setResults({ ...results, optimizedResume: updated });
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {step === Step.UPLOAD && (
          <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center">
              <h1 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">
                Ready to beat the ATS?
              </h1>
              <p className="mt-4 text-lg text-slate-600">
                Upload your resume and the job description. We'll handle the alignment.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
              <FileUpload onFileSelect={(base64) => setResumeBase64(base64)} />
              <JobDescription value={jobDescription} onChange={setJobDescription} />
              
              <button
                onClick={handleOptimization}
                disabled={!resumeBase64 || jobDescription.length < 50 || isLoading}
                className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl active:scale-[0.98]"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <i className="fas fa-circle-notch fa-spin mr-2"></i> Optimizing...
                  </span>
                ) : (
                  'Optimize Resume Now'
                )}
              </button>
            </div>
          </div>
        )}

        {step === Step.OPTIMIZING && (
          <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
            <div className="relative w-24 h-24">
              <div className="absolute inset-0 border-4 border-indigo-100 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
            </div>
            <div className="text-center">
              <h2 className="text-2xl font-bold text-slate-800">Analyzing & Realigning...</h2>
              <p className="text-slate-500 mt-2">Gemini is finding the perfect keyword synergy.</p>
            </div>
            <div className="w-full max-w-md bg-slate-100 rounded-full h-2 overflow-hidden">
              <div className="bg-indigo-600 h-full animate-pulse-progress"></div>
            </div>
          </div>
        )}

        {step === Step.REVIEW && results && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Sidebar Controls */}
            <div className="lg:col-span-4 space-y-6 no-print">
              <ScoreBoard score={results.matchScore} />

              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4">Detected Keywords</h3>
                <div className="flex flex-wrap gap-2">
                  {results.extractedKeywords.map((kw, i) => (
                    <span key={i} className="px-3 py-1 bg-green-50 text-green-700 text-xs font-semibold rounded-full border border-green-100">
                      {kw}
                    </span>
                  ))}
                  {results.missingKeywords.map((kw, i) => (
                    <span key={i} className="px-3 py-1 bg-rose-50 text-rose-700 text-xs font-semibold rounded-full border border-rose-100">
                      {kw}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4">Smart Suggestions</h3>
                <ul className="space-y-3">
                  {results.improvementSuggestions.map((sug, i) => (
                    <li key={i} className="flex items-start text-sm text-slate-600">
                      <i className="fas fa-lightbulb text-amber-500 mt-1 mr-3 shrink-0"></i>
                      {sug}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-col space-y-3">
                <button 
                  onClick={handlePrint}
                  className="flex items-center justify-center bg-slate-900 text-white py-3 rounded-lg font-bold hover:bg-slate-800 transition-all shadow-md"
                >
                  <i className="fas fa-download mr-2"></i> Download PDF
                </button>
                <button 
                  onClick={() => setStep(Step.UPLOAD)}
                  className="flex items-center justify-center bg-white text-slate-600 border border-slate-300 py-3 rounded-lg font-bold hover:bg-slate-50 transition-all"
                >
                  <i className="fas fa-undo mr-2"></i> Start Over
                </button>
              </div>
            </div>

            {/* Resume Canvas */}
            <div className="lg:col-span-8">
              <div className="mb-4 flex items-center justify-between no-print">
                <span className="text-sm font-medium text-slate-500">
                  <i className="fas fa-info-circle mr-1"></i> Interactive Editor: Click any text to edit before downloading.
                </span>
                <div className="flex space-x-2">
                  <div className="w-3 h-3 rounded-full bg-slate-300"></div>
                  <div className="w-3 h-3 rounded-full bg-slate-300"></div>
                  <div className="w-3 h-3 rounded-full bg-slate-300"></div>
                </div>
              </div>
              <ResumePreview 
                data={results.optimizedResume} 
                onUpdate={handleUpdateResume}
              />
            </div>
          </div>
        )}

        {error && (
          <div className="fixed bottom-8 right-8 bg-rose-600 text-white px-6 py-4 rounded-xl shadow-2xl animate-in fade-in slide-in-from-right-4">
            <div className="flex items-center">
              <i className="fas fa-exclamation-circle text-xl mr-3"></i>
              <div>
                <p className="font-bold">Optimization Error</p>
                <p className="text-sm opacity-90">{error}</p>
              </div>
              <button onClick={() => setError(null)} className="ml-6 hover:opacity-75">
                <i className="fas fa-times"></i>
              </button>
            </div>
          </div>
        )}
      </main>

      <footer className="bg-white border-t border-slate-200 py-8 no-print">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-slate-500">
            Built with Gemini 3 Flash & React. Designed for maximum ATS compatibility.
          </p>
          <p className="text-xs text-slate-400 mt-2">
            © 2024 ATS Resume Optimizer. For professional use only.
          </p>
        </div>
      </footer>
      
      <style>{`
        @keyframes pulse-progress {
          0% { width: 0%; }
          50% { width: 70%; }
          100% { width: 95%; }
        }
        .animate-pulse-progress {
          animation: pulse-progress 10s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default App;
