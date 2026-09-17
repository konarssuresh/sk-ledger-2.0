export default function LogoWordmark({
  className = "h-10 w-auto text-slate-900",
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 380 120"
      aria-label="SKLedger"
      role="img"
    >
      <defs>
        <linearGradient id="logo-g1" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#2dd4bf" />
          <stop offset="100%" stopColor="#0ea5e9" />
        </linearGradient>
        <linearGradient id="logo-g2" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="100%" stopColor="#14b8a6" />
        </linearGradient>
      </defs>
      <g transform="translate(10 10)">
        <path
          d="M64 0 L104 20 L82 32 L62 22 L36 40 L56 52 L36 64 L0 44 L0 24 Z"
          fill="url(#logo-g1)"
        />
        <path
          d="M64 92 L28 72 L50 60 L68 70 L94 52 L74 40 L94 28 L128 48 L128 68 Z"
          fill="url(#logo-g2)"
        />
        <path d="M36 40 L56 52 L36 64 L16 52 Z" fill="#0ea5e9" opacity="0.85" />
        <path d="M92 52 L74 40 L94 28 L114 40 Z" fill="#22d3ee" opacity="0.85" />
      </g>
      <g transform="translate(150 26)" fill="currentColor">
        <text
          x="0"
          y="52"
          fontFamily="Inter, ui-sans-serif, system-ui"
          fontWeight="700"
          fontSize="48"
        >
          SKLedger
        </text>
      </g>
    </svg>
  );
}
