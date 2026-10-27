import Image from "next/image";

const logos: Record<string, string> = {
  "100b-studio": "/projects/icons/100b-studio.png",
  zuno: "/projects/icons/zuno.svg",
  moza: "/projects/icons/moza.svg",
  selfnest: "/projects/icons/selfnest.svg",
  "enstudy-hub": "/projects/icons/enstudy-hub.svg",
  educata: "/projects/icons/educata.svg",
};

export function ProjectLogo({ slug, size = 40, responsive = false }: { slug: string; size?: number; responsive?: boolean }) {
  const src = logos[slug];
  if (!src) return null;
  const displaySize = responsive ? `clamp(2rem, 5vw, ${size}px)` : size;
  return <Image src={src} alt="" width={size} height={size} className={`shrink-0 object-contain outline-none ${slug === "100b-studio" ? "" : "rounded-xl"}`} style={{ width: displaySize, height: displaySize }} />;
}
