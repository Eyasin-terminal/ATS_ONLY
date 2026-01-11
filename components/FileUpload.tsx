
import React, { useRef, useState } from 'react';

interface FileUploadProps {
  onFileSelect: (base64: string, fileName: string) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (file.type !== 'application/pdf') {
      alert('Please upload a PDF file.');
      return;
    }
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target?.result as string;
      const base64Data = base64.split(',')[1];
      onFileSelect(base64Data, file.name);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div 
      className={`relative border-2 border-dashed rounded-xl p-8 transition-all duration-200 text-center ${
        isDragging ? 'border-indigo-500 bg-indigo-50' : 'border-slate-300 bg-white hover:border-indigo-400'
      }`}
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
    >
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept=".pdf"
        onChange={(e) => e.target.files && handleFile(e.target.files[0])}
      />
      <div className="flex flex-col items-center">
        <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
          <i className="fas fa-cloud-upload-alt text-indigo-600 text-2xl"></i>
        </div>
        <h3 className="text-lg font-semibold text-slate-800">
          {fileName ? fileName : 'Upload your current Resume'}
        </h3>
        <p className="text-sm text-slate-500 mt-1 mb-4">
          PDF files only (Max 5MB)
        </p>
        <button
          onClick={() => fileInputRef.current?.click()}
          className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
        >
          Browse Files
        </button>
      </div>
    </div>
  );
};

export default FileUpload;
