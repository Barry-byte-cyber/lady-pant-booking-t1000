import React from "react";
import dayjs from "dayjs";

import * as rules from "../config/calendarRules";
const isBlockedDate = (d) => {
  const fn = rules.isBlockedDate ?? rules.default;
  return typeof fn === "function" ? fn(d) === true : false;
};

export default function CalendarView({ bookings = [], onDateClick, sidebar = false }) {
  const year = dayjs().year();
  const months = Array.from({ length: 12 }, (_, i) => dayjs().year(year).month(i));

  const itemsByDate = React.useMemo(() => {
    const map = new Map();
    for (const b of bookings) {
      const d = b?.date;
      const n = Number(b?.items || 0);
      if (!d) continue;
      map.set(d, (map.get(d) || 0) + n);
    }
    return map;
  }, [bookings]);

  const gridClass = sidebar ? "grid grid-cols-1 gap-4" : "grid gap-6 md:grid-cols-2 lg:grid-cols-3";

  return (
    <div className={gridClass}>
      {months.map((m) => (
        <MonthCard key={m.format("YYYY-MM")} month={m} itemsByDate={itemsByDate} onDateClick={onDateClick} />
      ))}
    </div>
  );
}

function MonthCard({ month, itemsByDate, onDateClick }) {
  const year = month.year();
  const monthIndex = month.month();
  const start = month.startOf("month");
  const end = month.endOf("month");
  const startWeekday = start.day();
  const daysInMonth = end.date();

  const cells = [];
  for (let i = 0; i < startWeekday; i++) cells.push({ blank: true, key: `b-${i}` });
  for (let d = 1; d <= daysInMonth; d++) {
    const date = dayjs().year(year).month(monthIndex).date(d).format("YYYY-MM-DD");
    const totalItems = itemsByDate.get(date) || 0;
    const blocked = isBlockedDate(date);
    const isFull = totalItems >= 100;
    cells.push({ d, date, totalItems, blocked, isFull, key: date });
  }

  const dow = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="rounded-lg border bg-white p-3 min-w-0">
      <h3 className="text-lg font-semibold text-center mb-2">{month.format("MMMM")}</h3>

      <div className="grid grid-cols-7 text-xs text-gray-500 mb-1">
        {dow.map((d) => (
          <div key={d} className="text-center py-1">{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {cells.map((c) =>
          c.blank ? (
            <div key={c.key} />
          ) : (
            <button
              key={c.key}
              onClick={() => !c.blocked && onDateClick?.(c.date)}
              disabled={c.blocked}
              className={[
                "relative w-full text-xs rounded-md transition py-2",
                c.blocked
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : c.isFull
                  ? "bg-red-600 text-white"   // <-- RED when full
                  : "bg-gray-100 hover:bg-gray-200",
              ].join(" ")}
              aria-disabled={c.blocked ? "true" : "false"}
              title={
                c.blocked
                  ? "Closed"
                  : c.isFull
                  ? "Full (100/100)"
                  : `${c.totalItems}/100`
              }
            >
              <div className="font-medium">{c.d}</div>
              <div className="text-[10px]">
                {c.blocked ? (
                  <span className="uppercase font-semibold">Closed</span>
                ) : (
                  `${c.totalItems}/100`
                )}
              </div>
            </button>
          )
        )}
      </div>
    </div>
  );
}