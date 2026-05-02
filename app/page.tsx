import { Hero } from "@/components/hero/Hero";
import { ProfileSection } from "@/components/sections/ProfileSection";
import { MissionsSection } from "@/components/sections/MissionsSection";

export default function HomePage() {
  return (
    <main>
      <Hero />
      <ProfileSection />
      <MissionsSection />
    </main>
  );
}
