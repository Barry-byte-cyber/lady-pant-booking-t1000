import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import BookingForm from "./components/BookingForm";
import CalendarView from "./components/CalendarView";
import AdminView from "./components/AdminView";

function App() {
  const [bookings, setBookings] = useState(() => {
    try {
      const stored = localStorage.getItem("bookings");
      return stored ? JSON.parse(stored) : [];
    } catch (err) {
      console.error("Error reading bookings from localStorage:", err);
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("bookings", JSON.stringify(bookings));
  }, [bookings]);

  const addBooking = (newBooking) => {
    setBookings((prev) => [...prev, newBooking]);
  };

  const cancelBooking = (email, date) => {
    setBookings((prev) =>
      prev.filter((b) => !(b.email === email && b.date === date))
    );
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        {/* 🔹 Navigation Bar */}
        <nav className="bg-blue-600 text-white p-4 shadow-md">
          <ul className="flex justify-center space-x-6">
            <li>
              <Link to="/" className="hover:underline">
                Book a Slot
              </Link>
            </li>
            <li>
              <Link to="/admin" className="hover:underline">
                Admin Login
              </Link>
            </li>
          </ul>
        </nav>

        {/* 🔹 Routes */}
        <div className="p-6">
          import React, { useState } from "react";
import BookingForm from "./BookingForm";
import CalendarView from "./CalendarView";

function AdminView({ bookings, cancelBooking }) {
  const [selectedDate, setSelectedDate] = useState(null);
  const bookingsForDate = bookings.filter((b) => b.date === selectedDate);

  return (
    <div className="flex flex-col items-center space-y-8">
      {/* Sticky Booking Form */}
      <div className="w-full max-w-lg sticky top-0 bg-gray-50 z-10 shadow-md rounded-lg">
        <h2 className="text-xl font-semibold text-center mb-2">Admin Booking</h2>
        <BookingForm addBooking={(newBooking) => {
          const updated = [...bookings, newBooking];
          localStorage.setItem("bookings", JSON.stringify(updated));
          window.location.reload();
        }} />
      </div>

      {/* Calendar clickable */}
      <div className="w-full">
        <h2 className="text-2xl font-semibold mb-6 text-center">
          Admin Calendar (All Bookings)
        </h2>
        <CalendarView bookings={bookings} onDateClick={setSelectedDate} />
      </div>

      {/* Booking list */}
      {selectedDate && (
        <div className="w-full max-w-2xl bg-white shadow-lg rounded-lg p-6">
          <h3 className="text-xl font-bold mb-4">
            Bookings for {selectedDate}
          </h3>
          {bookingsForDate.length > 0 ? (
            <ul className="space-y-2">
              {bookingsForDate.map((b, i) => (
                <li
                  key={i}
                  className="flex justify-between items-center p-2 border rounded-md"
                >
                  <div>
                    <p className="font-semibold">{b.name}</p>
                    <p className="text-sm text-gray-600">{b.email}</p>
                    <p className="text-sm">
                      Time: {b.time || "N/A"} – Items: {b.items}
                    </p>
                  </div>
                  <button
                    onClick={() => cancelBooking(b.email, b.date)}
                    className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
                  >
                    Cancel
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No bookings for this date.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default AdminView;
        </div>
      </div>
    </Router>
  );
}

export default App;