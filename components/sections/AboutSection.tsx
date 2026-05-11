"use client";

import { FadeIn } from "@/components/ui/FadeIn";
import { ContactButton } from "@/components/ui/ContactButton";
import { AnimatedText } from "@/components/ui/AnimatedText";

const BIO =
  "With more than two years of building across frontend, game dev, and AI, I focus on crafting experiences that are fast, intentional, and memorable. Whether it's a slick landing page or a multiplayer Godot game — let's build something incredible together.";

const CORNER_IMAGES = {
  topLeft: {
    src: "https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/moon_icon.11395d36.png",
    className: "absolute top-[4%] left-[1%] sm:left-[2%] md:left-[4%]",
    style: { width: "clamp(80px, 12vw, 210px)" },
    fadeIn: { delay: 0.1, x: -80, y: 0, duration: 0.9 },
  },
  bottomLeft: {
    src: "https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/p59_1.4659672e.png",
    className: "absolute bottom-[8%] left-[3%] sm:left-[6%] md:left-[10%]",
    style: { width: "clamp(70px, 10vw, 180px)" },
    fadeIn: { delay: 0.25, x: -80, y: 0, duration: 0.9 },
  },
  topRight: {
    src: "https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/lego_icon-1.703bb594.png",
    className: "absolute top-[4%] right-[1%] sm:right-[2%] md:right-[4%]",
    style: { width: "clamp(80px, 12vw, 210px)" },
    fadeIn: { delay: 0.15, x: 80, y: 0, duration: 0.9 },
  },
  bottomRight: {
    src: "https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/Group_134-1.2e04f3ce.png",
    className: "absolute bottom-[8%] right-[3%] sm:right-[6%] md:right-[10%]",
    style: { width: "clamp(90px, 13vw, 220px)" },
    fadeIn: { delay: 0.3, x: 80, y: 0, duration: 0.9 },
  },
};

export default function AboutSection() {
  return (
    <section
      id="about"
      className="relative min-h-screen bg-[#0c0c0c] px-5 sm:px-8 md:px-10 py-20 flex items-center justify-center"
    >
      {/* Corner decorative images */}
      {Object.entries(CORNER_IMAGES).map(([key, img]) => (
        <FadeIn
          key={key}
          delay={img.fadeIn.delay}
          x={img.fadeIn.x}
          y={img.fadeIn.y}
          duration={img.fadeIn.duration}
          className={img.className}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={img.src} alt="" style={img.style} />
        </FadeIn>
      ))}

      {/* Center content */}
      <div className="relative z-10 flex flex-col items-center gap-10 sm:gap-14 md:gap-16 text-center">
        <FadeIn delay={0} y={40}>
          <h2
            className="hero-heading font-black uppercase leading-none tracking-tight"
            style={{ fontSize: "clamp(3rem, 12vw, 160px)" }}
          >
            About me
          </h2>
        </FadeIn>

        <AnimatedText
          text={BIO}
          className="font-medium leading-relaxed text-[#D7E2EA] max-w-[560px]"
          style={{ fontSize: "clamp(1rem, 2vw, 1.35rem)" }}
        />

        <div style={{ marginTop: "clamp(2rem, 4vw, 4rem)" }}>
          <ContactButton />
        </div>
      </div>
    </section>
  );
}
