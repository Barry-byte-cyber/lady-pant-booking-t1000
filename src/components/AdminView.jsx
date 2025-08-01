import React from "react";

function AdminView({ bookings = [], cancelBooking }) {
  return (
    <div className="bg-white p-4 rounded-xl shadow-md border">
      <h2 className="text-xl font-bold mb-4 text-center">Admin View</h2>

      {bookings.length === 0 ? (
        <p className="text-gray-500 text-center">No bookings yet.</p>
      ) : (
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
            {bookings.map((b, idx) => (
              <tr key={idx} className="text-center">
                <td className="border border-gray-300 px-2 py-1">{b.name}</td>
                <td className="border border-gray-300 px-2 py-1">{b.email}</td>
                <td className="border border-gray-300 px-2 py-1">{b.date}</td>
                <td className="border border-gray-300 px-2 py-1">{b.quantity}</td>
                <td className="border border-gray-300 px-2 py-1">
                  <button
                    onClick={() => cancelBooking(b.email, b.date)}
                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                  >
                    Cancel
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default AdminView;