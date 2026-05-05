
import React from 'react';
import { 
  Database, 
  BrainCircuit, 
  Settings, 
  Server, 
  GraduationCap, 
  Briefcase, 
  Users, 
  Trophy,
  BarChart,
  Code,
  ShieldCheck,
  Zap,
  Globe,
  Search,
  Cpu,
  Workflow
} from 'lucide-react';
import type { Service, Testimonial, Stat, NavItem } from '@/types';

export const WHATSAPP_NUMBER = '917259354946';

export const getWhatsAppLink = (message: string) => {
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
};

/** Use for in-page anchors so links work from non-home routes (e.g. course pages). */
export function marketingNavHref(href: string) {
  if (href.startsWith('#')) return `/#${href.slice(1)}`;
  return href;
}

/** Training homepage path (marketing). */
export const TRAINING_HOME_HREF = '/' as const;

/** HRM app entry (Vite + Firebase) — merged under `/hrm/`. */
export const DASHBOARD_NAV_ITEM: NavItem = { label: 'Dashboard', href: '/hrm/' };

/** Footer / header navigation (in-page anchors on the marketing home + home link). */
export const TRAINING_NAV_ITEMS: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Programs', href: '/programs' },
  { label: 'Careers', href: '/careers' },
  { label: 'Internship', href: '/internship' },
  { label: 'Placements', href: '/placements' },
  { label: 'FAQ', href: '/faq' },
  { label: 'Contact', href: '/contact' },
];

export const SERVICES: Service[] = [
  {
    id: 'ai-consulting',
    title: 'Agentic AI & LLMs',
    description: 'The future of AI. Build autonomous agents using LangChain and advanced LLM frameworks.',
    icon: <BrainCircuit className="w-8 h-8 text-blue-600" />,
    duration: '10 Weeks',
    level: 'Advanced',
    fullDescription: 'Master the next frontier of artificial intelligence. This course focuses on building autonomous software entities that can reason, plan, and execute tasks using LLMs. You will move beyond simple chat interfaces to sophisticated agentic workflows.',
    curriculum: [
      'Foundations of Generative AI and Transformer Architecture',
      'Prompt Engineering and Advanced Reasoning Techniques',
      'Building Agents with LangChain and LangGraph',
      'Multi-Agent Systems with CrewAI and AutoGen',
      'RAG (Retrieval Augmented Generation) at Enterprise Scale',
      'Deployment of AI Agents using Vector Databases'
    ],
    trainer: {
      name: 'Dr. Arshad Ahmed',
      bio: 'AI Research Architect with 12+ years of experience in Natural Language Processing and autonomous systems.',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop',
      expertise: ['Generative AI', 'Python', 'Vector DBs']
    }
  },
  {
    id: 'snowflake',
    title: 'Snowflake Data Cloud',
    description: 'Master the world\'s leading cloud data platform. Architecture, loading, and analytics.',
    icon: <Database className="w-8 h-8 text-blue-600" />,
    duration: '8 Weeks',
    level: 'Intermediate',
    fullDescription: 'Deep dive into the architecture that redefined data warehousing. Learn how Snowflake handles petabyte-scale data with zero management overhead, unique caching, and multi-cluster shared data architecture.',
    curriculum: [
      'Snowflake Architecture and Cloud Ecosystem',
      'Data Loading (Snowpipe, COPY INTO)',
      'Time Travel, Zero-Copy Cloning, and Fail-safe',
      'Performance Tuning and Clustering Keys',
      'Secure Data Sharing and Marketplace',
      'Snowpark and Machine Learning Integrations'
    ],
    trainer: {
      name: 'Suresh K.',
      bio: 'Cloud Data Consultant specializing in Snowflake migration for Fortune 500 companies.',
      image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&h=200&fit=crop',
      expertise: ['Snowflake', 'AWS', 'Big Data']
    }
  },
  {
    id: 'sap-abap',
    title: 'SAP ABAP on HANA',
    description: 'Comprehensive training on SAP programming. Master RICEFW and OData services.',
    icon: <Settings className="w-8 h-8 text-blue-600" />,
    duration: '12 Weeks',
    level: 'Beginner to Pro',
    fullDescription: 'A complete end-to-end journey into the world of SAP ERP programming. We focus heavily on the S/4HANA programming model, ensuring you are ready for the modern enterprise landscape.',
    curriculum: [
      'Introduction to SAP ERP and ABAP Dictionary',
      'Reports (Classical, Interactive, ALV)',
      'RICEFW Objects and Enhancement Framework',
      'ABAP on HANA Programming Model',
      'OData Services and SAP Fiori Integration',
      'Module Pool Programming and Adobe Forms'
    ],
    trainer: {
      name: 'Venkatesh R.',
      bio: 'Lead SAP Consultant with 15 years of industry experience across global SAP implementations.',
      image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop',
      expertise: ['SAP S/4HANA', 'ABAP', 'OData']
    }
  },
  {
    id: 'fullstack',
    title: 'Java Full Stack Development',
    description: 'Master Java, Spring Boot, React, and Microservices for enterprise-scale applications.',
    icon: <Code className="w-8 h-8 text-blue-600" />,
    duration: '16 Weeks',
    level: 'Beginner to Pro',
    fullDescription: 'Become a highly employable full stack developer. We bridge the gap between frontend aesthetics and backend resilience using the most popular enterprise stack: Java Spring Boot and React.',
    curriculum: [
      'Core & Advanced Java (Java 17+)',
      'Spring Boot and Microservices Architecture',
      'Frontend Mastery with React and Tailwind CSS',
      'Database Design with PostgreSQL and Hibernate',
      'Security with JWT and OAuth2',
      'Real-world Project Deployment on AWS'
    ],
    trainer: {
      name: 'Rahul Sharma',
      bio: 'Senior Full Stack Lead with a passion for clean code and scalable architecture.',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
      expertise: ['Java', 'React', 'Cloud Native']
    }
  },
  {
    id: 'python-ds',
    title: 'Python & Data Science',
    description: 'Data analysis, visualization, and predictive modeling using industry-standard libraries.',
    icon: <Cpu className="w-8 h-8 text-blue-600" />,
    duration: '10 Weeks',
    level: 'Intermediate',
    fullDescription: 'Turn data into actionable insights. This course covers the entire data science pipeline, from wrangling messy datasets to building high-accuracy machine learning models.',
    curriculum: [
      'Advanced Python for Data Science',
      'Data Analysis with Pandas and NumPy',
      'Data Visualization with Seaborn and Plotly',
      'Machine Learning Foundations (Regression, Classification)',
      'Deep Learning with TensorFlow and Keras',
      'Capstone: Predictive Business Modeling'
    ],
    trainer: {
      name: 'Priyanka M.',
      bio: 'Senior Data Scientist specialized in predictive analytics and computer vision.',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop',
      expertise: ['Python', 'Machine Learning', 'AI']
    }
  },
  {
    id: 'devops-aws',
    title: 'DevOps & AWS Cloud',
    description: 'Master CI/CD pipelines, Docker, Kubernetes, and AWS infrastructure management.',
    icon: <Workflow className="w-8 h-8 text-blue-600" />,
    duration: '12 Weeks',
    level: 'Advanced',
    fullDescription: 'The blueprint for modern software delivery. Learn how to automate infrastructure, optimize cloud costs, and build high-availability pipelines using industry-standard DevOps tools.',
    curriculum: [
      'AWS Core Services (EC2, S3, RDS, IAM)',
      'Containerization with Docker',
      'Orchestration with Kubernetes (EKS)',
      'CI/CD Pipelines with Jenkins and GitHub Actions',
      'Infrastructure as Code (Terraform)',
      'Monitoring and Logging (Prometheus, ELK)'
    ],
    trainer: {
      name: 'Amit V.',
      bio: 'Cloud Architect and DevOps evangelist with experience in scaling large-scale startups.',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop',
      expertise: ['AWS', 'Kubernetes', 'CI/CD']
    }
  },
  {
    id: 'digital-marketing',
    title: 'Digital Marketing Pro',
    description: 'SEO, SEM, Social Media, and Analytics training to dominate the digital landscape.',
    icon: <Search className="w-8 h-8 text-blue-600" />,
    duration: '8 Weeks',
    level: 'All Levels',
    fullDescription: 'Master the art of online growth. This course is designed for entrepreneurs and professionals looking to drive traffic, convert leads, and build an unstoppable digital brand.',
    curriculum: [
      'Search Engine Optimization (On-page & Off-page)',
      'Google Ads and Performance Marketing',
      'Social Media Strategy and Brand Building',
      'Email Marketing and Automation',
      'Web Analytics and Reporting',
      'Content Strategy and Copywriting'
    ],
    trainer: {
      name: 'Nithin J.',
      bio: 'Marketing Strategist who has managed over $5M in ad spend for global brands.',
      image: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=200&h=200&fit=crop',
      expertise: ['SEO', 'Performance Marketing', 'Growth']
    }
  }
];

export const STATS: Stat[] = [
  { label: 'Years Of Excellence', value: '13+' },
  { label: 'Students Placed', value: '20,000+' },
  { label: 'Corporate Partners', value: '150+' },
  { label: 'Highest Package', value: '25 LPA' },
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 'nithin',
    name: 'Nithin',
    role: 'Digital Marketing Expert',
    company: 'Marketing Pros',
    content: 'I upgraded my skills with Digital Marketing training at YugamCloud.ai. The courses were clear, practical, and guided by expert trainers.',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop',
  },
  {
    id: 'swathi',
    name: 'Swathi',
    role: 'SAP ABAP Consultant',
    company: 'MNC Solutions',
    content: 'I transitioned from a non-IT background to IT by completing SAP ABAP training here. The placement team was incredibly supportive.',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop',
  },
  {
    id: 'rajahariharan',
    name: 'Rajahariharan',
    role: 'Fullstack Developer',
    company: 'Global Tech',
    content: 'YugamCloud provided excellent Fullstack development training with practical projects. Their placement support was valuable in securing a strong role.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
  },
];

export const ALUMNI_SUCCESS = [
  { name: 'Ragu', course: 'SAP ABAP', role: 'Consultant', salary: '12 LPA' },
  { name: 'Pradeep', course: 'DevOps', role: 'Sr. Software Engineer', salary: '25 LPA' },
  { name: 'Manjunath', course: 'SAP ABAP', role: 'Consultant', salary: '10 LPA' },
  { name: 'Supriya', course: 'SAP MM', role: 'Consultant', salary: '7 LPA' },
  { name: 'Kiran Kumar', course: 'Linux Admin', role: 'Administrator', salary: '15 LPA' },
];

export const FAQS = [
  {
    q: "What is SAP ABAP?",
    a: "SAP ABAP (Advanced Business Application Programming) is the high-level programming language used by SAP to develop and customize its enterprise software."
  },
  {
    q: "How does YugamCloud.ai ensure job placements?",
    a: "We have a dedicated 100% placement cell that provides mock interviews, resume building, and direct access to our network of 150+ hiring partners."
  },
  {
    q: "Can I enroll in multiple courses simultaneously?",
    a: "Yes, our modular schedule allows students to balance multiple courses, provided they can dedicate the necessary time to projects and labs."
  },
  {
    q: "Is the curriculum up-to-date?",
    a: "Absolutely. Our curriculum is reviewed every quarter by working professionals to ensure alignment with the latest industry standards and tech stacks."
  }
];

export const VALUE_PROPS = [
  {
    title: 'Expert Trainers',
    description: 'Learn from industry veterans with 10+ years of real-world project experience.',
    icon: <Users className="w-6 h-6" />
  },
  {
    title: 'Live Projects',
    description: 'Work on actual enterprise-level projects to gain practical hands-on experience.',
    icon: <Briefcase className="w-6 h-6" />
  },
  {
    title: 'Placement Support',
    description: 'Dedicated placement cell with a network of 150+ corporate hiring partners.',
    icon: <Trophy className="w-6 h-6" />
  },
  {
    title: 'Flexible Learning',
    description: 'Choose between classroom, online, or corporate training modules to fit your schedule.',
    icon: <Zap className="w-6 h-6" />
  }
];
