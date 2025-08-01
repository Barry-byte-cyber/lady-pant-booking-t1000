import React from "react";
import dayjs from "dayjs";

function CalendarView({ bookings = [], onDateClick }) {
  const months = Array.from({ length: 12 }, (_, i) =>
    dayjs().month(i).format("MMMM")
  );

  // Group bookings by date
  const groupedBookings = bookings.reduce((acc, booking) => {
    acc[booking.date] = acc[booking.date] || [];
    acc[booking.date].push(booking);
    return acc;
  }, {});

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
      {months.map((month, monthIndex) => {
        const startOfMonth = dayjs().month(monthIndex).startOf("month");
        const daysInMonth = startOfMonth.daysInMonth();
        const startDay = startOfMonth.day();

        return (
          <div
            key={month}
            className="bg-white shadow-md rounded-lg p-4 border"
          >
            <h2 className="text-lg font-semibold mb-2 text-center">{month}</h2>
            <div className="grid grid-cols-7 gap-1 text-center text-xs font-bold mb-1">
              <div>Sun</div>
              <div>Mon</div>
              <div>Tue</div>
              <div>Wed</div>
              <div>Thu</div>
              <div>Fri</div>
              <div>Sat</div>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center">
              {/* Empty days before the first day */}
              {Array.from({ length: startDay }).map((_, i) => (
                <div key={`empty-${i}`} />
              ))}

              {/* Days of the month */}
              {Array.from({ length: daysInMonth }).map((_, dayIndex) => {
                const day = dayIndex + 1;
                const date = startOfMonth.date(day).format("YYYY-MM-DD");

                const bookingsForDate = groupedBookings[date] || [];
                const totalItems = bookingsForDate.reduce(
                  (sum, b) => sum + parseInt(b.items || 0),
                  0
                );

                // 🚦 Set color based on load
                let bgColor = "bg-gray-100"; // no bookings
                if (totalItems > 0 && totalItems <= 38) {
                  bgColor = "bg-blue-200"; // light load
                } else if (totalItems >= 39 && totalItems <= 40) {
                  bgColor = "bg-green-200"; // medium load
                } else if (totalItems >= 41 && totalItems <= 79) {
                  bgColor = "bg-yellow-300"; // filling up
                } else if (totalItems >= 80) {
                  bgColor = "bg-red-400"; // full
                }

                return (
                  <div
                    key={day}
                    onClick={() => onDateClick && onDateClick(date)}
                    className={`cursor-pointer p-2 rounded text-xs ${bgColor} hover:bg-blue-200`}
                  >
                    <div>{day}</div>
                    <div className="text-[10px]">{totalItems}/80</div>
                  </div>
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