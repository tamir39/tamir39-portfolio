import type { Metadata } from "next";
import { SectionHeader } from "@/components/hud/SectionHeader";
import { VideoFrame } from "@/components/transmission/VideoFrame";
import { ContactCard } from "@/components/transmission/ContactCard";
import { ResumeDownload } from "@/components/transmission/ResumeDownload";

export const metadata: Metadata = {
  title: "TRANSMISSION // TAMIR.OS",
  description:
    "Live feed, contact channels, and downloadable dossier for Phi Vuong Tuong Tam.",
};

export default function TransmissionPage() {
  return (
    <main className="px-6 pb-32 pt-32 md:px-16 lg:px-32">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-12">
        <SectionHeader channel="LOG_03 :: OPEN CHANNEL" title="TRANSMISSION" />

        <VideoFrame />

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
          <ContactCard />
          <div className="flex flex-col items-start justify-between gap-6 px-2 py-2">
            <p className="font-mono text-sm leading-relaxed text-text-dim">
              For collaboration, contract work, or just a conversation about
              game systems and AI — open any channel above. Async messages
              answered within 24h, GMT+7.
            </p>
            <ResumeDownload />
          </div>
        </div>
      </div>
    </main>
  );
}
