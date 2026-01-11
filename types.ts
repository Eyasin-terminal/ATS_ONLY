
export interface WorkExperience {
  id: string;
  company: string;
  position: string;
  duration: string;
  location: string;
  achievements: string[];
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  year: string;
  location: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string[];
}

export interface ResumeData {
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    linkedin?: string;
    portfolio?: string;
  };
  summary: string;
  experience: WorkExperience[];
  education: Education[];
  skills: string[];
  projects: Project[];
}

export interface OptimizationResult {
  optimizedResume: ResumeData;
  matchScore: number;
  extractedKeywords: string[];
  missingKeywords: string[];
  improvementSuggestions: string[];
}

export enum Step {
  UPLOAD = 'UPLOAD',
  OPTIMIZING = 'OPTIMIZING',
  REVIEW = 'REVIEW'
}
