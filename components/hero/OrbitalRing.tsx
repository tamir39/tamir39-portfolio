export function OrbitalRing({ size = 480 }: { size?: number }) {
  const r = size / 2 - 4;

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 flex items-center justify-center"
    >
      {/* outer ring */}
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="absolute"
        style={{ animation: "spin-slow 40s linear infinite" }}
      >
        <defs>
          <linearGradient id="orbit-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--color-cyan)" />
            <stop offset="100%" stopColor="var(--color-violet)" />
          </linearGradient>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="url(#orbit-grad)"
          strokeWidth="1.25"
          strokeDasharray="0 6 600 6"
          opacity="0.85"
        />
        {/* reticle dot at 0deg */}
        <circle cx={size / 2 + r} cy={size / 2} r="3" fill="var(--color-cyan)" />
        {/* reticle dot at 137deg */}
        <circle
          cx={size / 2 + r * Math.cos((137 * Math.PI) / 180)}
          cy={size / 2 + r * Math.sin((137 * Math.PI) / 180)}
          r="2"
          fill="var(--color-violet)"
        />
      </svg>

      {/* inner dashed ring counter-rotating */}
      <svg
        width={size * 0.62}
        height={size * 0.62}
        viewBox={`0 0 ${size} ${size}`}
        className="absolute"
        style={{ animation: "spin-slow-reverse 60s linear infinite" }}
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r * 0.7}
          fill="none"
          stroke="var(--color-cyan-soft)"
          strokeWidth="1"
          strokeDasharray="3 8"
        />
      </svg>

      {/* faint outermost ring */}
      <svg
        width={size * 1.18}
        height={size * 1.18}
        viewBox={`0 0 ${size} ${size}`}
        className="absolute"
        style={{ animation: "spin-slow 90s linear infinite reverse" }}
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r * 1.05}
          fill="none"
          stroke="var(--color-violet-soft)"
          strokeWidth="0.75"
          strokeDasharray="1 5"
        />
      </svg>
    </div>
  );
}
