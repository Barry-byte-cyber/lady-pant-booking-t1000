import React, { useState } from "react";

function AdminView({ allBookings, setBookings }) {
  const [selectedDate, setSelectedDate] = useState(null);

  const handleCancel = (index) => {
    const updated = [...allBookings];
    updated.splice(index, 1);
    setBookings(updated);
  };

  // Group bookings by date
  const bookingsByDate = allBookings.reduce((acc, booking) => {
    if (!acc[booking.date]) acc[booking.date] = [];
    acc[booking.date].push(booking);
    return acc;
  }, {});

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>

      {Object.keys(bookingsByDate).length === 0 ? (
        <p>No bookings yet.</p>
      ) : (
        <div className="space-y-6">
          {Object.entries(bookingsByDate).map(([date, bookings]) => (
            <div
              key={date}
              className="bg-white shadow-md rounded-xl p-4 border"
            >
              <div
                className="flex justify-between items-center cursor-pointer"
                onClick={() =>
                  setSelectedDate(selectedDate === date ? null : date)
                }
              >
                <h2 className="text-lg font-semibold">{date}</h2>
                <span className="text-sm text-gray-500">
                  {bookings.length} booking(s)
                </span>
              </div>

              {/* Expand bookings when date clicked */}
              {selectedDate === date && (
                <ul className="mt-3 space-y-2">
                  {bookings.map((b, idx) => (
                    <li
                      key={idx}
                      className="flex justify-between items-center border-b pb-1"
                    >
                      <span>
                        {b.name} ({b.email}) – {b.quantity} items
                      </span>
                      <button
                        className="text-red-600 hover:underline"
                        onClick={() =>
                          handleCancel(
                            allBookings.findIndex((x) => x === b)
                          )
                        }
                      >
                        Cancel
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminView;