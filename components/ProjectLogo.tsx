import Image from "next/image";

const logos: Record<string, string> = {
  "100b-studio": "/projects/icons/100b-studio.png",
  moza: "/projects/icons/moza.svg",
  selfnest: "/projects/icons/selfnest.svg",
  "enstudy-hub": "/projects/icons/enstudy-hub.svg",
  educata: "/projects/icons/educata.svg",
};

export function ProjectLogo({ slug, size = 40 }: { slug: string; size?: number }) {
  const src = logos[slug];
  if (!src) return null;
  return <Image src={src} alt="" width={size} height={size} className={`shrink-0 object-contain outline-none ${slug === "100b-studio" ? "" : "rounded-xl"}`} style={{ width: size, height: size }} />;
}
