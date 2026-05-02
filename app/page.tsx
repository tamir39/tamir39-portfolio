import { Hero } from "@/components/hero/Hero";
import { ProfileSection } from "@/components/sections/ProfileSection";
import { MissionsSection } from "@/components/sections/MissionsSection";
import { HashScrollFix } from "@/components/utils/HashScrollFix";

export default function HomePage() {
  return (
    <main>
      <HashScrollFix />
      <Hero />
      <ProfileSection />
      <MissionsSection />
    </main>
  );
}
