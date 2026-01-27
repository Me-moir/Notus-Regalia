export interface TeamMember {
  name: string;
  role: string;
  color: string;
}

export interface Industry {
  name: string;
  description: string;
  problem: string;
  valueProposition: string;
  team: TeamMember[];
}

export interface Project {
  title: string;
  industryName: string;
  industryDescription: string;
  description: string;
  problem: string;
  valueProposition: string;
  team: TeamMember[];
  domains: string[];
  features: string[];
  timeline: { stage: string; date: string; status: 'complete' | 'current' | 'future' }[];
}

export interface ExecutiveSummaryContent {
  title: string;
  description: string[];
  buttonText: string;
}

export interface FeatureBox {
  icon: string;
  title: string;
  description: string;
}

export const executiveSummary: ExecutiveSummaryContent = {
  title: 'Regalitica Holdings',
  description: [
    'Regalitica is a student-led innovation holding company and venture studio, built as a platform for ideas, experimentation, and future startups. We exist to build systems that create companies, incubate concepts, and accelerate projects across industries — all while maintaining a shared ecosystem where student founders can grow their ventures together.',
    'Currently in its pre-seed, stealth phase, Regalitica is developing and validating multiple projects, ranging from early-stage concepts to potential startups. Each project is nurtured under the Regalitica umbrella, gaining visibility, mentorship, and operational guidance — without requiring external funding at this stage.'
  ],
  buttonText: 'More about us'
};

export const featureBoxes: FeatureBox[] = [
  {
    icon: 'bi-collection',
    title: 'Venture Studio Model',
    description: "We don't run a single startup — we build and incubate multiple ventures under one structured system."
  },
  {
    icon: 'bi-arrows-move',
    title: 'Multi-Sector Exploration',
    description: 'Our projects span across different industries, allowing us to identify high-impact opportunities beyond a single market.'
  },
  {
    icon: 'bi-bounding-box',
    title: 'Systems-First Approach',
    description: 'We focus on building repeatable systems for ideation, validation, execution, and scaling — not one-off experiments.'
  },
  {
    icon: 'bi-mortarboard',
    title: 'Student-Led Innovation',
    description: 'Founded and operated by students, we move fast, experiment boldly, and build with a long-term learning mindset.'
  },
  {
    icon: 'bi-leaf',
    title: 'Pre-Seed Venture Incubation',
    description: 'We specialize in turning early concepts into real, testable ventures through MVPs, pilots, and market validation.'
  },
  {
    icon: 'bi-eye-slash',
    title: 'Stealth & Future-Oriented',
    description: 'Operating in stealth allows us to develop frontier ideas quietly while preparing for public launches and partnerships.'
  },
  {
    icon: 'bi-stars',
    title: 'Tech-Enabled Systems',
    description: 'We leverage state of the art tools, systems, and processes to scale projects efficiently. Our projects aim to solve meaningful problems across industries, shaping the future of work, society, and technology.'
  },
  {
    icon: 'bi-share',
    title: 'Open to Collaboration',
    description: 'We actively collaborate with partners, institutions, and external teams, with pathways for projects to evolve into independent companies.'
  }
];

export const industries: Industry[] = [
  {
    name: 'Healthcare',
    description: 'Revolutionary healthcare solutions that make quality care accessible, affordable, and personalized for everyone.',
    problem: 'Rural patients lack access to real-time specialist care, leading to delayed diagnoses and increased healthcare costs. Traditional telemedicine solutions fail to address connectivity issues in underserved areas.',
    valueProposition: 'AI-powered diagnostic assistant that works offline, providing immediate preliminary assessments and prioritizing cases for remote specialist review when connectivity is restored.',
    team: [
      { name: 'Dr. Sarah Chen', role: 'Team Leader', color: 'bg-[#DC143C]' },
      { name: 'Marcus Johnson', role: 'Lead Developer', color: 'bg-blue-500' },
      { name: 'Aisha Patel', role: 'UX Designer', color: 'bg-purple-500' },
      { name: 'David Kim', role: 'Data Scientist', color: 'bg-green-500' },
    ],
  },
  {
    name: 'FinTech',
    description: 'Next-generation financial technology that democratizes access to banking, investing, and wealth management.',
    problem: 'Small businesses in emerging markets lack access to affordable credit and financial services, limiting their growth potential and economic impact.',
    valueProposition: 'Blockchain-based microfinancing platform with AI credit scoring that reduces lending costs by 60% while expanding access to previously unbanked populations.',
    team: [
      { name: 'James Martinez', role: 'CEO & Founder', color: 'bg-[#DC143C]' },
      { name: 'Priya Sharma', role: 'Blockchain Lead', color: 'bg-cyan-500' },
      { name: 'Alex Wong', role: 'Risk Analyst', color: 'bg-indigo-500' },
    ],
  },
  {
    name: 'CleanTech',
    description: 'Sustainable technologies that combat climate change while creating profitable business models.',
    problem: 'Industrial facilities struggle to reduce carbon emissions due to high costs and lack of real-time monitoring systems.',
    valueProposition: 'IoT-enabled carbon capture system with real-time analytics that reduces industrial emissions by 45% while generating tradeable carbon credits.',
    team: [
      { name: 'Dr. Lisa Zhang', role: 'Chief Scientist', color: 'bg-[#DC143C]' },
      { name: 'Robert Green', role: 'Engineering Lead', color: 'bg-teal-500' },
      { name: 'Maya Okafor', role: 'Sustainability Advisor', color: 'bg-lime-500' },
    ],
  },
  {
    name: 'EdTech',
    description: 'Innovative learning platforms powered by AI that provide personalized education pathways.',
    problem: 'Students in developing regions lack access to quality STEM education, with teacher shortages limiting opportunities.',
    valueProposition: 'AI tutor platform with adaptive learning that provides personalized STEM education at scale, proven to improve test scores by 35%.',
    team: [
      { name: 'Prof. Ahmed Hassan', role: 'Chief Educator', color: 'bg-[#DC143C]' },
      { name: 'Jessica Park', role: 'AI/ML Engineer', color: 'bg-violet-500' },
      { name: 'Carlos Rivera', role: 'Content Director', color: 'bg-fuchsia-500' },
    ],
  },
];

export const allProjects: Project[] = [
  {
    title: 'AI Telemedicine Platform',
    industryName: 'Healthcare',
    industryDescription: industries[0].description,
    description: 'An AI-powered diagnostic assistant for remote healthcare delivery in underserved areas.',
    problem: industries[0].problem,
    valueProposition: industries[0].valueProposition,
    team: industries[0].team,
    domains: ['AI', 'SaaS', 'HealthTech'],
    features: ['Offline Mode', 'AI Diagnostics', 'Real-time Sync', 'HIPAA Compliant', 'Multi-language', 'Cloud Backup'],
    timeline: [
      { stage: 'Concept', date: 'Jan 2024', status: 'complete' },
      { stage: 'Development', date: 'Mar 2024', status: 'complete' },
      { stage: 'Private Beta', date: 'Nov 2024', status: 'current' },
      { stage: 'Live', date: 'Q1 2025', status: 'future' },
      { stage: 'Scale', date: 'Q3 2025', status: 'future' },
    ],
  },
  {
    title: 'Micro-Lending Blockchain',
    industryName: 'FinTech',
    industryDescription: industries[1].description,
    description: 'Blockchain-based microfinancing with AI credit scoring for emerging markets.',
    problem: industries[1].problem,
    valueProposition: industries[1].valueProposition,
    team: industries[1].team,
    domains: ['Blockchain', 'DeFi', 'Web3'],
    features: ['Smart Contracts', 'AI Credit Score', 'Multi-currency', 'KYC Integration', 'Mobile First', 'Low Fees'],
    timeline: [
      { stage: 'Concept', date: 'Feb 2024', status: 'complete' },
      { stage: 'Development', date: 'May 2024', status: 'complete' },
      { stage: 'Beta', date: 'Dec 2024', status: 'current' },
      { stage: 'Launch', date: 'Q2 2025', status: 'future' },
      { stage: 'Expand', date: 'Q4 2025', status: 'future' },
    ],
  },
  {
    title: 'Smart Carbon Capture',
    industryName: 'CleanTech',
    industryDescription: industries[2].description,
    description: 'IoT-enabled carbon capture system with real-time analytics and credit generation.',
    problem: industries[2].problem,
    valueProposition: industries[2].valueProposition,
    team: industries[2].team,
    domains: ['IoT', 'CleanTech', 'AI'],
    features: ['Real-time Monitor', 'Carbon Credits', 'Predictive AI', 'Dashboard', 'API Access', 'Compliance'],
    timeline: [
      { stage: 'Research', date: 'Mar 2024', status: 'complete' },
      { stage: 'Prototype', date: 'Jul 2024', status: 'complete' },
      { stage: 'Pilot', date: 'Jan 2025', status: 'current' },
      { stage: 'Deploy', date: 'Q3 2025', status: 'future' },
      { stage: 'Scale', date: 'Q1 2026', status: 'future' },
    ],
  },
  {
    title: 'Adaptive STEM Learning',
    industryName: 'EdTech',
    industryDescription: industries[3].description,
    description: 'AI tutor platform with personalized learning paths for global STEM education.',
    problem: industries[3].problem,
    valueProposition: industries[3].valueProposition,
    team: industries[3].team,
    domains: ['EdTech', 'AI', 'Mobile'],
    features: ['Adaptive Learning', 'Progress Track', 'Gamification', 'Offline Mode', 'Teacher Tools', 'Analytics'],
    timeline: [
      { stage: 'Design', date: 'Apr 2024', status: 'complete' },
      { stage: 'Build', date: 'Aug 2024', status: 'complete' },
      { stage: 'Testing', date: 'Feb 2025', status: 'current' },
      { stage: 'Release', date: 'Q2 2025', status: 'future' },
      { stage: 'Global', date: 'Q4 2025', status: 'future' },
    ],
  },
];

export const partners = [
  'TechCorp',
  'InnovateLabs',
  'FutureVentures',
  'AlphaPartners',
  'BetaGroup',
  'GammaInvest',
  'DeltaFund',
  'EpsilonCapital'
];