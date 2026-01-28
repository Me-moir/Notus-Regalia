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

export interface Statement {
  id: string;
  title: string;
  date: string;
  tags: Array<'Public Disclosure' | 'Compliance' |  'Recruitment' | 'Governance' | 'Venture' | 'Capital' | 'Research & Development' | 'Partnerships' | 'Operations'>;
  content: string;
  pdfUrl?: string;
  linkUrl?: string;
}

export const executiveSummary: ExecutiveSummaryContent = {
  title: 'Regalitica Holdings',
  description: [
    'Regalitica is a holding and venture-building entity established to develop, steward, and scale early-stage systems and ventures across multiple industries. We operate as a structured platform for capital-efficient experimentation, validation, and long-term value creation.',
    'Currently operating in a pre-seed, stealth phase, Regalitica is advancing a portfolio of early initiatives at varying stages of maturity. Projects developed under the Regalitica umbrella leverage shared infrastructure, governance, and operational oversight, without reliance on external funding at this stage.'
  ],
  buttonText: 'About Regalitica'
};

export const featureBoxes: FeatureBox[] = [
  {
    icon: 'bi-collection',
    title: 'Venture-Building Platform',
    description:
      'We develop and oversee multiple ventures through a centralized operating framework, rather than managing a single standalone company.'
  },
  {
    icon: 'bi-arrows-move',
    title: 'Cross-Sector Mandate',
    description:
      'Our activities are sector-agnostic, allowing capital and effort to be allocated toward opportunities with asymmetric impact.'
  },
  {
    icon: 'bi-bounding-box',
    title: 'Systems-First Governance',
    description:
      'We prioritize repeatable operating systems for ideation, validation, execution, and scale over isolated experimentation.'
  },
  {
    icon: 'bi-mortarboard',
    title: 'Founder-Operator Model',
    description:
      'Regalitica functions as a founder-operator platform. While student-founded, ventures are governed with institutional discipline and long-term ownership principles.'
  },
  {
    icon: 'bi-leaf',
    title: 'Early-Stage Capital Formation',
    description:
      'We focus on converting undeveloped concepts into venture-ready entities through disciplined validation and controlled deployment of resources.'
  },
  {
    icon: 'bi-eye-slash',
    title: 'Stealth Operations',
    description:
      'Operating in stealth enables concentrated development, reduced external signaling, and strategic optionality ahead of public exposure.'
  },
  {
    icon: 'bi-stars',
    title: 'Shared Infrastructure',
    description:
      'Ventures leverage centralized technical, operational, and strategic infrastructure designed to compound execution efficiency.'
  },
  {
    icon: 'bi-share',
    title: 'Selective External Alignment',
    description:
      'We engage selectively with external partners and institutions where alignment supports long-term structural objectives.'
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

export const statements: Statement[] = [
  {
    id: 'statement-001',
    title: 'Regalitica Holdings Announces Formation and Stealth Operating Framework',
    date: 'January 15, 2025',
    tags: ['Public Disclosure', 'Recruitment'],
    content: 'Regalitica Holdings has been formally established as a holding and venture-building entity focused on developing, stewarding, and scaling early-stage systems across multiple industries. Operating in a pre-seed, stealth phase, the entity will pursue capital-efficient experimentation and validation through a centralized platform designed for long-term value creation, prioritizing repeatable operating systems, shared infrastructure, and disciplined governance over isolated project execution.',
    pdfUrl: '/documents/formation-announcement.pdf',
    linkUrl: 'https://regalitica.com/announcements/formation'
  },
  {
    id: 'statement-002',
    title: 'Portfolio Development Update: Healthcare and FinTech Ventures Progress to Beta',
    date: 'December 8, 2024',
    tags: ['Venture', 'Research & Development', 'Operations'],
    content: 'Two ventures under the Regalitica umbrella—AI Telemedicine Platform and Micro-Lending Blockchain—have successfully transitioned to private beta and beta testing phases respectively. The AI Telemedicine Platform is currently undergoing controlled deployment with select healthcare partners in underserved regions, demonstrating offline diagnostic capabilities and real-time synchronization protocols, while the blockchain-based microfinancing platform has completed smart contract audits and is conducting pilot programs with small business borrowers in three emerging markets.',
    pdfUrl: '/documents/q4-2024-venture-update.pdf'
  },
  {
    id: 'statement-003',
    title: 'Governance Framework and Operational Principles Published',
    date: 'November 22, 2024',
    tags: ['Governance', 'Compliance', 'Public Disclosure'],
    content: 'Regalitica has formalized its governance framework outlining decision-making protocols, resource allocation methodologies, and venture oversight mechanisms. The framework establishes clear delineation between holding entity responsibilities and individual venture operations, ensuring institutional discipline while maintaining operational flexibility through systems-first thinking, capital efficiency, asymmetric opportunity prioritization, and founder-operator alignment with long-term ownership structures, including standardized processes for venture validation, stage-gate advancement criteria, and risk management protocols across the portfolio.',
    linkUrl: 'https://regalitica.com/governance/framework'
  },
  {
    id: 'statement-004',
    title: 'CleanTech Initiative Reaches Pilot Stage with Industrial Partners',
    date: 'October 30, 2024',
    tags: ['Venture', 'Research & Development', 'Partnerships'],
    content: 'The Smart Carbon Capture system has advanced to pilot deployment following successful prototype validation and environmental impact assessment, with three industrial facilities across manufacturing and energy sectors selected as initial pilot sites for IoT-enabled carbon monitoring and capture technology. Preliminary data indicates potential emissions reductions of 40-50% with real-time analytics capabilities significantly exceeding baseline projections, while strategic partnerships with carbon credit verification agencies are in advanced discussions to establish tradeable credit generation protocols.',
    pdfUrl: '/documents/cleantech-pilot-report.pdf',
    linkUrl: 'https://regalitica.com/ventures/cleantech'
  },
  {
    id: 'statement-005',
    title: 'Strategic Infrastructure Investment: Shared Technical Platform Operational',
    date: 'September 18, 2024',
    tags: ['Operations', 'Capital', 'Research & Development'],
    content: 'Regalitica has completed development and deployment of centralized technical infrastructure designed to support multiple ventures simultaneously, including shared development environments, API frameworks, data analytics pipelines, and security protocols that compound execution efficiency across the portfolio. This infrastructure investment enables ventures to achieve production readiness 35-40% faster than traditional standalone development approaches, with modular architecture supporting integration that allows new ventures to leverage existing systems while maintaining operational independence where strategically appropriate.'
  },
  {
    id: 'statement-006',
    title: 'EdTech Platform Enters Testing Phase with Education Partners',
    date: 'August 12, 2024',
    tags: ['Venture', 'Partnerships', 'Research & Development'],
    content: 'The Adaptive STEM Learning platform has commenced testing phase in partnership with educational institutions across three developing regions, with initial cohorts of 500+ students engaging with AI-powered personalized learning paths showing promising engagement and comprehension improvements. Teacher feedback sessions have informed iterative refinements to interface design, content delivery mechanisms, and progress tracking analytics, while platform architecture supports both online and offline learning modes to address connectivity challenges prevalent in target deployment regions.',
    pdfUrl: '/documents/edtech-testing-report.pdf'
  },
  {
    id: 'statement-007',
    title: 'Regalitica Establishes Advisory Board for Long-Term Strategic Guidance',
    date: 'July 5, 2024',
    tags: ['Governance', 'Partnerships', 'Operations'],
    content: 'An advisory board comprising industry veterans, academic researchers, and operational experts has been established to provide strategic oversight and domain-specific guidance across healthcare technology, financial systems, sustainable infrastructure, and educational innovation. The advisory structure is designed to complement founder-operator decision-making with external perspective while maintaining operational autonomy, with quarterly strategic reviews assessing portfolio performance, validating market assumptions, and informing resource allocation decisions.',
    linkUrl: 'https://regalitica.com/about/advisory-board'
  },
  {
    id: 'statement-008',
    title: 'Compliance and Regulatory Framework Certification Achieved',
    date: 'June 20, 2024',
    tags: ['Compliance', 'Governance', 'Operations'],
    content: 'Regalitica has completed comprehensive compliance assessments across all active ventures, achieving necessary certifications and regulatory approvals including HIPAA compliance certification for healthcare venture operations ensuring patient data protection and privacy standards, KYC/AML framework implementation for FinTech platform with preliminary regulatory approval in initial deployment markets, and ongoing compliance monitoring systems established to maintain adherence to evolving regulatory requirements across all sectors.',
    pdfUrl: '/documents/compliance-certification.pdf'
  }
];