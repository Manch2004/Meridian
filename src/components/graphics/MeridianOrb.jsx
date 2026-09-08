import { useId } from "react";

// Points around the sphere/pentagon, roughly evenly spaced on a ring.
const SPHERE_NODES = [
  [300, 100],
  [460, 220],
  [420, 420],
  [180, 420],
  [140, 220],
];

// A denser, more scattered set of points for the "network" variant.
const NETWORK_NODES = [
  [300, 110],
  [449, 182],
  [485, 342],
  [382, 471],
  [218, 471],
  [115, 342],
  [152, 182],
];

// Curated edges (not full pairwise) so the network reads as a constellation
// rather than a dense mesh: an outer ring plus a few crossing chords.
const NETWORK_EDGES = [
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 4],
  [4, 5],
  [5, 6],
  [6, 0],
  [0, 3],
  [1, 5],
  [2, 6],
];

/**
 * Reusable abstract wireframe-sphere / network graphic used as decorative
 * visual identity across sections. Pure SVG, no dependencies. Colors read
 * from the `color` prop (defaults to the accent design token) so it always
 * tracks the theme instead of a hardcoded hex value.
 */
export default function MeridianOrb({
  size = 600,
  opacity = 1,
  variant = "sphere",
  color = "var(--color-accent)",
  animate = true,
  speed = 120,
  className = "",
}) {
  const gradientId = useId();
  const isNetwork = variant === "network";
  const nodes = isNetwork ? NETWORK_NODES : SPHERE_NODES;

  return (
    <svg
      viewBox="0 0 600 600"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={`h-auto w-full ${className}`}
      style={{ maxWidth: size, opacity }}
    >
      <defs>
        <radialGradient id={gradientId} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </radialGradient>
      </defs>

      <circle cx="300" cy="300" r="260" fill={`url(#${gradientId})`} />

      <g
        className={animate ? "orb-rotate" : ""}
        style={animate ? { transformOrigin: "300px 300px", "--orb-spin-duration": `${speed}s` } : undefined}
      >
        {isNetwork ? (
          <>
            <circle cx="300" cy="300" r="220" stroke={color} strokeOpacity="0.12" strokeWidth="1" />
            {NETWORK_EDGES.map(([a, b]) => {
              const [x1, y1] = nodes[a];
              const [x2, y2] = nodes[b];
              return (
                <line
                  key={`${a}-${b}`}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke={color}
                  strokeOpacity="0.25"
                  strokeWidth="0.75"
                />
              );
            })}
          </>
        ) : (
          <>
            <circle cx="300" cy="300" r="200" stroke={color} strokeOpacity="0.12" strokeWidth="1" />
            <ellipse cx="300" cy="300" rx="200" ry="140" stroke={color} strokeOpacity="0.15" strokeWidth="1" />
            <ellipse cx="300" cy="300" rx="140" ry="200" stroke={color} strokeOpacity="0.1" strokeWidth="1" />

            <ellipse
              cx="300"
              cy="300"
              rx="200"
              ry="70"
              stroke={color}
              strokeWidth="1.2"
              strokeDasharray="6 10"
              strokeOpacity="0.65"
              className={animate ? "animate-dash" : ""}
            />
            <ellipse
              cx="300"
              cy="300"
              rx="70"
              ry="200"
              stroke={color}
              strokeWidth="1"
              strokeDasharray="4 9"
              strokeOpacity="0.4"
              className={animate ? "animate-dash" : ""}
            />

            <line x1="100" y1="300" x2="500" y2="300" stroke={color} strokeOpacity="0.12" strokeWidth="1" />

            <path
              d="M300 100 L460 220 L420 420 L180 420 L140 220 Z"
              stroke={color}
              strokeOpacity="0.35"
              strokeWidth="1"
            />
            <path
              d="M300 100 L300 300 M460 220 L300 300 M420 420 L300 300 M180 420 L300 300 M140 220 L300 300"
              stroke={color}
              strokeOpacity="0.25"
              strokeWidth="0.75"
            />
          </>
        )}

        <circle cx="300" cy="300" r="4.5" fill={color} />
        {nodes.map(([cx, cy], i) => (
          <circle
            key={`${cx}-${cy}`}
            cx={cx}
            cy={cy}
            r="4"
            fill={color}
            className={animate ? "animate-pulse-slow" : ""}
            style={{ animationDelay: `${i * 0.4}s` }}
          />
        ))}
      </g>
    </svg>
  );
}
