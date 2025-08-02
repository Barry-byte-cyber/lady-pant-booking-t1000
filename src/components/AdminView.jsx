import React, { useState } from "react";
import CalendarView from "./CalendarView";

function AdminView({ bookings, cancelBooking }) {
  const [selectedDates, setSelectedDates] = useState([]);

  // Toggle a date in/out of selection
  const toggleDate = (date) => {
    setSelectedDates((prev) =>
      prev.includes(date) ? prev.filter((d) => d !== date) : [...prev, date]
    );
  };

  return (
    <div className="flex flex-col items-center space-y-8">
      {/* Sticky Header */}
      <div className="sticky top-0 bg-white shadow-md p-4 w-full text-center z-10">
        <h2 className="text-2xl font-bold">🔑 Admin View</h2>
        <p className="text-gray-600">
          Click dates to view bookings (multiple can be open)
        </p>
      </div>

      {/* Calendar Grid */}
      <CalendarView bookings={bookings} onDateClick={toggleDate} />

      {/* Booking Details Sections */}
      {selectedDates.length > 0 && (
        <div className="w-full max-w-3xl space-y-6">
          {selectedDates.map((date) => {
            const bookingsForDate = bookings.filter((b) => b.date === date);
            return (
              <div
                key={date}
                className="bg-white shadow-lg rounded-lg p-6"
              >
                <h3 className="font-semibold mb-4">Bookings for {date}</h3>
                {bookingsForDate.length > 0 ? (
                  <ul className="space-y-2">
                    {bookingsForDate.map((b) => (
                      <li
                        key={b.id}
                        className="flex justify-between bg-gray-100 p-2 rounded"
                      >
                        <span>
                          {b.name} ({b.email}) – {b.items} items – ⏰ {b.time}
                          {/* ⚠️ Marker for 4PM slot */}
                          {b.time === "4:00 PM" && (
                            <span className="text-red-600 font-bold ml-2">
                              ⚠️ Max 30
                            </span>
                          )}
                        </span>
                        <button
                          onClick={() => cancelBooking(b.id)}
                          className="text-red-600 hover:underline"
                        >
                          Cancel
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No bookings for this date.</p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default AdminView;