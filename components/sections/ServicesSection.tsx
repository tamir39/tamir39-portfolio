"use client";

import { FadeIn } from "@/components/ui/FadeIn";
import { services } from "@/lib/data/services";

export default function ServicesSection() {
  return (
    <section
      id="services"
      className="bg-white rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] px-5 sm:px-8 md:px-10 py-20 sm:py-24 md:py-32"
    >
      <FadeIn delay={0} y={40}>
        <h2
          className="font-black uppercase text-center text-[#0c0c0c] leading-none tracking-tight mb-16 sm:mb-20 md:mb-28"
          style={{ fontSize: "clamp(3rem, 12vw, 160px)" }}
        >
          Services
        </h2>
      </FadeIn>

      <ul className="mx-auto max-w-5xl">
        {services.map((service, i) => (
          <FadeIn key={service.number} delay={i * 0.1} y={20}>
            <li
              className="flex items-start gap-6 md:gap-10 py-8 sm:py-10 md:py-12"
              style={{
                borderTop: "1px solid rgba(12, 12, 12, 0.15)",
              }}
            >
              {/* Number */}
              <span
                className="font-black text-[#0c0c0c] leading-none shrink-0 select-none"
                aria-hidden
                style={{ fontSize: "clamp(3rem, 10vw, 140px)", lineHeight: 1 }}
              >
                {service.number}
              </span>

              {/* Name + Description */}
              <div className="flex flex-col gap-2 pt-1">
                <h3
                  className="font-medium uppercase text-[#0c0c0c] leading-tight"
                  style={{ fontSize: "clamp(1rem, 2.2vw, 2.1rem)" }}
                >
                  {service.name}
                </h3>
                <p
                  className="font-light leading-relaxed text-[#0c0c0c] max-w-2xl"
                  style={{
                    fontSize: "clamp(0.85rem, 1.6vw, 1.25rem)",
                    opacity: 0.6,
                  }}
                >
                  {service.description}
                </p>
              </div>
            </li>
          </FadeIn>
        ))}
        {/* Bottom border */}
        <li style={{ borderTop: "1px solid rgba(12, 12, 12, 0.15)" }} />
      </ul>
    </section>
  );
}
