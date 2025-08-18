import React from "react";
import dayjs from "dayjs";

/**
 * CalendarView
 * Props:
 *  - bookings: [{ id, date:"YYYY-MM-DD", time, items, ...}]
 *  - onDateClick?: (yyyyMmDd) => void
 *  - sidebar?: boolean  // when true, render months in a single vertical column for sticky sidebars
 */
export default function CalendarView({ bookings = [], onDateClick, sidebar = false }) {
  const year = dayjs().year(); // change if you want a fixed year
  const months = Array.from({ length: 12 }, (_, i) => dayjs().year(year).month(i));

  // quick lookup: date -> count
  const countByDate = React.useMemo(() => {
    const map = new Map();
    for (const b of bookings) {
      const d = b?.date;
      if (!d) continue;
      map.set(d, (map.get(d) || 0) + 1);
    }
    return map;
  }, [bookings]);

  const gridClass = sidebar
    ? "grid grid-cols-1 gap-4"
    : "grid gap-6 md:grid-cols-2 lg:grid-cols-3";

  return (
    <div className={gridClass}>
      {months.map((m) => (
        <MonthCard
          key={m.format("YYYY-MM")}
          month={m}
          countByDate={countByDate}
          onDateClick={onDateClick}
        />
      ))}
    </div>
  );
}

function MonthCard({ month, countByDate, onDateClick }) {
  const year = month.year();
  const monthIndex = month.month(); // 0..11
  const start = month.startOf("month");
  const end = month.endOf("month");
  const startWeekday = start.day(); // 0=Sun..6=Sat
  const daysInMonth = end.date();

  // Build an array of cells, including leading blanks
  const cells = [];
  for (let i = 0; i < startWeekday; i++) cells.push({ blank: true, key: `b-${i}` });
  for (let d = 1; d <= daysInMonth; d++) {
    const date = dayjs().year(year).month(monthIndex).date(d).format("YYYY-MM-DD");
    const count = countByDate.get(date) || 0;
    cells.push({ d, date, count, key: date });
  }

  const dow = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="rounded-lg border bg-white p-3 min-w-0">
      <h3 className="text-lg font-semibold text-center mb-2">
        {month.format("MMMM")}
      </h3>

      {/* Day-of-week header */}
      <div className="grid grid-cols-7 text-xs text-gray-500 mb-1">
        {dow.map((d) => (
          <div key={d} className="text-center py-1">{d}</div>
        ))}
      </div>

      {/* Days grid */}
      <div className="grid grid-cols-7 gap-2">
        {cells.map((c) =>
          c.blank ? (
            <div key={c.key} />
          ) : (
            <button
              key={c.key}
              onClick={() => onDateClick?.(c.date)}
              className="w-full text-xs rounded-md bg-gray-100 hover:bg-gray-200 transition py-2"
              title={c.date}
            >
              <div className="font-medium">{c.d}</div>
              <div className="text-[10px] text-gray-500">{c.count ?? 0}/80</div>
            </button>
          )
        )}
      </div>
    </div>
  );
}