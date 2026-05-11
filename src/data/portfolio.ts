// ============================================================
// PORTFOLIO DATA — AI Systems Engineer
// ============================================================

export const PERSONAL = {
  name: "Kael Soren",
  initials: "KS",
  title: "AI Systems Engineer",
  roles: [
    "AI Systems Engineer",
    "AI Product Engineer",
    "Fullstack Engineer",
    "Backend Engineer",
    "AI Workflow Architect",
    "SaaS Builder",
  ],
  tagline: "I build AI-native products, scalable systems, and modern web experiences.",
  bio: `I specialize in architecting and shipping AI-native products at the intersection of LLMs, 
  infrastructure, and product engineering. From designing multi-agent pipelines to building 
  production RAG systems, I move fast and ship real things. Currently exploring the frontier of 
  autonomous AI workflows and reasoning systems.`,
  location: "San Francisco, CA",
  availability: "",
  email: "kael@kaelsoren.dev",
  github: "https://github.com/kaelsoren",
  linkedin: "https://linkedin.com/in/kaelsoren",
  twitter: "https://x.com/kaelsoren",
  calendly: "https://calendly.com/kaelsoren",
};

export const METRICS = [
  { label: "Projects Shipped", value: 24, suffix: "+" },
  { label: "APIs Built", value: 47, suffix: "" },
  { label: "Workflows Automated", value: 130, suffix: "+" },
  { label: "Years Experience", value: 7, suffix: "" },
];

export const TECH_STACK = [
  { name: "Next.js", category: "frontend" },
  { name: "React", category: "frontend" },
  { name: "TypeScript", category: "language" },
  { name: "Node.js", category: "backend" },
  { name: "Python", category: "language" },
  { name: "PostgreSQL", category: "database" },
  { name: "Prisma", category: "database" },
  { name: "Docker", category: "infra" },
  { name: "OpenAI", category: "ai" },
  { name: "Anthropic", category: "ai" },
  { name: "LangChain", category: "ai" },
  { name: "Supabase", category: "database" },
  { name: "Tailwind CSS", category: "frontend" },
  { name: "AWS", category: "infra" },
  { name: "Vercel", category: "infra" },
  { name: "Redis", category: "database" },
  { name: "Pinecone", category: "ai" },
  { name: "tRPC", category: "backend" },
];

export const EXPERTISE = [
  "AI Systems",
  "LLM Apps",
  "RAG Pipelines",
  "AI Agents",
  "Fullstack",
  "REST APIs",
  "Cloud Infra",
  "UI Engineering",
  "Vector DBs",
  "Prompt Engineering",
  "Multi-Agent",
  "SaaS Architecture",
];

export const EXPERIENCE = [
  {
    company: "Nexus AI",
    role: "Senior AI Systems Engineer",
    period: "2023 — Present",
    type: "Full-time",
    description:
      "Lead architect for production LLM infrastructure serving 50k+ daily active users. Designed multi-agent orchestration system reducing task completion time by 65%.",
    achievements: [
      "Built RAG pipeline processing 2M+ documents with <200ms retrieval latency",
      "Architected multi-agent system handling complex reasoning chains",
      "Reduced LLM inference costs by 40% through smart caching + batching",
    ],
    tech: ["Next.js", "Python", "OpenAI", "Pinecone", "PostgreSQL", "AWS"],
  },
  {
    company: "Strata Labs",
    role: "AI Product Engineer",
    period: "2021 — 2023",
    type: "Full-time",
    description:
      "Built the core product infrastructure for an AI-native B2B SaaS platform. Shipped 12 major features across the AI pipeline and web application.",
    achievements: [
      "Designed the AI document processing engine (10x faster than prior system)",
      "Shipped real-time collaboration features using WebSockets + CRDT",
      "Led migration from monolith → microservices architecture",
    ],
    tech: ["React", "Node.js", "Supabase", "Redis", "Docker", "Vercel"],
  },
  {
    company: "Fulcrum Systems",
    role: "Fullstack Engineer",
    period: "2019 — 2021",
    type: "Full-time",
    description:
      "Core engineer on enterprise SaaS platform. Built scalable APIs and data pipelines for Fortune 500 clients.",
    achievements: [
      "Re-architected data ingestion pipeline handling 1B+ rows/day",
      "Built internal tooling that saved 20 eng-hours/week",
      "Introduced TypeScript across the entire frontend codebase",
    ],
    tech: ["React", "TypeScript", "PostgreSQL", "AWS", "Docker"],
  },
  {
    company: "Freelance",
    role: "Independent Engineer & Consultant",
    period: "2017 — 2019",
    type: "Contract",
    description:
      "Worked with early-stage startups to build MVPs, AI experiments, and production APIs.",
    achievements: [
      "Shipped 8 client MVPs from 0→1",
      "Built custom NLP classification systems for 3 clients",
      "Consulted on AI product strategy for seed-stage startups",
    ],
    tech: ["Python", "Flask", "React", "Postgres", "Heroku"],
  },
];

export const PROJECTS = [
  {
    slug: "synapse-rag",
    title: "Synapse RAG",
    subtitle: "Enterprise Knowledge Intelligence Platform",
    category: "AI Infrastructure",
    status: "Production",
    year: "2024",
    description:
      "A production-grade Retrieval-Augmented Generation system that ingests enterprise documents, builds semantic indexes, and provides intelligent Q&A with citations. Built for scale — handles millions of documents with sub-200ms retrieval.",
    overview:
      "Synapse RAG started as an internal tool and became a standalone product. The core challenge was building a RAG system that didn't hallucinate, provided accurate citations, and remained fast at scale.",
    image: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=800&q=80",
    tech: ["Next.js", "Python", "FastAPI", "OpenAI", "Pinecone", "PostgreSQL", "Redis", "Docker", "AWS"],
    metrics: [
      { label: "Documents Indexed", value: "2.4M" },
      { label: "Avg Retrieval Latency", value: "180ms" },
      { label: "Accuracy Rate", value: "94%" },
      { label: "Daily Queries", value: "50k+" },
    ],
    architecture: `The system uses a hybrid retrieval approach combining dense vector search (Pinecone) with BM25 sparse retrieval, 
    then re-ranks results using a cross-encoder model. Documents are chunked using semantic chunking rather than fixed-size splitting, 
    dramatically improving retrieval quality.`,
    challenges: [
      "Handling 2M+ documents without degrading retrieval quality",
      "Eliminating hallucinations while maintaining natural response style",
      "Reducing costs 10x while improving latency",
    ],
    github: "https://github.com/kaelsoren/synapse-rag",
    demo: "https://synapse-rag.dev",
    featured: true,
  },
  {
    slug: "orchestral-agents",
    title: "Orchestral",
    subtitle: "Multi-Agent Orchestration Framework",
    category: "AI Agents",
    status: "Production",
    year: "2024",
    description:
      "A TypeScript-native framework for orchestrating complex multi-agent workflows. Supports branching logic, parallel execution, human-in-the-loop, and full observability. Powers 130+ automated workflows in production.",
    overview:
      "Orchestral was born from frustration with existing agent frameworks that were either too opinionated or too low-level. It provides a clean, composable API for building reliable agent systems.",
    image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&q=80",
    tech: ["TypeScript", "Node.js", "OpenAI", "Anthropic", "Redis", "PostgreSQL", "Vercel"],
    metrics: [
      { label: "Active Workflows", value: "130+" },
      { label: "Tasks Automated/Day", value: "8,000" },
      { label: "Success Rate", value: "98.2%" },
      { label: "Avg Task Time", value: "4.2s" },
    ],
    architecture:
      "Event-driven architecture with a central orchestrator managing worker pools. Each agent is a pure function with defined inputs/outputs. State is managed in Redis with PostgreSQL for durable storage.",
    challenges: [
      "Ensuring deterministic behavior in non-deterministic LLM environments",
      "Building robust error recovery without human intervention",
      "Designing an API that's expressive but not overwhelming",
    ],
    github: "https://github.com/kaelsoren/orchestral",
    demo: "https://orchestral.dev",
    featured: true,
  },
  {
    slug: "cortex-api",
    title: "Cortex API",
    subtitle: "LLM Gateway & Inference Optimization Layer",
    category: "Infrastructure",
    status: "Production",
    year: "2023",
    description:
      "A unified LLM API gateway that routes requests across providers (OpenAI, Anthropic, Cohere, local models) based on cost, latency, and capability requirements. Includes caching, rate limiting, and full observability.",
    overview:
      "Built to solve the multi-provider LLM problem — giving teams flexibility without the complexity of managing multiple SDKs and keys.",
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80",
    tech: ["Python", "FastAPI", "Redis", "PostgreSQL", "Docker", "AWS", "Prometheus"],
    metrics: [
      { label: "Requests/Day", value: "2.1M" },
      { label: "Cache Hit Rate", value: "34%" },
      { label: "Cost Saved", value: "40%" },
      { label: "P99 Latency", value: "290ms" },
    ],
    architecture:
      "Proxy layer built with FastAPI, Redis for semantic caching (embedding-based), PostgreSQL for audit logs. Intelligent routing via cost/latency scoring matrix updated every 60 seconds.",
    challenges: [
      "Semantic caching that works across different phrasings of the same question",
      "Failover logic that doesn't degrade user experience",
      "Cost attribution across multiple teams and projects",
    ],
    github: "https://github.com/kaelsoren/cortex-api",
    demo: "https://cortexapi.dev",
    featured: true,
  },
  {
    slug: "scribe-ai",
    title: "Scribe AI",
    subtitle: "AI-Powered Technical Documentation Generator",
    category: "AI Product",
    status: "Beta",
    year: "2024",
    description:
      "Auto-generates beautiful, accurate technical documentation from codebases, APIs, and internal wikis. Uses AST analysis + LLMs to produce docs that actually reflect the code.",
    overview:
      "Documentation is almost always wrong or outdated. Scribe solves this by analyzing code structure, not just comments, to produce contextually accurate docs.",
    image: "https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=800&q=80",
    tech: ["Next.js", "TypeScript", "Python", "OpenAI", "AST", "Supabase", "Vercel"],
    metrics: [
      { label: "Codebases Documented", value: "340" },
      { label: "Doc Accuracy", value: "91%" },
      { label: "Time Saved/Engineer", value: "6h/mo" },
      { label: "Active Teams", value: "28" },
    ],
    architecture:
      "Pipeline: Git clone → AST parse → semantic chunking → context-aware prompting → structured doc output. MDX for rendering, stored in Supabase.",
    challenges: [
      "Understanding code intent beyond syntax",
      "Handling private internal context without exposing it",
      "Keeping docs in sync as code changes",
    ],
    github: "https://github.com/kaelsoren/scribe-ai",
    demo: "https://scribeai.dev",
    featured: false,
  },
  {
    slug: "vector-forge",
    title: "VectorForge",
    subtitle: "Embedding Pipeline & Vector Store Manager",
    category: "AI Infrastructure",
    status: "Open Source",
    year: "2023",
    description:
      "CLI + library for building, managing, and querying embedding pipelines. Supports 12 embedding models and 6 vector stores with a unified interface.",
    overview:
      "Switched embedding models or vector stores 3 times before building this. VectorForge abstracts the plumbing so you can focus on what matters.",
    image: "https://images.unsplash.com/photo-1642427749670-f20e2e76ed8c?w=800&q=80",
    tech: ["Python", "Pinecone", "Weaviate", "Qdrant", "OpenAI", "HuggingFace"],
    metrics: [
      { label: "GitHub Stars", value: "1.2k" },
      { label: "Embedding Models", value: "12" },
      { label: "Vector Stores", value: "6" },
      { label: "Downloads/Month", value: "8k" },
    ],
    architecture:
      "Plugin-based architecture where each embedding provider and vector store is an adapter. Core pipeline handles batching, retry logic, and schema management.",
    challenges: [
      "Normalizing very different APIs across vector stores",
      "Handling large-scale upserts without rate limit errors",
      "Schema migration when switching embedding dimensions",
    ],
    github: "https://github.com/kaelsoren/vector-forge",
    demo: null,
    featured: false,
  },
  {
    slug: "canvas-saas",
    title: "Canvas",
    subtitle: "AI-Assisted Product Roadmap & Strategy Tool",
    category: "SaaS Product",
    status: "Shipped",
    year: "2022",
    description:
      "A collaborative product management tool with integrated AI that helps teams draft PRDs, analyze user feedback, and prioritize features using signal-based scoring.",
    overview:
      "Built from scratch as a solo project. Canvas reached 500 paying customers before being acquired. Full-stack Next.js app with real-time collaboration.",
    image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&q=80",
    tech: ["Next.js", "TypeScript", "Supabase", "OpenAI", "Vercel", "Stripe", "Resend"],
    metrics: [
      { label: "Paying Customers", value: "500" },
      { label: "MRR at Acquisition", value: "$12k" },
      { label: "Team Size", value: "Solo" },
      { label: "Time to $1 MRR", value: "3 months" },
    ],
    architecture:
      "Supabase for auth + DB + realtime. Edge functions for AI operations. Stripe for billing. Everything deployed on Vercel with no separate backend.",
    challenges: [
      "Handling realtime collaboration without WebSocket complexity",
      "Building AI features users actually use (not just impressive demos)",
      "Doing sales, support, and engineering simultaneously",
    ],
    github: null,
    demo: null,
    featured: false,
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