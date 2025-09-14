import { useEffect, useRef, useState } from 'react';

export default function StepRing({ value = 6916, max = 10000 }) {
  // use a normalized 0-100 viewBox so CSS can size via rem
  const r = 42; // radius in viewBox units
  const circumference = 2 * Math.PI * r;
  const progressRef = useRef(null);
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const start = performance.now();
    const duration = 1200; // ms
    const startVal = 0;
    const animate = (ts) => {
      const p = Math.min(1, (ts - start) / duration);
      const current = Math.round(startVal + (value - startVal) * p);
      setDisplay(current);
      const ratio = Math.max(0, Math.min(1, current / max));
      const offset = circumference * (1 - ratio);
      if (progressRef.current) {
        progressRef.current.style.strokeDashoffset = offset;
      }
      if (p < 1) requestAnimationFrame(animate);
    };
    // init dash array/offset
    if (progressRef.current) {
      progressRef.current.style.strokeDasharray = `${circumference}`;
      progressRef.current.style.strokeDashoffset = `${circumference}`;
    }
    requestAnimationFrame(animate);
  }, [value, max, circumference]);

  return (
    <div className="step-ring">
      <svg viewBox="0 0 100 100" aria-hidden="true">
        {/* track */}
        <circle cx="50" cy="50" r={r} fill="none" stroke="var(--border)" strokeWidth="8" />
        {/* progress */}
        <circle
          ref={progressRef}
          cx="50" cy="50" r={r} fill="none"
          stroke="var(--primary)" strokeWidth="8" strokeLinecap="round"
          transform="rotate(-90 50 50)"
          style={{ transition: 'stroke-dashoffset .2s' }}
        />
      </svg>
      <div className="step-count">
        {display.toLocaleString()}
        <div className="step-sub">/ {max.toLocaleString()} {}</div>
      </div>
    </div>
  );
}
