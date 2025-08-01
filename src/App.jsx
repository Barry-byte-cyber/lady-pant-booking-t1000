import React, { useState, useEffect } from "react";
import BookingForm from "./components/BookingForm";
import CalendarView from "./components/CalendarView";
import AdminView from "./components/AdminView";

function App() {
  const [bookings, setBookings] = useState(() => {
    const stored = localStorage.getItem("bookings");
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem("bookings", JSON.stringify(bookings));
  }, [bookings]);

  const addBooking = (newBooking) => {
    setBookings((prev) => [...prev, newBooking]);
  };

  const cancelBooking = (email, date) => {
    setBookings((prev) =>
      prev.filter(
        (b) => !(b.email === email && b.date === date)
      )
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Lady Pant Store Booking
      </h1>
      <BookingForm addBooking={addBooking} />
      <CalendarView bookings={bookings} showFullYear={true} />
      <AdminView bookings={bookings} cancelBooking={cancelBooking} />
    </div>
  );
}

export default App;