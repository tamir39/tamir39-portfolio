import { academicProjects } from "./academic-projects";
import { independentProjects } from "./independent-projects";

export type ProjectStatus = "ACTIVE" | "ARCHIVED";

export type Project = {
  slug: string;
  id: string;
  name: string;
  tagline: string;
  status: ProjectStatus;
  role: string;
  dates: string;
  stack: string[];
  summary: string;
  deliverable?: string;
  contribution?: string;
  focus?: string[];
  journey?: string[];
  highlights: { title: string; body: string }[];
  academic?: { course: string; state: "Completed" | "In progress" | "UI studies"; featured?: boolean; description: string; focus: string[] };
  independent?: { state: "Local MVP" | "Local build" | "Frontend prototype"; description: string };
  releaseState?: string;
  links?: { label: string; href: string }[];
  competition?: { name: string; theme: string; team: string; teamSize: number; href: string };
  video?: { youtubeId: string; title: string };
  recognition?: { title: string; event: string; team: string; organizer: string; partner: string; href: string };
};

export const projects: Project[] = [
  {
    slug: "100b-studio", id: "16", name: "100b.studio",
    tagline: "Studio landing page · Cinematic visuals and interactive engineering storytelling",
    deliverable: "Co-founder & Frontend Developer",
    contribution: "I’m a co-founder and frontend developer at 100b.studio. My work on our public website includes a configurable wireframe hero, animated capability diagrams, a scroll-linked process timeline, and a project-inquiry flow. The interface brings our services, work, and engagement process into one visual story.",
    focus: ["Landing-page design", "Canvas visuals", "Scroll interactions", "Inquiry flow"],
    status: "ACTIVE", role: "Co-founder & Frontend Developer", dates: "",
    stack: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Canvas 2D", "Framer Motion"],
    summary: "100b.studio is the full-stack engineering studio I co-founded, where I also work as a frontend developer. Our public website combines warm paper surfaces and strong typography with wireframe graphics, cinematic interludes, and interactive diagrams. Visitors move from our studio’s positioning through capabilities, process, projects, team, and terms before sending a brief. My frontend work focuses on implementation and interaction flow.",
    journey: ["Explore the studio", "Adjust the hero visual", "Inspect capabilities", "Follow the process timeline", "Review work and team", "Read engagement terms", "Send a project brief"],
    highlights: [
      { title: "A cinematic visual system", body: "Cream and paper surfaces, dark ink, monospaced labels, and saffron-to-coral accents establish the current visual direction. Section markers and geometric graphics connect the hero, service explanations, projects, and contact area." },
      { title: "An interactive wireframe hero", body: "A Canvas 2D scene sits behind the opening message. A tweaks panel exposes shape and accent choices, while progress readouts connect the graphics to the page’s technical character." },
      { title: "Explain the work through motion", body: "Capability canvases illustrate SaaS, AI, and scale concepts. The process section maps Analyze → Design → Build → Scale onto a scroll-linked rail, with an active stage and a moving token making the sequence visible." },
      { title: "Navigation that follows the journey", body: "The desktop top bar reveals near the top edge and tracks the active section. Mobile keeps navigation visible, while page progress and in-page links support a long scrolling experience." },
      { title: "A complete inquiry interface", body: "The contact form collects a name, email, budget, timeline, and project description. Submitting, success, and error states give feedback, with direct email and a copy-address action as alternative contact paths." },
      { title: "Render detail with the viewport in mind", body: "Canvas helpers account for pixel density and resizing, and small canvas scenes gate drawing by viewport visibility. The hero includes a reduced-motion check so the visual implementation can respond to motion preferences." },
    ],
    links: [{ label: "Visit website", href: "https://100b.studio/" }],
  },
  {
    slug: "twohearts-vn", id: "03", name: "Twohearts.vn",
    tagline: "Landing page · Interactive product storytelling for restaurant owners",
    deliverable: "Landing page",
    contribution: "I designed and built the public landing experience: responsive page layouts, interactive product demos, a savings calculator, and a bilingual signup flow.",
    focus: ["UI/UX design", "Responsive frontend", "Motion & demos", "Signup flow"],
    status: "ACTIVE", role: "Frontend · UI/UX design", dates: "June 2026 — present", stack: ["React", "TypeScript", "Vite", "Framer Motion", "Responsive design", "VI / EN"],
    recognition: {
      title: "F&B Track winner", event: "Agentic AI Build Week 2026", team: "Twohearts", organizer: "GenAI Fund", partner: "KFC Vietnam",
      href: "https://www.linkedin.com/posts/genai-fund_aabw2026-aabwxgaf-activity-7482359686189445120-FEhQ",
    },
    summary: "Twohearts.vn turns a broad restaurant platform into a story owners can explore. My frontend and UI/UX work focuses on the public landing experience: making the cost of third-party ordering tangible, showing how an order travels from conversation to kitchen, and giving visitors a clear path to register their interest. The product demonstrations are illustrative scenes, designed to explain the service before someone signs up.",
    journey: ["Explore the product", "Adjust the savings calculator", "Follow the ordering demo", "Compare capabilities and pricing", "Submit the waitlist form"],
    highlights: [
      {"title":"Visual direction","body":"A light, teal-accented interface with clear section hierarchy, product scenes, phone mockups, and recognizable brand assets. The layout connects the problem, product explanation, pricing, and signup rather than presenting disconnected feature cards."},
      {"title":"Interactive value explanation","body":"Order-volume and average-ticket sliders update comparison bars and estimated monthly and yearly savings. The calculator makes the pricing model explorable; its figures are estimates, not measured customer results."},
      {"title":"Motion that explains a flow","body":"A moving chip changes from message to confirmed order to kitchen ticket across three aligned stages. ChatOS, VoiceOS, ScanOS, and ReviewOS scenes give each capability a visible context, with viewport-triggered reveals and reduced-motion handling."},
      {"title":"Signup and recovery","body":"The bilingual waitlist form validates required information, focuses the first invalid field, shows submission progress, and replaces the form with a clear success state. Vietnamese and English routes share content structure and remember the visitor’s language choice."},
      {"title":"A separate live-tracking demo","body":"Visitors can play, advance, or select stages in a five-step order journey. The changing progress indicator makes the sequence easy to follow without presenting the demo as a live customer order."},
      {"title":"Responsive frontend refinement","body":"Mobile guardrails keep the hero and product scenes within the viewport. Optimized CDN imagery, self-hosted fonts, memoized sections, and off-screen animation gating support the visual experience without continuously animating every section."},
    ],
    links: [{ label: "Visit Twohearts.vn", href: "https://twohearts.vn" }],
  },
  {
    slug: "joi-vn", id: "02", name: "Joi.vn",
    tagline: "Menu & ordering interface · From finding a dish to placing an order",
    deliverable: "Menu & ordering interface",
    contribution: "I designed and implemented the customer-facing menu and ordering experience: dish discovery, customization, basket interactions, and a guided four-step checkout.",
    focus: ["Menu discovery", "UI/UX design", "Product customization", "Checkout logic"],
    status: "ACTIVE", role: "Frontend · UI/UX design", dates: "",
    stack: ["React", "TypeScript", "Tailwind CSS", "Framer Motion", "TanStack Query", "Zustand", "VI / EN"],
    summary: "Joi’s customer storefront connects food discovery with the practical details of ordering. My work spans UI/UX design and frontend implementation across the landing page, delivery menu, product customization, basket, and checkout. The design keeps the food prominent while making availability, selected options, prices, and the next action readable on both desktop and mobile.",
    journey: ["Browse or search dishes", "Choose options and quantities", "Review the basket", "Choose delivery or pickup", "Enter contact details", "Apply savings and choose payment", "Review and place the order", "View confirmation"],
    highlights: [
      {"title":"Food-led visual design","body":"Warm white, pale green, dark-green actions, and natural food photography create a consistent storefront. Shared color roles distinguish brand accents from success and error feedback, while stronger action colors keep button text readable."},
      {"title":"Menu discovery","body":"Category filters, search suggestions, best sellers, and a dedicated deals-and-combos shelf give customers several ways to find a meal. Search and category selection feed the same browsing state, with clear empty results rather than mismatched filters."},
      {"title":"Product-to-basket interaction","body":"Dish details bring imagery, customization choices, quantity, notes, and an add action into one focused surface. Mobile sizing accounts for the available viewport and keyboard; persistent cart state keeps selections available across navigation."},
      {"title":"A four-step checkout","body":"Receiving → Customer → Pay & save → Review replaces a long form. Delivery or pickup and timing come first, followed by contact details, optional rewards and payment, then the final review. The cart summary stays expanded so customers retain order context."},
      {"title":"Feedback without layout jumps","body":"Fixed localized notices explain validation and availability issues. Submission states and the invoice view complete the order flow. Unavailable showcase dishes remain visible with disabled ordering, while campaign sections follow their own stock rules."},
      {"title":"Responsive continuity","body":"Desktop and mobile use layouts suited to their space, including a desktop support rail and mobile chat launcher. The shared background survives route changes, Vietnamese and English copy stay connected, and restrained fades respect reduced-motion preferences."},
    ],
    links: [{ label: "Visit Joi.vn", href: "https://joi.vn" }],
  },
  {
    slug: "zuno",
    links: [{ label: "Visit Zuno app", href: "https://www.zuno.page/" }],
    id: "04",
    name: "Zuno",
    tagline: "Full-stack PWA · Private Class Zones, from interface to application logic",
    deliverable: "Full-stack PWA",
    contribution: "I build Zuno as a personal full-stack PWA, connecting the visual design and frontend with authentication, Zone membership, posting, votes, and persistent data.",
    focus: ["Product & UI/UX design", "Frontend", "Backend & data flows", "PWA experience"],
    status: "ACTIVE",
    role: "Personal app · Full-stack development & UI/UX",
    dates: "2026 — present",
    stack: ["Next.js", "React", "TypeScript", "Tailwind CSS", "PostgreSQL", "Drizzle", "Zustand", "PWA"],
    summary:
      "Zuno is a private social space built around Zones, with Class Zones as the current beta focus. I shape the interface and application flows from the first invitation through posting, reactions, votes, and daily activity. Expressive scrapbook-style timelines give shared moments a sense of identity, while navigation, settings, and PWA prompts keep everyday actions clear.",
    journey: ["Sign in", "Create a Class Zone or open an invite", "Preview and join", "Share a post or vote", "React and follow activity", "Return through the inbox or a notification"],
    highlights: [
      {"title":"Expressive identity, practical surfaces","body":"Violet-blue atmosphere, serif display headings, cream photo cards, and floating pills give the landing and timeline personality. Shared semantic color roles support light and dark themes across desktop and mobile, with Vietnamese-friendly typography for names and controls."},
      {"title":"An invitation that preserves context","body":"Shared links open a Zone preview with its name, member count, and a single join action. Guests who need to sign in are directed back to the invitation, and loading or join errors use readable messages rather than raw API codes."},
      {"title":"Fewer steps to share","body":"The global creation flow keeps the destination Zone in an inline picker while composing a post or vote. Numbered vote options and visible option counts make the form easier to scan; text drafts in the Zone composer are saved locally and cleared after a successful post."},
      {"title":"Navigation adapted to the task","body":"Phones have labeled Zone, Post, Inbox, and Account controls with safe-area clearance. Posting and inbox controls open dialogs; destinations remain links. Settings group preferences and secondary actions on a dedicated mobile page, while desktop retains a wider Zone grid and compact account menu."},
      {"title":"PWA installation and updates","body":"Supported browsers use an install action, while iPhone users get an illustrated Add to Home Screen walkthrough. A new version waits for the user to choose Update or Later, with update prompts suppressed on public and sign-in routes to avoid interrupting entry into the app."},
      {"title":"Activity feedback","body":"Contextual Web Push copy identifies the person and Zone involved, with an in-app toast fallback and unread inbox counts. Micro-interactions and landing reveals add feedback and character; desktop decorative effects are gated by pointer capability and reduced-motion preferences."},
    ],
  },
  {
    slug: "enstudy-hub", id: "13", name: "EnStudy-Hub",
    tagline: "Learning application · From a vocabulary collection to a daily review",
    deliverable: "Vocabulary app · Public alpha",
    contribution: "A vocabulary-learning application connecting deck discovery, validated CSV imports, review sessions, and progress visualization, with a public alpha available online. The focus is a complete learning flow with clear choices, keyboard controls, and useful feedback.",
    focus: ["Learning flows", "Import UX", "Keyboard interaction", "Data visualization"],
    status: "ACTIVE", role: "Frontend Developer & UI/UX Designer", dates: "",
    releaseState: "Public alpha",
    stack: ["Next.js", "TypeScript", "Tailwind CSS", "Framer Motion", "Zustand", "Supabase", "Drizzle", "FSRS"],
    links: [{ label: "Visit website", href: "https://en-study-hub.vercel.app/" }],
    summary: "EnStudy-Hub is an English-vocabulary application for Vietnamese learners, available as a public alpha. Collections, topics, lessons, and cards give the content a navigable structure. A review queue connects that content to daily practice, while personal imports and card editing let learners bring their own material. The portfolio mockup uses sample data; the website link opens the deployed application.",
    journey: ["Browse a collection or import a CSV", "Preview and validate the cards", "Open a lesson", "Start a review session", "Reveal and rate an answer", "Inspect progress and adjust daily limits"],
    highlights: [
      { title: "Preview before importing", body: "Learners can upload or paste CSV data, download a template, and inspect a validation preview before creating a personal lesson. The form separates preview and submission states and returns readable errors when the data or lesson details need attention." },
      { title: "A review flow with several ways to practice", body: "Flashcards, cloze questions, multiple choice, typing, and listening share a review-session structure. Answer ratings feed the spaced-repetition queue; notes and suspend or bury actions give learners control over individual cards." },
      { title: "Keyboard support for repeated actions", body: "A command palette and review shortcuts reduce the effort of repeated navigation and rating. Session state preserves the selected practice mode, while visible controls remain available for people using touch or a pointer." },
      { title: "Make progress visible", body: "The dashboard and statistics views combine a streak, activity heatmap, due counts, retention, and card-maturity charts. SVG visualizations present different aspects of the same learning history, with theme and daily-limit settings nearby." },
    ],
  },
  {
    slug: "panic-hub", id: "05", name: "Panic Hub",
    tagline: "A crisis-simulation game about decisions, rumors, and the crowd",
    deliverable: "Simulation interface · Hackathon",
    contribution: "I worked as the team’s frontend engineer, building the Godot interface that connects live city metrics, policy decisions, and citizen reactions to the simulation backend.",
    focus: ["Dashboard UI", "Decision feedback", "Real-time integration"],
    status: "ARCHIVED", role: "Frontend Engineer · Godot interface", dates: "2026",
    stack: ["Godot 4", "GDScript", "WebSocket", "FastAPI integration"],
    summary: "Panic Hub is a team-built economic crisis simulator for GDGoC Hackathon Vietnam 2026. You play as a mayor managing a city of 50 AI-driven citizens, responding to news, rumors, and changing market conditions. My role was frontend engineering: making the simulation’s state, available decisions, and consequences readable through the Godot interface.",
    highlights: [
      {"title":"A readable city dashboard","body":"A live dashboard for panic, public trust, bank liquidity, city funds, and commodity prices, with visual feedback when thresholds change."},
      {"title":"Policy decisions with feedback","body":"Policy controls connected to the simulation, including cooldowns, funding constraints, and feedback on the results of each decision."},
      {"title":"See how rumors spread","body":"An NPC inspector that reveals a citizen’s thought log, alongside news headlines and speech bubbles that make the spread of rumors visible."},
      {"title":"Connected simulation states","body":"WebSocket integration between the Godot client and the team’s FastAPI backend, handling simulation updates, loading progress, and the end-of-session report."},
    ],
    competition: {
      name: "GDGoC Hackathon Vietnam 2026", theme: "Agentic AI — Agents of Change", team: "Panic Hub", teamSize: 4,
      href: "https://gdg.community.dev/events/details/google-gdg-on-campus-hanoi-university-of-science-technology-hanoi-vietnam-presents-demo-day-gdgoc-hackathon-vietnam-2026/",
    },
    video: { youtubeId: "Vw9_MV7uf-c", title: "Panic Hub — project trailer" },
    links: [
      { label: "Watch the trailer", href: "https://www.youtube.com/watch?v=Vw9_MV7uf-c" },
      { label: "View source code", href: "https://github.com/LineLuLan/Panic-Hub" },
    ],
  },
  ...academicProjects,
  ...independentProjects,
];

export function getProject(slug: string): Project | undefined {
  return projects.find(project => project.slug === slug);
}
