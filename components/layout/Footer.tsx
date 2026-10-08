import { ArrowUpRight, ArrowUp } from "lucide-react";
import { ContactForm } from "@/components/ContactForm";

export function Footer() {
  return <footer id="contact" className="relative overflow-hidden contact-footer px-6 pb-6 pt-20 sm:px-10 lg:px-16 lg:pt-24">
    <div className="contact-art pointer-events-none absolute -right-32 top-8 h-[430px] w-[430px] opacity-20 sm:right-0 lg:right-[4%]" aria-hidden="true"><svg viewBox="0 0 430 430" fill="none" className="h-full w-full"><rect x="72" y="72" width="286" height="286" rx="143" stroke="currentColor" /><rect x="114" y="114" width="202" height="202" rx="32" stroke="currentColor" transform="rotate(-20 215 215)" /><path className="contact-art-fill" d="M215 125L240 190L305 215L240 240L215 305L190 240L125 215L190 190Z" /><path d="M40 215H390M215 40V390" stroke="currentColor" strokeDasharray="3 8" /></svg></div>
    <div className="relative mx-auto max-w-[1312px]">
      <div className="contact-layout">
        <div className="contact-copy"><p className="section-eyebrow"><span aria-hidden="true">✧</span> Every ending is a beginning</p><h2 className="contact-heading">What could<br />we create<br /><span className="font-editorial font-normal italic text-accent">in your next product?</span></h2><p className="mt-6 max-w-[350px] text-sm leading-relaxed text-muted">A website, an interface, or an idea that needs a little exploration. I’d love to hear about it.</p><a href="mailto:tamphi5002@gmail.com" className="mt-5 inline-flex min-h-11 items-center gap-3 text-xs text-muted underline underline-offset-4">tamphi5002@gmail.com<ArrowUpRight size={14} aria-hidden="true" /></a></div>
        <ContactForm />
      </div>
      <div id="contact-end" className="mt-16 flex flex-wrap items-center justify-between gap-4 border-t theme-border pt-5 text-xs text-muted"><span>© {new Date().getFullYear()} Tamir · A little design, a little code, a little wonder.</span><div className="flex flex-wrap items-center gap-5"><a className="inline-flex min-h-11 items-center gap-1 hover:text-ink" href="https://github.com/tamir39" target="_blank" rel="noopener noreferrer">GitHub<ArrowUpRight size={12} aria-hidden="true" /></a><a className="inline-flex min-h-11 items-center gap-1 hover:text-ink" href="https://www.linkedin.com/in/tam-phi-vuong-tuong-686919388/" target="_blank" rel="noopener noreferrer">LinkedIn<ArrowUpRight size={12} aria-hidden="true" /></a><a href="#top" className="inline-flex min-h-11 items-center gap-2 hover:text-ink">Back to top<ArrowUp size={13} aria-hidden="true" /></a></div></div>
    </div>
  </footer>;
}
