import React from "react";

function AdminView({ bookings = [], cancelBooking }) {
  const demoBookings = [
    {
      name: "Alice Example",
      email: "alice@example.com",
      date: "2025-08-01",
      quantity: 2,
    },
    {
      name: "Bob Sample",
      email: "bob@example.com",
      date: "2025-08-03",
      quantity: 1,
    },
  ];

  // Show real bookings if they exist, otherwise show demo data
  const displayBookings = bookings.length > 0 ? bookings : demoBookings;

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 rounded-xl shadow-lg mt-10">
      <h2 className="text-2xl font-bold mb-4 text-center">Admin View</h2>

      <table className="w-full border-collapse border border-gray-300 text-sm">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-300 px-2 py-1">Name</th>
            <th className="border border-gray-300 px-2 py-1">Email</th>
            <th className="border border-gray-300 px-2 py-1">Date</th>
            <th className="border border-gray-300 px-2 py-1">Items</th>
            <th className="border border-gray-300 px-2 py-1">Action</th>
          </tr>
        </thead>
        <tbody>
          {displayBookings.map((b, idx) => (
            <tr key={idx} className="text-center">
              <td className="border border-gray-300 px-2 py-1">{b.name}</td>
              <td className="border border-gray-300 px-2 py-1">{b.email}</td>
              <td className="border border-gray-300 px-2 py-1">{b.date}</td>
              <td className="border border-gray-300 px-2 py-1">{b.quantity}</td>
              <td className="border border-gray-300 px-2 py-1">
                {bookings.length > 0 && (
                  <button
                    onClick={() => cancelBooking(b.email, b.date)}
                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                  >
                    Cancel
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {bookings.length === 0 && (
        <p className="text-gray-500 mt-4 text-center italic">
          Showing demo bookings — add a booking to replace with live data.
        </p>
      )}
    </div>
  );
}

export default AdminView;