// All page copy lives here so it can be edited without touching layout code.

export interface Service {
  id: string;
  title: string;
  kicker: string;
  summary: string;
  items: string[];
}

export const services: Service[] = [
  {
    id: "websites",
    title: "Websites",
    kicker: "Be found. Be trusted.",
    summary:
      "Fast, responsive websites with solid SEO foundations — built to earn trust and turn visitors into conversations.",
    items: [
      "Company & brand websites",
      "Landing pages",
      "Online stores",
      "Booking & reservation sites",
      "WordPress or fully custom",
      "Redesigns & migrations",
      "Accessibility & performance",
      "Domain, email & hosting setup",
    ],
  },
  {
    id: "software",
    title: "Custom software",
    kicker: "Shaped around how you work.",
    summary:
      "Web applications and internal systems designed around your real processes, people, and data — not the other way around.",
    items: [
      "Management systems",
      "Customer & partner portals",
      "Admin dashboards",
      "CRM, HR & inventory systems",
      "SaaS products",
      "Maps & GIS platforms",
      "Roles, permissions & audit logs",
      "Data validation & protection",
    ],
  },
  {
    id: "mobile",
    title: "Mobile apps",
    kicker: "Your service, in their pocket.",
    summary:
      "Cross-platform mobile apps that put the right tools in your customers’ and teams’ hands — connected to the systems you already run.",
    items: [
      "iOS & Android with React Native",
      "Customer-facing apps",
      "Field & staff apps",
      "Push notifications",
      "Offline-friendly workflows",
      "App store release support",
    ],
  },
  {
    id: "automation",
    title: "Automation",
    kicker: "Less copy-paste. More progress.",
    summary:
      "Replace spreadsheets, email chains, and paper forms with workflows that route, remind, and record — automatically.",
    items: [
      "Approval workflows",
      "Digital forms",
      "Automated reports",
      "Notifications & reminders",
      "Document tracking",
      "Onboarding flows",
      "Spreadsheet replacement",
    ],
  },
  {
    id: "ai",
    title: "AI solutions",
    kicker: "Practical intelligence, human-checked.",
    summary:
      "AI that does a real job: answering from your approved knowledge, reading documents, and drafting routine work for people to review.",
    items: [
      "AI assistants & chatbots",
      "Knowledge search",
      "Document intelligence",
      "OpenAI, Claude & Gemini integration",
      "AI-assisted workflows",
      "Access controls for AI data",
    ],
  },
  {
    id: "cloud",
    title: "Integrations & cloud",
    kicker: "Everything talking. Everything running.",
    summary:
      "APIs that connect your tools, plus deployment, monitoring, and support that keep everything online after launch.",
    items: [
      "REST APIs & third-party integrations",
      "Payments, maps, email & SMS",
      "Legacy system connections",
      "Cloud & database deployment",
      "CI/CD pipelines",
      "Monitoring & backups",
      "Maintenance & security updates",
    ],
  },
];

export interface Project {
  id: string;
  name: string;
  client: string;
  sector: string;
  category: string;
  year: string;
  url: string;
  image: { src: string; width: number; height: number; alt: string };
  summary: string;
  delivered: string[];
  stack: string[];
}

export const projects: Project[] = [
  {
    id: "cts-pacific",
    name: "CTS Pacific",
    client: "Corerin Technical Solutions, LLC",
    sector: "Telecommunications & infrastructure, Guam",
    category: "Website",
    year: "2026",
    url: "https://ctspacific.com",
    image: {
      src: "/work/cts-pacific.jpg",
      width: 1440,
      height: 900,
      alt: "CTS Pacific homepage: “Building the infrastructure that keeps the Pacific connected,” beside a photo of a technician working on a utility pole.",
    },
    summary:
      "A production website for a Guam telecommunications and infrastructure contractor — built to show technical authority and turn visits into quote requests.",
    delivered: [
      "Fifteen service pages, from fiber optics to CCTV",
      "Guided quote request flow",
      "Private admin inbox for quotes & contacts",
      "Local SEO, sitemap & structured data",
    ],
    stack: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Supabase", "PostgreSQL", "Playwright"],
  },
];

export const approach = [
  {
    word: "Listen",
    copy: "We learn your goals, your users, and how the work actually happens today.",
    outcome: "A clear, shared problem statement.",
  },
  {
    word: "Map",
    copy: "Scope, architecture, security needs, and a plan that fits your budget and timeline.",
    outcome: "A roadmap and an estimate.",
  },
  {
    word: "Build",
    copy: "Short cycles with working previews you can click through and react to.",
    outcome: "Regular demos, no surprises.",
  },
  {
    word: "Launch",
    copy: "Testing, deployment, release checks, and a careful handover to your team.",
    outcome: "A live, documented system.",
  },
  {
    word: "Stay",
    copy: "Monitoring, updates, and improvements as your organization grows.",
    outcome: "A partner after launch day.",
  },
];

export const buildables = [
  "Company websites",
  "Online stores",
  "Booking systems",
  "Customer portals",
  "CRMs",
  "Inventory systems",
  "HR systems",
  "Dashboards",
  "Document systems",
  "Workflow automation",
  "AI assistants",
  "Mobile apps",
  "SaaS products",
  "Map & GIS platforms",
  "API integrations",
  "Internal tools",
];

export const principles = [
  {
    title: "Security isn’t an add‑on.",
    copy: "Access control, data protection, and secure configuration are planned from the first sketch.",
  },
  {
    title: "Responsive and search-ready.",
    copy: "Every site works on phones, tablets, and desktops, with clean structure and metadata search engines understand.",
  },
  {
    title: "No black boxes.",
    copy: "Plain-language updates, visible progress, and documentation your team can actually use.",
  },
  {
    title: "Built to evolve.",
    copy: "Maintainable code and sensible architecture, so version two is easier than version one.",
  },
];

export const toolbox = [
  {
    area: "Frontend",
    tools: ["HTML5", "CSS", "JavaScript", "TypeScript", "React", "Next.js", "Vue.js", "Tailwind CSS", "Vite"],
  },
  {
    area: "Backend & APIs",
    tools: ["Node.js", "Express", "Python", "Django", "FastAPI", "Flask", "PHP", "Laravel", "GraphQL"],
  },
  { area: "Mobile", tools: ["React Native", "Expo", "Flutter", "Android", "iOS"] },
  {
    area: "Databases",
    tools: ["PostgreSQL", "MySQL", "MongoDB", "Redis", "SQLite", "Supabase", "Firebase", "Prisma"],
  },
  { area: "CMS & e-commerce", tools: ["WordPress", "WooCommerce", "Shopify"] },
  {
    area: "Cloud & hosting",
    tools: ["Google Cloud", "AWS", "Vercel", "Netlify", "Cloudflare", "DigitalOcean", "Hostinger"],
  },
  {
    area: "DevOps & security",
    tools: ["Docker", "Linux", "Nginx", "Git", "GitHub", "GitHub Actions", "Let’s Encrypt", "Sentry"],
  },
  {
    area: "AI & data",
    tools: ["OpenAI", "Claude", "Gemini", "Hugging Face", "LangChain", "TensorFlow", "Pandas"],
  },
  {
    area: "Automation & integrations",
    tools: ["n8n", "Zapier", "Make", "Stripe", "PayPal", "Xendit", "Google Maps", "Leaflet"],
  },
  {
    area: "Testing & SEO",
    tools: ["Jest", "Vitest", "Cypress", "Playwright", "Postman", "Google Search Console", "Google Analytics"],
  },
  { area: "Design", tools: ["Figma"] },
];

export const faqs = [
  {
    q: "How much does a project cost?",
    a: "Every project is scoped individually. After a first conversation about your goals, we’ll share an estimate and timeline based on what you actually need.",
  },
  {
    q: "Do we need a detailed specification first?",
    a: "No. A clear description of the problem is enough to start. Shaping the details together is part of our Listen and Map stages.",
  },
  {
    q: "Can you work with the systems we already use?",
    a: "Usually, yes. We connect new software to existing tools through APIs and integrations, and we can modernize legacy systems step by step.",
  },
  {
    q: "What happens after launch?",
    a: "We can monitor, maintain, and improve your system through an agreed support plan — security updates, fixes, and new features as you grow.",
  },
  {
    q: "Is AI right for our organization?",
    a: "Sometimes. We start with the job to be done. If AI genuinely helps — searching knowledge, reading documents, drafting routine work — we build it with human review built in.",
  },
];

export const serviceOptions = [
  "Website",
  "Custom software",
  "Mobile app",
  "Automation",
  "AI solution",
  "Integrations & cloud",
  "Not sure yet",
];
