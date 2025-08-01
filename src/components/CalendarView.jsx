import React from "react";
import dayjs from "dayjs";

function CalendarView({ bookings = [], onDateClick }) {
  const months = Array.from({ length: 12 }, (_, i) =>
    dayjs().month(i).format("MMMM")
  );

  // ✅ Count items booked per date
  const bookingCounts = bookings.reduce((acc, b) => {
    acc[b.date] = (acc[b.date] || 0) + Number(b.items || 0);
    return acc;
  }, {});

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-6 text-center">
        Booking Calendar (2025)
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {months.map((month, monthIndex) => {
          const startOfMonth = dayjs()
            .month(monthIndex)
            .startOf("month");
          const daysInMonth = startOfMonth.daysInMonth();
          const startDay = startOfMonth.day();

          return (
            <div
              key={month}
              className="bg-white shadow-md rounded-lg p-4"
            >
              <h2 className="text-lg font-semibold mb-2 text-center">
                {month}
              </h2>
              <div className="grid grid-cols-7 gap-2 text-center text-gray-600 font-medium">
                <div>Sun</div>
                <div>Mon</div>
                <div>Tue</div>
                <div>Wed</div>
                <div>Thu</div>
                <div>Fri</div>
                <div>Sat</div>
              </div>

              <div className="grid grid-cols-7 gap-2 text-center mt-2">
                {/* Empty slots before month starts */}
                {Array.from({ length: startDay }).map((_, i) => (
                  <div key={`empty-${i}`} />
                ))}

                {/* Actual days */}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const date = startOfMonth.date(i + 1).format("YYYY-MM-DD");
                  const count = bookingCounts[date] || 0;

                  return (
                    <div
                      key={date}
                      onClick={() => onDateClick && onDateClick(date)}
                      className={`p-2 border rounded cursor-pointer hover:bg-blue-100 ${
                        count > 0
                          ? "bg-green-100 border-green-400"
                          : "bg-gray-50"
                      }`}
                    >
                      <div className="font-bold">{i + 1}</div>
                      <div className="text-xs">
                        {count}/80
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default CalendarView;