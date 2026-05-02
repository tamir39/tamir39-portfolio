export function ResumeDownload() {
  return (
    <a
      href="/PHIVUONGTUONGTAM_RESUME.pdf"
      download
      data-cursor="download dossier"
      className="group relative inline-flex items-center justify-between gap-6 overflow-hidden border border-violet px-6 py-4 font-mono text-xs uppercase tracking-[0.2em] text-violet transition-colors duration-200 hover:text-bg"
    >
      <span
        aria-hidden
        className="absolute inset-0 origin-left scale-x-0 bg-violet transition-transform duration-300 ease-[cubic-bezier(0.65,0,0.35,1)] group-hover:scale-x-100"
      />
      <span className="relative z-[1]">{"> DOWNLOAD DOSSIER"}</span>
      <span className="relative z-[1] text-[10px] tracking-[0.18em] opacity-70">
        PDF · 1 PAGE
      </span>
    </a>
  );
}
