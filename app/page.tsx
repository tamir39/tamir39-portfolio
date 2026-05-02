import { Hero } from "@/components/hero/Hero";
import { ProfileSection } from "@/components/sections/ProfileSection";
import { MissionsSection } from "@/components/sections/MissionsSection";
import { TransmissionSection } from "@/components/sections/TransmissionSection";

export default function HomePage() {
  return (
    <main>
      <Hero />
      <ProfileSection />
      <MissionsSection />
      <TransmissionSection />
    </main>
  );
}
