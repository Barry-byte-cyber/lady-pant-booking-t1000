import React from "react";

const getDaysInMonth = (year, month) =>
  new Date(year, month + 1, 0).getDate();

function CalendarView({ bookings }) {
  const currentYear = new Date().getFullYear();

  // Count bookings by date
  const bookingCounts = bookings.reduce((acc, b) => {
    acc[b.date] = (acc[b.date] || 0) + Number(b.quantity || 1);
    return acc;
  }, {});

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Booking Calendar ({currentYear})
      </h2>

      {/* Full-year grid: 3 columns on large screens */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 12 }, (_, month) => {
          const daysInMonth = getDaysInMonth(currentYear, month);
          const firstDay = new Date(currentYear, month, 1).getDay();

          return (
            <div
              key={month}
              className="bg-white p-4 rounded-xl shadow-md border"
            >
              <h3 className="text-lg font-semibold text-center mb-3">
                {new Date(currentYear, month).toLocaleString("default", {
                  month: "long",
                })}
              </h3>

              <div className="grid grid-cols-7 gap-1 text-center text-sm">
                {/* Weekday headers */}
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                  <div key={d} className="font-semibold">
                    {d}
                  </div>
                ))}

                {/* Empty slots before first day */}
                {Array.from({ length: firstDay }).map((_, idx) => (
                  <div key={`empty-${idx}`} />
                ))}

                {/* Days */}
                {Array.from({ length: daysInMonth }, (_, day) => {
                  const dateStr = `${currentYear}-${String(
                    month + 1
                  ).padStart(2, "0")}-${String(day + 1).padStart(2, "0")}`;

                  const count = bookingCounts[dateStr] || 0;

                  return (
                    <div
                      key={day}
                      className={`border rounded p-1 ${
                        count > 0
                          ? "bg-green-200 hover:bg-green-300"
                          : "bg-gray-100"
                      }`}
                    >
                      <div>{day + 1}</div>
                      {count > 0 && (
                        <div className="text-xs text-gray-700">
                          {count} item(s)
                        </div>
                      )}
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