"use client";

interface ContactButtonProps {
  href?: string;
  label?: string;
  target?: string;
  className?: string;
}

const EMAIL = "tamphi5002@gmail.com";
const DEFAULT_HREF = `https://mail.google.com/mail/?view=cm&fs=1&to=${EMAIL}`;

export function ContactButton({
  href = DEFAULT_HREF,
  label = "Contact Me",
  target = "_blank",
  className,
}: ContactButtonProps) {
  return (
    <a
      href={href}
      target={target}
      rel="noopener noreferrer"
      className={className}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "9999px",
        background: "linear-gradient(123deg, #18011F 7%, #B600A8 37%, #7621B0 72%, #BE4C00 100%)",
        boxShadow: "0px 4px 4px rgba(181, 1, 167, 0.25), inset 4px 4px 12px #7721B1",
        outline: "2px solid white",
        outlineOffset: "-3px",
        color: "white",
        fontWeight: 500,
        textTransform: "uppercase",
        letterSpacing: "0.15em",
        padding: "clamp(0.65rem, 1vw, 1rem) clamp(1.5rem, 3vw, 3rem)",
        fontSize: "clamp(0.7rem, 1vw, 0.875rem)",
        whiteSpace: "nowrap",
        transition: "filter 0.2s, transform 0.2s",
        cursor: "pointer",
        textDecoration: "none",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLAnchorElement).style.filter = "brightness(1.15)";
        (e.currentTarget as HTMLAnchorElement).style.transform = "scale(1.02)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLAnchorElement).style.filter = "brightness(1)";
        (e.currentTarget as HTMLAnchorElement).style.transform = "scale(1)";
      }}
    >
      {label}
    </a>
  );
}
