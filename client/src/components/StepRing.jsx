import {useEffect, useRef, useState} from 'react';

export default function StepRing({max=10000, value=6916, radius=88}) {
  const [display, setDisplay] = useState(0);
  const ringRef = useRef(null);
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    let start = 0;
    const duration = 1200; // ms
    const startTs = performance.now();
    const animate = (ts) => {
      const p = Math.min(1, (ts - startTs) / duration);
      const current = Math.round(value * p);
      setDisplay(current);
      const offset = circumference - (current / max) * circumference;
      if (ringRef.current) ringRef.current.style.strokeDashoffset = offset;
      if (p < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [value, max, circumference]);

  return (
    <div className="step-ring">
      <svg width="220" height="220">
        <circle cx="110" cy="110" r={radius} stroke="#e5e7eb" strokeWidth="16" fill="none"/>
        <circle
          ref={ringRef}
          id="progress-ring"
          cx="110" cy="110" r={radius}
          stroke="var(--primary)" strokeWidth="16" fill="none"
          strokeLinecap="round"
          style={{strokeDasharray: circumference, strokeDashoffset: circumference, transition: 'stroke-dashoffset 0.2s'}}
        />
      </svg>
      <div className="step-count">
        {display.toLocaleString()}
        <div className="muted">/ {max.toLocaleString()} steps</div>
      </div>
    </div>
  );
}
