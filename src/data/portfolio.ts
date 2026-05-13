// ============================================================
// PORTFOLIO DATA — AI Systems Engineer
// ============================================================

export const PERSONAL = {
  name: "Terry Agbo",
  initials: "TA",
  title: "Fullstack Engineer | SaaS | Fintech | PropTech | AI Integration",
  roles: [
    "Fullstack Engineer",
    "Frontend Specialist",
    "AI Product Engineer",
    "SaaS Architect",
  ],
  tagline:
    "Building scalable, reliable, and high-quality AI-powered solutions.",
  bio: `Full Stack Engineer with 4 years of experience building multitenant platforms, CRMs, and fintech applications. Skilled in Next.js, React, NestJS, Prisma, PostgreSQL, SQL, and Tailwind CSS. Experienced in integrating AI powered features to enhance user experience and streamline workflows. Passionate about delivering scalable, reliable, and high quality solutions.`,
  location: "Abuja, Nigeria",
  availability: "Available for new opportunities",
  email: "anjiraterry@gmail.com",
  github: "https://github.com/anjiraterry",
  linkedin: "https://linkedin.com/in/anjiraterry",
  twitter: "https://x.com/anjiraterry",
  calendly: "https://calendly.com/anjiraterry",
};

export const METRICS = [
  { label: "Solutions Shipped", value: 12, suffix: "+" },
  { label: "APIs Built", value: 24, suffix: "" },
  { label: "Workflows Automated", value: 45, suffix: "+" },
  { label: "Years Experience", value: 4, suffix: "" },
];

export const TECH_STACK = [
  { name: "Next.js", category: "frontend" },
  { name: "React", category: "frontend" },
  { name: "NestJS", category: "backend" },
  { name: "TypeScript", category: "language" },
  { name: "Prisma", category: "database" },
  { name: "PostgreSQL", category: "database" },
  { name: "SQL", category: "database" },
  { name: "Tailwind CSS", category: "frontend" },
  { name: "Drizzle ORM", category: "database" },
  { name: "Vite", category: "frontend" },
  { name: "OpenAI", category: "ai" },
  { name: "Claude", category: "ai" },
];

export const EXPERTISE = [
  "Systems Design",
  "Product spaceelopment",
  "Full-Stack spaceelopment",
  "Fintech Apps",
  "CRM spaceelopment",
  "AI Integration",
];

export const EXPERIENCE = [
  {
    company: "SW Global Limited",
    role: "Frontend Engineer",
    period: "July 2025 — Present",
    type: "Full-time",
    location: "Abuja, Nigeria",
    description:
      "Built and maintained system portals using React, Next.js, and Tailwind CSS, delivering responsive, scalable interfaces.",
    achievements: [
      "Collaborated closely with cross-functional teams to ship reliable front-end solutions",
      "Optimized system portal performance for enterprise-scale deployments",
      "Implemented responsive designs ensuring cross-spaceice compatibility",
    ],
    tech: ["React", "Next.js", "Tailwind CSS", "TypeScript"],
  },
  {
    company: "Giant Beats® LLC Technology",
    role: "Frontend Engineer",
    period: "June 2025 — Dec 2025",
    type: "Contract",
    location: "Remote",
    description:
      "spaceeloped frontend features for studio and technology platforms.",
    achievements: [
      "Built interactive UI components for media management",
      "Integrated complex state management for real-time updates",
    ],
    tech: ["React", "Tailwind CSS", "Redux"],
  },
  {
    company: "ConvROI",
    role: "Lead Fullstack Engineer",
    period: "Feb 2025 — May 2025",
    type: "Full-time",
    location: "United States (Remote)",
    description:
      "Contributed to the spaceelopment of a CRM for AI chat and lead management.",
    achievements: [
      "Built scalable frontend and backend features for lead tracking",
      "Architected AI chat workflows to streamline lead management",
      "Used Drizzle ORM and Replit to accelerate spaceelopment cycles",
    ],
    tech: ["React", "Vite", "Drizzle ORM", "Node.js", "AI Workflows"],
  },
];

export const EDUCATION = [
  {
    degree:
      "Bachelor of Engineering - BE, Electrical and Electronics Engineering",
    school: "University of Abuja",
    year: "2017 — 2022",
  },
];

// Add helper fields for Resume page
EXPERIENCE.forEach((job) => {
  (job as any).highlights = job.achievements;
});

export const PROJECTS = [
  {
    slug: "rydway",
    title: "Rydway",
    subtitle: "Car Rental & Inventory Management Platform",
    category: "SaaS Product",
    status: "Production",
    year: "2024",
    description:
      "A comprehensive car rental and inventory management platform that streamlines fleet tracking, booking management, and vehicle maintenance scheduling. Built for rental agencies of all sizes.",
    overview:
      "Rydway solves the operational chaos of car rental businesses by providing real-time inventory visibility, automated booking workflows, and maintenance alerts. From single-location startups to multi-city fleets.",
    image: "/rydway.png",
    tech: [
      "Next.js",
      "TypeScript",
      "PostgreSQL",
      "Prisma",
      "TailwindCSS",
      "Redis",
      "Docker",
    ],
    metrics: [
      { label: "Vehicles Managed", value: "2,500+" },
      { label: "Active Rentals/Day", value: "1,200" },
      { label: "Inventory Accuracy", value: "99.8%" },
      { label: "Customer Satisfaction", value: "4.9/5" },
    ],
    architecture: `Real-time inventory sync with Redis caching, PostgreSQL for transactional data, and webhook-based integrations with payment providers. Mobile-responsive design for on-the-go fleet management.`,
    challenges: [
      "Real-time inventory sync across multiple locations",
      "Preventing double bookings with race condition handling",
      "Building intuitive maintenance scheduling that reduces downtime",
    ],
    github: "https://github.com/anjiraterry/rydway",
    demo: "https://rydway.space",
    featured: true,
  },
  {
    slug: "onset",
    title: "Onset",
    subtitle: "Gear & Space Rental Marketplace",
    category: "Marketplace",
    status: "Production",
    year: "2024",
    description:
      "A peer-to-peer marketplace connecting equipment owners with renters. Rent cameras, tools, studio spaces, and outdoor gear with built-in insurance and verification.",
    overview:
      "Onset eliminates the trust barrier in peer-to-peer rentals with verified profiles, damage protection, and secure payments. Built for creators, contractors, and hobbyists.",
    image: "/onset.png",
    tech: [
      "Next.js",
      "TypeScript",
      "Supabase",
      "Stripe Connect",
      "TailwindCSS",
      "Redis",
      "Resend",
    ],
    metrics: [
      { label: "Active Listings", value: "3,200+" },
      { label: "Completed Rentals", value: "8,500" },
      { label: "Avg Response Time", value: "2.4min" },
      { label: "Repeat Renters", value: "42%" },
    ],
    architecture:
      "Dual-index search (location + availability) with Algolia. Stripe Connect for split payments between platform and lister. Real-time messaging and booking calendar.",
    challenges: [
      "Building trust in a two-sided marketplace from zero",
      "Handling cancellations and disputes fairly",
      "Implementing location-based search with availability windows",
    ],
    github: "https://github.com/anjiraterry/onset",
    demo: "https://onset.space",
    featured: true,
  },
  {
    slug: "pressctrl",
    title: "PressCtrl",
    subtitle: "Modern Jewelry E-Commerce Platform",
    category: "E-Commerce",
    status: "Production",
    year: "2023",
    description:
      "A high-performance e-commerce platform for jewelry brands featuring 3D product views, size guides, and personalized recommendations. Built for conversion and brand storytelling.",
    overview:
      "Jewelry e-commerce requires exceptional product presentation. PressCtrl delivers high-res zoom, video integration, and AR try-on capabilities with a checkout experience that converts.",
    image: "/pressctrl.png",
    tech: [
      "Next.js",
      "TypeScript",
      "Shopify API",
      "Stripe",
      "TailwindCSS",
      "Redis",
      "Cloudinary",
    ],
    metrics: [
      { label: "Conversion Rate", value: "4.2%" },
      { label: "Avg Order Value", value: "$245" },
      { label: "Monthly Visitors", value: "45k" },
      { label: "Page Load Time", value: "0.8s" },
    ],
    architecture:
      "Headless Shopify backend with Next.js frontend. Cloudinary for image optimization, Redis for cart sessions. Dynamic meta tags for SEO on each product.",
    challenges: [
      "Optimizing high-res product images without killing load times",
      "Building a size guide that reduces returns by 30%",
      "Creating personalized recommendations without creepy targeting",
    ],
    github: "https://github.com/anjiraterry/pressctrl",
    demo: "https://pressctrl.space",
    featured: true,
  },
  {
    slug: "thorfin",
    title: "Thorfin",
    subtitle: "Financial Operations WebApp",
    category: "FinTech",
    status: "Production",
    year: "2024",
    description:
      "A comprehensive financial operations platform for small to medium businesses. Manage invoicing, expense tracking, reconciliation, and cash flow forecasting in one place.",
    overview:
      "Thorfin replaces messy spreadsheets with automated financial workflows. Connect bank feeds, categorize transactions, generate reports, and get real-time cash flow insights.",
    image: "/thorfin.png",
    tech: [
      "Next.js",
      "TypeScript",
      "PostgreSQL",
      "Plaid API",
      "TailwindCSS",
      "Node.js",
      "BullMQ",
    ],
    metrics: [
      { label: "Transactions Processed", value: "125k+" },
      { label: "Time Saved/Month", value: "15hrs" },
      { label: "Bank Connections", value: "340" },
      { label: "Accuracy Rate", value: "99.3%" },
    ],
    architecture:
      "Plaid for bank data aggregation, BullMQ for background reconciliation jobs, PostgreSQL with row-level security for multi-tenant data isolation.",
    challenges: [
      "Categorizing transactions accurately across diverse business types",
      "Building reconciliation that works with partial data",
      "Making financial data accessible without exposing sensitive information",
    ],
    github: "https://github.com/anjiraterry/thorfin",
    demo: "https://thorfin.space",
    featured: true,
  },
];

export const FOCUS_AREAS = [
  {
    id: "reasoning-agents",
    title: "Reasoning Agent Architectures",
    status: "Active Research",
    description:
      "Exploring chain-of-thought prompting, tree-of-thoughts search, and hybrid symbolic/neural reasoning for complex multi-step problem solving.",
    tags: ["Agents", "Reasoning", "LLMs", "CoT"],
    progress: 65,
    insights: [
      "Tree-of-thoughts significantly outperforms linear CoT on planning tasks",
      "Hybrid approaches (LLM + rule-based) beat pure LLM on structured domains",
      "Observation loops need explicit termination conditions to avoid infinite loops",
    ],
  },
  {
    id: "rag-v2",
    title: "Next-Gen RAG Systems",
    status: "Building",
    description:
      "Moving beyond naive RAG — researching adaptive retrieval, graph-based knowledge representation, and multi-hop reasoning for enterprise knowledge bases.",
    tags: ["RAG", "Graph DB", "Retrieval", "Knowledge Graphs"],
    progress: 45,
    insights: [
      "Semantic chunking at concept boundaries beats fixed-size chunking",
      "Re-ranking with cross-encoders adds 8-15% accuracy with minimal latency cost",
      "GraphRAG shows strong promise for multi-hop question answering",
    ],
  },
  {
    id: "ai-infra-cost",
    title: "LLM Cost Optimization",
    status: "Active",
    description:
      "Building patterns for semantic caching, prompt compression, speculative decoding, and intelligent model routing to cut inference costs at scale.",
    tags: ["Infrastructure", "Cost", "Caching", "Optimization"],
    progress: 80,
    insights: [
      "Semantic caching with 0.92 cosine similarity threshold catches ~34% of duplicate queries",
      "Prompt compression (LLMLingua) reduces token count 2-4x with <3% quality drop",
      "Small model routing for simple queries saves 60%+ on inference costs",
    ],
  },
  {
    id: "agentic-ui",
    title: "Agentic UI Patterns",
    status: "Exploring",
    description:
      "Designing UI patterns for AI-native products where agents take actions, need approval flows, and communicate complex reasoning to non-technical users.",
    tags: ["UI/UX", "Agents", "Product", "Design"],
    progress: 30,
    insights: [
      "Users need progressive disclosure — hide complexity until confidence is high",
      "Approval flows must be atomic and reversible to build trust",
      "Real-time streaming creates more user confidence than batch responses",
    ],
  },
];

export const NOTES = [
  {
    slug: "semantic-caching-llms",
    title: "Semantic Caching for LLM APIs: What Actually Works",
    date: "2024-11-15",
    category: "AI Infrastructure",
    readTime: "8 min",
    excerpt:
      "After running semantic caching in production for 6 months across millions of queries, here's what the papers don't tell you about cache invalidation, similarity thresholds, and when NOT to cache.",
    tags: ["LLMs", "Caching", "Infrastructure", "Cost"],
  },
  {
    slug: "multi-agent-production",
    title: "Multi-Agent Systems in Production: A Failure Postmortem",
    date: "2024-10-28",
    category: "AI Agents",
    readTime: "12 min",
    excerpt:
      "We shipped a multi-agent system that worked perfectly in eval and catastrophically failed in production. Here's the full breakdown: what we got wrong, what we missed, and how we fixed it.",
    tags: ["Agents", "Production", "Reliability", "LLMs"],
  },
  {
    slug: "rag-chunking-deep-dive",
    title: "RAG Chunking Strategies: A Systematic Comparison",
    date: "2024-09-12",
    category: "RAG Systems",
    readTime: "10 min",
    excerpt:
      "Tested 7 chunking strategies across 50k documents. Fixed-size, recursive, semantic, proposition-based, and 3 hybrids. Results were not what I expected.",
    tags: ["RAG", "Chunking", "Benchmarks", "Research"],
  },
  {
    slug: "typescript-ai-apps",
    title: "Why TypeScript is Actually Great for AI Applications",
    date: "2024-08-05",
    category: "Engineering",
    readTime: "6 min",
    excerpt:
      "Python has dominated AI tooling but TypeScript's type safety, ecosystem, and deployment story make it compelling for production AI apps. Here's the case.",
    tags: ["TypeScript", "Python", "AI", "Engineering"],
  },
  {
    slug: "supabase-ai-stack",
    title: "The Supabase AI Stack in 2024",
    date: "2024-07-22",
    category: "Stack",
    readTime: "7 min",
    excerpt:
      "Supabase pgvector, edge functions, and realtime subscriptions form a surprisingly complete AI application backend. Here's the full architecture pattern I use.",
    tags: ["Supabase", "PostgreSQL", "pgvector", "Architecture"],
  },
  {
    slug: "prompt-engineering-production",
    title: "Prompt Engineering at Scale: Patterns That Stick",
    date: "2024-06-10",
    category: "Prompt Engineering",
    readTime: "9 min",
    excerpt:
      "After iterating on hundreds of production prompts, some patterns consistently outperform others. A practical guide to prompt design that goes beyond academic tutorials.",
    tags: ["Prompts", "LLMs", "Production", "Patterns"],
  },
];

export const PHILOSOPHY = [
  { icon: "Brain", title: "AI-First Thinking", description: "I approach every problem by asking: how can AI make this 10x better? Then I build the infrastructure to make it real." },
  { icon: "Code2", title: "Systems Mindset", description: "Good AI products need great engineering foundations. I obsess over reliability, observability, and maintainability." },
  { icon: "Layers", title: "Product Sensibility", description: "I've shipped and grown SaaS products solo. I understand what users need and how to build toward that north star." },
];
