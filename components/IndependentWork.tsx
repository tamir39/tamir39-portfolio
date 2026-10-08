import { independentProjects } from "@/lib/data/independent-projects";
import { IndependentSlideshow } from "./IndependentSlideshow";

export function IndependentWork() {
  return (
    <section id="independent" aria-labelledby="independent-heading" className="px-6 py-16 sm:px-10 lg:px-16 lg:py-24">
      <div className="mx-auto max-w-[1312px]">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="section-eyebrow">Independent projects</p>
            <h2 id="independent-heading" className="section-heading">More ideas.<br /><span className="font-editorial font-normal italic text-accent">Working interfaces.</span></h2>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-muted">Personal builds and prototypes, with interactive mockups to explore in each project’s details.</p>
        </div>
        <IndependentSlideshow projects={independentProjects.map(project => ({
          slug: project.slug,
          name: project.name,
          deliverable: project.deliverable ?? "Independent project",
          state: project.independent!.state,
          description: project.independent!.description,
          focus: project.focus ?? [],
          websiteHref: project.links?.find(link => link.label === "Visit website")?.href,
        }))} />
      </div>
    </section>
  );
}
