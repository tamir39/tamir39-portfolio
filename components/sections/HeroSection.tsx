"use client";

import { FadeIn } from "@/components/ui/FadeIn";
import { ContactButton } from "@/components/ui/ContactButton";
import { Magnet } from "@/components/ui/Magnet";
import Image from "next/image";

const NAV_LINKS = [
  { label: "About", href: "#about" },
  { label: "Skills", href: "#services" },
  { label: "Projects", href: "#projects" },
  {
    label: "Contact",
    href: "https://mail.google.com/mail/?view=cm&fs=1&to=tamphi5002@gmail.com",
    external: true,
  },
];

export default function HeroSection() {
  return (
    <section
      id="hero"
      className="relative flex h-screen flex-col"
      style={{
        overflowX: "clip",
        backgroundImage:
          "radial-gradient(circle, rgba(0,229,255,0.07) 1px, transparent 1px)",
        backgroundSize: "28px 28px",
      }}
    >
      {/* Navbar */}
      <FadeIn delay={0} y={-20} className="px-6 pt-6 md:px-10 md:pt-8">
        <nav className="flex w-full justify-between">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target={link.external ? "_blank" : undefined}
              rel={link.external ? "noopener noreferrer" : undefined}
              className="font-medium uppercase tracking-wider text-[#D7E2EA] transition-opacity duration-200 hover:opacity-70"
              style={{ fontSize: "clamp(0.75rem, 1.2vw, 1.4rem)" }}
            >
              {link.label}
            </a>
          ))}
        </nav>
      </FadeIn>

      {/* Hero Heading */}
      <div className="overflow-hidden mt-6 sm:mt-4 md:-mt-5">
        <FadeIn delay={0.15} y={40}>
          <h1
            className="hero-heading w-full whitespace-nowrap font-black uppercase leading-none tracking-tight"
            style={{
              fontSize: "clamp(3rem, 14vw, 16rem)",
              paddingLeft: "clamp(1rem, 2vw, 2.5rem)",
            }}
          >
            Hi, i&apos;m Tâm
          </h1>
        </FadeIn>
      </div>

      {/* Bottom Bar */}
      <div className="mt-auto flex items-end justify-between pb-7 sm:pb-8 md:pb-10 px-6 md:px-10">
        <FadeIn delay={0.35} y={20}>
          <p
            className="font-light uppercase tracking-wide leading-snug text-[#D7E2EA]"
            style={{
              fontSize: "clamp(0.75rem, 1.4vw, 1.5rem)",
              maxWidth: "clamp(160px, 18vw, 260px)",
            }}
          >
            a frontend developer driven by crafting striking and unforgettable
            experiences
          </p>
        </FadeIn>

        <FadeIn delay={0.5} y={20}>
          <ContactButton />
        </FadeIn>
      </div>

      {/* Portrait — positioning wrapper + FadeIn animation separated */}
      <div
        className="absolute left-1/2 z-10 top-1/2 sm:top-auto sm:bottom-0"
        style={{ transform: "translateX(-50%) translateY(-50%)" }}
      >
        <FadeIn delay={0.6} y={30}>
          <Magnet padding={150} strength={3}>
            <Image
              src="/tamir-avatar-darkmode.png"
              alt="Tâm portrait"
              width={520}
              height={720}
              priority
              className="object-contain select-none pointer-events-none"
              style={{
                width: "clamp(220px, 28vw, 520px)",
                height: "auto",
              }}
            />
          </Magnet>
        </FadeIn>
      </div>
    </section>
  );
}
