import React from "react";
import { eachDayOfInterval, format, startOfMonth, endOfMonth } from "date-fns";

const getMonthDays = (year, month) => {
  const start = startOfMonth(new Date(year, month));
  const end = endOfMonth(new Date(year, month));
  return eachDayOfInterval({ start, end });
};

const CalendarView = ({ bookings = {}, onDateClick, showFullYear = false }) => {
  const months = showFullYear ? [...Array(12).keys()] : [new Date().getMonth()];
  const currentYear = new Date().getFullYear();

  return (
    <div className="flex flex-wrap justify-center gap-4 p-4">
      {months.map((monthIndex) => {
        const days = getMonthDays(currentYear, monthIndex);

        return (
          <div key={monthIndex} className="bg-white shadow rounded p-4 w-72">
            <h3 className="text-center font-bold text-lg mb-2">
              {format(new Date(currentYear, monthIndex), "MMMM yyyy")}
            </h3>
            <div className="grid grid-cols-7 text-sm text-center font-semibold text-gray-600 mb-1">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                <div key={d}>{d}</div>
              ))}
            </div>
            <div className="grid grid-cols-7 text-sm">
              {Array(days[0].getDay()).fill(null).map((_, i) => (
                <div key={i}></div>
              ))}
              {days.map((day) => {
                const dateStr = format(day, "yyyy-MM-dd");
                const totalItems = bookings[dateStr]?.reduce((sum, b) => sum + b.quantity, 0) || 0;
                const color =
                  totalItems === 0
                    ? "bg-green-100"
                    : totalItems < 80
                    ? "bg-yellow-100"
                    : "bg-red-100";

                return (
                  <div
                    key={dateStr}
                    className={`p-1 border m-[1px] cursor-pointer text-center rounded ${color}`}
                    onClick={() => onDateClick && onDateClick(dateStr)}
                  >
                    <div className="font-semibold">{format(day, "d")}</div>
                    <div className="text-xs">{totalItems} items</div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CalendarView;