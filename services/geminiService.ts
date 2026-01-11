
import { GoogleGenAI, Type } from "@google/genai";
import { ResumeData, OptimizationResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

const RESUME_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    personalInfo: {
      type: Type.OBJECT,
      properties: {
        fullName: { type: Type.STRING },
        email: { type: Type.STRING },
        phone: { type: Type.STRING },
        location: { type: Type.STRING },
        linkedin: { type: Type.STRING },
        portfolio: { type: Type.STRING }
      },
      required: ["fullName", "email"]
    },
    summary: { type: Type.STRING },
    experience: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          company: { type: Type.STRING },
          position: { type: Type.STRING },
          duration: { type: Type.STRING },
          location: { type: Type.STRING },
          achievements: { type: Type.ARRAY, items: { type: Type.STRING } }
        }
      }
    },
    education: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          institution: { type: Type.STRING },
          degree: { type: Type.STRING },
          year: { type: Type.STRING },
          location: { type: Type.STRING }
        }
      }
    },
    skills: { type: Type.ARRAY, items: { type: Type.STRING } },
    projects: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          name: { type: Type.STRING },
          description: { type: Type.STRING },
          technologies: { type: Type.ARRAY, items: { type: Type.STRING } }
        }
      }
    }
  }
};

const OPTIMIZATION_RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    optimizedResume: RESUME_SCHEMA,
    matchScore: { type: Type.NUMBER },
    extractedKeywords: { type: Type.ARRAY, items: { type: Type.STRING } },
    missingKeywords: { type: Type.ARRAY, items: { type: Type.STRING } },
    improvementSuggestions: { type: Type.ARRAY, items: { type: Type.STRING } }
  }
};

export const optimizeResume = async (
  pdfBase64: string,
  jobDescription: string
): Promise<OptimizationResult> => {
  const model = 'gemini-3-flash-preview';
  
  const prompt = `
    You are an expert ATS (Applicant Tracking System) optimization consultant.
    
    TASK:
    1. Parse the attached Resume PDF.
    2. Analyze the provided Job Description (JD).
    3. Rewrite and Optimize the Resume to maximize the ATS match score for this specific JD.
    
    STRICT CONSTRAINTS:
    - DO NOT HALLUCINATE: Only rephrase or highlight existing experiences. Do not add job titles, companies, or specific dates not found in the original resume.
    - If a skill mentioned in the JD is logically implied by the candidate's history but not explicitly stated, you may include it as a "Suggested Addition" in the suggestions field.
    - Use powerful action verbs and quantify achievements if the original text allows it.
    - Structure the content for a single-column, ATS-safe format.
    - Identify key skills/keywords missing from the original resume that are present in the JD.
    
    JOB DESCRIPTION:
    ${jobDescription}
  `;

  const result = await ai.models.generateContent({
    model,
    contents: [
      {
        parts: [
          {
            inlineData: {
              mimeType: "application/pdf",
              data: pdfBase64,
            },
          },
          { text: prompt },
        ],
      },
    ],
    config: {
      responseMimeType: "application/json",
      responseSchema: OPTIMIZATION_RESPONSE_SCHEMA,
    },
  });

  return JSON.parse(result.text);
};
