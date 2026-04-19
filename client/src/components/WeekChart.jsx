import { useMemo } from 'react';

const DAY_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

export default function WeekChart({ days = [], goal = 10000 }) {
  const { bars, yMax } = useMemo(() => {
    const maxCount = Math.max(goal, ...days.map((d) => d.count || 0), 1);
    return {
      yMax: maxCount,
      bars: days.map((d) => ({
        date: d.date,
        count: d.count || 0,
        pct: Math.min(1, (d.count || 0) / maxCount),
        dayLetter: DAY_LABELS[new Date(d.date).getDay()] ?? '·',
      })),
    };
  }, [days, goal]);

  if (!days.length) return null;

  const todayDate = bars[bars.length - 1]?.date;
  const goalY = Math.min(1, goal / yMax);

  return (
    <div className="week-chart">
      <div className="week-chart-eyebrow">
        <span className="eyebrow">7-day steps</span>
        <span className="eyebrow" style={{ opacity: 0.6 }}>
          Goal · {goal.toLocaleString()}
        </span>
      </div>
      <div className="week-chart-bars">
        {bars.map((b) => (
          <div key={b.date} className="week-chart-col">
            <div className="week-chart-track">
              <div
                className="week-chart-goal"
                style={{ bottom: `${goalY * 100}%` }}
                aria-hidden="true"
              />
              <div
                className={`week-chart-bar${b.date === todayDate ? ' today' : ''}`}
                style={{ height: `${Math.max(b.pct * 100, b.count > 0 ? 6 : 0)}%` }}
                title={`${b.date}: ${b.count.toLocaleString()} steps`}
              />
            </div>
            <div className="week-chart-label">{b.dayLetter}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
