import { ArrowUpRight } from "lucide-react";

export function ProjectVideo({ youtubeId, title, showCaption = true }: { youtubeId: string; title: string; showCaption?: boolean }) {
  return <figure className="min-w-0">
    <div className="theme-border relative aspect-video overflow-hidden rounded-[var(--theme-radius)] border bg-[var(--color-ink)]">
      <iframe className="absolute inset-0 size-full border-0" src={`https://www.youtube-nocookie.com/embed/${youtubeId}?rel=0`} title={title} loading="lazy" referrerPolicy="strict-origin-when-cross-origin" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen />
    </div>
    {showCaption && <figcaption className="mt-3 flex flex-wrap items-center justify-between gap-x-4 gap-y-1 text-xs text-muted"><span>{title}</span><a href={`https://www.youtube.com/watch?v=${youtubeId}`} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2 underline underline-offset-4">Watch on YouTube<ArrowUpRight size={13} aria-hidden="true" /></a></figcaption>}
  </figure>;
}
