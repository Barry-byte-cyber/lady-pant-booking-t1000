import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import BookingForm from "./components/BookingForm";
import CalendarView from "./components/CalendarView";
import AdminView from "./components/AdminView";

function App() {
  const [bookings, setBookings] = useState([]);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("bookings")) || [];
    setBookings(stored);
  }, []);

  // Save to localStorage whenever bookings update
  useEffect(() => {
    localStorage.setItem("bookings", JSON.stringify(bookings));
  }, [bookings]);

  // ✅ Add booking with validation (80 max items/day + no duplicate slot)
  const addBooking = (booking) => {
    // 1. Check total items already booked for that date
    const totalForDate = bookings
      .filter((b) => b.date === booking.date)
      .reduce((sum, b) => sum + parseInt(b.items || 0), 0);

    if (totalForDate + parseInt(booking.items || 0) > 80) {
      alert("❌ Booking limit reached: Maximum 80 items per day.");
      return;
    }

    // 2. Check if the time slot is already taken
    const slotTaken = bookings.some(
      (b) => b.date === booking.date && b.time === booking.time
    );

    if (slotTaken) {
      alert("❌ This time slot is already booked.");
      return;
    }

    // 3. If all good, save booking
    const bookingWithId = { ...booking, id: Date.now() }; // unique ID
    setBookings((prev) => [...prev, bookingWithId]);
  };

  // ✅ Cancel booking by ID
  const cancelBooking = (id) => {
    setBookings((prev) => prev.filter((b) => b.id !== id));
  };

  return (
    <Router>
      <nav className="bg-gray-800 text-white p-4 flex justify-between">
        <div className="font-bold">Lady Pant Store Booking</div>
        <ul className="flex space-x-4">
          <li>
            <Link to="/" className="hover:underline">
              Client View
            </Link>
          </li>
          <li>
            <Link to="/admin" className="hover:underline">
              Admin View
            </Link>
          </li>
        </ul>
      </nav>

      <div className="p-6">
        <Routes>
          {/* Client Booking Page */}
          <Route
            path="/"
            element={
              <div>
                <BookingForm addBooking={addBooking} />
                <h2 className="text-xl font-bold mt-6 mb-2">
                  Booking Calendar (2025)
                </h2>
                <CalendarView bookings={bookings} />
              </div>
            }
          />

          {/* Admin Page */}
          <Route
            path="/admin"
            element={
              <AdminView bookings={bookings} cancelBooking={cancelBooking} />
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;