import { ResumeData, Template } from './types';

export const INITIAL_DATA: ResumeData = {
  personalInfo: {
    fullName: 'John Doe',
    role: 'Senior Software Engineer',
    email: 'john.doe@example.com',
    phone: '+1 (555) 000-0000',
    location: 'San Francisco, CA',
    website: 'johndoe.dev',
    summary: 'Passionate software engineer with 8+ years of experience in building scalable web applications. Expert in React, Node.js, and cloud architecture. Proven track record of leading teams and delivering high-quality products.',
  },
  experience: [
    {
      id: '1',
      company: 'Tech Solutions Inc.',
      position: 'Senior Developer',
      location: 'Remote',
      startDate: '2021-01',
      endDate: '',
      current: true,
      description: 'Led the migration of a legacy monolithic application to a microservices architecture. Managed a team of 5 developers and improved deployment speed by 40%.',
    },
    {
      id: '2',
      company: 'Digital Agency',
      position: 'Frontend Engineer',
      location: 'New York, NY',
      startDate: '2018-05',
      endDate: '2020-12',
      current: false,
      description: 'Developed interactive dashboards using React and D3.js. Optimized frontend performance, reducing initial load time by 50%.',
    },
  ],
  education: [
    {
      id: '1',
      school: 'University of Technology',
      degree: 'Master of Science',
      fieldOfStudy: 'Computer Science',
      startDate: '2016-09',
      endDate: '2018-05',
      grade: '3.9/4.0',
    },
  ],
  skills: ['React', 'TypeScript', 'Node.js', 'AWS', 'GraphQL', 'Docker', 'Python', 'System Design'],
  projects: [
    {
      id: '1',
      name: 'Open Source UI Library',
      description: 'A comprehensive collection of reusable React components designed for high performance and accessibility.',
      link: 'github.com/johndoe/ui-lib',
    }
  ],
  languages: ['English (Native)', 'Spanish (Professional)'],
};

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
