import { useEffect, useRef, useState } from 'react';

export default function StepRing({ value = 6916, max = 10000 }) {
  const r = 38;
  const circumference = 2 * Math.PI * r;
  const progressRef = useRef(null);
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const start = performance.now();
    const duration = 900;
    const animate = (ts) => {
      const p = Math.min(1, (ts - start) / duration);
      const current = Math.round(value * p);
      setDisplay(current);
      const ratio = Math.max(0, Math.min(1, current / max));
      if (progressRef.current) {
        progressRef.current.style.strokeDashoffset = `${circumference * (1 - ratio)}`;
      }
      if (p < 1) requestAnimationFrame(animate);
    };
    if (progressRef.current) {
      progressRef.current.style.strokeDasharray = `${circumference}`;
      progressRef.current.style.strokeDashoffset = `${circumference}`;
    }
    requestAnimationFrame(animate);
  }, [value, max, circumference]);

  const pct = Math.round(Math.min(1, display / max) * 100);

  return (
    <div className="step-ring-block">
      <div className="step-ring-svg">
        <svg width="92" height="92" viewBox="0 0 92 92" aria-hidden="true">
          <circle cx="46" cy="46" r={r} fill="var(--butter)" stroke="var(--ink)" strokeWidth="2.5" />
          <circle
            ref={progressRef}
            cx="46"
            cy="46"
            r={r}
            fill="none"
            stroke="var(--ink)"
            strokeWidth="8"
            strokeLinecap="butt"
            transform="rotate(-90 46 46)"
          />
        </svg>
        <div className="step-ring-center">
          <div className="step-ring-value">{(display / 1000).toFixed(1)}k</div>
          <div className="step-ring-label">STEPS</div>
        </div>
      </div>
      <div className="step-ring-side">
        <div className="eyebrow">Today</div>
        <div className="step-ring-pct">{pct}% of</div>
        <div className="step-ring-goal">{max.toLocaleString()}</div>
      </div>
    </div>
  );
}
