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

  // ✅ Add new booking with unique ID
  const addBooking = (booking) => {
    const bookingWithId = { ...booking, id: Date.now() }; // timestamp ID
    setBookings((prev) => [...prev, bookingWithId]);
  };

  // ✅ Cancel booking by unique ID
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