import { Mail, Phone, Github, Linkedin } from "lucide-react";

const EMAIL = "tamphi5002@gmail.com";
const GMAIL = `https://mail.google.com/mail/?view=cm&fs=1&to=${EMAIL}`;
const PHONE_TEL = "+84938419071";
const GH = "https://github.com/tamir39";
const LI =
  "https://www.linkedin.com/in/t%C3%A2m-ph%C3%AD-v%C6%B0%C6%A1ng-t%C6%B0%E1%BB%9Dng-686919388/";

export function Footer() {
  return (
    <footer className="bg-[#0c0c0c]">
      <div className="divider-cyan" />
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-5 py-6 md:flex-row md:gap-3 md:px-10 md:py-5">
        <span className="text-[11px] uppercase tracking-[0.2em] text-[#D7E2EA]/40">
          © 2026 Tâm — tamir39
        </span>

        <div className="flex items-center gap-3 md:hidden">
          <a
            href={GMAIL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Email"
            className="flex h-8 w-8 items-center justify-center border border-white/20 text-[#D7E2EA]/50 transition-colors hover:border-white/50 hover:text-[#D7E2EA]"
          >
            <Mail size={14} strokeWidth={1.5} />
          </a>
          <a
            href={`tel:${PHONE_TEL}`}
            aria-label="Call"
            className="flex h-8 w-8 items-center justify-center border border-white/20 text-[#D7E2EA]/50 transition-colors hover:border-white/50 hover:text-[#D7E2EA]"
          >
            <Phone size={14} strokeWidth={1.5} />
          </a>
          <a
            href={GH}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="flex h-8 w-8 items-center justify-center border border-white/20 text-[#D7E2EA]/50 transition-colors hover:border-white/50 hover:text-[#D7E2EA]"
          >
            <Github size={14} strokeWidth={1.5} />
          </a>
          <a
            href={LI}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="flex h-8 w-8 items-center justify-center border border-white/20 text-[#D7E2EA]/50 transition-colors hover:border-white/50 hover:text-[#D7E2EA]"
          >
            <Linkedin size={14} strokeWidth={1.5} />
          </a>
        </div>

        <div className="hidden items-center gap-3 text-[11px] uppercase tracking-[0.18em] text-[#D7E2EA]/40 md:flex">
          <a href={GMAIL} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-[#D7E2EA]">
            {EMAIL}
          </a>
          <span aria-hidden className="h-3 w-px bg-white/20" />
          <a href={`tel:${PHONE_TEL}`} className="transition-colors hover:text-[#D7E2EA]">
            +84 938 419 071
          </a>
          <span aria-hidden className="h-3 w-px bg-white/20" />
          <a href={GH} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-[#D7E2EA]">
            github.com/tamir39
          </a>
          <span aria-hidden className="h-3 w-px bg-white/20" />
          <a href={LI} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-[#D7E2EA]">
            linkedin
          </a>
        </div>
      </div>
    </footer>
  );
}
