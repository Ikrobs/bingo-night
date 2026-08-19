import React, { useMemo } from "react";

export default function NumberGrid({ total, drawn, compact = false }) {
  const drawnSet = useMemo(() => new Set(drawn), [drawn]);
  const numbers = useMemo(() => Array.from({ length: total }, (_, i) => i + 1), [total]);
  const cols = compact ? 10 : 15;
  const current = drawn[drawn.length - 1] ?? null;
 
  return (
    <div className="grid-container shadow-inner">
      <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0,1fr))` }}>
        {numbers.map((n) => {
          const on = drawnSet.has(n);
          const isCurrent = current === n;
          
          return (
            <div
              key={n}
              className={`grid-ball ${compact ? "text-[11px] p-0.5 rounded" : "text-sm md:text-lg rounded-sm"} ${
                isCurrent ? "ball-current-highlight" : on ? "ball-drawn" : "ball-empty"
              }`}
            >
              {n}
            </div>
          );
        })}
      </div>
    </div>
  );
}
