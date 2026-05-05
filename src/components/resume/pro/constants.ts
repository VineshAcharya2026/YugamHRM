import type { ResumeData, Template } from './types';

export function createEmptyResumeData(overrides?: Partial<ResumeData['personalInfo']>): ResumeData {
  return {
    personalInfo: {
      fullName: overrides?.fullName ?? '',
      email: overrides?.email ?? '',
      phone: overrides?.phone ?? '',
      location: overrides?.location ?? '',
      website: overrides?.website ?? '',
      role: overrides?.role ?? '',
      summary: overrides?.summary ?? '',
    },
    experience: [],
    education: [],
    skills: [],
    projects: [],
    languages: [],
  };
}

export const TEMPLATES: Template[] = [
  { id: 'modern', name: 'Modern Sans', thumbnail: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=400&auto=format&fit=crop&q=60' },
  { id: 'professional', name: 'Executive Serif', thumbnail: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=400&auto=format&fit=crop&q=60' },
  { id: 'minimal', name: 'Minimalist Clean', thumbnail: 'https://images.unsplash.com/photo-1512486130939-2c4f79935e4f?w=400&auto=format&fit=crop&q=60' },
  { id: 'creative', name: 'Playful Designer', thumbnail: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=400&auto=format&fit=crop&q=60' },
  { id: 'standard-tech', name: 'Standard Software', thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&auto=format&fit=crop&q=60' },
  { id: 'data-scientist', name: 'Data Insights', thumbnail: 'https://images.unsplash.com/photo-1551288049-bbda4865cda1?w=400&auto=format&fit=crop&q=60' },
  { id: 'product-exec', name: 'Strategic Lead', thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&auto=format&fit=crop&q=60' },
  { id: 'ux-designer', name: 'UX Centric', thumbnail: 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=400&auto=format&fit=crop&q=60' },
  { id: 'cloud-architect', name: 'Skyline Cloud', thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&auto=format&fit=crop&q=60' },
  { id: 'cyber-sec', name: 'Shielded Info', thumbnail: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400&auto=format&fit=crop&q=60' },
  { id: 'frontend-dev', name: 'Pixel Perfect', thumbnail: 'https://images.unsplash.com/photo-1547658719-da2b51169166?w=400&auto=format&fit=crop&q=60' },
  { id: 'backend-env', name: 'Server Core', thumbnail: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc51?w=400&auto=format&fit=crop&q=60' },
  { id: 'engineering-mgr', name: 'Leadership Pro', thumbnail: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&auto=format&fit=crop&q=60' },
  { id: 'devops-pro', name: 'Continuous Ops', thumbnail: 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=400&auto=format&fit=crop&q=60' },
  { id: 'qa-expert', name: 'Bug Hunter', thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&auto=format&fit=crop&q=60' },
  { id: 'ai-researcher', name: 'Neural Network', thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&auto=format&fit=crop&q=60' },
  { id: 'mobile-dev', name: 'App Specialist', thumbnail: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&auto=format&fit=crop&q=60' },
  { id: 'fullstack-modern', name: 'End-to-End Elite', thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&auto=format&fit=crop&q=60' },
  { id: 'systems-admin', name: 'Root Infrastructure', thumbnail: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=400&auto=format&fit=crop&q=60' },
  { id: 'tech-writer', name: 'Documentation Guru', thumbnail: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400&auto=format&fit=crop&q=60' },
];
