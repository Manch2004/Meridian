import { useId } from "react";

const SEGMENT_COUNT = 8;

function segmentPath(cx, cy, r, index, count) {
  const step = (2 * Math.PI) / count;
  const a0 = index * step - Math.PI / 2;
  const a1 = a0 + step;
  const x0 = cx + r * Math.cos(a0);
  const y0 = cy + r * Math.sin(a0);
  const x1 = cx + r * Math.cos(a1);
  const y1 = cy + r * Math.sin(a1);
  return `M${cx},${cy} L${x0.toFixed(2)},${y0.toFixed(2)} A${r},${r} 0 0,1 ${x1.toFixed(2)},${y1.toFixed(2)} Z`;
}

/**
 * Decorative, illustrative-only wheel graphic for the Daily Wheel section.
 * Pure SVG, no dependencies. Purely ornamental (aria-hidden) — not an
 * interactive control. The segment ring spins slowly via the shared
 * `orb-rotate` animation, which already respects prefers-reduced-motion.
 */
export default function MeridianWheel({
  size = 320,
  opacity = 1,
  color = "var(--color-gold-primary)",
  animate = true,
  speed = 90,
  className = "",
}) {
  const gradientId = useId();
  const cx = 200;
  const cy = 200;
  const r = 160;

  return (
    <svg
      viewBox="0 0 400 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={`h-auto w-full ${className}`}
      style={{ maxWidth: size, opacity }}
    >
      <defs>
        <radialGradient id={gradientId} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={color} stopOpacity="0.2" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </radialGradient>
      </defs>

      <circle cx={cx} cy={cy} r={r + 30} fill={`url(#${gradientId})`} />

      <g
        className={animate ? "orb-rotate" : ""}
        style={animate ? { transformOrigin: `${cx}px ${cy}px`, "--orb-spin-duration": `${speed}s` } : undefined}
      >
        {Array.from({ length: SEGMENT_COUNT }, (_, i) => (
          <path
            key={i}
            d={segmentPath(cx, cy, r, i, SEGMENT_COUNT)}
            fill={i % 2 === 0 ? "color-mix(in srgb, var(--color-gold-primary) 10%, var(--color-bg-card))" : "var(--color-bg-card)"}
            stroke={color}
            strokeOpacity="0.3"
            strokeWidth="1"
          />
        ))}

        <circle cx={cx} cy={cy} r={r} stroke={color} strokeOpacity="0.4" strokeWidth="1.5" />
      </g>

      <circle cx={cx} cy={cy} r="34" fill="var(--color-bg-primary)" stroke={color} strokeOpacity="0.6" strokeWidth="1.5" />
      <circle cx={cx} cy={cy} r="5" fill="var(--color-gold-light)" />

      <path
        d={`M${cx - 12},${cy - r - 6} L${cx + 12},${cy - r - 6} L${cx},${cy - r + 18} Z`}
        fill="var(--color-gold-light)"
      />
    </svg>
  );
}
