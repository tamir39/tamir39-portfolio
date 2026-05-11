"use client";

interface LiveProjectButtonProps {
  href?: string;
  label?: string;
  className?: string;
}

export function LiveProjectButton({
  href = "#",
  label = "Live Project",
  className,
}: LiveProjectButtonProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "9999px",
        border: "2px solid #D7E2EA",
        color: "#D7E2EA",
        fontWeight: 500,
        textTransform: "uppercase",
        letterSpacing: "0.15em",
        padding: "clamp(0.5rem, 0.8vw, 0.875rem) clamp(1.25rem, 2.5vw, 2.5rem)",
        fontSize: "clamp(0.65rem, 0.9vw, 0.875rem)",
        whiteSpace: "nowrap",
        transition: "background 0.2s, color 0.2s",
        cursor: "pointer",
        textDecoration: "none",
        background: "transparent",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLAnchorElement).style.background = "rgba(215,226,234,0.1)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLAnchorElement).style.background = "transparent";
      }}
    >
      {label}
    </a>
  );
}
