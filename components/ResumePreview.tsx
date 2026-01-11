
import React from 'react';
import { ResumeData } from '../types';

interface ResumePreviewProps {
  data: ResumeData;
  onUpdate: (data: ResumeData) => void;
}

const ResumePreview: React.FC<ResumePreviewProps> = ({ data, onUpdate }) => {
  const updatePersonalInfo = (field: string, value: string) => {
    onUpdate({
      ...data,
      personalInfo: { ...data.personalInfo, [field]: value }
    });
  };

  return (
    <div className="bg-white border border-slate-200 shadow-xl rounded-none sm:rounded-lg overflow-hidden resume-preview p-[1in] min-h-[11in] text-slate-800">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold uppercase tracking-widest border-b-2 border-slate-800 pb-2 mb-2 outline-none" contentEditable suppressContentEditableWarning onBlur={(e) => updatePersonalInfo('fullName', e.currentTarget.innerText)}>
          {data.personalInfo.fullName}
        </h1>
        <div className="text-sm space-x-2 text-slate-600">
          <span contentEditable suppressContentEditableWarning onBlur={(e) => updatePersonalInfo('location', e.currentTarget.innerText)}>{data.personalInfo.location}</span>
          <span>|</span>
          <span contentEditable suppressContentEditableWarning onBlur={(e) => updatePersonalInfo('phone', e.currentTarget.innerText)}>{data.personalInfo.phone}</span>
          <span>|</span>
          <span contentEditable suppressContentEditableWarning onBlur={(e) => updatePersonalInfo('email', e.currentTarget.innerText)} className="text-indigo-600 underline">{data.personalInfo.email}</span>
        </div>
        <div className="text-xs mt-1 text-slate-500">
          {data.personalInfo.linkedin && (
            <>
              <span className="hover:text-indigo-600 cursor-pointer underline">{data.personalInfo.linkedin}</span>
              <span className="mx-2">|</span>
            </>
          )}
          {data.personalInfo.portfolio && (
            <span className="hover:text-indigo-600 cursor-pointer underline">{data.personalInfo.portfolio}</span>
          )}
        </div>
      </div>

      {/* Summary */}
      <section className="mb-6">
        <h2 className="text-sm font-bold uppercase tracking-wider border-b border-slate-300 mb-2">Professional Summary</h2>
        <p className="text-sm leading-relaxed outline-none" contentEditable suppressContentEditableWarning onBlur={(e) => onUpdate({...data, summary: e.currentTarget.innerText})}>
          {data.summary}
        </p>
      </section>

      {/* Skills */}
      <section className="mb-6">
        <h2 className="text-sm font-bold uppercase tracking-wider border-b border-slate-300 mb-2">Technical Skills</h2>
        <div className="text-sm outline-none" contentEditable suppressContentEditableWarning onBlur={(e) => onUpdate({...data, skills: e.currentTarget.innerText.split(',').map(s => s.trim())})}>
          <span className="font-bold">Expertise:</span> {data.skills.join(', ')}
        </div>
      </section>

      {/* Experience */}
      <section className="mb-6">
        <h2 className="text-sm font-bold uppercase tracking-wider border-b border-slate-300 mb-3">Professional Experience</h2>
        <div className="space-y-4">
          {data.experience.map((exp, idx) => (
            <div key={exp.id || idx}>
              <div className="flex justify-between items-baseline mb-1">
                <span className="font-bold text-sm" contentEditable suppressContentEditableWarning>{exp.company}</span>
                <span className="text-xs italic">{exp.duration}</span>
              </div>
              <div className="flex justify-between items-baseline mb-2">
                <span className="text-sm italic font-medium">{exp.position}</span>
                <span className="text-xs">{exp.location}</span>
              </div>
              <ul className="list-disc ml-5 text-sm space-y-1">
                {exp.achievements.map((bullet, bIdx) => (
                  <li key={bIdx} contentEditable suppressContentEditableWarning className="outline-none hover:bg-slate-50 transition-colors">
                    {bullet}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Education */}
      <section className="mb-6">
        <h2 className="text-sm font-bold uppercase tracking-wider border-b border-slate-300 mb-2">Education</h2>
        {data.education.map((edu, idx) => (
          <div key={edu.id || idx} className="mb-3">
            <div className="flex justify-between items-baseline">
              <span className="font-bold text-sm">{edu.institution}</span>
              <span className="text-xs">{edu.year}</span>
            </div>
            <div className="text-sm italic">{edu.degree} — {edu.location}</div>
          </div>
        ))}
      </section>

      {/* Projects if available */}
      {data.projects && data.projects.length > 0 && (
        <section>
          <h2 className="text-sm font-bold uppercase tracking-wider border-b border-slate-300 mb-2">Key Projects</h2>
          <div className="space-y-3">
            {data.projects.map((proj, idx) => (
              <div key={proj.id || idx}>
                <div className="flex justify-between items-baseline mb-1">
                  <span className="font-bold text-sm">{proj.name}</span>
                  <span className="text-xs italic">{proj.technologies.join(', ')}</span>
                </div>
                <p className="text-sm leading-snug">{proj.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ResumePreview;
