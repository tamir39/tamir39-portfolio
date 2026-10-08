import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Sparkles, ArrowDown } from "lucide-react";
import { InteractionLab } from "./InteractionLab";
import { GameDevelopment } from "./GameDevelopment";
import { AcademicWork } from "./AcademicWork";
import { IndependentWork } from "./IndependentWork";
import { Portrait } from "./Portrait";
import { ProjectRecognition } from "./ProjectRecognition";
import { getProject } from "@/lib/data/projects";
import { currentRole } from "@/lib/data/profile";




export function Portfolio() {
  return <main id="main-content">
    <InteractionLab />
    <section id="work" className="relative px-6 py-20 sm:px-10 lg:px-16 lg:py-28">
      <div className="mx-auto max-w-[1312px]">
        <div className="mb-16 flex flex-wrap items-end justify-between gap-7">
          <div><p className="section-eyebrow"><span aria-hidden="true">✧</span> Selected work</p><h2 className="section-heading">Interfaces with purpose.<br /><span className="font-editorial font-normal italic text-accent">Real things I’ve made.</span></h2></div>
          <p className="max-w-[300px] text-sm leading-relaxed text-muted">Frontend work shaped around visual design, application logic, and the flows people move through.</p>
        </div>
        <div className="mb-16 grid grid-cols-1 gap-5">
          {[
            { slug: "100b-studio", name: "100b.studio", icon: "/projects/icons/100b-studio.png", href: "https://100b.studio/", label: "Co-founder & Frontend Developer", text: "A cinematic studio landing page with an adjustable wireframe hero, animated diagrams, a scroll-linked process, and a project-inquiry flow." },
            { slug: "twohearts-vn", name: "Twohearts.vn", icon: "/projects/icons/twohearts.jpeg", href: "https://twohearts.vn", label: "Landing page · UI/UX design", text: "An interactive restaurant-platform landing page, with a savings calculator, product demos, and a bilingual signup flow." },
            { slug: "joi-vn", name: "Joi.vn", icon: "/projects/icons/joi.svg", href: "https://joi.vn", label: "Menu & ordering · UI/UX design", text: "A food-first storefront connecting menu discovery, product customization, and a guided four-step checkout." },
            { slug: "zuno", name: "Zuno app", icon: "/projects/icons/zuno.svg", href: "https://www.zuno.page/", label: "Full-stack PWA", text: "A full-stack PWA connecting authentication, private Class Zones, posts, and votes with expressive timelines and app-style installation." },
            { slug: "enstudy-hub", name: "EnStudy-Hub", icon: "/projects/icons/enstudy-hub.svg", href: "https://en-study-hub.vercel.app/", label: "Frontend Developer & UI/UX Designer", text: "A vocabulary app with personal collections, CSV preview and validation, spaced review sessions, and learning-progress charts." },
          ].map(project => <article key={project.slug} className="portfolio-project project-card-link-surface grid gap-6 border p-7 sm:p-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)_auto] lg:items-center lg:gap-10">
            <div className="min-w-0"><p className="mb-4 text-sm font-semibold leading-snug text-ink">{project.label}</p><div className="flex items-center gap-3"><Image src={project.icon} alt="" width={40} height={40} className={`size-10 shrink-0 object-contain outline-none ${project.slug === "100b-studio" ? "" : "rounded-xl"}`} /><h3 className="min-w-0 font-editorial text-[clamp(1.8rem,2.7vw,3rem)] italic">{project.name}</h3></div></div>
            <div className="min-w-0"><p className="max-w-md text-sm leading-relaxed text-muted">{project.text}</p><ProjectRecognition recognition={getProject(project.slug)?.recognition} compact /></div>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 lg:flex-col lg:items-start"><a href={project.href} target="_blank" rel="noopener noreferrer" aria-label={`Visit ${project.name} website`} className="theme-button inline-flex min-h-11 items-center gap-2 whitespace-nowrap rounded-full px-5 text-xs font-medium text-white">Visit website<ArrowUpRight size={14} aria-hidden="true" /></a><Link href={`/missions/${project.slug}`} aria-label={`View ${project.name} project details`} className="project-card-details inline-flex min-h-11 items-center text-xs underline underline-offset-4">Project details</Link></div>
          </article>)}
        </div>
      </div>
    </section>

    <GameDevelopment />
    <IndependentWork />
    <AcademicWork />


    <section aria-labelledby="focus-heading" className="px-6 py-16 sm:px-10 lg:px-16"><div className="mx-auto max-w-[1312px]"><p className="section-eyebrow">What I focus on</p><h2 id="focus-heading" className="section-heading">From visual detail<br /><span className="font-editorial italic text-accent">to a complete flow.</span></h2><div className="mt-10 grid gap-7 sm:grid-cols-2 lg:grid-cols-4">{[{title:"Frontend engineering",text:"Responsive interfaces, reusable components, and interactions built with React, Next.js, and TypeScript."},{title:"UI/UX design",text:"Layout, spacing, hierarchy, and feedback that make the interface easier to understand."},{title:"Application flows",text:"Navigation, onboarding, invites, and state changes that connect each step of a task."},{title:"PWA experiences",text:"Exploring app-like web experiences through Zuno’s update prompts, service-worker lifecycle, and contextual push notifications."}].map(item=><article key={item.title} className="border-t theme-border pt-5"><h3 className="text-lg font-medium">{item.title}</h3><p className="mt-3 text-sm leading-relaxed text-muted">{item.text}</p></article>)}</div></div></section>

    <section id="about" className="relative overflow-clip theme-surface px-6 py-20 sm:px-10 lg:px-16 lg:py-28">
      <div className="relative z-10 mx-auto grid max-w-[1312px] items-center gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-24">
        <div className="about-profile relative mx-auto w-full max-w-[430px]">
          <div className="explorer-orbit" aria-hidden="true"><span className="orbit-point" /><span className="orbit-star">✦</span></div>
          <div className="profile-card relative p-7 sm:p-9">
            <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.15em] text-muted"><span>A little about me</span><Sparkles size={16} aria-hidden="true" /></div>
            <div className="my-8 flex items-center gap-5"><Portrait className="size-24 border theme-outline sm:size-28" sizes="(min-width: 640px) 140px, 120px" /><div><p className="text-3xl font-medium tracking-tight">Tamir</p><p className="mt-2 text-xs text-muted">Designer’s curiosity.<br />Developer’s mindset.</p></div></div>
            <dl className="space-y-4 text-xs"><div className="flex justify-between gap-6 border-t theme-border pt-4"><dt className="text-muted">Based in</dt><dd className="text-right">Ho Chi Minh City, Vietnam</dd></div><div className="flex justify-between gap-6"><dt className="text-muted">Focus</dt><dd className="text-right">Frontend, UI/UX & PWA</dd></div><div className="flex justify-between gap-6"><dt className="text-muted">Favorite way to learn</dt><dd className="text-right">Making something</dd></div></dl>
            <a href="/PHI_VUONG_TUONG_TAM_FRONTEND_RESUME.pdf" target="_blank" rel="noopener noreferrer" className="mt-8 flex min-h-12 items-center justify-between rounded-full border theme-outline px-5 text-xs font-semibold transition-colors ">View my resume<ArrowUpRight size={16} aria-hidden="true" /></a>
          </div>
        </div>
        <div><p className="section-eyebrow"><span aria-hidden="true">✧</span> Design meets application logic</p><h2 className="section-heading">One curious mind.<br /><span className="font-editorial font-normal italic text-accent">Many ways to create.</span></h2><p className="mt-7 max-w-xl text-lg leading-relaxed">I’m Phí Vương Tường Tâm, also known as Tamir, a frontend developer and UI/UX designer at {currentRole.company}. I’m also a computer science student at Ton Duc Thang University.</p>
          <article id="experience" aria-labelledby="current-role-heading" className="theme-border mt-7 scroll-mt-6 border-y py-5"><p className="section-eyebrow mb-2">Current role</p><div className="flex flex-wrap items-center justify-between gap-x-5 gap-y-2"><h3 id="current-role-heading" className="flex min-w-0 max-w-full items-center gap-3 text-xl font-semibold tracking-tight"><Image src="/projects/icons/twohearts.jpeg" alt="" width={32} height={32} className="size-8 shrink-0 rounded-md object-cover" /><span className="min-w-0 break-words">{currentRole.company}</span></h3><p className="text-xs text-muted"><time dateTime={currentRole.startDate}>{currentRole.start}</time> — present</p></div><p className="mt-2 text-sm font-medium">{currentRole.title}</p><p className="mt-3 max-w-xl text-sm leading-relaxed text-muted">{currentRole.summary}</p><div className="mt-2 flex flex-wrap gap-x-6"><a href={currentRole.href} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2 text-xs underline underline-offset-4">Visit Twohearts<ArrowUpRight size={14} aria-hidden="true" /></a><a href={currentRole.linkedinHref} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2 text-xs underline underline-offset-4">View LinkedIn profile<ArrowUpRight size={14} aria-hidden="true" /></a></div></article>
          <p className="mt-5 max-w-xl text-sm leading-relaxed text-muted sm:text-base">I work where visual design meets application logic: clear layouts, thoughtful interactions, and user flows that hold together from the first click to the final step. I explore different themes, visual styles, motion, and animation to make interfaces feel more interactive, attractive, and alive.</p><div className="mt-8 flex flex-wrap gap-2">{["Figma", "React", "Next.js", "TypeScript", "Tailwind CSS", "Framer Motion", "PWA", "User flows", "Unity", "Godot"].map(skill => <span key={skill} className="rounded-full border theme-outline bg-white/25 px-4 py-2 text-xs text-muted">{skill}</span>)}</div></div>
      </div>
    </section>

    <section className="px-6 py-20 sm:px-10 lg:px-16 lg:py-28" aria-labelledby="approach-heading"><div className="mx-auto max-w-[1312px]"><div className="mb-12 flex flex-wrap items-end justify-between gap-6"><div><p className="section-eyebrow"><span aria-hidden="true">✧</span> From curiosity to creation</p><h2 id="approach-heading" className="section-heading">A small spark.<br /><span className="font-editorial font-normal italic text-accent">A considered process.</span></h2></div><p className="max-w-[280px] text-sm leading-relaxed text-muted">I like room to experiment, with a clear reason behind the decisions.</p></div><ol className="grid gap-8 md:grid-cols-3">{[{ title:"Understand",text:"Start with the people and the problem. Figure out what needs to be clearer, simpler, or more useful.", symbol:"◎" },{ title:"Explore",text:"Sketch possibilities, shape the visual direction, and prototype how the important moments should feel.",symbol:"✧" },{ title:"Bring it to life",text:"Build in the browser, refine the interactions, and check how the experience holds up across screens.",symbol:"↗" }].map((step,index) => <li key={step.title} className="border-t theme-border pt-6"><div className="mb-8 flex items-center justify-between"><span className="font-mono text-xs text-muted">0{index+1}</span><span aria-hidden="true" className="text-4xl font-light text-accent">{step.symbol}</span></div><h3 className="mb-3 text-xl font-medium">{step.title}</h3><p className="max-w-sm text-sm leading-relaxed text-muted">{step.text}</p></li>)}</ol><a href="#contact" className="mt-12 inline-flex min-h-11 items-center gap-3 text-xs font-medium text-muted hover:text-accent">Have a product in mind? Let’s talk<ArrowDown size={14} aria-hidden="true" /></a></div></section>
  </main>;
}
