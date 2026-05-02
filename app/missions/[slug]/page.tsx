import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProject, projects } from "@/lib/data/projects";
import { MissionHeader } from "@/components/missions/detail/MissionHeader";
import { MissionBody } from "@/components/missions/detail/MissionBody";
import { MissionMeta } from "@/components/missions/detail/MissionMeta";
import { BackToGrid } from "@/components/missions/detail/BackToGrid";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) return { title: "MLOG NOT FOUND // TAMIR.OS" };
  return {
    title: `${p.id} // ${p.name}`,
    description: p.tagline,
  };
}

export default async function MissionDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  return (
    <main className="px-6 pb-32 pt-32 md:px-16 lg:px-32">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-12">
        <MissionHeader project={project} />

        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
          <MissionBody project={project} />
          <MissionMeta project={project} />
        </div>

        <BackToGrid />
      </div>
    </main>
  );
}
