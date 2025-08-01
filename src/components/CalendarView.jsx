import React from "react";
import dayjs from "dayjs";

function CalendarView({ bookings = [], onDateClick }) {
  const months = Array.from({ length: 12 }, (_, i) =>
    dayjs().month(i).startOf("month")
  );

  // Count total items booked per date
  const getBookingCount = (date) => {
    return bookings
      .filter((b) => b.date === date)
      .reduce((sum, b) => sum + Number(b.items || 0), 0);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {months.map((month, idx) => {
        const daysInMonth = month.daysInMonth();
        const startDay = month.day();

        return (
          <div
            key={idx}
            className="bg-white shadow-md rounded-lg p-4 text-center"
          >
            <h3 className="text-lg font-semibold mb-2">
              {month.format("MMMM")}
            </h3>
            <div className="grid grid-cols-7 gap-1 text-sm font-bold">
              <span>Sun</span>
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
            </div>
            <div className="grid grid-cols-7 gap-1 text-sm mt-2">
              {Array.from({ length: startDay }).map((_, i) => (
                <span key={i}></span>
              ))}
              {Array.from({ length: daysInMonth }, (_, i) => {
                const date = month.date(i + 1).format("YYYY-MM-DD");
                const count = getBookingCount(date);

                return (
                  <button
                    key={i}
                    onClick={() => onDateClick && onDateClick(date)}
                    className={`h-16 flex flex-col items-center justify-center border rounded hover:bg-blue-100 ${
                      count >= 80
                        ? "bg-red-200"
                        : count > 0
                        ? "bg-yellow-100"
                        : "bg-green-50"
                    }`}
                  >
                    <span className="font-bold">{i + 1}</span>
                    <span className="text-xs">{count}/80</span>
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default CalendarView;