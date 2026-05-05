export interface ResumeData {
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    website: string;
    role: string;
    summary: string;
    profileImage?: string;
  };
  experience: Experience[];
  education: Education[];
  skills: string[];
  projects: Project[];
  languages: string[];
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

export interface Education {
  id: string;
  school: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate: string;
  grade: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  link: string;
}

export type TemplateId =
  | 'modern'
  | 'professional'
  | 'minimal'
  | 'creative'
  | 'standard-tech'
  | 'data-scientist'
  | 'product-exec'
  | 'ux-designer'
  | 'cloud-architect'
  | 'cyber-sec'
  | 'frontend-dev'
  | 'backend-env'
  | 'engineering-mgr'
  | 'devops-pro'
  | 'qa-expert'
  | 'ai-researcher'
  | 'mobile-dev'
  | 'fullstack-modern'
  | 'systems-admin'
  | 'tech-writer';

export interface Template {
  id: TemplateId;
  name: string;
  thumbnail: string;
}
