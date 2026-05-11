"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { portfolioProjects } from "@/lib/data/portfolio-projects";
import { LiveProjectButton } from "@/components/ui/LiveProjectButton";
import { FadeIn } from "@/components/ui/FadeIn";
import Image from "next/image";
import Link from "next/link";

const TOTAL = portfolioProjects.length;

export default function ProjectsSection() {
  return (
    <section
      id="projects"
      className="bg-[#0c0c0c] rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] -mt-10 sm:-mt-12 md:-mt-14 relative z-10 px-5 sm:px-8 md:px-10 pt-20 sm:pt-24 md:pt-32 pb-32"
    >
      <FadeIn delay={0} y={40}>
        <h2
          className="hero-heading font-black uppercase text-center leading-none tracking-tight mb-16 sm:mb-20 md:mb-28"
          style={{ fontSize: "clamp(3rem, 12vw, 160px)" }}
        >
          Project
        </h2>
      </FadeIn>

      <div className="relative mx-auto max-w-6xl">
        {portfolioProjects.map((project, i) => (
          <ProjectCard key={project.id} project={project} index={i} />
        ))}
      </div>
    </section>
  );
}

function ProjectCard({
  project,
  index,
}: {
  project: (typeof portfolioProjects)[number];
  index: number;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const targetScale = 1 - (TOTAL - 1 - index) * 0.03;
  const scale = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [1, targetScale, targetScale]
  );

  return (
    <div ref={containerRef} className="h-[85vh] flex items-start">
      <motion.div
        className="sticky rounded-[40px] sm:rounded-[50px] md:rounded-[60px] border-2 border-[#D7E2EA] bg-[#0c0c0c] p-4 sm:p-6 md:p-8 w-full hover:shadow-[0_0_32px_rgba(0,229,255,0.08)] transition-shadow duration-300"
        style={{
          top: `${96 + index * 28}px`,
          scale,
          transformOrigin: "top center",
        }}
      >
        {/* Card top row */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 md:mb-8">
          <div className="flex items-center gap-4 md:gap-6">
            <span
              className="font-black text-[#D7E2EA] leading-none select-none"
              style={{ fontSize: "clamp(2rem, 6vw, 5rem)" }}
            >
              {project.id}
            </span>
            <div className="flex flex-col gap-1">
              <span className="text-hud-label">
                {project.category}
              </span>
              <Link
                href={`/missions/${project.slug}`}
                className="font-black uppercase text-[#D7E2EA] leading-tight tracking-tight hover:opacity-70 transition-opacity"
                style={{ fontSize: "clamp(1rem, 3vw, 2.5rem)" }}
              >
                {project.name}
              </Link>
            </div>
          </div>

          <LiveProjectButton
            href={project.liveUrl ?? project.githubUrl ?? `/missions/${project.slug}`}
          />
        </div>

        {/* Card image grid */}
        <div className="flex gap-3 sm:gap-4">
          {/* Left column — 2 stacked images */}
          <div className="flex flex-col gap-3 sm:gap-4" style={{ flex: "0 0 40%" }}>
            <Image
              src={project.images.col1a}
              alt={`${project.name} preview 1`}
              width={600}
              height={400}
              loading="lazy"
              className="w-full object-cover rounded-[24px] sm:rounded-[32px] md:rounded-[40px]"
              style={{ height: "clamp(130px, 16vw, 230px)" }}
            />
            <Image
              src={project.images.col1b}
              alt={`${project.name} preview 2`}
              width={600}
              height={500}
              loading="lazy"
              className="w-full object-cover rounded-[24px] sm:rounded-[32px] md:rounded-[40px]"
              style={{ height: "clamp(160px, 22vw, 340px)" }}
            />
          </div>

          {/* Right column — 1 tall image */}
          <div style={{ flex: "0 0 calc(60% - 1rem)" }}>
            <Image
              src={project.images.col2}
              alt={`${project.name} preview 3`}
              width={900}
              height={800}
              loading="lazy"
              className="w-full h-full object-cover rounded-[24px] sm:rounded-[32px] md:rounded-[40px]"
              style={{ minHeight: "clamp(300px, 40vw, 580px)" }}
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
