import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { interfaceAtlas } from "@/lib/interface-atlas";

export function InterfaceAtlas() {
  return <aside className="studio-atlas" aria-labelledby="studio-atlas-heading">
    <div>
      <p className="section-eyebrow">How I build with agents</p>
      <div className="atlas-identity">
        <span className="atlas-mark" aria-hidden="true">
          <Image src="/projects/icons/interface-atlas-light.svg" alt="" width={48} height={48} className="atlas-logo-light" />
          <Image src="/projects/icons/interface-atlas-dark.svg" alt="" width={48} height={48} className="atlas-logo-dark" />
        </span>
        <h3 id="studio-atlas-heading">{interfaceAtlas.name}</h3>
      </div>
      <p className="atlas-status">Personal knowledge library · Editorial pilot</p>
    </div>
    <div className="atlas-overview">
      <p>{interfaceAtlas.description} {interfaceAtlas.workflow}</p>
      <p>{interfaceAtlas.scope}</p>
      <div className="atlas-links">
        <a href={interfaceAtlas.href} target="_blank" rel="noopener noreferrer">Explore the library<ArrowUpRight size={14} aria-hidden="true" /></a>
        <a href={interfaceAtlas.previewHref} target="_blank" rel="noopener noreferrer">Open live previews<ArrowUpRight size={14} aria-hidden="true" /></a>
      </div>
    </div>
  </aside>;
}
