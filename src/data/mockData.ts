import type {
  Job,
  Candidate,
  OutreachMessage,
  Interview,
  RecruiterTask,
  AIActivityEvent,
  ClientAccount,
  PrivacyRequest,
  SecurityAuditEvent,
  AppSettings,
} from '../types';

export const initialJobs: Job[] = [
  {
    id: 'job-101',
    title: 'Senior Frontend Engineer',
    department: 'Engineering',
    location: 'Bengaluru, India (Hybrid)',
    employmentType: 'Full-time',
    experienceLevel: '5-8 Years',
    skills: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS', 'State Management', 'Web Performance'],
    description:
      'We are looking for a Senior Frontend Engineer to build high-performance, accessible, and resilient client-facing applications for our core operations suite. You will lead UI architecture, mentor junior developers, and collaborate closely with product and design.',
    client: 'HyperScale Fintech (Demo)',
    priority: 'High',
    status: 'Open',
    createdAt: '2026-08-01',
    applicantsCount: 38,
    shortlistedCount: 4,
    salaryRange: '₹32,00,000 - ₹45,00,000 PA',
  },
  {
    id: 'job-102',
    title: 'Lead Backend Architect (Distributed Systems)',
    department: 'Platform Engineering',
    location: 'Hyderabad, India (Hybrid)',
    employmentType: 'Full-time',
    experienceLevel: '8-12 Years',
    skills: ['Go', 'Kafka', 'PostgreSQL', 'Kubernetes', 'gRPC', 'Distributed Systems'],
    description:
      'Seeking an experienced Backend Architect to design and scale high-throughput transaction processing pipelines capable of processing millions of events per minute with sub-50ms latency.',
    client: 'FinFlow Global (Demo)',
    priority: 'High',
    status: 'Open',
    createdAt: '2026-08-04',
    applicantsCount: 24,
    shortlistedCount: 2,
    salaryRange: '₹48,00,000 - ₹65,00,000 PA',
  },
  {
    id: 'job-103',
    title: 'Staff AI/ML Engineer (LLM Applications)',
    department: 'AI & Data Intelligence',
    location: 'Bengaluru, India (Remote)',
    employmentType: 'Full-time',
    experienceLevel: '6-10 Years',
    skills: ['Python', 'PyTorch', 'LangChain', 'RAG Pipelines', 'Vector Databases', 'Model Fine-tuning'],
    description:
      'Lead the development and deployment of generative AI workflows, context retrieval systems, and prompt evaluation frameworks for enterprise workflows.',
    client: 'CognitiveCore AI (Demo)',
    priority: 'High',
    status: 'Open',
    createdAt: '2026-08-08',
    applicantsCount: 19,
    shortlistedCount: 3,
    salaryRange: '₹50,00,000 - ₹70,00,000 PA',
  },
  {
    id: 'job-104',
    title: 'Product Design Lead (Design Systems)',
    department: 'Product & Design',
    location: 'Mumbai, India (Hybrid)',
    employmentType: 'Full-time',
    experienceLevel: '6-9 Years',
    skills: ['Figma', 'Design Systems', 'Micro-interactions', 'User Research', 'Accessibility (WCAG)', 'Prototyping'],
    description:
      'Lead the evolution of our enterprise design system, establishing cohesive component standards, interaction patterns, and design-to-code pipelines across web and mobile surfaces.',
    client: 'DesignKraft Studio (Demo)',
    priority: 'Medium',
    status: 'Open',
    createdAt: '2026-08-10',
    applicantsCount: 15,
    shortlistedCount: 1,
    salaryRange: '₹30,00,000 - ₹42,00,000 PA',
  },
  {
    id: 'job-105',
    title: 'DevOps & Cloud Security Specialist',
    department: 'Infrastructure',
    location: 'Gurugram, India (Hybrid)',
    employmentType: 'Full-time',
    experienceLevel: '4-7 Years',
    skills: ['AWS', 'Terraform', 'CI/CD', 'Docker', 'Zero Trust', 'SOC2 Compliance'],
    description:
      'Own infrastructure security automation, CI/CD reliability, container orchestration, and cloud governance frameworks.',
    client: 'CloudArmor Systems (Demo)',
    priority: 'Medium',
    status: 'Paused',
    createdAt: '2026-07-25',
    applicantsCount: 29,
    shortlistedCount: 2,
    salaryRange: '₹26,00,000 - ₹38,00,000 PA',
  },
  {
    id: 'job-106',
    title: 'Associate Product Manager',
    department: 'Product',
    location: 'Pune, India (On-site)',
    employmentType: 'Full-time',
    experienceLevel: '2-4 Years',
    skills: ['Product Analytics', 'SQL', 'User Stories', 'A/B Testing', 'Roadmapping'],
    description:
      'Work with cross-functional engineering and design squads to execute product sprints, analyze user behavior funnels, and optimize conversion metrics.',
    client: 'Nexus Commerce (Demo)',
    priority: 'Low',
    status: 'Draft',
    createdAt: '2026-08-12',
    applicantsCount: 0,
    shortlistedCount: 0,
    salaryRange: '₹18,00,000 - ₹24,00,000 PA',
  },
];

export const initialCandidates: Candidate[] = [
  {
    id: 'cand-1',
    name: 'Sarah Chen',
    title: 'Senior Frontend Engineer',
    experienceYears: 6,
    location: 'Bengaluru, India',
    email: 'sarah.chen.demo@example.com',
    phone: '+91 98765 43210',
    skills: ['React', 'TypeScript', 'Next.js', 'Design Systems', 'Web Performance', 'GraphQL'],
    status: 'Qualified',
    matchScore: 91,
    appliedJobId: 'job-101',
    appliedJobTitle: 'Senior Frontend Engineer',
    summary:
      'Specialized in building modular frontend architectures, scalable component libraries, and optimized web apps with 6+ years of production experience.',
    experienceList: [
      {
        title: 'Senior Frontend Engineer',
        company: 'NovaStack Solutions (Demo)',
        period: '2022 - Present (2.5 yrs)',
        description:
          'Spearheaded the migration of the flagship dashboard to Next.js and TypeScript, reducing load time by 42% and implementing an internal design system used by 35 engineers.',
      },
      {
        title: 'Frontend Developer',
        company: 'AppScale India (Demo)',
        period: '2020 - 2022 (2 yrs)',
        description:
          'Built core client-facing features using React and Redux Toolkit. Integrated real-time WebSocket feeds for financial analytics dashboard.',
      },
    ],
    educationList: [
      {
        degree: 'B.Tech in Computer Science and Engineering',
        institution: 'NIT Karnataka, Surathkal (Demo)',
        year: '2020',
      },
    ],
    strengths: [
      'Strong proficiency in React, TypeScript, and modern state architecture',
      'Proven experience building and maintaining enterprise Design Systems',
      'Demonstrated impact on web performance optimization (42% speed improvement)',
    ],
    potentialGaps: [
      'Limited explicit mention of backend Node.js microservice experience',
      'Moderate team leadership experience (primarily individual contributor role)',
    ],
    aiAnalysisExplanation:
      'Sarah Chen presents an exceptional match (91%) for the Senior Frontend Engineer role. Her deep background in React, TypeScript, and design systems directly matches 5/6 required role skills. Her previous achievements in performance optimization align with our scalability requirements.',
    resumeText: `SARAH CHEN — SENIOR FRONTEND ENGINEER
Email: sarah.chen.demo@example.com | Bengaluru, India | LinkedIn (Demo)

SUMMARY:
Results-driven Senior Frontend Engineer with 6 years of experience building high-traffic, reactive web applications and design systems. Deep expertise in React, TypeScript, Next.js, and browser performance.

EXPERIENCE:
NovaStack Solutions — Senior Frontend Engineer (2022 - Present)
- Architected modular frontend component library reducing code duplication by 35%.
- Migrated legacy SPA to Next.js 14 App Router, cutting LCP from 2.8s to 1.1s.
- Led frontend code reviews and established automated visual regression testing pipelines.

AppScale India — Frontend Developer (2020 - 2022)
- Built interactive data visualization charts with D3 and Canvas.
- Implemented state management using Redux Toolkit and React Query.

SKILLS:
React, TypeScript, Next.js, JavaScript (ES6+), CSS3/Sass, Webpack/Vite, Jest/Playwright, CI/CD, Git.

EDUCATION:
B.Tech in Computer Science — NIT Karnataka, Surathkal (2016-2020)`,
    appliedDate: '2026-08-03',
  },
  {
    id: 'cand-2',
    name: 'Rajesh Menon',
    title: 'Distributed Systems Architect',
    experienceYears: 10,
    location: 'Hyderabad, India',
    email: 'rajesh.menon.demo@example.com',
    phone: '+91 98450 12345',
    skills: ['Go', 'Kafka', 'PostgreSQL', 'Kubernetes', 'gRPC', 'AWS', 'Redis'],
    status: 'Shortlisted',
    matchScore: 94,
    appliedJobId: 'job-102',
    appliedJobTitle: 'Lead Backend Architect (Distributed Systems)',
    summary:
      'Seasoned backend architect with 10 years of experience designing fault-tolerant, high-concurrency microservice platforms in Golang and cloud-native systems.',
    experienceList: [
      {
        title: 'Principal Backend Engineer',
        company: 'ZetaScale Cloud (Demo)',
        period: '2021 - Present (3 yrs)',
        description:
          'Architected an asynchronous messaging engine handling 45,000 req/sec with Apache Kafka and Go. Reduced cloud infrastructure spend by 28% through memory optimization.',
      },
      {
        title: 'Lead Systems Engineer',
        company: 'PayMatrix Labs (Demo)',
        period: '2017 - 2021 (4 yrs)',
        description:
          'Designed high-availability PostgreSQL clusters and gRPC microservice communication layer for financial transaction routing.',
      },
    ],
    educationList: [
      {
        degree: 'M.Tech in Computer Science',
        institution: 'IIT Madras (Demo)',
        year: '2016',
      },
    ],
    strengths: [
      'Mastery of Go and low-latency microservice architectures',
      'Extensive production experience with Kafka at 40k+ ops/sec scale',
      'Solid track record in infrastructure cost optimization and zero-downtime migrations',
    ],
    potentialGaps: [
      'Primarily focused on backend; minimal involvement in client-facing GraphQL APIs',
    ],
    aiAnalysisExplanation:
      'Rajesh Menon demonstrates an outstanding 94% match score. His 10 years of distributed systems engineering, expertise in Go, Kafka, and Kubernetes directly fulfill all core technical requirements for the Lead Backend Architect role.',
    resumeText: `RAJESH MENON — DISTRIBUTED SYSTEMS ARCHITECT
Email: rajesh.menon.demo@example.com | Hyderabad, India

SUMMARY:
10 years of experience architecting distributed transaction systems, event-driven pipelines, and cloud-native infrastructure.

EXPERIENCE:
ZetaScale Cloud — Principal Backend Engineer (2021 - Present)
- Designed and built Go microservices processing 45k QPS with 99.99% uptime.
- Implemented multi-region Kafka cluster replication and failover mechanisms.

PayMatrix Labs — Lead Systems Engineer (2017 - 2021)
- Built gRPC interfaces and optimized SQL query execution plans for high volume ledger.

EDUCATION:
M.Tech in Computer Science — IIT Madras (2014 - 2016)`,
    appliedDate: '2026-08-05',
  },
  {
    id: 'cand-3',
    name: 'Ananya Sharma',
    title: 'Staff AI Engineer',
    experienceYears: 8,
    location: 'Bengaluru, India',
    email: 'ananya.sharma.demo@example.com',
    phone: '+91 97112 34567',
    skills: ['Python', 'PyTorch', 'LangChain', 'RAG Pipelines', 'Vector Databases', 'FastAPI'],
    status: 'Interviewing',
    matchScore: 88,
    appliedJobId: 'job-103',
    appliedJobTitle: 'Staff AI/ML Engineer (LLM Applications)',
    summary:
      'Applied AI engineer specializing in retrieval-augmented generation (RAG), vector search indexes, and enterprise LLM application integration.',
    experienceList: [
      {
        title: 'Senior AI Engineer',
        company: 'CortexAI Labs (Demo)',
        period: '2022 - Present (2 yrs)',
        description:
          'Built multi-agent LLM systems with LangGraph and ChromaDB. Deployed low-latency embedding search serving 200+ enterprise queries/sec.',
      },
    ],
    educationList: [
      {
        degree: 'B.Tech in Artificial Intelligence',
        institution: 'IIIT Hyderabad (Demo)',
        year: '2018',
      },
    ],
    strengths: [
      'Hands-on expertise in RAG pipelines, fine-tuning, and vector similarity search',
      'Strong production software engineering practices (FastAPI, Docker, AsyncIO)',
    ],
    potentialGaps: [
      'Fewer years in on-premise model quantization (primarily uses cloud API endpoints)',
    ],
    aiAnalysisExplanation:
      'Ananya Sharma matches 88% of requirements with deep hands-on experience in LLM development and vector search. Highly relevant background for cognitive AI pipelines.',
    resumeText: `ANANYA SHARMA — STAFF AI ENGINEER
Email: ananya.sharma.demo@example.com | Bengaluru, India

EXPERIENCE:
CortexAI Labs — Senior AI Engineer (2022 - Present)
- Created RAG pipeline evaluating 100k+ documents with hybrid dense-sparse retrieval.
- Automated prompt testing and regression guardrails.`,
    appliedDate: '2026-08-09',
  },
  {
    id: 'cand-4',
    name: 'Vikram Patel',
    title: 'Lead Product Designer',
    experienceYears: 7,
    location: 'Mumbai, India',
    email: 'vikram.patel.demo@example.com',
    phone: '+91 99201 87654',
    skills: ['Figma', 'Design Systems', 'Micro-interactions', 'User Research', 'Design Tokens', 'Prototyping'],
    status: 'Qualified',
    matchScore: 89,
    appliedJobId: 'job-104',
    appliedJobTitle: 'Product Design Lead (Design Systems)',
    summary:
      'Design leader with 7 years crafting design systems, typography hierarchies, and intuitive enterprise SaaS interfaces.',
    experienceList: [
      {
        title: 'Lead UI/UX Designer',
        company: 'PixelCraft Systems (Demo)',
        period: '2021 - Present (3 yrs)',
        description:
          'Created multi-brand Figma token library synchronized with React token repositories via GitHub Actions.',
      },
    ],
    educationList: [
      {
        degree: 'Bachelor of Design (B.Des)',
        institution: 'NID Ahmedabad (Demo)',
        year: '2019',
      },
    ],
    strengths: [
      'Comprehensive design system architecture and token management knowledge',
      'Strong visual craftsmanship and interaction design portfolio',
    ],
    potentialGaps: [
      'Limited experience in direct front-end coding (creates prototypes in Figma)',
    ],
    aiAnalysisExplanation:
      'Vikram Patel matches 89% of core requirements. His systematic approach to component libraries and design tokens is ideal for leading design system evolution.',
    resumeText: `VIKRAM PATEL — LEAD PRODUCT DESIGNER
Email: vikram.patel.demo@example.com | Mumbai, India

EXPERIENCE:
PixelCraft Systems — Lead UI/UX Designer (2021 - Present)
- Unified 4 separate product suites under a single design system.`,
    appliedDate: '2026-08-11',
  },
  {
    id: 'cand-5',
    name: 'Neha Gupta',
    title: 'Frontend Engineer (UI Performance)',
    experienceYears: 5,
    location: 'Bengaluru, India',
    email: 'neha.gupta.demo@example.com',
    phone: '+91 98110 54321',
    skills: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS', 'Redux', 'Jest'],
    status: 'Shortlisted',
    matchScore: 87,
    appliedJobId: 'job-101',
    appliedJobTitle: 'Senior Frontend Engineer',
    summary:
      'Passionate frontend developer experienced in TypeScript, complex state flows, and modular React architectures.',
    experienceList: [
      {
        title: 'Frontend Engineer',
        company: 'FinTrack Tech (Demo)',
        period: '2021 - Present (3 yrs)',
        description:
          'Built accessible dashboards complying with WCAG 2.1 AA standards. Optimized client bundle size by 30%.',
      },
    ],
    educationList: [
      {
        degree: 'B.E. in Information Technology',
        institution: 'BITS Pilani (Demo)',
        year: '2021',
      },
    ],
    strengths: [
      'Solid TypeScript and React foundation',
      'Strong dedication to web accessibility and automated testing',
    ],
    potentialGaps: [
      '5 years total experience (on the lower boundary of the 5-8 year seniority bracket)',
    ],
    aiAnalysisExplanation:
      'Neha Gupta scored 87% match. Solid technical skill alignment across React, TypeScript, and state management, with proven accessibility focus.',
    resumeText: `NEHA GUPTA — FRONTEND ENGINEER
Email: neha.gupta.demo@example.com | Bengaluru, India

EXPERIENCE:
FinTrack Tech — Frontend Engineer (2021 - Present)
- Developed responsive component library with 95% unit test coverage.`,
    appliedDate: '2026-08-04',
  },
  {
    id: 'cand-6',
    name: 'Devendra Singh',
    title: 'Senior Cloud & DevOps Engineer',
    experienceYears: 6,
    location: 'Gurugram, India',
    email: 'devendra.singh.demo@example.com',
    phone: '+91 98711 00998',
    skills: ['AWS', 'Terraform', 'Kubernetes', 'CI/CD', 'Docker', 'Prometheus'],
    status: 'Review',
    matchScore: 82,
    appliedJobId: 'job-105',
    appliedJobTitle: 'DevOps & Cloud Security Specialist',
    summary:
      'Infrastructure engineer with strong experience in Terraform infrastructure-as-code and automated CI/CD deployment pipelines.',
    experienceList: [
      {
        title: 'DevOps Engineer',
        company: 'SecureCloud India (Demo)',
        period: '2020 - Present (4 yrs)',
        description:
          'Maintained multi-account AWS architectures, configured EKS clusters, and automated security vulnerability scanning.',
      },
    ],
    educationList: [
      {
        degree: 'B.Tech in Computer Engineering',
        institution: 'Delhi Technological University (Demo)',
        year: '2020',
      },
    ],
    strengths: [
      'Deep knowledge of Terraform, AWS, and Kubernetes orchestration',
    ],
    potentialGaps: [
      'Moderate direct experience with formal SOC2 audit preparation',
    ],
    aiAnalysisExplanation:
      'Devendra matches 82% of role criteria. Strong infrastructure foundation with opportunity for growth in formal compliance governance.',
    resumeText: `DEVENDRA SINGH — DEVOPS ENGINEER
Email: devendra.singh.demo@example.com | Gurugram, India`,
    appliedDate: '2026-07-28',
  },
];

export const initialOutreach: OutreachMessage[] = [
  {
    id: 'msg-1',
    candidateId: 'cand-1',
    candidateName: 'Sarah Chen',
    candidateEmail: 'sarah.chen.demo@example.com',
    jobId: 'job-101',
    jobTitle: 'Senior Frontend Engineer',
    subject: 'Exploring Senior Frontend Architecture role at HyperScale Fintech',
    body: `Hi Sarah,

I came across your impressive work leading frontend architecture and design systems at NovaStack Solutions.

We are currently expanding our core operations platform team at HyperScale Fintech, and we are looking for a Senior Frontend Engineer to lead UI performance and component library design. Given your deep experience with React, TypeScript, and Next.js, your background seems like an exceptional fit for the technical challenges we are solving.

Would you be open for a brief 15-minute introductory conversation this week to learn more about the role and team?

Best regards,
Aarav Mehta
Lead Technical Recruiter, ScoutAI`,
    tone: 'Professional',
    status: 'Approved',
    createdAt: '2026-08-06',
    approvedAt: '2026-08-06 14:30',
  },
  {
    id: 'msg-2',
    candidateId: 'cand-2',
    candidateName: 'Rajesh Menon',
    candidateEmail: 'rajesh.menon.demo@example.com',
    jobId: 'job-102',
    jobTitle: 'Lead Backend Architect (Distributed Systems)',
    subject: 'Lead Distributed Systems Architect Opportunity — FinFlow Global',
    body: `Hi Rajesh,

Your background in scaling high-throughput Kafka pipelines and Go microservices at ZetaScale Cloud caught our attention.

FinFlow Global is building the next-generation financial routing engine in Hyderabad, and we are looking for a Lead Backend Architect to own our distributed transaction infrastructure (40k+ req/sec scale).

I'd love to share more context about our engineering roadmap and explore if this aligns with your career aspirations. Are you free for a quick chat?

Warm regards,
Aarav Mehta
ScoutAI Recruitment Operations`,
    tone: 'Executive',
    status: 'Sent — Demo',
    createdAt: '2026-08-07',
    approvedAt: '2026-08-07 10:15',
    sentAt: '2026-08-07 10:18',
  },
];

export const initialInterviews: Interview[] = [
  {
    id: 'int-1',
    candidateId: 'cand-3',
    candidateName: 'Ananya Sharma',
    candidateTitle: 'Staff AI Engineer',
    jobId: 'job-103',
    jobTitle: 'Staff AI/ML Engineer (LLM Applications)',
    interviewer: 'Dr. Sameer Kulkarni (VP of AI)',
    date: '2026-08-16',
    time: '14:30 IST',
    durationMinutes: 45,
    type: 'System Architecture',
    status: 'Scheduled',
    locationOrLink: 'https://meet.scoutai.internal/demo-room-301',
    notes: 'Focus on multi-agent evaluation pipelines and embedding retrieval optimization.',
  },
  {
    id: 'int-2',
    candidateId: 'cand-2',
    candidateName: 'Rajesh Menon',
    candidateTitle: 'Distributed Systems Architect',
    jobId: 'job-102',
    jobTitle: 'Lead Backend Architect',
    interviewer: 'Kiran Rao (Director of Engineering)',
    date: '2026-08-18',
    time: '16:00 IST',
    durationMinutes: 60,
    type: 'Technical Screen',
    status: 'Scheduled',
    locationOrLink: 'https://meet.scoutai.internal/demo-room-102',
    notes: 'Review past Kafka partition strategies and concurrency control.',
  },
];

export const initialTasks: RecruiterTask[] = [
  {
    id: 'task-1',
    title: 'Review Sarah Chen match analysis for Senior Frontend role',
    category: 'Review Candidate',
    status: 'In Progress',
    priority: 'High',
    dueDate: '2026-08-15',
    relatedCandidateId: 'cand-1',
    relatedCandidateName: 'Sarah Chen',
    relatedJobId: 'job-101',
  },
  {
    id: 'task-2',
    title: 'Approve personalized outreach draft for Rajesh Menon',
    category: 'Approve Outreach',
    status: 'Completed',
    priority: 'High',
    dueDate: '2026-08-07',
    relatedCandidateId: 'cand-2',
    relatedCandidateName: 'Rajesh Menon',
    relatedJobId: 'job-102',
  },
  {
    id: 'task-3',
    title: 'Schedule System Design interview for Ananya Sharma',
    category: 'Schedule Interview',
    status: 'Completed',
    priority: 'Medium',
    dueDate: '2026-08-10',
    relatedCandidateId: 'cand-3',
    relatedCandidateName: 'Ananya Sharma',
    relatedJobId: 'job-103',
  },
  {
    id: 'task-4',
    title: 'Review application batch for Lead Product Designer role',
    category: 'Review Application',
    status: 'Pending',
    priority: 'Medium',
    dueDate: '2026-08-17',
    relatedJobId: 'job-104',
  },
  {
    id: 'task-5',
    title: 'Follow up with HyperScale Fintech on candidate shortlist feedback',
    category: 'Follow Up With Client',
    status: 'Pending',
    priority: 'Low',
    dueDate: '2026-08-19',
    relatedJobId: 'job-101',
  },
];

export const initialAIActivity: AIActivityEvent[] = [
  {
    id: 'act-1',
    timestamp: '2026-08-14 11:20:00',
    type: 'Candidate Shortlisted',
    target: 'Rajesh Menon',
    actor: 'Aarav Mehta (Recruiter)',
    details: 'Candidate shortlisted for Lead Backend Architect role based on high distributed systems match (94%).',
    isHumanAction: true,
  },
  {
    id: 'act-2',
    timestamp: '2026-08-14 10:45:12',
    type: 'Match Generated',
    target: 'Sarah Chen (Senior Frontend Engineer)',
    actor: 'ScoutAI Matching Engine (Advisory)',
    details: 'Generated 91% match confidence score. Identified strong alignment with React/TypeScript/Design System requirements.',
    isHumanAction: false,
  },
  {
    id: 'act-3',
    timestamp: '2026-08-13 16:10:05',
    type: 'Outreach Drafted',
    target: 'Sarah Chen',
    actor: 'ScoutAI Outreach Assistant',
    details: 'Drafted tailored initial outreach emphasizing frontend architecture and performance accomplishments.',
    isHumanAction: false,
  },
  {
    id: 'act-4',
    timestamp: '2026-08-13 14:02:40',
    type: 'Sourcing Completed',
    target: 'Senior Frontend Engineer (Job #101)',
    actor: 'ScoutAI Sourcing Engine',
    details: 'Analyzed 247 demo candidate profiles across Indian tech hubs; identified 42 qualified and 12 high-confidence profiles.',
    isHumanAction: false,
  },
  {
    id: 'act-5',
    timestamp: '2026-08-12 09:30:15',
    type: 'Interview Scheduled',
    target: 'Ananya Sharma',
    actor: 'Aarav Mehta (Recruiter)',
    details: 'System Architecture interview confirmed with Dr. Sameer Kulkarni for Aug 16, 2026.',
    isHumanAction: true,
  },
];

export const initialClients: ClientAccount[] = [
  {
    id: 'client-1',
    name: 'HyperScale Fintech (Demo)',
    industry: 'Financial Technology / Payments',
    openJobsCount: 2,
    activeCandidatesCount: 14,
    hiringProgress: 68,
    keyContact: 'Pooja Iyer (Talent Partner)',
    email: 'pooja.iyer.demo@hyperscale.internal',
    location: 'Bengaluru, India',
    recentActivity: 'Shortlist reviewed for Senior Frontend role.',
  },
  {
    id: 'client-2',
    name: 'FinFlow Global (Demo)',
    industry: 'Enterprise Banking Software',
    openJobsCount: 1,
    activeCandidatesCount: 8,
    hiringProgress: 82,
    keyContact: 'Gaurav Khanna (Engineering Director)',
    email: 'gaurav.k.demo@finflow.internal',
    location: 'Hyderabad, India',
    recentActivity: 'Interview scheduled with Lead Backend candidate.',
  },
  {
    id: 'client-3',
    name: 'CognitiveCore AI (Demo)',
    industry: 'Applied Artificial Intelligence',
    openJobsCount: 2,
    activeCandidatesCount: 11,
    hiringProgress: 45,
    keyContact: 'Nidhi Singhal (Head of People)',
    email: 'nidhi.s.demo@cognitivecore.internal',
    location: 'Bengaluru, India',
    recentActivity: 'New requisition created for AI/ML Engineer.',
  },
  {
    id: 'client-4',
    name: 'DesignKraft Studio (Demo)',
    industry: 'Digital Product Design',
    openJobsCount: 1,
    activeCandidatesCount: 5,
    hiringProgress: 30,
    keyContact: 'Varun Sethi (Creative VP)',
    email: 'varun.s.demo@designkraft.internal',
    location: 'Mumbai, India',
    recentActivity: 'Candidate sourcing initiated.',
  },
];

export const initialPrivacyRequests: PrivacyRequest[] = [
  {
    id: 'priv-101',
    candidateName: 'Rahul Deshmukh',
    email: 'rahul.d.demo@example.com',
    requestType: 'Data Access (SAR)',
    status: 'Pending Review',
    requestedAt: '2026-08-11',
    reviewNotes: 'Candidate requested summary copy of stored application profile and notes.',
  },
  {
    id: 'priv-102',
    candidateName: 'Meera Nambiar',
    email: 'meera.n.demo@example.com',
    requestType: 'Data Erasure',
    status: 'Completed',
    requestedAt: '2026-08-02',
    reviewNotes: 'Record scrubbed in accordance with candidate deletion request.',
  },
];

export const initialSecurityAudit: SecurityAuditEvent[] = [
  {
    id: 'sec-1',
    timestamp: '2026-08-14 11:20:00',
    actor: 'aarav.mehta@scoutai.internal',
    action: 'Candidate Shortlisted',
    target: 'Candidate #cand-2 (Rajesh Menon)',
    ipAddress: '103.24.12.88 (Bengaluru)',
    result: 'Success',
  },
  {
    id: 'sec-2',
    timestamp: '2026-08-14 09:15:20',
    actor: 'aarav.mehta@scoutai.internal',
    action: 'User Session Login',
    target: 'ScoutAI Web Portal',
    ipAddress: '103.24.12.88 (Bengaluru)',
    result: 'Success',
  },
  {
    id: 'sec-3',
    timestamp: '2026-08-13 17:40:11',
    actor: 'aarav.mehta@scoutai.internal',
    action: 'Outreach Message Approved',
    target: 'Message #msg-1 (Sarah Chen)',
    ipAddress: '103.24.12.88 (Bengaluru)',
    result: 'Success',
  },
  {
    id: 'sec-4',
    timestamp: '2026-08-12 14:22:05',
    actor: 'aarav.mehta@scoutai.internal',
    action: 'Interview Scheduled',
    target: 'Interview #int-1 (Ananya Sharma)',
    ipAddress: '103.24.12.88 (Bengaluru)',
    result: 'Success',
  },
  {
    id: 'sec-5',
    timestamp: '2026-08-11 11:05:44',
    actor: 'aarav.mehta@scoutai.internal',
    action: 'Job Requisition Created',
    target: 'Job #job-106 (Associate PM)',
    ipAddress: '103.24.12.88 (Bengaluru)',
    result: 'Success',
  },
];

export const initialSettings: AppSettings = {
  profile: {
    name: 'Aarav Mehta',
    email: 'aarav.mehta@scoutai.internal',
    role: 'Lead Technical Recruiter',
    department: 'Talent Acquisition Operations',
  },
  workspace: {
    organizationName: 'ScoutAI Operations (India Hub)',
    region: 'Asia/Kolkata (IST)',
    timezone: 'UTC+05:30',
  },
  notifications: {
    emailAlerts: true,
    candidateShortlistAlerts: true,
    interviewReminders: true,
    dailyActivityDigest: false,
  },
  aiPreferences: {
    advisoryDetailLevel: 'in-depth',
    autoHighlightGaps: true,
    enableSmartOutreachTemplates: true,
  },
  security: {
    sessionTimeoutMinutes: 60,
    auditLogRetentionDays: 90,
  },
  privacy: {
    candidateDataRetentionMonths: 24,
    requireConsentForSourcing: true,
  },
};
