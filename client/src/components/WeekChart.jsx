import { useMemo } from 'react';

const DAY_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

export default function WeekChart({
  days = [],
  goal,
  title,
  goalLabel,
  barColor = 'var(--lavender)',
  todayColor = 'var(--coral)',
  yMaxFloor,
  format = (n) => n.toLocaleString(),
}) {
  const { bars, yMax, goalY } = useMemo(() => {
    const rawMax = Math.max(
      yMaxFloor || 0,
      goal || 0,
      ...days.map((d) => d.value || 0),
      1,
    );
    return {
      yMax: rawMax,
      goalY: goal ? Math.min(1, goal / rawMax) : null,
      bars: days.map((d) => ({
        date: d.date,
        value: d.value || 0,
        pct: Math.min(1, (d.value || 0) / rawMax),
        dayLetter: DAY_LABELS[new Date(d.date).getDay()] ?? '·',
      })),
    };
  }, [days, goal, yMaxFloor]);

  if (!days.length) return null;

  const todayDate = bars[bars.length - 1]?.date;

  return (
    <div className="week-chart">
      <div className="week-chart-eyebrow">
        <span className="eyebrow">{title}</span>
        {goalLabel ? (
          <span className="eyebrow" style={{ opacity: 0.6 }}>
            {goalLabel}
          </span>
        ) : null}
      </div>
      <div className="week-chart-bars">
        {bars.map((b) => (
          <div key={b.date} className="week-chart-col">
            <div className="week-chart-track">
              {goalY != null && (
                <div
                  className="week-chart-goal"
                  style={{ bottom: `${goalY * 100}%` }}
                  aria-hidden="true"
                />
              )}
              <div
                className={`week-chart-bar${b.date === todayDate ? ' today' : ''}`}
                style={{
                  height: `${Math.max(b.pct * 100, b.value > 0 ? 6 : 0)}%`,
                  background: b.date === todayDate ? todayColor : barColor,
                }}
                title={`${b.date}: ${format(b.value)}`}
              />
            </div>
            <div className="week-chart-label">{b.dayLetter}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
