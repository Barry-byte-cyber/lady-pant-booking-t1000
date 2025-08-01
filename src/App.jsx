import React, { useState, useEffect } from "react";
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

  // Keep localStorage updated
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
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Lady Pant Store Booking
      </h1>

      {/* Booking Form */}
      <div className="mb-10">
        <BookingForm addBooking={addBooking} />
      </div>

      {/* Calendar View */}
      <div className="mb-10">
        <CalendarView bookings={bookings} />
      </div>

      {/* Admin View */}
      <div className="mb-10">
        <AdminView bookings={bookings} cancelBooking={cancelBooking} />
      </div>

      {/* Debug fallback */}
      {bookings.length === 0 && (
        <p className="text-center text-gray-500">
          No bookings yet — try adding one in the form above.
        </p>
      )}
    </div>
  );
}

export default App;