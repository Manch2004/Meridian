import { useEffect, useState } from "react";

export default function useCountUp(target, { start = false, duration = 1400 } = {}) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!start) return undefined;

    let frame;
    const startTime = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - (1 - progress) ** 3;
      setValue(target * eased);
      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      }
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [start, target, duration]);

  return value;
}
